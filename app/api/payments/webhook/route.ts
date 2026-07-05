import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { confirmBookingFromSession, StripeSession } from '@/lib/stripe/confirm-booking'

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

  const alreadyProcessed = await db.execute(sql`
    SELECT 1 FROM processed_events WHERE event_id = ${event.id}
  `)
  if (alreadyProcessed.rows.length > 0) {
    return NextResponse.json({ received: true })
  }

  await db.execute(sql`
    INSERT INTO processed_events (event_id) VALUES (${event.id}) ON CONFLICT DO NOTHING
  `)

  if (event.type === 'checkout.session.completed') {
    const stripeSession = event.data.object as StripeSession
    await confirmBookingFromSession(stripeSession)
  }

  if (event.type === 'checkout.session.expired') {
    const stripeSession = event.data.object as StripeSession
    const bookingId = stripeSession.metadata?.booking_id
    if (bookingId) {
      await db.execute(sql`
        UPDATE bookings SET status = 'cancelled' WHERE id = ${bookingId} AND status = 'pending'
      `)
      await db.execute(sql`
        UPDATE booking_sessions SET status = 'cancelled' WHERE booking_id = ${bookingId} AND status = 'pending'
      `)
    }
  }

  return NextResponse.json({ received: true })
}
