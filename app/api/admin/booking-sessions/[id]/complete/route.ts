import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendEmail, sessionCompletedHtml } from "@/emails"
import { requireAdmin } from "@/lib/auth-helpers"
import { sendWhatsApp } from "@/lib/whatsapp"
import { bookingSessions, bookings } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    const { notes } = await req.json()

    const result = await db.execute(sql`
      UPDATE booking_sessions bs SET status = 'completed', admin_notes = ${notes || null}
      FROM bookings b, users u, therapies t
      WHERE bs.id = ${id} AND bs.booking_id = b.id AND bs.status = 'confirmed'
        AND b.user_id = u.id AND b.therapy_id = t.id
      RETURNING bs.id, bs.session_number, bs.booking_id, bs.status, bs.admin_notes,
                u.name AS user_name, u.email AS user_email, u.phone AS user_phone,
                t.name AS therapy_name
    `)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Sesión no encontrada o ya completada" }, { status: 404 })
    }

    const s = result.rows[0] as {
      id: string; session_number: number; booking_id: string; status: string; admin_notes: string | null;
      user_name: string; user_email: string; user_phone: string | null; therapy_name: string;
    }

    const remaining = await db.execute(sql`
      SELECT COUNT(*)::int AS count FROM booking_sessions
      WHERE booking_id = ${s.booking_id} AND status != 'completed'
    `)

    if (remaining.rows[0].count === 0) {
      await db.update(bookings)
        .set({ status: 'completed' })
        .where(eq(bookings.id, s.booking_id))
    }

    if (s.admin_notes) {
      await sendEmail(
        s.user_email,
        `✨ Sesión ${s.session_number} completada — ${s.therapy_name}`,
        sessionCompletedHtml(s.user_name, `${s.therapy_name} (Sesión ${s.session_number})`, s.admin_notes)
      )

      if (s.user_phone) {
        sendWhatsApp(
          s.user_phone,
          `✨ *Sesión ${s.session_number} completada — ${s.therapy_name}*\n\nHola ${s.user_name}, tu sesión ${s.session_number} de ${s.therapy_name} ha sido completada.\n\n💜 Mensaje de Inma:\n${s.admin_notes}\n\nGracias por confiar en TikkunKaruna 🙏`
        )
      }
    }

    return NextResponse.json({ session: s })
  } catch (error) {
    console.error("Error completing session:", error)
    return NextResponse.json({ error: "Error al completar la sesión" }, { status: 500 })
  }
}
