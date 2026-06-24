import { auth } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  if ((session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  return null
}

export async function requireUser() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  return session
}
