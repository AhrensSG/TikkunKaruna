import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import pool from '@/lib/db'
import { sendEmail } from '@/emails'

async function nextInvoiceNumber(): Promise<string> {
  const { rows } = await pool.query(
    "SELECT invoice_number FROM invoices ORDER BY created_at DESC LIMIT 1"
  )
  const last = rows[0]?.invoice_number
  if (!last) return "INV-2024-0001"
  const num = parseInt(last.replace(/^INV-\d+-/, ""), 10) || 0
  const year = new Date().getFullYear()
  return `INV-${year}-${String(num + 1).padStart(4, "0")}`
}

async function createBookingFromSession(stripeSession: any) {
  const sessionId = stripeSession.id
  const therapyId = stripeSession.metadata?.therapy_id
  const userId = stripeSession.metadata?.user_id
  const date = stripeSession.metadata?.date
  const time = stripeSession.metadata?.time

  if (!therapyId || !userId || !date || !time) return

  const existing = await pool.query(
    "SELECT id FROM bookings WHERE stripe_session_id = $1",
    [sessionId]
  )
  if (existing.rows.length > 0) return

  const therapyResult = await pool.query(
    "SELECT duration_minutes FROM therapies WHERE id = $1",
    [therapyId]
  )
  if (therapyResult.rows.length === 0) return

  const durationMinutes = therapyResult.rows[0].duration_minutes
  const startTime = new Date(`${date}T${time}:00`)
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000)

  const booking = await pool.query(
    `INSERT INTO bookings (user_id, therapy_id, start_time, end_time, status, stripe_session_id)
     VALUES ($1, $2, $3, $4, 'confirmed', $5)
     RETURNING id`,
    [userId, therapyId, startTime.toISOString(), endTime.toISOString(), sessionId]
  )
  const bookingId = booking.rows[0].id

  await pool.query(
    `INSERT INTO payments (booking_id, user_id, amount_cents, currency, status, stripe_payment_id)
     VALUES ($1, $2, $3, $4, 'succeeded', $5)`,
    [bookingId, userId, stripeSession.amount_total, stripeSession.currency || 'eur', sessionId]
  )

  const invoiceNumber = await nextInvoiceNumber()
  await pool.query(
    `INSERT INTO invoices (booking_id, user_id, invoice_number, amount_cents)
     VALUES ($1, $2, $3, $4)`,
    [bookingId, userId, invoiceNumber, stripeSession.amount_total]
  )

  const { rows: userRows } = await pool.query(
    `SELECT u.email, u.name as user_name, t.name as therapy_name, b.start_time
     FROM bookings b
     JOIN therapies t ON t.id = b.therapy_id
     JOIN users u ON u.id = b.user_id
     WHERE b.id = $1`,
    [bookingId]
  )
  if (userRows.length > 0) {
    const info = userRows[0]
    const dateStr = new Date(info.start_time).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    })
    await sendEmail(
      info.email,
      `✅ Reserva confirmada — ${info.therapy_name}`,
      `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#4a1a5e;">¡Reserva confirmada!</h2>
        <p>Hola <strong>${info.user_name}</strong>,</p>
        <p>Tu sesión ha sido confirmada. Aquí tienes los detalles:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Terapia</td><td style="padding:8px 12px;">${info.therapy_name}</td></tr>
          <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Fecha y hora</td><td style="padding:8px 12px;">${dateStr}</td></tr>
          <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Factura</td><td style="padding:8px 12px;">${invoiceNumber}</td></tr>
        </table>
        <p style="color:#666;">Gracias por confiar en TikkunKaruna.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#999;font-size:12px;">TikkunKaruna — Terapias Holísticas</p>
      </div>`
    )
  }
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Firma no encontrada' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const stripeSession = event.data.object as any
    await createBookingFromSession(stripeSession)
  }

  return NextResponse.json({ received: true })
}
