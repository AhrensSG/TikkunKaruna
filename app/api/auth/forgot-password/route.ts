import { NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"
import { users, resetTokens } from "@/lib/db/schema"
import { sendEmail } from "@/emails"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 })
    }

    const [user] = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    const token = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await db.delete(resetTokens).where(eq(resetTokens.email, email))
    await db.insert(resetTokens).values({ email, token: hashedToken, expiresAt })

    if (user) {
      const resetUrl = `${process.env.NEXT_PUBLIC_API_URL}/reset-password?token=${token}`
      await sendEmail(
        email,
        "Recuperación de contraseña - TikkunKaruna",
        `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
            <h2 style="color:#4a1a5e;">Recupera tu contraseña</h2>
            <p>Hola <strong>${user.name}</strong>,</p>
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
