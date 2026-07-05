import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth.config'
import { checkOverlap } from '@/lib/overlap'
import { getEffectiveDuration } from '@/lib/therapy'
import { MIN_HOURS_BETWEEN_SESSIONS, MIN_HOURS_FROM_NOW, STRIPE_CURRENCY } from '@/lib/constants'
import { sql } from 'drizzle-orm'

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { therapyId } = body

    if (!therapyId) {
      return NextResponse.json({ error: 'Falta el id de la terapia' }, { status: 400 })
    }

    const therapyResult = await db.execute(sql`
      SELECT id, name, price_cents, duration_minutes, is_pack, session_count, session_duration_minutes
      FROM therapies WHERE id = ${therapyId} AND is_active = true AND deleted_at IS NULL
    `)

    if (therapyResult.rows.length === 0) {
      return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
    }

    const therapy = therapyResult.rows[0] as {
      id: string; name: string; price_cents: number; duration_minutes: number;
      is_pack: boolean; session_count: number | null; session_duration_minutes: number | null;
    }
    const perSessionDuration = getEffectiveDuration(therapy)

    let sessions: { start_time: string }[] = []

    if (therapy.is_pack) {
      sessions = body.sessions || []
      if (!Array.isArray(sessions) || sessions.length !== therapy.session_count) {
        return NextResponse.json(
          { error: `Este pack requiere exactamente ${therapy.session_count} sesiones` },
          { status: 400 }
        )
      }
    } else {
      if (!body.start_time) {
        return NextResponse.json({ error: 'Faltan datos de la reserva' }, { status: 400 })
      }
      sessions = [{ start_time: body.start_time }]
    }

    const now = new Date()

    for (let i = 0; i < sessions.length; i++) {
      const s = sessions[i]
      const sessionStart = new Date(s.start_time)

      if (isNaN(sessionStart.getTime())) {
        return NextResponse.json({ error: `Fecha u hora inválida en la sesión ${i + 1}` }, { status: 400 })
      }

      const hoursFromNow = (sessionStart.getTime() - now.getTime()) / 3_600_000
      if (hoursFromNow < MIN_HOURS_FROM_NOW) {
        return NextResponse.json(
          { error: `La sesión ${i + 1} debe ser al menos ${MIN_HOURS_FROM_NOW}h después de ahora` },
          { status: 400 }
        )
      }

      if (i > 0) {
        const prevStart = new Date(sessions[i - 1].start_time)
        const hoursBetween = (sessionStart.getTime() - prevStart.getTime()) / 3_600_000
        if (hoursBetween < MIN_HOURS_BETWEEN_SESSIONS) {
          return NextResponse.json(
            { error: `Debe haber al menos ${MIN_HOURS_BETWEEN_SESSIONS}h entre la sesión ${i} y la sesión ${i + 1}` },
            { status: 400 }
          )
        }
      }
    }

    const overlapError = await checkOverlap(sessions, perSessionDuration)
    if (overlapError) {
      return NextResponse.json({ error: overlapError }, { status: 409 })
    }

    const firstSession = sessions[0]
    const bookingStart = new Date(firstSession.start_time)
    const bookingEnd = new Date(bookingStart.getTime() + perSessionDuration * 60_000)

    const result = await db.transaction(async (tx) => {
      await tx.execute(sql`
        UPDATE bookings SET status = 'cancelled'
        WHERE user_id = ${session.user.id} AND therapy_id = ${therapyId} AND status = 'pending'
      `)

      const bookingResult = await tx.execute(sql`
        INSERT INTO bookings (user_id, therapy_id, start_time, end_time, status)
        VALUES (${session.user.id}, ${therapyId}, ${bookingStart.toISOString()}, ${bookingEnd.toISOString()}, 'pending')
        RETURNING id
      `)
      const bookingId = bookingResult.rows[0].id as string

      if (therapy.is_pack) {
        for (let i = 0; i < sessions.length; i++) {
          const s = sessions[i]
          const sStart = new Date(s.start_time)
          const sEnd = new Date(sStart.getTime() + perSessionDuration * 60_000)
          await tx.execute(sql`
            INSERT INTO booking_sessions (booking_id, session_number, start_time, end_time, status)
            VALUES (${bookingId}, ${i + 1}, ${sStart.toISOString()}, ${sEnd.toISOString()}, 'pending')
          `)
        }
      }

      const productName = therapy.is_pack
        ? `${therapy.name} (${therapy.session_count} sesiones)`
        : therapy.name

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: STRIPE_CURRENCY,
            product_data: { name: productName },
            unit_amount: therapy.price_cents,
          },
          quantity: 1,
        }],
        metadata: { booking_id: bookingId },
        success_url: `${process.env.NEXT_PUBLIC_API_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/dashboard/book?canceled=true`,
      })

      await tx.execute(sql`
        UPDATE bookings SET stripe_session_id = ${checkoutSession.id} WHERE id = ${bookingId}
      `)

      return { url: checkoutSession.url }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Error al procesar el pago' }, { status: 500 })
  }
}
