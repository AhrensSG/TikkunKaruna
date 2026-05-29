import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { auth } from '@/lib/auth.config'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const result = await pool.query(
      `SELECT id, name, subtitle, description, duration_minutes, price_cents,
              is_active, image_url, category, modality, is_pack,
              session_count, sort_order, created_at
       FROM therapies WHERE id = $1`,
      [params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
    }

    const therapy = {
      ...result.rows[0],
      tag: result.rows[0].tag ?? '',
      video_url: result.rows[0].video_url ?? '',
    }

    return NextResponse.json({ therapy })
  } catch (err: any) {
    console.error('GET /api/admin/therapies/[id]:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const body = await req.json()
    const {
      name, subtitle, description, duration_minutes, price_cents,
      is_active, image_url, category, modality, is_pack, session_count, sort_order,
    } = body

    if (!name || !duration_minutes || price_cents === undefined) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const result = await pool.query(
      `UPDATE therapies
       SET name=$1, subtitle=$2, description=$3, duration_minutes=$4, price_cents=$5,
           is_active=$6, image_url=$7, category=$8, modality=$9,
           is_pack=$10, session_count=$11, sort_order=$12
       WHERE id=$13
       RETURNING *`,
      [
        name,
        subtitle ?? '',
        description ?? '',
        Number(duration_minutes),
        Number(price_cents),
        is_active ?? true,
        image_url ?? '',
        category ?? 'pendulo_hebreo',
        modality ?? 'distancia',
        is_pack ?? false,
        Number(session_count ?? 1),
        Number(sort_order ?? 0),
        params.id,
      ]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
    }

    const therapy = {
      ...result.rows[0],
      tag: result.rows[0].tag ?? '',
      video_url: result.rows[0].video_url ?? '',
    }

    return NextResponse.json({ therapy })
  } catch (err: any) {
    console.error('PUT /api/admin/therapies/[id]:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const result = await pool.query(
      `DELETE FROM therapies WHERE id = $1 RETURNING id`,
      [params.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('DELETE /api/admin/therapies/[id]:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
