import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result = await pool.query(
    `SELECT t.id, t.name, t.description, t.duration_minutes, t.price_cents,
            t.image_url, t.video_url,
            COALESCE(
              json_agg(tr.description) FILTER (WHERE tr.description IS NOT NULL),
              '[]'
            ) AS requirements
     FROM therapies t
     LEFT JOIN therapy_requirements tr ON tr.therapy_id = t.id
     WHERE t.is_active = true
     GROUP BY t.id
     ORDER BY t.sort_order ASC, t.created_at DESC`
  )
  return NextResponse.json({ therapies: result.rows })
}
