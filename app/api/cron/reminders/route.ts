import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { sendEmail } from '@/emails'
import { reminderHtml } from '@/emails/templates'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const now = new Date()
  const windowStart = new Date(now.getTime() + 50 * 60000).toISOString()
  const windowEnd = new Date(now.getTime() + 70 * 60000).toISOString()

  const { rows: bookings } = await pool.query(
    `SELECT b.id, b.start_time, b.therapy_id,
            u.email, u.name as user_name,
            t.name as therapy_name, t.description as therapy_description,
            t.duration_minutes
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     JOIN therapies t ON t.id = b.therapy_id
     WHERE b.status = 'confirmed'
       AND b.start_time BETWEEN $1 AND $2
       AND b.reminder_sent_at IS NULL`,
    [windowStart, windowEnd]
  )

  if (bookings.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0
  for (const booking of bookings) {
    const { rows: reqs } = await pool.query(
      `SELECT description FROM therapy_requirements WHERE therapy_id = $1`,
      [booking.therapy_id]
    )

    const dateStr = new Date(booking.start_time).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    })

    await sendEmail(
      booking.email,
      `⏰ Recordatorio — ${booking.therapy_name} en 1 hora`,
      reminderHtml({
        userName: booking.user_name,
        userEmail: booking.email,
        therapyName: booking.therapy_name,
        therapyDescription: booking.therapy_description || '',
        durationMinutes: booking.duration_minutes,
        dateStr,
        requirements: reqs.map((r: any) => r.description),
      })
    )

    await pool.query(
      `UPDATE bookings SET reminder_sent_at = NOW() WHERE id = $1`,
      [booking.id]
    )
    sent++
  }

  return NextResponse.json({ sent })
}
