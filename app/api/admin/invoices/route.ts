import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT i.id, i.invoice_number, i.amount_cents, i.created_at,
              u.name AS user_name, u.email AS user_email,
              t.name AS therapy_name
       FROM invoices i
       JOIN users u ON u.id = i.user_id
       JOIN bookings b ON b.id = i.booking_id
       JOIN therapies t ON t.id = b.therapy_id
       ORDER BY i.created_at DESC`
    )
    return NextResponse.json({ invoices: rows })
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Error al cargar facturas" }, { status: 500 })
  }
}
