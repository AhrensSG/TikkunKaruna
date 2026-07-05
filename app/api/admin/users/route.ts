import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth.config'
import { hash } from 'bcryptjs'
import { users } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    phone: users.phone,
    role: users.role,
    createdAt: users.createdAt,
  })
    .from(users)
    .orderBy(sql`created_at DESC`)

  return NextResponse.json({ users: result })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  try {
    const { name, email, phone, password, role } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nombre, email y contraseña son obligatorios' }, { status: 400 })
    }

    const exists = await db.select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))

    if (exists.length > 0) {
      return NextResponse.json({ error: 'Ya existe un usuario con ese email' }, { status: 409 })
    }

    const hashed = await hash(password, 12)
    const result = await db.insert(users).values({
      name,
      email,
      phone: phone || '',
      password: hashed,
      role: role || 'user',
    }).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      createdAt: users.createdAt,
    })

    return NextResponse.json({ user: result[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Error al crear el usuario' }, { status: 500 })
  }
}
