import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { auth } from '@/lib/auth.config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let rows, unread

  try {
    const result = await pool.query(
      `SELECT b.id, b.admin_notes, b.start_time, b.end_time, b.status, b.message_read_at,
              t.name AS therapy_name
       FROM bookings b
       JOIN therapies t ON t.id = b.therapy_id
       WHERE b.user_id = $1
         AND b.status = 'completed'
         AND b.admin_notes IS NOT NULL
         AND b.admin_notes != ''
       ORDER BY b.end_time DESC`,
      [session.user.id]
    )
    rows = result.rows
    unread = rows.filter((r: { message_read_at: string | null }) => !r.message_read_at).length
  } catch {
    const result = await pool.query(
      `SELECT b.id, b.admin_notes, b.start_time, b.end_time, b.status,
              NULL::timestamptz AS message_read_at,
              t.name AS therapy_name
       FROM bookings b
       JOIN therapies t ON t.id = b.therapy_id
       WHERE b.user_id = $1
         AND b.status = 'completed'
         AND b.admin_notes IS NOT NULL
         AND b.admin_notes != ''
       ORDER BY b.end_time DESC`,
      [session.user.id]
    )
    rows = result.rows
    unread = 0
  }

  return NextResponse.json({ messages: rows, unread })
}
