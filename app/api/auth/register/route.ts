import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { hashPassword } from '@/lib/auth'
import { notifyAdmin, adminNewUserHtml } from '@/emails'
import { checkRateLimit } from '@/lib/rate-limit'
import { eq } from 'drizzle-orm'

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

    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con ese correo electrónico' },
        { status: 409 }
      )
    }

    const hashed = await hashPassword(password)
    const [user] = await db
      .insert(users)
      .values({ name, email, phone: phone || '', password: hashed })
      .returning({ id: users.id, name: users.name, email: users.email, phone: users.phone, role: users.role, createdAt: users.createdAt })

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
