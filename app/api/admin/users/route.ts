import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { auth } from '@/lib/auth.config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const result = await pool.query(
    `SELECT id, name, email, phone, role, created_at
     FROM users
     ORDER BY created_at DESC`
  )

  return NextResponse.json({ users: result.rows })
}
