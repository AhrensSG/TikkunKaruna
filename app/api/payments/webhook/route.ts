import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import pool from '@/lib/db'
import { sendEmail, notifyAdmin, adminNewBookingHtml } from '@/emails'
import { bookingConfirmationHtml } from '@/emails/templates'
import { sendWhatsApp, notifyAdminWhatsApp } from '@/lib/whatsapp'

async function nextInvoiceNumber(): Promise<string> {
  const { rows } = await pool.query(
    "SELECT invoice_number FROM invoices ORDER BY created_at DESC LIMIT 1"
  )
  const last = rows[0]?.invoice_number
  const year = new Date().getFullYear()
  if (!last) return `TKFAC-${year}-0001`
  const num = parseInt((last.split('-').pop() || '0'), 10)
  return `TKFAC-${year}-${String(num + 1).padStart(4, "0")}`
}

const processedEvents = new Set<string>()

async function confirmBookingFromSession(stripeSession: any) {
  const bookingId = stripeSession.metadata?.booking_id
  if (!bookingId) return

  const existing = await pool.query(
    "SELECT id, status, user_id, stripe_session_id FROM bookings WHERE id = $1",
    [bookingId]
  )
  if (existing.rows.length === 0) return
  if (existing.rows[0].status === 'confirmed') return

  const booking = existing.rows[0]

  const country = stripeSession.customer_details?.address?.country || null

  await pool.query(
    `UPDATE bookings SET status = 'confirmed', stripe_session_id = $1, country = $2 WHERE id = $3`,
    [stripeSession.id, country, bookingId]
  )

  await pool.query(
    `UPDATE booking_sessions SET status = 'confirmed' WHERE booking_id = $1`,
    [bookingId]
  )

  await pool.query(
    `INSERT INTO payments (booking_id, user_id, amount_cents, currency, status, stripe_payment_id)
     VALUES ($1, $2, $3, $4, 'succeeded', $5)`,
    [bookingId, booking.user_id, stripeSession.amount_total, stripeSession.currency || 'eur', stripeSession.id]
  )

  const invoiceNumber = await nextInvoiceNumber()
  await pool.query(
    `INSERT INTO invoices (booking_id, user_id, invoice_number, amount_cents)
     VALUES ($1, $2, $3, $4)`,
    [bookingId, booking.user_id, invoiceNumber, stripeSession.amount_total]
  )

  const { rows: userRows } = await pool.query(
    `SELECT u.email, u.phone, u.name as user_name, t.id as therapy_id, t.name as therapy_name,
            t.description as therapy_description, t.duration_minutes,
            t.is_pack, t.session_duration_minutes,
            b.start_time, b.user_id
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
      [info.therapy_id]
    )
    let dateStr: string
    if (info.is_pack) {
      const { rows: sessions } = await pool.query(
        `SELECT start_time FROM booking_sessions WHERE booking_id = $1 ORDER BY session_number`,
        [bookingId]
      )
      dateStr = sessions.map((s: any, i: number) =>
        `Sesión ${i + 1}: ${new Date(s.start_time).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
      ).join('\n')
    } else {
      dateStr = new Date(info.start_time).toLocaleDateString("es-ES", {
        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    }
    await sendEmail(
      info.email,
      `✅ Reserva confirmada — ${info.therapy_name}`,
      bookingConfirmationHtml({
        userName: info.user_name,
        userEmail: info.email,
        therapyName: info.therapy_name,
        therapyDescription: info.therapy_description || '',
        durationMinutes: info.is_pack && info.session_duration_minutes ? info.session_duration_minutes : info.duration_minutes,
        dateStr,
        invoiceNumber,
        requirements: reqs.map((r: any) => r.description),
      })
    )

    const waMsg = `✅ *Reserva confirmada — ${info.therapy_name}*\n\nHola ${info.user_name}, tu reserva ha sido confirmada.\n\n📅 ${dateStr.replace(/\n/g, '\n')}\n📄 Factura: ${invoiceNumber}\n\nGracias por confiar en TikkunKaruna 💜`
    if (info.phone) sendWhatsApp(info.phone, waMsg)
    notifyAdminWhatsApp(`📅 Nueva reserva: ${info.user_name} — ${info.therapy_name}\n📅 ${dateStr.replace(/\n/g, '\n')}`)

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

  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true })
  }

  if (event.type === 'checkout.session.completed') {
    const stripeSession = event.data.object as any
    processedEvents.add(event.id)
    await confirmBookingFromSession(stripeSession)
  }

  if (event.type === 'checkout.session.expired') {
    const stripeSession = event.data.object as any
    processedEvents.add(event.id)
    const bookingId = stripeSession.metadata?.booking_id
    if (bookingId) {
      await pool.query(
        `UPDATE bookings SET status = 'cancelled' WHERE id = $1 AND status = 'pending'`,
        [bookingId]
      )
      await pool.query(
        `UPDATE booking_sessions SET status = 'cancelled' WHERE booking_id = $1 AND status = 'pending'`,
        [bookingId]
      )
    }
  }

  return NextResponse.json({ received: true })
}
