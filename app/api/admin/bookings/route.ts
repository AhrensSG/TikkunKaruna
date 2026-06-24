import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { rows } = await pool.query(
      `SELECT b.id, b.start_time, b.end_time, b.status, b.created_at,
              b.admin_notes, b.therapy_id,
              u.name AS user_name, u.email AS user_email,
              t.name AS therapy_name, t.price_cents,
              t.is_pack, t.session_count,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', bs.id,
                    'session_number', bs.session_number,
                    'start_time', bs.start_time,
                    'end_time', bs.end_time,
                    'status', bs.status,
                    'admin_notes', bs.admin_notes
                  )
                  ORDER BY bs.session_number
                ) FILTER (WHERE bs.id IS NOT NULL),
                '[]'
              ) AS sessions
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       JOIN therapies t ON t.id = b.therapy_id
       LEFT JOIN booking_sessions bs ON bs.booking_id = b.id
       WHERE b.status IN ('confirmed', 'completed')
       GROUP BY b.id, u.name, u.email, t.name, t.price_cents, t.is_pack, t.session_count
       ORDER BY b.start_time DESC`
    )

    return NextResponse.json({ bookings: rows })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Error al cargar reservas" }, { status: 500 })
  }
}
