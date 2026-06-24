import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.amount_cents, p.currency, p.status, p.created_at,
              p.stripe_payment_id,
              u.name AS user_name, u.email AS user_email,
              t.name AS therapy_name,
              i.invoice_number, i.id AS invoice_id
       FROM payments p
       JOIN users u ON u.id = p.user_id
       JOIN bookings b ON b.id = p.booking_id
       JOIN therapies t ON t.id = b.therapy_id
       LEFT JOIN invoices i ON i.booking_id = b.id
       ORDER BY p.created_at DESC`
    )
    return NextResponse.json({ payments: rows })
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Error al cargar pagos" }, { status: 500 })
  }
}
