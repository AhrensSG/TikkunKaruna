import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { therapies, scheduleWeekly, scheduleExceptions, bookings, bookingSessions } from '@/lib/db/schema'
import { generateSlots } from '@/lib/slots'
import { getEffectiveDuration } from '@/lib/therapy'
import { BUFFER_MINUTES, MIN_HOURS_FROM_NOW, DEFAULT_DURATION_MINUTES } from '@/lib/constants'
import { eq, and, sql } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")
    const therapyId = searchParams.get("therapyId")
    const after = searchParams.get("after")

    if (!date) {
      return NextResponse.json({ error: "Fecha requerida" }, { status: 400 })
    }

    let durationMinutes = DEFAULT_DURATION_MINUTES
    if (therapyId) {
      const [therapy] = await db
        .select({
          durationMinutes: therapies.durationMinutes,
          isPack: therapies.isPack,
          sessionDurationMinutes: therapies.sessionDurationMinutes,
        })
        .from(therapies)
        .where(and(eq(therapies.id, therapyId), eq(therapies.isActive, true), sql`${therapies.deletedAt} IS NULL`))
        .limit(1)

      if (therapy) {
        durationMinutes = getEffectiveDuration(therapy)
      }
    }

    const dayDate = new Date(`${date}T12:00:00`)
    if (isNaN(dayDate.getTime())) {
      return NextResponse.json({ error: "Fecha inválida" }, { status: 400 })
    }

    const dayOfWeek = dayDate.getDay()
    const dayStart = new Date(`${date}T00:00:00`)
    const dayEnd = new Date(`${date}T23:59:59`)

    const [exception] = await db
      .select({ isAvailable: scheduleExceptions.isAvailable })
      .from(scheduleExceptions)
      .where(eq(scheduleExceptions.exceptionDate, date))
      .limit(1)

    if (exception && !exception.isAvailable) {
      return NextResponse.json({ date, slots: [] })
    }

    const ranges = await db
      .select({ startTime: scheduleWeekly.startTime, endTime: scheduleWeekly.endTime })
      .from(scheduleWeekly)
      .where(eq(scheduleWeekly.dayOfWeek, dayOfWeek))
      .orderBy(scheduleWeekly.startTime)

    let allSlots: string[] = []
    for (const r of ranges) {
      allSlots = allSlots.concat(generateSlots(r.startTime, r.endTime, durationMinutes))
    }
    allSlots = [...new Set(allSlots)]

    const occupied = await db
      .select({
        startTime: sql`${bookings.startTime}::text`,
        endTime: sql`${bookings.endTime}::text`,
      })
      .from(bookings)
      .where(
        and(
          eq(bookings.status, 'confirmed'),
          sql`${bookings.startTime} < ${dayEnd.toISOString()}::timestamptz`,
          sql`${bookings.endTime} > ${dayStart.toISOString()}::timestamptz`,
        ),
      )
      .union(
        db
          .select({
            startTime: sql`${bookingSessions.startTime}::text`,
            endTime: sql`${bookingSessions.endTime}::text`,
          })
          .from(bookingSessions)
          .innerJoin(bookings, eq(bookingSessions.bookingId, bookings.id))
          .where(
            and(
              eq(bookingSessions.status, 'confirmed'),
              eq(bookings.status, 'confirmed'),
              sql`${bookingSessions.startTime} < ${dayEnd.toISOString()}::timestamptz`,
              sql`${bookingSessions.endTime} > ${dayStart.toISOString()}::timestamptz`,
            ),
          ),
      )

    const now = new Date()
    const minStart = after ? new Date(new Date(after).getTime() + MIN_HOURS_FROM_NOW * 3_600_000) : null

    const available = allSlots.filter((slot) => {
      const slotStart = new Date(`${date}T${slot}:00`)
      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60_000)

      const hoursFromNow = (slotStart.getTime() - now.getTime()) / 3_600_000
      if (hoursFromNow < MIN_HOURS_FROM_NOW) return false

      if (minStart && slotStart < minStart) return false

      const occupiedRows = occupied as { startTime: string; endTime: string }[]
      return !occupiedRows.some((b) => {
        const bStart = new Date(b.startTime)
        const bEnd = new Date(b.endTime)
        const overlapStart = new Date(bStart.getTime() - BUFFER_MINUTES * 60_000)
        const overlapEnd = new Date(bEnd.getTime() + BUFFER_MINUTES * 60_000)
        return slotStart < overlapEnd && slotEnd > overlapStart
      })
    })

    return NextResponse.json({ date, slots: available })
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json({ error: "Error al consultar disponibilidad" }, { status: 500 })
  }
}
