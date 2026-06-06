import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { exception_date, start_time, end_time, is_available, reason } = await req.json()

    if (!exception_date) {
      return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
    }

    const { rows } = await pool.query(
      `INSERT INTO schedule_exceptions (exception_date, start_time, end_time, is_available, reason)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, exception_date, start_time, end_time, is_available, reason`,
      [exception_date, start_time || null, end_time || null, is_available ?? false, reason || '']
    )

    return NextResponse.json({ exception: rows[0] })
  } catch (error) {
    console.error('Error creating exception:', error)
    return NextResponse.json({ error: 'Error al crear excepción' }, { status: 500 })
  }
}
