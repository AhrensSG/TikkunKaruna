import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth.config'
import { therapies, therapyRequirements } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const { id } = await params

  const result = await db.execute(sql`
    SELECT t.*, COALESCE(
      json_agg(tr.description ORDER BY tr.sort_order) FILTER (WHERE tr.description IS NOT NULL),
      '[]'
    ) AS requirements
    FROM therapies t
    LEFT JOIN therapy_requirements tr ON tr.therapy_id = t.id
    WHERE t.id = ${id}
    GROUP BY t.id
  `)

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
    const { name, description, duration_minutes, price_cents, is_active, image_url, video_url, requirements, is_pack, session_count, session_duration_minutes } = await req.json()

    const result = await db.update(therapies)
      .set({
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
      })
      .where(eq(therapies.id, id))
      .returning()

    if (result.length === 0) {
      return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
    }

    if (requirements && Array.isArray(requirements)) {
      await db.delete(therapyRequirements)
        .where(eq(therapyRequirements.therapyId, id))

      if (requirements.length > 0) {
        await db.insert(therapyRequirements).values(
          requirements.map((desc: string, i: number) => ({
            therapyId: id,
            description: desc,
            sortOrder: i,
          }))
        )
      }
    }

    return NextResponse.json({ therapy: { ...result[0], requirements: requirements || [] } })
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
    const { is_active, sort_order, restore } = await req.json()

    const updateData: Record<string, unknown> = {}

    if (typeof is_active === 'boolean') {
      updateData.isActive = is_active
    }
    if (typeof sort_order === 'number') {
      updateData.sortOrder = sort_order
    }
    if (restore === true) {
      updateData.deletedAt = null
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 })
    }

    const result = await db.update(therapies)
      .set(updateData)
      .where(eq(therapies.id, id))
      .returning({ id: therapies.id, name: therapies.name, isActive: therapies.isActive, sortOrder: therapies.sortOrder, deletedAt: therapies.deletedAt })

    if (result.length === 0) {
      return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ therapy: result[0] })
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

    const result = await db.update(therapies)
      .set({ isActive: false, deletedAt: new Date() })
      .where(eq(therapies.id, id))
      .returning({ id: therapies.id })

    if (result.length === 0) {
      return NextResponse.json({ error: 'Terapia no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting therapy:', error)
    return NextResponse.json({ error: 'Error al eliminar la terapia' }, { status: 500 })
  }
}
