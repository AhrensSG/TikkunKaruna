import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { notifyAdmin, adminNewUserHtml } from '@/emails'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const rateCheck = await checkRateLimit(`register:${ip}`, 'register', { maxRequests: 5, windowMs: 60_000 })
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Demasiados intentos. Intenta de nuevo en un minuto.' }, { status: 429 })
    }

    const { name, email, phone, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, email y contraseña son obligatorios' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con ese correo electrónico' },
        { status: 409 }
      )
    }

    const hashed = await hashPassword(password)
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, password, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING id, name, email, phone, role, created_at`,
      [name, email, phone || '', hashed]
    )

    const user = result.rows[0]
    notifyAdmin(
      `👤 Nuevo registro: ${user.name}`,
      adminNewUserHtml(user.name, user.email)
    )
    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido'
    console.error('Register error:', msg)
    return NextResponse.json(
      { error: 'Error al registrar. Intentalo de nuevo.' },
      { status: 500 }
    )
  }
}
