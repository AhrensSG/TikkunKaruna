import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth.config'
import { hashPassword } from '@/lib/auth'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const result = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    phone: users.phone,
    image: users.image,
    role: users.role,
    createdAt: users.createdAt,
  })
    .from(users)
    .where(eq(users.id, session.user.id))

  if (result.length === 0) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  return NextResponse.json({ user: result[0] })
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { name, phone, image, currentPassword, newPassword } = await req.json()

    const updateData: Record<string, string | null> = {}

    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (image !== undefined) updateData.image = image

    if (newPassword) {
      const { verifyPassword } = await import('@/lib/auth')
      const userResult = await db.select({ password: users.password })
        .from(users)
        .where(eq(users.id, session.user.id))
      if (userResult.length === 0) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }
      if (!currentPassword) {
        return NextResponse.json({ error: 'Contraseña actual requerida' }, { status: 400 })
      }
      const valid = await verifyPassword(currentPassword, userResult[0].password)
      if (!valid) {
        return NextResponse.json({ error: 'Contraseña actual incorrecta' }, { status: 400 })
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Mínimo 6 caracteres' }, { status: 400 })
      }
      updateData.password = await hashPassword(newPassword)
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 })
    }

    const result = await db.update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        image: users.image,
        role: users.role,
        createdAt: users.createdAt,
      })

    return NextResponse.json({ user: result[0] })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 })
  }
}
