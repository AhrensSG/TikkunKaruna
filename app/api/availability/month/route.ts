import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { therapies, scheduleWeekly, scheduleExceptions, bookings, bookingSessions } from '@/lib/db/schema'
import { generateSlots } from '@/lib/slots'
import { getEffectiveDuration } from '@/lib/therapy'
import { BUFFER_MINUTES, MIN_HOURS_FROM_NOW, DEFAULT_DURATION_MINUTES } from '@/lib/constants'
import { toDateStr } from '@/lib/date'
import { eq, and, sql } from 'drizzle-orm'

function toUtc(dateStr: string, timeStr: string, tzOffsetMinutes: number): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  const [h, min] = timeStr.split(':').map(Number)
  return new Date(Date.UTC(y, m - 1, d, h, min) + tzOffsetMinutes * 60_000)
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const year = parseInt(searchParams.get('year') || '')
    const month = parseInt(searchParams.get('month') || '')
    const therapyId = searchParams.get('therapyId')
    const after = searchParams.get('after')
    const tzOffset = parseInt(searchParams.get('tzOffset') || '0')

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json({ error: 'year y month requeridos' }, { status: 400 })
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

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const minStart = after ? new Date(new Date(after).getTime() + MIN_HOURS_FROM_NOW * 3_600_000) : null

    const lastDay = new Date(year, month, 0)
    const totalDays = lastDay.getDate()

    const dates: string[] = []

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = toDateStr(year, month, day)
      const dayDate = new Date(`${dateStr}T12:00:00`)

      if (dayDate <= today) continue

      const dayOfWeek = dayDate.getDay()

      const [exception] = await db
        .select({ isAvailable: scheduleExceptions.isAvailable })
        .from(scheduleExceptions)
        .where(eq(scheduleExceptions.exceptionDate, dateStr))
        .limit(1)

      if (exception && !exception.isAvailable) continue

      const ranges = await db
        .select({ startTime: scheduleWeekly.startTime, endTime: scheduleWeekly.endTime })
        .from(scheduleWeekly)
        .where(eq(scheduleWeekly.dayOfWeek, dayOfWeek))
        .orderBy(scheduleWeekly.startTime)

      if (ranges.length === 0) continue

      let allSlots: string[] = []
      for (const r of ranges) {
        allSlots = allSlots.concat(generateSlots(r.startTime, r.endTime, durationMinutes))
      }
      allSlots = [...new Set(allSlots)]

      if (allSlots.length === 0) continue

      const dayStart = toUtc(dateStr, '00:00:00', tzOffset)
      const dayEnd = toUtc(dateStr, '23:59:59', tzOffset)

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

      const available = allSlots.filter((slot) => {
        const slotStart = toUtc(dateStr, slot + ':00', tzOffset)
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

      if (available.length > 0) {
        dates.push(dateStr)
      }
    }

    return NextResponse.json({ year, month, dates })
  } catch (error) {
    console.error("Error fetching month availability:", error)
    return NextResponse.json({ error: "Error al consultar disponibilidad" }, { status: 500 })
  }
}
