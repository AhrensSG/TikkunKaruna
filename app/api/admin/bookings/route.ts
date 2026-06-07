import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT b.id, b.start_time, b.end_time, b.status, b.created_at,
              b.admin_notes, b.therapy_id,
              u.name AS user_name, u.email AS user_email,
              t.name AS therapy_name, t.price_cents
       FROM bookings b
       JOIN users u ON u.id = b.user_id
       JOIN therapies t ON t.id = b.therapy_id
       ORDER BY b.start_time DESC`
    )
    return NextResponse.json({ bookings: rows })
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return NextResponse.json({ error: "Error al cargar reservas" }, { status: 500 })
  }
}
