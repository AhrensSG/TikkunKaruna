import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import pool from '@/lib/db'
import { sendEmail, notifyAdmin, adminNewBookingHtml } from '@/emails'
import { bookingConfirmationHtml } from '@/emails/templates'

async function nextInvoiceNumber(): Promise<string> {
  const { rows } = await pool.query(
    "SELECT invoice_number FROM invoices ORDER BY created_at DESC LIMIT 1"
  )
  const last = rows[0]?.invoice_number
  if (!last) return `FAC-${new Date().getFullYear()}-0001`
  const num = parseInt(last.replace(/^FAC-\d+-/, ""), 10) || 0
  const year = new Date().getFullYear()
  return `FAC-${year}-${String(num + 1).padStart(4, "0")}`
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
    `SELECT u.email, u.name as user_name, t.name as therapy_name,
            t.description as therapy_description, t.duration_minutes,
            b.start_time
     FROM bookings b
     JOIN therapies t ON t.id = b.therapy_id
     JOIN users u ON u.id = b.user_id
     WHERE b.id = $1`,
    [bookingId]
  )
  if (userRows.length > 0) {
    const info = userRows[0]
    const { rows: reqs } = await pool.query(
      `SELECT description FROM therapy_requirements WHERE therapy_id = $1`,
      [therapyId]
    )
    const dateStr = new Date(info.start_time).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    })
    await sendEmail(
      info.email,
      `✅ Reserva confirmada — ${info.therapy_name}`,
      bookingConfirmationHtml({
        userName: info.user_name,
        userEmail: info.email,
        therapyName: info.therapy_name,
        therapyDescription: info.therapy_description || '',
        durationMinutes: info.duration_minutes,
        dateStr,
        invoiceNumber,
        requirements: reqs.map((r: any) => r.description),
      })
    )
    notifyAdmin(
      `📅 Nueva reserva: ${info.user_name} — ${info.therapy_name}`,
      adminNewBookingHtml(info.user_name, info.email, info.therapy_name, dateStr)
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
