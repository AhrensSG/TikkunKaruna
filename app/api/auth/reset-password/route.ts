import { NextResponse } from "next/server"
import pool from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token y contraseña son requeridos" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    const result = await pool.query(
      "SELECT email, expires_at FROM reset_tokens WHERE token = $1",
      [token]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Token inválido o ya fue usado" }, { status: 400 })
    }

    const { email, expires_at } = result.rows[0]

    if (new Date(expires_at) < new Date()) {
      await pool.query("DELETE FROM reset_tokens WHERE token = $1", [token])
      return NextResponse.json({ error: "El token ha expirado. Solicita un nuevo enlace." }, { status: 400 })
    }

    const hashed = await hashPassword(password)

    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashed, email])
    await pool.query("DELETE FROM reset_tokens WHERE token = $1", [token])

    return NextResponse.json({ message: "Contraseña actualizada correctamente" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Error al restablecer la contraseña" }, { status: 500 })
  }
}
