import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { sendEmail } from '@/emails'

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Nombre, email y mensaje son obligatorios' }, { status: 400 })
    }

    await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4)`,
      [name, email, subject || '', message]
    )

    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="color:#4a1a5e;">Nuevo mensaje de contacto</h2>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;color:#333;">Nombre</td><td style="padding:8px 12px;">${name}</td></tr>
          <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;color:#333;">Email</td><td style="padding:8px 12px;">${email}</td></tr>
          ${subject ? `<tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;color:#333;">Asunto</td><td style="padding:8px 12px;">${subject}</td></tr>` : ''}
        </table>
        <div style="background:#f5f5f5;padding:16px;border-radius:8px;white-space:pre-wrap;">${message}</div>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#999;font-size:12px;">Enviado desde el formulario de contacto de TikkunKaruna</p>
      </div>
    `

    await sendEmail(
      'guillermoahrens@gmail.com',
      subject ? `📩 ${subject} — ${name}` : `📩 Nuevo mensaje de ${name}`,
      html
    )

    return NextResponse.json({ message: 'Mensaje enviado correctamente' })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'Error al enviar el mensaje' }, { status: 500 })
  }
}
