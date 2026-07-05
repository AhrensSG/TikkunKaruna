import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendEmail, sessionCompletedHtml } from "@/emails"
import { requireAdmin } from "@/lib/auth-helpers"
import { sendWhatsApp } from "@/lib/whatsapp"
import { bookings, bookingSessions } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    const { notes } = await req.json()

    const result = await db.execute(sql`
      UPDATE bookings SET status = 'completed', admin_notes = ${notes || null}
      FROM users, therapies
      WHERE bookings.id = ${id} AND bookings.status = 'confirmed'
        AND bookings.user_id = users.id
        AND bookings.therapy_id = therapies.id
      RETURNING bookings.id, bookings.status, bookings.admin_notes,
                users.name AS user_name, users.email AS user_email, users.phone AS user_phone,
                therapies.name AS therapy_name
    `)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Reserva no encontrada o ya completada" }, { status: 404 })
    }

    const b = result.rows[0] as {
      id: string; status: string; admin_notes: string | null;
      user_name: string; user_email: string; user_phone: string | null; therapy_name: string;
    }

    await db.update(bookingSessions)
      .set({ status: 'completed' })
      .where(and(eq(bookingSessions.bookingId, id), eq(bookingSessions.status, 'confirmed')))

    if (b.admin_notes) {
      await sendEmail(
        b.user_email,
        `✨ Sesión completada — ${b.therapy_name}`,
        sessionCompletedHtml(b.user_name, b.therapy_name, b.admin_notes)
      )

      if (b.user_phone) {
        sendWhatsApp(
          b.user_phone,
          `✨ *Sesión completada — ${b.therapy_name}*\n\nHola ${b.user_name}, tu sesión de ${b.therapy_name} ha sido completada.\n\n💜 Mensaje de Inma:\n${b.admin_notes}\n\nGracias por confiar en TikkunKaruna 🙏`
        )
      }
    }

    return NextResponse.json({ booking: { id: b.id, status: b.status, admin_notes: b.admin_notes } })
  } catch (error) {
    console.error("Error completing booking:", error)
    return NextResponse.json({ error: "Error al completar la sesión" }, { status: 500 })
  }
}
