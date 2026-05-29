import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result = await pool.query(`
    SELECT
      t.id, t.name, t.subtitle, t.description, t.duration_minutes, t.price_cents,
      t.image_url, t.category, t.modality, t.is_pack, t.session_count, t.tag,
      t.sort_order, t.created_at,
      p.name AS prerequisite_name,
      COALESCE(
        ARRAY_AGG(ti.indication ORDER BY ti.sort_order) FILTER (WHERE ti.id IS NOT NULL),
        ARRAY[]::text[]
      ) AS indications
    FROM therapies t
    LEFT JOIN therapies p ON p.id = t.prerequisite_id
    LEFT JOIN therapy_indications ti ON ti.therapy_id = t.id
    WHERE t.is_active = true
    GROUP BY t.id, t.name, t.subtitle, t.description, t.duration_minutes, t.price_cents,
             t.image_url, t.category, t.modality, t.is_pack, t.session_count, t.tag,
             t.sort_order, t.created_at, p.name
    ORDER BY t.sort_order, t.created_at
  `)

  return NextResponse.json({ therapies: result.rows })
}
