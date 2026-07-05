import { NextResponse } from "next/server"
import crypto from "crypto"
import { db } from "@/lib/db"
import { users, resetTokens } from "@/lib/db/schema"
import { hashPassword } from "@/lib/auth"
import { eq } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token y contraseña son requeridos" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const [rt] = await db
      .select({ email: resetTokens.email, expiresAt: resetTokens.expiresAt })
      .from(resetTokens)
      .where(eq(resetTokens.token, hashedToken))
      .limit(1)

    if (!rt) {
      return NextResponse.json({ error: "Token inválido o ya fue usado" }, { status: 400 })
    }

    if (new Date(rt.expiresAt) < new Date()) {
      await db.delete(resetTokens).where(eq(resetTokens.token, hashedToken))
      return NextResponse.json({ error: "El token ha expirado. Solicita un nuevo enlace." }, { status: 400 })
    }

    const hashed = await hashPassword(password)

    await db.update(users).set({ password: hashed }).where(eq(users.email, rt.email))
    await db.delete(resetTokens).where(eq(resetTokens.token, hashedToken))

    return NextResponse.json({ message: "Contraseña actualizada correctamente" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Error al restablecer la contraseña" }, { status: 500 })
  }
}
