import sgMail from '@sendgrid/mail'
import pool from "@/lib/db"
import { escapeHtml } from "@/lib/escape"
import { welcomeHtml as _welcomeHtml, adminNewUserStyledHtml, adminNewBookingStyledHtml } from './templates'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

export async function sendEmail(to: string, subject: string, html: string) {
  if (process.env.SENDGRID_API_KEY) {
    try {
      await sgMail.send({
        from: 'hola@tikkunkaruna.com',
        to,
        subject,
        html,
      })
    } catch (err) {
      console.error('[SendGrid]', err)
    }
  } else {
    console.log(`[Email] Sending to ${to}: ${subject}`)
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  await sendEmail(email, `✨ Bienvenida a TikkunKaruna, ${name}`, _welcomeHtml(name))
}

export async function notifyAdmin(subject: string, html: string) {
  try {
    const { rows } = await pool.query(
      `SELECT email FROM users WHERE role = 'admin'`
    )
    for (const row of rows) {
      await sendEmail(row.email, subject, html)
    }
  } catch (err) {
    console.error("[notifyAdmin]", err)
  }
}

export function adminNewUserHtml(name: string, email: string): string {
  return adminNewUserStyledHtml(name, email)
}

export function adminNewBookingHtml(userName: string, userEmail: string, therapyName: string, dateStr: string): string {
  return adminNewBookingStyledHtml(userName, userEmail, therapyName, dateStr)
}

export function sessionCompletedHtml(userName: string, therapyName: string, notes: string): string {
  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#4a1a5e,#7b2d8e);padding:24px;text-align:center;border-radius:12px 12px 0 0;">
        <h1 style="color:#fff;margin:0;font-size:20px;">TikkunKaruna</h1>
        <p style="color:rgba(255,255,255,.75);margin:4px 0 0 0;font-size:13px;">Terapias Holísticas</p>
      </div>
      <div style="padding:32px;background:#fff;border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px;">
        <h2 style="color:#4a1a5e;margin:0 0 8px 0;font-size:20px;">✨ Sesión completada</h2>
        <p style="color:#555;margin:0 0 4px 0;font-size:14px;">Hola <strong>${escapeHtml(userName)}</strong>,</p>
        <p style="color:#555;margin:0 0 16px 0;font-size:14px;">Tu sesión de <strong>${escapeHtml(therapyName)}</strong> ha sido completada.</p>
        <div style="background:#f9f9f9;border-left:4px solid #7b2d8e;padding:16px;margin:16px 0;border-radius:4px;">
          <p style="margin:0 0 6px 0;color:#4a1a5e;font-weight:600;font-size:13px;">💜 Mensaje de Inma:</p>
          <p style="margin:0;color:#444;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(notes)}</p>
        </div>
        <p style="color:#666;font-size:14px;margin:16px 0 0 0;">Gracias por confiar en TikkunKaruna. ¡Te esperamos en tu próxima sesión! 🙏</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#999;font-size:12px;text-align:center;">TikkunKaruna — Terapias Holísticas</p>
      </div>
    </div>`
}
