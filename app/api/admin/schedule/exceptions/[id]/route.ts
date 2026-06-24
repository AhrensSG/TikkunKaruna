import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth-helpers'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    await pool.query('DELETE FROM schedule_exceptions WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting exception:', error)
    return NextResponse.json({ error: 'Error al eliminar excepción' }, { status: 500 })
  }
}
