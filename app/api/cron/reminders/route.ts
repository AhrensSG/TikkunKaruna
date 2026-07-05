import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendEmail } from '@/emails'
import { reminderHtml } from '@/emails/templates'
import { sendWhatsApp } from '@/lib/whatsapp'
import { sql } from 'drizzle-orm'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const now = new Date()
  const windowStart = new Date(now.getTime() + 50 * 60000).toISOString()
  const windowEnd = new Date(now.getTime() + 70 * 60000).toISOString()

  const result = await db.execute(sql`
    SELECT b.id, b.start_time, b.therapy_id,
           u.email, u.phone, u.name as user_name,
           t.name as therapy_name, t.description as therapy_description,
           t.duration_minutes
    FROM bookings b
    JOIN users u ON u.id = b.user_id
    JOIN therapies t ON t.id = b.therapy_id
    WHERE b.status = 'confirmed'
      AND b.start_time BETWEEN ${windowStart} AND ${windowEnd}
      AND b.reminder_sent_at IS NULL
  `)

  const bookings = result.rows as {
    id: string; start_time: string; therapy_id: string;
    email: string; phone: string | null; user_name: string;
    therapy_name: string; therapy_description: string | null; duration_minutes: number;
  }[]
  if (bookings.length === 0) {
    return NextResponse.json({ sent: 0 })
  }

  let sent = 0
  for (const booking of bookings) {
    const reqsResult = await db.execute(sql`
      SELECT description FROM therapy_requirements WHERE therapy_id = ${booking.therapy_id} ORDER BY sort_order
    `)

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
        requirements: (reqsResult.rows as { description: string }[]).map((r) => r.description),
      })
    )

    if (booking.phone) {
      sendWhatsApp(
        booking.phone,
        `⏰ *Recordatorio — ${booking.therapy_name}*\n\nHola ${booking.user_name}, te recordamos que tu sesión es en aproximadamente 1 hora.\n\n📅 ${dateStr}\n\nTe esperamos 💜`
      )
    }

    await db.execute(sql`
      UPDATE bookings SET reminder_sent_at = NOW() WHERE id = ${booking.id}
    `)
    sent++
  }

  return NextResponse.json({ sent })
}
