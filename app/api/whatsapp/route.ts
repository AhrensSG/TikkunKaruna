import { NextResponse } from 'next/server'
import { sendWhatsApp, notifyAdminWhatsApp } from '@/lib/whatsapp'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth-helpers'

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

  const { rows } = await pool.query(
    `SELECT id, name, email, phone FROM users WHERE role = 'admin' ORDER BY created_at ASC LIMIT 1`
  )

  return NextResponse.json({
    configured: !!process.env.WHATSAPP_API_KEY && !!process.env.WHATSAPP_PHONE_NUMBER_ID,
    admin: rows[0] ? { name: rows[0].name, email: rows[0].email, phone: rows[0].phone } : null,
  })
}
