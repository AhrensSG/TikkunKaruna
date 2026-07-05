import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-helpers'
import { scheduleWeekly, scheduleExceptions } from '@/lib/db/schema'
import { sql, asc } from 'drizzle-orm'

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const weeklyResult = await db.select({
      id: scheduleWeekly.id,
      dayOfWeek: scheduleWeekly.dayOfWeek,
      startTime: scheduleWeekly.startTime,
      endTime: scheduleWeekly.endTime,
    })
      .from(scheduleWeekly)
      .orderBy(scheduleWeekly.dayOfWeek, scheduleWeekly.startTime)

    const exceptionsResult = await db.select({
      id: scheduleExceptions.id,
      exception_date: scheduleExceptions.exceptionDate,
      start_time: scheduleExceptions.startTime,
      end_time: scheduleExceptions.endTime,
      is_available: scheduleExceptions.isAvailable,
      reason: scheduleExceptions.reason,
    })
      .from(scheduleExceptions)
      .orderBy(sql`exception_date DESC`)

    return NextResponse.json({ weekly: weeklyResult, exceptions: exceptionsResult })
  } catch (error) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json({ error: 'Error al cargar horarios' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { weekly } = await req.json()
    if (!Array.isArray(weekly)) {
      return NextResponse.json({ error: 'Formato inválido' }, { status: 400 })
    }

    await db.transaction(async (tx) => {
      await tx.delete(scheduleWeekly)

      for (const entry of weekly) {
        if (entry.day_of_week === undefined || !entry.start_time || !entry.end_time) continue
        await tx.insert(scheduleWeekly).values({
          dayOfWeek: entry.day_of_week,
          startTime: entry.start_time,
          endTime: entry.end_time,
        })
      }
    })

    const result = await db.select({
      id: scheduleWeekly.id,
      dayOfWeek: scheduleWeekly.dayOfWeek,
      startTime: scheduleWeekly.startTime,
      endTime: scheduleWeekly.endTime,
    })
      .from(scheduleWeekly)
      .orderBy(scheduleWeekly.dayOfWeek, scheduleWeekly.startTime)

    return NextResponse.json({ weekly: result })
  } catch (error) {
    console.error('Error saving schedule:', error)
    return NextResponse.json({ error: 'Error al guardar horario' }, { status: 500 })
  }
}
