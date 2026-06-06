import { NextResponse } from 'next/server'
import pool from '@/lib/db'

const BUFFER_MINUTES = 30

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
  const date = searchParams.get("date")
  const therapyId = searchParams.get("therapyId")

  if (!date) {
    return NextResponse.json({ error: "Fecha requerida" }, { status: 400 })
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

  console.log(`[availability] date=${date} dayOfWeek=${dayOfWeek} ranges=${ranges.rows.length}`)

  let allSlots: string[] = []
  for (const r of ranges.rows) {
    const slots = generateSlots(r.start_time, r.end_time, durationMinutes)
    console.log(`[availability] range ${r.start_time}-${r.end_time} -> ${slots.join(',') || 'NINGUNO'}`)
    allSlots = allSlots.concat(slots)
  }

  const occupied = await pool.query(
    `SELECT start_time, end_time FROM bookings
     WHERE status = 'confirmed'
       AND start_time < $2::timestamptz
       AND end_time > $1::timestamptz`,
    [dayStart.toISOString(), dayEnd.toISOString()]
  )

  const available = allSlots.filter((slot) => {
    const slotStart = new Date(`${date}T${slot}:00`)
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60000)

    return !occupied.rows.some((b) => {
      const bStart = new Date(b.start_time)
      const bEnd = new Date(b.end_time)
      const overlapStart = new Date(bStart.getTime() - BUFFER_MINUTES * 60000)
      const overlapEnd = new Date(bEnd.getTime() + BUFFER_MINUTES * 60000)
      return slotStart < overlapEnd && slotEnd > overlapStart
    })
  })

  console.log(`[availability] returning ${available.length} slots: ${available.join(',')}`)
  return NextResponse.json({ date, slots: available })
}
