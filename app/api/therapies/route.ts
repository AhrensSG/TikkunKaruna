import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { therapies, therapyRequirements } from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const rows = await db.execute(sql`
      SELECT t.id, t.name, t.description,
             t.duration_minutes, t.price_cents, t.image_url, t.video_url,
             t.is_pack, t.session_count, t.session_duration_minutes,
             COALESCE(json_agg(tr.description ORDER BY tr.sort_order) FILTER (WHERE tr.description IS NOT NULL), '[]') AS requirements
      FROM therapies t
      LEFT JOIN therapy_requirements tr ON tr.therapy_id = t.id
      WHERE t.is_active = true AND t.deleted_at IS NULL
      GROUP BY t.id
      ORDER BY t.sort_order, t.created_at
    `)
    const therapiesData = rows.rows

    return NextResponse.json({ therapies: therapiesData })
  } catch (error) {
    console.error("Error fetching therapies:", error)
    return NextResponse.json({ error: "Error al cargar terapias" }, { status: 500 })
  }
}
