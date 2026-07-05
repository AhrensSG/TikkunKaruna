import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-helpers'
import { scheduleExceptions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params
    await db.delete(scheduleExceptions).where(eq(scheduleExceptions.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting exception:', error)
    return NextResponse.json({ error: 'Error al eliminar excepción' }, { status: 500 })
  }
}
