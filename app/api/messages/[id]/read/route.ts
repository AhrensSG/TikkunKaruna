import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { auth } from '@/lib/auth.config'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  try {
    await pool.query(
      `UPDATE bookings SET message_read_at = NOW()
       WHERE id = $1 AND user_id = $2 AND status = 'completed' AND admin_notes IS NOT NULL`,
      [id, session.user.id]
    )
  } catch {
    // columna message_read_at no existe aún — ignorar
  }

  return NextResponse.json({ ok: true })
}
