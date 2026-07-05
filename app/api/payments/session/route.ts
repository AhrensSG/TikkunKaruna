import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { confirmBookingFromSession } from '@/lib/stripe/confirm-booking'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  const bookingIdParam = searchParams.get('booking_id')

  if (!sessionId) {
    return NextResponse.json({ error: 'Falta session_id' }, { status: 400 })
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)

  if (stripeSession.payment_status !== 'paid') {
    return NextResponse.json({ error: 'El pago no se completó. No se ha realizado ningún cobro.' }, { status: 400 })
  }

  const bookingId = bookingIdParam || stripeSession.metadata?.booking_id

  if (!bookingId) {
    return NextResponse.json({ error: 'Error: reserva no encontrada' }, { status: 404 })
  }

  await confirmBookingFromSession(stripeSession as any)

  const result = await db.execute(sql`
    SELECT b.id, b.status, t.name AS therapy_name, t.description AS therapy_description,
           t.duration_minutes, t.price_cents, t.image_url,
           b.start_time, b.end_time
    FROM bookings b
    JOIN therapies t ON t.id = b.therapy_id
    WHERE b.id = ${bookingId}
  `)

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Reserva no encontrada' }, { status: 404 })
  }

  return NextResponse.json({ booking: result.rows[0] })
}
