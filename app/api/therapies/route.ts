import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT t.id, t.name, t.description, t.duration_minutes, t.price_cents,
              t.image_url, t.video_url, t.is_pack, t.session_count, t.session_duration_minutes,
              COALESCE(
                json_agg(tr.description) FILTER (WHERE tr.description IS NOT NULL),
                '[]'
              ) AS requirements
       FROM therapies t
       LEFT JOIN therapy_requirements tr ON tr.therapy_id = t.id
        WHERE t.is_active = true AND t.deleted_at IS NULL
        GROUP BY t.id
       ORDER BY t.sort_order ASC, t.created_at DESC`
    )
    return NextResponse.json({ therapies: result.rows })
  } catch (error) {
    console.error("Error fetching therapies:", error)
    return NextResponse.json({ error: "Error al cargar terapias" }, { status: 500 })
  }
}
