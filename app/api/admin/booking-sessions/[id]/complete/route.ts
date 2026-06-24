import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { sendEmail, sessionCompletedHtml } from "@/emails"
import { requireAdmin } from "@/lib/auth-helpers"
import { sendWhatsApp } from "@/lib/whatsapp"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    const { notes } = await req.json()

    const { rows: sessions } = await pool.query(
      `UPDATE booking_sessions bs SET status = 'completed', admin_notes = $1
       FROM bookings b, users u, therapies t
       WHERE bs.id = $2 AND bs.booking_id = b.id AND bs.status = 'confirmed'
         AND b.user_id = u.id AND b.therapy_id = t.id
       RETURNING bs.id, bs.session_number, bs.booking_id, bs.status, bs.admin_notes,
                 u.name AS user_name, u.email AS user_email, u.phone AS user_phone,
                 t.name AS therapy_name`,
      [notes || null, id]
    )

    if (sessions.length === 0) {
      return NextResponse.json({ error: "Sesión no encontrada o ya completada" }, { status: 404 })
    }

    const session = sessions[0]

    const { rows: remaining } = await pool.query(
      `SELECT COUNT(*)::int AS count FROM booking_sessions
       WHERE booking_id = $1 AND status != 'completed'`,
      [session.booking_id]
    )

    if (remaining[0].count === 0) {
      await pool.query(
        `UPDATE bookings SET status = 'completed' WHERE id = $1`,
        [session.booking_id]
      )
    }

    if (session.admin_notes) {
      await sendEmail(
        session.user_email,
        `✨ Sesión ${session.session_number} completada — ${session.therapy_name}`,
        sessionCompletedHtml(session.user_name, `${session.therapy_name} (Sesión ${session.session_number})`, session.admin_notes)
      )

      if (session.user_phone) {
        sendWhatsApp(
          session.user_phone,
          `✨ *Sesión ${session.session_number} completada — ${session.therapy_name}*\n\nHola ${session.user_name}, tu sesión ${session.session_number} de ${session.therapy_name} ha sido completada.\n\n💜 Mensaje de Inma:\n${session.admin_notes}\n\nGracias por confiar en TikkunKaruna 🙏`
        )
      }
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error("Error completing session:", error)
    return NextResponse.json({ error: "Error al completar la sesión" }, { status: 500 })
  }
}
