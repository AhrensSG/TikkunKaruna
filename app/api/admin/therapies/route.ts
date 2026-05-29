import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { auth } from '@/lib/auth.config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const result = await pool.query(
      `SELECT id, name, subtitle, description, duration_minutes, price_cents,
              is_active, image_url, category, modality, is_pack,
              session_count, sort_order, created_at
       FROM therapies
       ORDER BY sort_order, created_at DESC`
    )

    // Normalizar columnas que pueden no existir aún (migraciones 005/006)
    const therapies = result.rows.map((r) => ({
      ...r,
      tag: r.tag ?? '',
      video_url: r.video_url ?? '',
    }))

    return NextResponse.json({ therapies })
  } catch (err: any) {
    console.error('GET /api/admin/therapies:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
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
      `INSERT INTO therapies
         (name, subtitle, description, duration_minutes, price_cents,
          is_active, image_url, category, modality, is_pack, session_count, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
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
      ]
    )

    const therapy = {
      ...result.rows[0],
      tag: result.rows[0].tag ?? '',
      video_url: result.rows[0].video_url ?? '',
    }

    return NextResponse.json({ therapy }, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/admin/therapies:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
