import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const { start_time } = await req.json()
    if (!start_time) {
      return NextResponse.json({ error: "start_time requerido" }, { status: 400 })
    }

    const newStart = new Date(start_time)
    if (isNaN(newStart.getTime())) {
      return NextResponse.json({ error: "Fecha inválida" }, { status: 400 })
    }

    const booking = await pool.query(
      "SELECT therapy_id FROM bookings WHERE id = $1 AND status = 'confirmed'",
      [id]
    )
    if (booking.rows.length === 0) {
      return NextResponse.json({ error: "Reserva no encontrada o no confirmada" }, { status: 404 })
    }

    const therapy = await pool.query(
      "SELECT duration_minutes FROM therapies WHERE id = $1 AND is_active = true",
      [booking.rows[0].therapy_id]
    )
    if (therapy.rows.length === 0) {
      return NextResponse.json({ error: "Terapia no encontrada" }, { status: 404 })
    }

    const durationMinutes = therapy.rows[0].duration_minutes
    const newEnd = new Date(newStart.getTime() + durationMinutes * 60000)

    const { rows } = await pool.query(
      `UPDATE bookings SET start_time = $1, end_time = $2 WHERE id = $3 RETURNING *`,
      [newStart.toISOString(), newEnd.toISOString(), id]
    )

    return NextResponse.json({ booking: rows[0] })
  } catch (error) {
    console.error("Error rescheduling booking:", error)
    return NextResponse.json({ error: "Error al reprogramar" }, { status: 500 })
  }
}
