import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { auth } from '@/lib/auth.config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const result = await pool.query(
    `SELECT t.*, COALESCE(
       json_agg(tr.description) FILTER (WHERE tr.description IS NOT NULL),
       '[]'
     ) AS requirements
     FROM therapies t
     LEFT JOIN therapy_requirements tr ON tr.therapy_id = t.id
     GROUP BY t.id
     ORDER BY t.created_at DESC`
  )

  return NextResponse.json({ therapies: result.rows })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { name, description, duration_minutes, price_cents, is_active, image_url, video_url, requirements } = await req.json()

    if (!name || !duration_minutes || !price_cents) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const result = await pool.query(
      `INSERT INTO therapies (name, description, duration_minutes, price_cents, is_active, image_url, video_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description || '', duration_minutes, price_cents, is_active ?? true, image_url || '', video_url || '']
    )

    const therapy = result.rows[0]

    if (requirements && Array.isArray(requirements) && requirements.length > 0) {
      const values = requirements.map((_: string, i: number) => `($1, $${i + 2})`).join(', ')
      await pool.query(
        `INSERT INTO therapy_requirements (therapy_id, description) VALUES ${values}`,
        [therapy.id, ...requirements]
      )
    }

    therapy.requirements = requirements || []

    return NextResponse.json({ therapy }, { status: 201 })
  } catch (error) {
    console.error('Error creating therapy:', error)
    return NextResponse.json({ error: 'Error al crear la terapia' }, { status: 500 })
  }
}
