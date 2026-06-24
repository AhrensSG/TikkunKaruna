import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { auth } from '@/lib/auth.config'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const result = await pool.query(
    'SELECT id, name, email, phone, image, role, created_at FROM users WHERE id = $1',
    [session.user.id]
  )

  if (result.rows.length === 0) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
  }

  return NextResponse.json({ user: result.rows[0] })
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { name, phone, image, currentPassword, newPassword } = await req.json()

    const sets: string[] = []
    const values: (string | number | boolean)[] = []
    let idx = 1

    if (name !== undefined) {
      sets.push(`name = $${idx++}`)
      values.push(name)
    }
    if (phone !== undefined) {
      sets.push(`phone = $${idx++}`)
      values.push(phone)
    }
    if (image !== undefined) {
      sets.push(`image = $${idx++}`)
      values.push(image)
    }

    if (newPassword) {
      const { verifyPassword } = await import('@/lib/auth')
      const user = await pool.query('SELECT password FROM users WHERE id = $1', [session.user.id])
      if (user.rows.length === 0) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }
      if (!currentPassword) {
        return NextResponse.json({ error: 'Contraseña actual requerida' }, { status: 400 })
      }
      const valid = await verifyPassword(currentPassword, user.rows[0].password)
      if (!valid) {
        return NextResponse.json({ error: 'Contraseña actual incorrecta' }, { status: 400 })
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'Mínimo 6 caracteres' }, { status: 400 })
      }
      sets.push(`password = $${idx++}`)
      values.push(await hashPassword(newPassword))
    }

    if (sets.length === 0) {
      return NextResponse.json({ error: 'Nada que actualizar' }, { status: 400 })
    }

    values.push(session.user.id)
    const result = await pool.query(
      `UPDATE users SET ${sets.join(', ')} WHERE id = $${idx} RETURNING id, name, email, phone, image, role, created_at`,
      values
    )

    return NextResponse.json({ user: result.rows[0] })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Error al actualizar el perfil' }, { status: 500 })
  }
}
