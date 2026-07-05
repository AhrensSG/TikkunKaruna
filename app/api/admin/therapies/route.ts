import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth.config'
import { therapies, therapyRequirements } from '@/lib/db/schema'
import { eq, sql, asc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const result = await db.execute(sql`
    SELECT t.*, COALESCE(
      json_agg(tr.description ORDER BY tr.sort_order) FILTER (WHERE tr.description IS NOT NULL),
      '[]'
    ) AS requirements
    FROM therapies t
    LEFT JOIN therapy_requirements tr ON tr.therapy_id = t.id
    WHERE t.deleted_at IS NULL
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `)

  return NextResponse.json({ therapies: result.rows })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { name, description, duration_minutes, price_cents, is_active, image_url, video_url, requirements, is_pack, session_count, session_duration_minutes } = await req.json()

    if (!name || !duration_minutes || !price_cents) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const result = await db.insert(therapies).values({
      name,
      description: description || '',
      durationMinutes: duration_minutes,
      priceCents: price_cents,
      isActive: is_active ?? true,
      imageUrl: image_url || '',
      videoUrl: video_url || '',
      isPack: is_pack ?? false,
      sessionCount: session_count ?? null,
      sessionDurationMinutes: session_duration_minutes ?? null,
    }).returning()

    const therapy = result[0]

    if (requirements && Array.isArray(requirements) && requirements.length > 0) {
      await db.insert(therapyRequirements).values(
        requirements.map((desc: string, i: number) => ({
          therapyId: therapy.id,
          description: desc,
          sortOrder: i,
        }))
      )
    }

    return NextResponse.json({ therapy: { ...therapy, requirements: requirements || [] } }, { status: 201 })
  } catch (error) {
    console.error('Error creating therapy:', error)
    return NextResponse.json({ error: 'Error al crear la terapia' }, { status: 500 })
  }
}
