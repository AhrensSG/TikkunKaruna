import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { auth } from '@/lib/auth.config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const result = await pool.query(
    `SELECT
       b.id,
       b.start_time,
       b.end_time,
       b.status,
       t.name AS therapy_name,
       t.price_cents,
       COALESCE(p.amount_cents, t.price_cents) AS amount_cents,
       p.status AS payment_status,
       b.admin_notes,
       COALESCE(json_agg(tr.description) FILTER (WHERE tr.description IS NOT NULL), '[]') AS requirements
     FROM bookings b
     JOIN therapies t ON t.id = b.therapy_id
     LEFT JOIN payments p ON p.booking_id = b.id
     LEFT JOIN therapy_requirements tr ON tr.therapy_id = t.id
     WHERE b.user_id = $1
     GROUP BY b.id, t.name, t.price_cents, p.amount_cents, p.status
     ORDER BY b.start_time DESC`,
    [session.user.id]
  )

  const bookings = result.rows
  for (const booking of bookings) {
    const sessions = await pool.query(
      `SELECT id, session_number, start_time, end_time, status
       FROM booking_sessions
       WHERE booking_id = $1
       ORDER BY session_number ASC`,
      [booking.id]
    )
    booking.sessions = sessions.rows
  }

  return NextResponse.json({ bookings })
}
