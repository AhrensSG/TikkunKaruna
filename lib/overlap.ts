import { db } from '@/lib/db'
import { bookings, bookingSessions } from '@/lib/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { BUFFER_MINUTES } from '@/lib/constants'

export async function checkOverlap(
  sessions: { start_time: string }[],
  durationMinutes: number,
): Promise<string | null> {
  for (const s of sessions) {
    const sStart = new Date(s.start_time)
    const sEnd = new Date(sStart.getTime() + durationMinutes * 60_000)

    const [booking] = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(
        and(
          eq(bookings.status, 'confirmed'),
          sql`tstzrange(${bookings.startTime}, ${bookings.endTime}) &&
              tstzrange(
                ${sStart.toISOString()}::timestamptz - (${String(BUFFER_MINUTES)} || ' minutes')::interval,
                ${sEnd.toISOString()}::timestamptz + (${String(BUFFER_MINUTES)} || ' minutes')::interval
              )`,
        ),
      )
      .limit(1)

    if (booking) {
      const d = sStart.toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
      return `El horario ${d} ya está reservado. Elegí otro.`
    }

    const [session] = await db
      .select({ id: bookingSessions.id })
      .from(bookingSessions)
      .innerJoin(bookings, eq(bookingSessions.bookingId, bookings.id))
      .where(
        and(
          eq(bookingSessions.status, 'confirmed'),
          eq(bookings.status, 'confirmed'),
          sql`tstzrange(${bookingSessions.startTime}, ${bookingSessions.endTime}) &&
              tstzrange(
                ${sStart.toISOString()}::timestamptz - (${String(BUFFER_MINUTES)} || ' minutes')::interval,
                ${sEnd.toISOString()}::timestamptz + (${String(BUFFER_MINUTES)} || ' minutes')::interval
              )`,
        ),
      )
      .limit(1)

    if (session) {
      const d = sStart.toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
      return `El horario ${d} ya está reservado. Elegí otro.`
    }
  }
  return null
}
