import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import pool from '@/lib/db'

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
    const bookingId = stripeSession.metadata?.booking_id
    const userId = stripeSession.metadata?.user_id

    if (bookingId && userId) {
      await pool.query(
        "UPDATE bookings SET status = 'confirmed' WHERE id = $1",
        [bookingId]
      )

      await pool.query(
        `INSERT INTO payments (booking_id, user_id, amount_cents, currency, status, stripe_payment_id)
         VALUES ($1, $2, $3, $4, 'succeeded', $5)`,
        [bookingId, userId, stripeSession.amount_total, stripeSession.currency || 'eur', stripeSession.id]
      )

      const invoiceNumber = `INV-${Date.now()}`
      await pool.query(
        `INSERT INTO invoices (booking_id, user_id, invoice_number, amount_cents)
         VALUES ($1, $2, $3, $4)`,
        [bookingId, userId, invoiceNumber, stripeSession.amount_total]
      )
    }
  }

  return NextResponse.json({ received: true })
}
