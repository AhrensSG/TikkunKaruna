import pool from '@/lib/db'
import { BUFFER_MINUTES } from '@/lib/constants'

export async function checkOverlap(
  sessions: { start_time: string }[],
  durationMinutes: number,
): Promise<string | null> {
  for (const s of sessions) {
    const sStart = new Date(s.start_time)
    const sEnd = new Date(sStart.getTime() + durationMinutes * 60_000)

    const result = await pool.query(
      `SELECT id::text FROM bookings
       WHERE status = 'confirmed'
         AND tstzrange(start_time, end_time) &&
             tstzrange($1::timestamptz - interval '${BUFFER_MINUTES} minutes',
                       $2::timestamptz + interval '${BUFFER_MINUTES} minutes')
       UNION ALL
       SELECT bs.id::text FROM booking_sessions bs
       JOIN bookings b ON b.id = bs.booking_id
       WHERE bs.status = 'confirmed'
         AND b.status = 'confirmed'
         AND tstzrange(bs.start_time, bs.end_time) &&
             tstzrange($1::timestamptz - interval '${BUFFER_MINUTES} minutes',
                       $2::timestamptz + interval '${BUFFER_MINUTES} minutes')`,
      [sStart.toISOString(), sEnd.toISOString()]
    )

    if (result.rows.length > 0) {
      const d = sStart.toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
      return `El horario ${d} ya está reservado. Elegí otro.`
    }
  }
  return null
}
