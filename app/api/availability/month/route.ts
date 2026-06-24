import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { generateSlots } from '@/lib/slots'
import { getEffectiveDuration } from '@/lib/therapy'
import { BUFFER_MINUTES, MIN_HOURS_FROM_NOW, DEFAULT_DURATION_MINUTES } from '@/lib/constants'
import { toDateStr } from '@/lib/date'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const year = parseInt(searchParams.get('year') || '')
    const month = parseInt(searchParams.get('month') || '')
    const therapyId = searchParams.get('therapyId')
    const after = searchParams.get('after')

    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json({ error: 'year y month requeridos' }, { status: 400 })
    }

    let durationMinutes = DEFAULT_DURATION_MINUTES
    if (therapyId) {
      const therapy = await pool.query(
        "SELECT duration_minutes, is_pack, session_duration_minutes FROM therapies WHERE id = $1 AND is_active = true AND deleted_at IS NULL",
        [therapyId]
      )
      if (therapy.rows.length > 0) {
        durationMinutes = getEffectiveDuration(therapy.rows[0])
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
      allSlots = [...new Set(allSlots)]

      if (allSlots.length === 0) continue

      const dayStart = new Date(`${dateStr}T00:00:00`)
      const dayEnd = new Date(`${dateStr}T23:59:59`)

      const occupied = await pool.query(
        `SELECT start_time::text, end_time::text FROM bookings
         WHERE status = 'confirmed'
           AND start_time < $2::timestamptz
           AND end_time > $1::timestamptz
         UNION ALL
         SELECT bs.start_time::text, bs.end_time::text FROM booking_sessions bs
         JOIN bookings b ON b.id = bs.booking_id
         WHERE bs.status = 'confirmed'
           AND b.status = 'confirmed'
           AND bs.start_time < $2::timestamptz
           AND bs.end_time > $1::timestamptz`,
        [dayStart.toISOString(), dayEnd.toISOString()]
      )

      const now = new Date()

      const available = allSlots.filter((slot) => {
        const slotStart = new Date(`${dateStr}T${slot}:00`)
        const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60_000)

        const hoursFromNow = (slotStart.getTime() - now.getTime()) / 3_600_000
        if (hoursFromNow < MIN_HOURS_FROM_NOW) return false

        if (minStart && slotStart < minStart) return false

        return !occupied.rows.some((b) => {
          const bStart = new Date(b.start_time)
          const bEnd = new Date(b.end_time)
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
