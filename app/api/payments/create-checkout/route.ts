import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import pool from '@/lib/db'
import { auth } from '@/lib/auth.config'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { therapyId, date, time } = await req.json()

    if (!therapyId || !date || !time) {
      return NextResponse.json({ error: 'Faltan datos de la reserva' }, { status: 400 })
    }

    const therapyResult = await pool.query(
      'SELECT id, name, price_cents, duration_minutes FROM therapies WHERE id = $1 AND is_active = true',
      [therapyId]
    )

    if (therapyResult.rows.length === 0) {
      return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
    }

    const therapy = therapyResult.rows[0]
    const startTime = new Date(`${date}T${time}:00`)

    if (isNaN(startTime.getTime())) {
      return NextResponse.json({ error: 'Fecha u hora inválida' }, { status: 400 })
    }

    const endTime = new Date(startTime.getTime() + therapy.duration_minutes * 60000)

    const bookingResult = await pool.query(
      `INSERT INTO bookings (user_id, therapy_id, start_time, end_time, status)
       VALUES ($1, $2, $3, $4, 'pending')
       RETURNING id`,
      [session.user.id, therapyId, startTime.toISOString(), endTime.toISOString()]
    )

    const booking = bookingResult.rows[0]

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: therapy.name },
            unit_amount: therapy.price_cents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        booking_id: booking.id,
        user_id: session.user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/history?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/book?canceled=true`,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Error al procesar el pago' }, { status: 500 })
  }
}
