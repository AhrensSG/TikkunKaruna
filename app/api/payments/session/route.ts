import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import pool from '@/lib/db'
import { sendEmail, notifyAdmin, adminNewBookingHtml } from '@/emails'
import { bookingConfirmationHtml } from '@/emails/templates'

export const dynamic = 'force-dynamic'

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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Falta session_id' }, { status: 400 })
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)

  if (stripeSession.payment_status !== 'paid') {
    return NextResponse.json({ error: 'El pago no se completó. No se ha realizado ningún cobro.' }, { status: 400 })
  }

  const existing = await pool.query(
    `SELECT b.id, b.status, t.name AS therapy_name, t.description AS therapy_description,
            t.duration_minutes, t.price_cents, t.image_url,
            b.start_time, b.end_time
     FROM bookings b
     JOIN therapies t ON t.id = b.therapy_id
     WHERE b.stripe_session_id = $1`,
    [sessionId]
  )

  if (existing.rows.length > 0) {
    return NextResponse.json({ booking: existing.rows[0] })
  }

  const therapyId = stripeSession.metadata?.therapy_id
  const userId = stripeSession.metadata?.user_id
  const date = stripeSession.metadata?.date
  const time = stripeSession.metadata?.time

  if (!therapyId || !userId || !date || !time) {
    return NextResponse.json({ error: 'Error: datos de reserva incompletos' }, { status: 500 })
  }

  const therapyResult = await pool.query(
    'SELECT id, name, description, duration_minutes, price_cents, image_url FROM therapies WHERE id = $1',
    [therapyId]
  )
  if (therapyResult.rows.length === 0) {
    return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
  }
  const therapy = therapyResult.rows[0]

  const startTime = new Date(`${date}T${time}:00`)
  const endTime = new Date(startTime.getTime() + therapy.duration_minutes * 60000)

  const BUFFER_MINUTES = 30
  const overlap = await pool.query(
    `SELECT id FROM bookings
     WHERE status = 'confirmed'
       AND tstzrange(start_time, end_time) &&
           tstzrange($1::timestamptz - interval '${BUFFER_MINUTES} minutes',
                     $2::timestamptz + interval '${BUFFER_MINUTES} minutes')`,
    [startTime.toISOString(), endTime.toISOString()]
  )

  if (overlap.rows.length > 0) {
    const paymentIntentId = stripeSession.payment_intent
    if (paymentIntentId) {
      await stripe.refunds.create({ payment_intent: paymentIntentId as string }).catch(e => {
        console.error('Error al reembolsar:', e)
      })
    }
    return NextResponse.json({
      error: 'Este horario ya fue reservado por otra persona. El reembolso se ha procesado.'
    }, { status: 409 })
  }

  const bookingResult = await pool.query(
    `INSERT INTO bookings (user_id, therapy_id, start_time, end_time, status, stripe_session_id)
     VALUES ($1, $2, $3, $4, 'confirmed', $5)
     RETURNING id`,
    [userId, therapyId, startTime.toISOString(), endTime.toISOString(), sessionId]
  )
  const bookingId = bookingResult.rows[0].id

  await pool.query(
    `INSERT INTO payments (booking_id, user_id, amount_cents, currency, status, stripe_payment_id)
     VALUES ($1, $2, $3, $4, 'succeeded', $5)`,
    [bookingId, userId, stripeSession.amount_total, stripeSession.currency || 'eur', stripeSession.id]
  )

  const invoiceNumber = await nextInvoiceNumber()
  await pool.query(
    `INSERT INTO invoices (booking_id, user_id, invoice_number, amount_cents)
     VALUES ($1, $2, $3, $4)`,
    [bookingId, userId, invoiceNumber, stripeSession.amount_total]
  )

  const { rows: userRows } = await pool.query(
    `SELECT email, name FROM users WHERE id = $1`,
    [userId]
  )
  if (userRows.length > 0) {
    const user = userRows[0]
    const { rows: reqs } = await pool.query(
      `SELECT description FROM therapy_requirements WHERE therapy_id = $1`,
      [therapyId]
    )
    const dateStr = startTime.toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    })
    await sendEmail(
      user.email,
      `✅ Reserva confirmada — ${therapy.name}`,
      bookingConfirmationHtml({
        userName: user.name,
        userEmail: user.email,
        therapyName: therapy.name,
        therapyDescription: therapy.description || '',
        durationMinutes: therapy.duration_minutes,
        dateStr,
        invoiceNumber,
        requirements: reqs.map((r: any) => r.description),
      })
    )
    notifyAdmin(
      `📅 Nueva reserva: ${user.name} — ${therapy.name}`,
      adminNewBookingHtml(user.name, user.email, therapy.name, dateStr)
    )
  }

  return NextResponse.json({
    booking: {
      booking_id: bookingId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      status: 'confirmed',
      stripe_session_id: sessionId,
      therapy_name: therapy.name,
      therapy_description: therapy.description,
      duration_minutes: therapy.duration_minutes,
      price_cents: therapy.price_cents,
      image_url: therapy.image_url,
    }
  })
}
