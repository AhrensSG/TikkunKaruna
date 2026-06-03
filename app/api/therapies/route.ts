import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result = await pool.query(
    `SELECT id, name, description, duration_minutes, price_cents, image_url
     FROM therapies WHERE is_active = true
     ORDER BY sort_order ASC, created_at DESC`
  )
  return NextResponse.json({ therapies: result.rows })
}
