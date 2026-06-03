import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { auth } from '@/lib/auth.config'

export const dynamic = 'force-dynamic'

export async function PUT(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { orders } = await req.json()

    if (!Array.isArray(orders)) {
      return NextResponse.json({ error: 'orders debe ser un array' }, { status: 400 })
    }

    for (const item of orders) {
      await pool.query(
        'UPDATE therapies SET sort_order = $1 WHERE id = $2',
        [item.sort_order, item.id]
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering therapies:', error)
    return NextResponse.json({ error: 'Error al reordenar' }, { status: 500 })
  }
}
