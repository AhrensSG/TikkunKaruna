import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    const weekly = await pool.query(
      'SELECT id, day_of_week, start_time, end_time FROM schedule_weekly ORDER BY day_of_week, start_time'
    )
    const exceptions = await pool.query(
      'SELECT id, exception_date, start_time, end_time, is_available, reason FROM schedule_exceptions ORDER BY exception_date DESC'
    )
    return NextResponse.json({ weekly: weekly.rows, exceptions: exceptions.rows })
  } catch (error) {
    console.error('Error fetching schedule:', error)
    return NextResponse.json({ error: 'Error al cargar horarios' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { weekly } = await req.json()
    if (!Array.isArray(weekly)) {
      return NextResponse.json({ error: 'Formato inválido' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await client.query('DELETE FROM schedule_weekly')

      for (const entry of weekly) {
        if (entry.day_of_week === undefined || !entry.start_time || !entry.end_time) continue
        await client.query(
          'INSERT INTO schedule_weekly (day_of_week, start_time, end_time) VALUES ($1, $2, $3)',
          [entry.day_of_week, entry.start_time, entry.end_time]
        )
      }

      await client.query('COMMIT')
    } catch {
      await client.query('ROLLBACK')
      throw new Error('Error al guardar horario')
    } finally {
      client.release()
    }

    const { rows } = await pool.query(
      'SELECT id, day_of_week, start_time, end_time FROM schedule_weekly ORDER BY day_of_week, start_time'
    )

    return NextResponse.json({ weekly: rows })
  } catch (error) {
    console.error('Error saving schedule:', error)
    return NextResponse.json({ error: 'Error al guardar horario' }, { status: 500 })
  }
}
