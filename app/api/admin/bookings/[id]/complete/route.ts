import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { sendEmail, sessionCompletedHtml } from "@/emails"
import { requireAdmin } from "@/lib/auth-helpers"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    const { notes } = await req.json()

    const { rows: bookings } = await pool.query(
      `UPDATE bookings SET status = 'completed', admin_notes = $1
       FROM users, therapies
       WHERE bookings.id = $2 AND bookings.status = 'confirmed'
         AND bookings.user_id = users.id
         AND bookings.therapy_id = therapies.id
       RETURNING bookings.id, bookings.status, bookings.admin_notes,
                 users.name AS user_name, users.email AS user_email,
                 therapies.name AS therapy_name`,
      [notes || null, id]
    )

    if (bookings.length === 0) {
      return NextResponse.json({ error: "Reserva no encontrada o ya completada" }, { status: 404 })
    }

    const b = bookings[0]

    await pool.query(
      `UPDATE booking_sessions SET status = 'completed'
       WHERE booking_id = $1 AND status = 'confirmed'`,
      [id]
    )

    if (b.admin_notes) {
      await sendEmail(
        b.user_email,
        `✨ Sesión completada — ${b.therapy_name}`,
        sessionCompletedHtml(b.user_name, b.therapy_name, b.admin_notes)
      )
    }

    return NextResponse.json({ booking: { id: b.id, status: b.status, admin_notes: b.admin_notes } })
  } catch (error) {
    console.error("Error completing booking:", error)
    return NextResponse.json({ error: "Error al completar la sesión" }, { status: 500 })
  }
}
