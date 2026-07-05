import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth.config'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const result = await db.execute(sql`
    SELECT i.id, i.invoice_number, i.amount_cents, i.created_at,
           t.name AS therapy_name
    FROM invoices i
    JOIN bookings b ON b.id = i.booking_id
    JOIN therapies t ON t.id = b.therapy_id
    WHERE i.user_id = ${session.user.id}
    ORDER BY i.created_at DESC
  `)

  return NextResponse.json({ invoices: result.rows })
}
