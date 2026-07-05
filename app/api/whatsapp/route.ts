import { NextResponse } from 'next/server'
import { sendWhatsApp, notifyAdminWhatsApp } from '@/lib/whatsapp'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-helpers'
import { sql } from 'drizzle-orm'

export async function POST(req: Request) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { to, message, type } = await req.json()

    if (type === 'admin') {
      await notifyAdminWhatsApp(message || 'Notificación desde TikkunKaruna')
      return NextResponse.json({ sent: true })
    }

    if (!to || !message) {
      return NextResponse.json({ error: 'Se requiere "to" y "message"' }, { status: 400 })
    }

    await sendWhatsApp(to, message)
    return NextResponse.json({ sent: true })
  } catch (error) {
    console.error('[WhatsApp API]', error)
    return NextResponse.json({ error: 'Error al enviar WhatsApp' }, { status: 500 })
  }
}

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const result = await db.execute(sql`
    SELECT id, name, email, phone FROM users WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1
  `)

  const admin = result.rows[0]

  return NextResponse.json({
    configured: !!process.env.WHATSAPP_API_KEY && !!process.env.WHATSAPP_PHONE_NUMBER_ID,
    admin: admin ? { name: admin.name, email: admin.email, phone: admin.phone } : null,
  })
}
