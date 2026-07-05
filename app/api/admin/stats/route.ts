import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-helpers"
import { sql } from "drizzle-orm"

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const totalsResult = await db.execute(sql`
      SELECT
        COUNT(*)::int AS total_payments,
        COALESCE(SUM(amount_cents), 0) AS total_revenue_cents,
        COALESCE(SUM(amount_cents) FILTER (WHERE status = 'refunded'), 0) AS refunded_cents
      FROM payments
      WHERE status IN ('succeeded', 'refunded')
    `)

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const monthStart = `${year}-${String(month).padStart(2, '0')}-01`

    const monthResult = await db.execute(sql`
      SELECT
        COUNT(*)::int AS month_count,
        COALESCE(SUM(amount_cents), 0) AS month_revenue_cents
      FROM payments
      WHERE status = 'succeeded'
        AND created_at >= ${monthStart}::timestamptz
    `)

    const monthlyResult = await db.execute(sql`
      SELECT
        DATE_TRUNC('month', created_at)::date AS month,
        COUNT(*)::int AS count,
        COALESCE(SUM(amount_cents), 0) AS revenue_cents
      FROM payments
      WHERE status = 'succeeded'
        AND created_at >= ${`${year - 1}-${String(month).padStart(2, '0')}-01`}::timestamptz
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `)

    const invoiceResult = await db.execute(sql`
      SELECT COUNT(*)::int AS count FROM invoices
    `)

    const total = totalsResult.rows[0]
    const monthInfo = monthResult.rows[0]

    return NextResponse.json({
      totalRevenueCents: Number(total.total_revenue_cents),
      refundedCents: Number(total.refunded_cents),
      netRevenueCents: Number(total.total_revenue_cents) - Number(total.refunded_cents),
      totalPayments: total.total_payments,
      monthRevenueCents: Number(monthInfo.month_revenue_cents),
      monthCount: monthInfo.month_count,
      totalInvoices: invoiceResult.rows[0].count,
      monthly: monthlyResult.rows,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Error al cargar estadísticas" }, { status: 500 })
  }
}
