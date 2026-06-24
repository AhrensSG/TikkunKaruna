import pool from '@/lib/db'

const API_VERSION = 'v22.0'
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const API_KEY = process.env.WHATSAPP_API_KEY

function isConfigured(): boolean {
  return !!PHONE_NUMBER_ID && !!API_KEY
}

function formatPhone(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '').replace(/^00/, '')
}

export async function sendWhatsApp(to: string, body: string) {
  if (!isConfigured()) {
    console.log(`[WhatsApp] Would send to ${to}: ${body.slice(0, 60)}...`)
    return
  }

  const phone = formatPhone(to)
  if (!phone) return

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phone,
          type: 'text',
          text: { body },
        }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('[WhatsApp API error]', err)
    }
  } catch (err) {
    console.error('[WhatsApp]', err)
  }
}

export async function notifyAdminWhatsApp(body: string) {
  try {
    const { rows } = await pool.query(
      `SELECT phone FROM users WHERE role = 'admin' AND phone IS NOT NULL ORDER BY created_at ASC LIMIT 1`
    )
    if (rows.length === 0) return
    await sendWhatsApp(rows[0].phone, body)
  } catch (err) {
    console.error('[notifyAdminWhatsApp]', err)
  }
}

export async function sendUserWhatsApp(userId: string, body: string) {
  try {
    const { rows } = await pool.query(
      `SELECT phone FROM users WHERE id = $1 AND phone IS NOT NULL`,
      [userId]
    )
    if (rows.length === 0) return
    await sendWhatsApp(rows[0].phone, body)
  } catch (err) {
    console.error('[sendUserWhatsApp]', err)
  }
}
