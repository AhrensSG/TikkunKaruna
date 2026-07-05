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
    SELECT p.id, p.amount_cents, p.currency, p.status, p.created_at,
           p.stripe_payment_id,
           t.name AS therapy_name
    FROM payments p
    JOIN bookings b ON b.id = p.booking_id
    JOIN therapies t ON t.id = b.therapy_id
    WHERE p.user_id = ${session.user.id}
    ORDER BY p.created_at DESC
  `)

  return NextResponse.json({ payments: result.rows })
}
