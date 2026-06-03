import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { auth } from '@/lib/auth.config'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { id } = await params

  const result = await pool.query(
    `SELECT t.*, COALESCE(
       json_agg(tr.description) FILTER (WHERE tr.description IS NOT NULL),
       '[]'
     ) AS requirements
     FROM therapies t
     LEFT JOIN therapy_requirements tr ON tr.therapy_id = t.id
     WHERE t.id = $1
     GROUP BY t.id`,
    [id]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
  }

  return NextResponse.json({ therapy: result.rows[0] })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { id } = await params
    const { name, description, duration_minutes, price_cents, is_active, image_url, video_url, requirements } = await req.json()

    const result = await pool.query(
      `UPDATE therapies
       SET name = $1, description = $2, duration_minutes = $3, price_cents = $4,
           is_active = $5, image_url = $6, video_url = $7
       WHERE id = $8
       RETURNING *`,
      [name, description || '', duration_minutes, price_cents, is_active ?? true, image_url || '', video_url || '', id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
    }

    if (requirements && Array.isArray(requirements)) {
      await pool.query('DELETE FROM therapy_requirements WHERE therapy_id = $1', [id])

      if (requirements.length > 0) {
        const values = requirements.map((_: string, i: number) => `($1, $${i + 2})`).join(', ')
        await pool.query(
          `INSERT INTO therapy_requirements (therapy_id, description) VALUES ${values}`,
          [id, ...requirements]
        )
      }
    }

    const therapy = result.rows[0]
    therapy.requirements = requirements || []

    return NextResponse.json({ therapy })
  } catch (error) {
    console.error('Error updating therapy:', error)
    return NextResponse.json({ error: 'Error al actualizar la terapia' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { id } = await params
    const { is_active } = await req.json()

    if (typeof is_active !== 'boolean') {
      return NextResponse.json({ error: 'is_active debe ser booleano' }, { status: 400 })
    }

    const result = await pool.query(
      'UPDATE therapies SET is_active = $1 WHERE id = $2 RETURNING id, name, is_active',
      [is_active, id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ therapy: result.rows[0] })
  } catch (error) {
    console.error('Error toggling therapy:', error)
    return NextResponse.json({ error: 'Error al actualizar la terapia' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { id } = await params

    const result = await pool.query(
      'DELETE FROM therapies WHERE id = $1 RETURNING id',
      [id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting therapy:', error)
    return NextResponse.json({ error: 'Error al eliminar la terapia' }, { status: 500 })
  }
}
