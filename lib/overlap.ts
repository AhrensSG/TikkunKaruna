import { db } from '@/lib/db'
import { bookings, bookingSessions, scheduleExceptions } from '@/lib/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { BUFFER_MINUTES } from '@/lib/constants'

function getSpainOffsetMinutes(date: Date): number {
  const year = date.getUTCFullYear()
  const marLast = new Date(Date.UTC(year, 2, 31))
  const marLastSun = 31 - marLast.getUTCDay()
  const octLast = new Date(Date.UTC(year, 9, 31))
  const octLastSun = 31 - octLast.getUTCDay()
  const dstStart = Date.UTC(year, 2, marLastSun, 2)
  const dstEnd = Date.UTC(year, 9, octLastSun, 3)
  const ts = date.getTime()
  return ts >= dstStart && ts < dstEnd ? 120 : 60
}

export async function checkBlockedTime(
  startTime: Date,
  durationMinutes: number,
): Promise<string | null> {
  const dateStr = startTime.toISOString().slice(0, 10)
  const slotEndMs = startTime.getTime() + durationMinutes * 60_000

  const exceptions = await db
    .select({
      isAvailable: scheduleExceptions.isAvailable,
      startTime: scheduleExceptions.startTime,
      endTime: scheduleExceptions.endTime,
    })
    .from(scheduleExceptions)
    .where(eq(scheduleExceptions.exceptionDate, dateStr))

  const offset = getSpainOffsetMinutes(startTime)

  for (const ex of exceptions) {
    if (!ex.isAvailable && !ex.startTime && !ex.endTime) {
      return 'El día seleccionado no está disponible (bloqueado por el administrador).'
    }
    if (!ex.isAvailable && ex.startTime && ex.endTime) {
      const [bh, bm] = ex.startTime.split(':').map(Number)
      const [eh, em] = ex.endTime.split(':').map(Number)
      const blockStartMin = bh * 60 + bm - offset
      const blockEndMin = eh * 60 + em - offset
      const slotStartUtcMin = startTime.getUTCHours() * 60 + startTime.getUTCMinutes()
      const slotEndUtcMin = new Date(slotEndMs).getUTCHours() * 60 + new Date(slotEndMs).getUTCMinutes()
      if (slotStartUtcMin < blockEndMin && slotEndUtcMin > blockStartMin) {
        return `El horario seleccionado (${ex.startTime} - ${ex.endTime}) está bloqueado por el administrador.`
      }
    }
  }
  return null
}

export async function checkOverlap(
  sessions: { start_time: string }[],
  durationMinutes: number,
  excludeBookingId?: string,
): Promise<string | null> {
  for (const s of sessions) {
    const sStart = new Date(s.start_time)
    const sEnd = new Date(sStart.getTime() + durationMinutes * 60_000)

    const bookingCond = excludeBookingId
      ? and(eq(bookings.status, 'confirmed'), sql`${bookings.id} != ${excludeBookingId}`)
      : eq(bookings.status, 'confirmed')

    const [booking] = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(
        and(
          bookingCond,
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

    const sessionBookingCond = excludeBookingId
      ? and(eq(bookingSessions.status, 'confirmed'), eq(bookings.status, 'confirmed'), sql`${bookings.id} != ${excludeBookingId}`)
      : and(eq(bookingSessions.status, 'confirmed'), eq(bookings.status, 'confirmed'))

    const [session] = await db
      .select({ id: bookingSessions.id })
      .from(bookingSessions)
      .innerJoin(bookings, eq(bookingSessions.bookingId, bookings.id))
      .where(
        and(
          sessionBookingCond,
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
