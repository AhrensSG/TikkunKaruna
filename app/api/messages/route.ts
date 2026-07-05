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

  let rows, unread

  try {
    const result = await db.execute(sql`
      SELECT b.id, b.admin_notes, b.start_time, b.end_time, b.status, b.message_read_at,
             t.name AS therapy_name
      FROM bookings b
      JOIN therapies t ON t.id = b.therapy_id
      WHERE b.user_id = ${session.user.id}
        AND b.status = 'completed'
        AND b.admin_notes IS NOT NULL
        AND b.admin_notes != ''
      ORDER BY b.end_time DESC
    `)
    rows = result.rows as { id: string; admin_notes: string | null; start_time: string; end_time: string; status: string; message_read_at: string | null; therapy_name: string }[]
    unread = rows.filter((r) => !r.message_read_at).length
  } catch {
    const result = await db.execute(sql`
      SELECT b.id, b.admin_notes, b.start_time, b.end_time, b.status,
             NULL::timestamptz AS message_read_at,
             t.name AS therapy_name
      FROM bookings b
      JOIN therapies t ON t.id = b.therapy_id
      WHERE b.user_id = ${session.user.id}
        AND b.status = 'completed'
        AND b.admin_notes IS NOT NULL
        AND b.admin_notes != ''
      ORDER BY b.end_time DESC
    `)
    rows = result.rows as { id: string; admin_notes: string | null; start_time: string; end_time: string; status: string; message_read_at: string | null; therapy_name: string }[]
    unread = 0
  }

  return NextResponse.json({ messages: rows, unread })
}
