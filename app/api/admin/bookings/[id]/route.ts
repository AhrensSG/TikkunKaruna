import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"
import { bookings, bookingSessions } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const { id } = await params
  try {
    const body = await req.json()

    if (body.action === 'cancel') {
      const result = await db.execute(sql`
        UPDATE bookings SET status = 'cancelled' WHERE id = ${id} AND status = 'pending' RETURNING id
      `)
      if (result.rows.length === 0) {
        return NextResponse.json({ error: "Reserva no encontrada o ya no está pendiente" }, { status: 404 })
      }
      await db.execute(sql`
        UPDATE booking_sessions SET status = 'cancelled' WHERE booking_id = ${id} AND status = 'pending'
      `)
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

    const bookingResult = await db.execute(sql`
      SELECT b.id, b.therapy_id, b.start_time, t.is_pack, t.session_duration_minutes, t.duration_minutes
      FROM bookings b JOIN therapies t ON t.id = b.therapy_id
      WHERE b.id = ${id} AND b.status = 'confirmed'
    `)
    if (bookingResult.rows.length === 0) {
      return NextResponse.json({ error: "Reserva no encontrada o no confirmada" }, { status: 404 })
    }

    const b = bookingResult.rows[0] as {
      id: string; therapy_id: string; start_time: string;
      is_pack: boolean; session_duration_minutes: number | null; duration_minutes: number;
    }
    const perSessionDuration = b.is_pack && b.session_duration_minutes
      ? b.session_duration_minutes
      : b.duration_minutes
    const newEnd = new Date(newStart.getTime() + perSessionDuration * 60000)

    if (session_id) {
      const sessionResult = await db.update(bookingSessions)
        .set({ startTime: newStart, endTime: newEnd })
        .where(and(eq(bookingSessions.id, session_id), eq(bookingSessions.bookingId, id)))
        .returning()
      if (sessionResult.length === 0) {
        return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 })
      }
      return NextResponse.json({ booking: { ...b, sessions: sessionResult, start_time: newStart.toISOString(), end_time: newEnd.toISOString() } })
    }

    const updateResult = await db.update(bookings)
      .set({ startTime: newStart, endTime: newEnd })
      .where(eq(bookings.id, id))
      .returning()

    return NextResponse.json({ booking: updateResult[0] })
  } catch (error) {
    console.error("Error rescheduling booking:", error)
    return NextResponse.json({ error: "Error al reprogramar" }, { status: 500 })
  }
}
