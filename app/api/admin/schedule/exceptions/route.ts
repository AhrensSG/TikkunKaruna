import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-helpers'
import { scheduleExceptions } from '@/lib/db/schema'

export async function POST(req: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { exception_date, start_time, end_time, is_available, reason } = await req.json()

    if (!exception_date) {
      return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
    }

    const result = await db.insert(scheduleExceptions).values({
      exceptionDate: exception_date,
      startTime: start_time || null,
      endTime: end_time || null,
      isAvailable: is_available ?? false,
      reason: reason || '',
    }).returning({
      id: scheduleExceptions.id,
      exception_date: scheduleExceptions.exceptionDate,
      start_time: scheduleExceptions.startTime,
      end_time: scheduleExceptions.endTime,
      is_available: scheduleExceptions.isAvailable,
      reason: scheduleExceptions.reason,
    })

    return NextResponse.json({ exception: result[0] })
  } catch (error) {
    console.error('Error creating exception:', error)
    return NextResponse.json({ error: 'Error al crear excepción' }, { status: 500 })
  }
}
