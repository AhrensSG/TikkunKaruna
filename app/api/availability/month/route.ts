import { NextResponse } from 'next/server'
import pool from '@/lib/db'

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function generateSlots(start: string, end: string, duration: number): string[] {
  const slots: string[] = []
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const startMin = sh * 60 + sm
  const endMin = eh * 60 + em
  for (let m = startMin; m + duration <= endMin; m += duration) {
    const h = Math.floor(m / 60)
    const min = m % 60
    slots.push(`${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`)
  }
  return slots
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const year = parseInt(searchParams.get('year') || '')
  const month = parseInt(searchParams.get('month') || '')
  const therapyId = searchParams.get('therapyId')

  if (!year || !month || month < 1 || month > 12) {
    return NextResponse.json({ error: 'year y month requeridos' }, { status: 400 })
  }

  let durationMinutes = 60
  if (therapyId) {
    const therapy = await pool.query(
      "SELECT duration_minutes FROM therapies WHERE id = $1 AND is_active = true",
      [therapyId]
    )
    if (therapy.rows.length > 0) {
      durationMinutes = therapy.rows[0].duration_minutes
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const totalDays = lastDay.getDate()

  const dates: string[] = []

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = toDateStr(year, month, day)
    const dayDate = new Date(`${dateStr}T12:00:00`)

    if (dayDate <= today) continue

    const dayOfWeek = dayDate.getDay()

    const exception = await pool.query(
      `SELECT is_available FROM schedule_exceptions WHERE exception_date = $1 LIMIT 1`,
      [dateStr]
    )
    if (exception.rows.length > 0 && !exception.rows[0].is_available) continue

    const ranges = await pool.query(
      `SELECT start_time, end_time FROM schedule_weekly WHERE day_of_week = $1 ORDER BY start_time`,
      [dayOfWeek]
    )

    if (ranges.rows.length === 0) continue

    let allSlots: string[] = []
    for (const r of ranges.rows) {
      allSlots = allSlots.concat(generateSlots(r.start_time, r.end_time, durationMinutes))
    }

    if (allSlots.length === 0) continue

    const dayStart = new Date(`${dateStr}T00:00:00`)
    const dayEnd = new Date(`${dateStr}T23:59:59`)

    const occupied = await pool.query(
      `SELECT start_time, end_time FROM bookings
       WHERE status = 'confirmed'
         AND start_time < $2::timestamptz
         AND end_time > $1::timestamptz`,
      [dayStart.toISOString(), dayEnd.toISOString()]
    )

    const available = allSlots.filter((slot) => {
      const slotStart = new Date(`${dateStr}T${slot}:00`)
      const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000)
      return !occupied.rows.some((b) => {
        const bStart = new Date(b.start_time)
        const bEnd = new Date(b.end_time)
        const overlapStart = new Date(bStart.getTime() - 30 * 60000)
        const overlapEnd = new Date(bEnd.getTime() + 30 * 60000)
        return slotStart < overlapEnd && slotEnd > overlapStart
      })
    })

    if (available.length > 0) {
      dates.push(dateStr)
    }
  }

  return NextResponse.json({ year, month, dates })
}
