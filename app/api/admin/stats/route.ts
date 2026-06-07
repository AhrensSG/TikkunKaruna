import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET() {
  try {
    const { rows: totals } = await pool.query(
      `SELECT
         COUNT(*)::int AS total_payments,
         COALESCE(SUM(amount_cents), 0) AS total_revenue_cents,
         COALESCE(SUM(amount_cents) FILTER (WHERE status = 'refunded'), 0) AS refunded_cents
       FROM payments
       WHERE status IN ('succeeded', 'refunded')`
    )

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const monthStart = `${year}-${String(month).padStart(2, '0')}-01`

    const { rows: monthData } = await pool.query(
      `SELECT
         COUNT(*)::int AS month_count,
         COALESCE(SUM(amount_cents), 0) AS month_revenue_cents
       FROM payments
       WHERE status = 'succeeded'
         AND created_at >= $1::timestamptz`,
      [monthStart]
    )

    const { rows: monthly } = await pool.query(
      `SELECT
         DATE_TRUNC('month', created_at)::date AS month,
         COUNT(*)::int AS count,
         COALESCE(SUM(amount_cents), 0) AS revenue_cents
       FROM payments
       WHERE status = 'succeeded'
         AND created_at >= $1::timestamptz
       GROUP BY month
       ORDER BY month DESC
       LIMIT 12`,
      [`${year - 1}-${String(month).padStart(2, '0')}-01`]
    )

    const { rows: invoiceCount } = await pool.query(
      `SELECT COUNT(*)::int AS count FROM invoices`
    )

    const total = totals[0]
    const monthInfo = monthData[0]

    return NextResponse.json({
      totalRevenueCents: Number(total.total_revenue_cents),
      refundedCents: Number(total.refunded_cents),
      netRevenueCents: Number(total.total_revenue_cents) - Number(total.refunded_cents),
      totalPayments: total.total_payments,
      monthRevenueCents: Number(monthInfo.month_revenue_cents),
      monthCount: monthInfo.month_count,
      totalInvoices: invoiceCount[0].count,
      monthly,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Error al cargar estadísticas" }, { status: 500 })
  }
}
