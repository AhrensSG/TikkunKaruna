import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params
  try {
    const body = await req.json()

    if (body.action === 'cancel') {
      const { rowCount } = await pool.query(
        `UPDATE bookings SET status = 'cancelled' WHERE id = $1 AND status = 'pending'`,
        [id]
      )
      if (rowCount === 0) {
        return NextResponse.json({ error: "Reserva no encontrada o ya no está pendiente" }, { status: 404 })
      }
      await pool.query(
        `UPDATE booking_sessions SET status = 'cancelled' WHERE booking_id = $1 AND status = 'pending'`,
        [id]
      )
      return NextResponse.json({ success: true })
    }

    const { start_time, session_id } = body
    if (!start_time) {
      return NextResponse.json({ error: "start_time requerido" }, { status: 400 })
    }

    const newStart = new Date(start_time)
    if (isNaN(newStart.getTime())) {
      return NextResponse.json({ error: "Fecha inválida" }, { status: 400 })
    }

    const booking = await pool.query(
      `SELECT b.id, b.therapy_id, b.start_time, t.is_pack, t.session_duration_minutes, t.duration_minutes
       FROM bookings b JOIN therapies t ON t.id = b.therapy_id
       WHERE b.id = $1 AND b.status = 'confirmed'`,
      [id]
    )
    if (booking.rows.length === 0) {
      return NextResponse.json({ error: "Reserva no encontrada o no confirmada" }, { status: 404 })
    }

    const b = booking.rows[0]
    const perSessionDuration = b.is_pack && b.session_duration_minutes
      ? b.session_duration_minutes
      : b.duration_minutes
    const newEnd = new Date(newStart.getTime() + perSessionDuration * 60000)

    if (session_id) {
      const { rows } = await pool.query(
        `UPDATE booking_sessions SET start_time = $1, end_time = $2 WHERE id = $3 AND booking_id = $4
         RETURNING *`,
        [newStart.toISOString(), newEnd.toISOString(), session_id, id]
      )
      if (rows.length === 0) {
        return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 })
      }
      return NextResponse.json({ booking: { ...b, sessions: rows, start_time: newStart.toISOString(), end_time: newEnd.toISOString() } })
    }

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
