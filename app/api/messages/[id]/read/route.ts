import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth.config'
import { sql } from 'drizzle-orm'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  try {
    await db.execute(sql`
      UPDATE bookings SET message_read_at = NOW()
      WHERE id = ${id} AND user_id = ${session.user.id} AND status = 'completed' AND admin_notes IS NOT NULL
    `)
  } catch {
    // columna message_read_at no existe aún — ignorar
  }

  return NextResponse.json({ ok: true })
}
