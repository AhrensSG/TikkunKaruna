import { NextResponse } from "next/server"
import crypto from "crypto"
import pool from "@/lib/db"
import { sendEmail } from "@/emails"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 })
    }

    const user = await pool.query("SELECT id, name FROM users WHERE email = $1", [email])

    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await pool.query("DELETE FROM reset_tokens WHERE email = $1", [email])
    await pool.query(
      "INSERT INTO reset_tokens (email, token, expires_at) VALUES ($1, $2, $3)",
      [email, token, expiresAt]
    )

    if (user.rows.length > 0) {
      const resetUrl = `${process.env.NEXT_PUBLIC_API_URL}/reset-password?token=${token}`
      await sendEmail(
        email,
        "Recuperación de contraseña - TikkunKaruna",
        `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
            <h2 style="color:#4a1a5e;">Recupera tu contraseña</h2>
            <p>Hola <strong>${user.rows[0].name}</strong>,</p>
            <p>Recibimos una solicitud para restablecer tu contraseña.</p>
            <a href="${resetUrl}"
               style="display:inline-block;background:#6b21a8;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">
              Restablecer contraseña
            </a>
            <p style="color:#666;font-size:13px;">Este enlace expira en 1 hora. Si no solicitaste esto, ignora este mensaje.</p>
          </div>
        `
      )
    }

    return NextResponse.json({ message: "Si el email existe, recibirás un enlace de recuperación." })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}
