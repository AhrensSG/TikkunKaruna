import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { generateSlots } from '@/lib/slots'
import { getEffectiveDuration } from '@/lib/therapy'
import { BUFFER_MINUTES, MIN_HOURS_FROM_NOW, DEFAULT_DURATION_MINUTES } from '@/lib/constants'

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
      const therapy = await pool.query(
        "SELECT duration_minutes, is_pack, session_duration_minutes FROM therapies WHERE id = $1 AND is_active = true AND deleted_at IS NULL",
        [therapyId]
      )
      if (therapy.rows.length > 0) {
        durationMinutes = getEffectiveDuration(therapy.rows[0])
      }
    }

    const dayDate = new Date(`${date}T12:00:00`)
    if (isNaN(dayDate.getTime())) {
      return NextResponse.json({ error: "Fecha inválida" }, { status: 400 })
    }

    const dayOfWeek = dayDate.getDay()
    const dayStart = new Date(`${date}T00:00:00`)
    const dayEnd = new Date(`${date}T23:59:59`)

    const exception = await pool.query(
      `SELECT is_available FROM schedule_exceptions WHERE exception_date = $1 LIMIT 1`,
      [date]
    )
    if (exception.rows.length > 0 && !exception.rows[0].is_available) {
      return NextResponse.json({ date, slots: [] })
    }

    const ranges = await pool.query(
      `SELECT start_time, end_time FROM schedule_weekly WHERE day_of_week = $1 ORDER BY start_time`,
      [dayOfWeek]
    )

    let allSlots: string[] = []
    for (const r of ranges.rows) {
      allSlots = allSlots.concat(generateSlots(r.start_time, r.end_time, durationMinutes))
    }
    allSlots = [...new Set(allSlots)]

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
    const minStart = after ? new Date(new Date(after).getTime() + MIN_HOURS_FROM_NOW * 3_600_000) : null

    const available = allSlots.filter((slot) => {
      const slotStart = new Date(`${date}T${slot}:00`)
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

    return NextResponse.json({ date, slots: available })
  } catch (error) {
    console.error("Error fetching availability:", error)
    return NextResponse.json({ error: "Error al consultar disponibilidad" }, { status: 500 })
  }
}
