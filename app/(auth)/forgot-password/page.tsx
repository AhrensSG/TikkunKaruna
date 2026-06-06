"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import LogoMark from "@/components/ui/LogoMark"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al enviar la solicitud")
      } else {
        setSent(true)
      }
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <LogoMark size="md" />
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 space-y-4">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
            </div>
            <h1 className="font-heading text-xl text-purple-950">Revisa tu correo</h1>
            <p className="text-gray-500 text-sm">
              Si existe una cuenta con <strong>{email}</strong>, recibirás un enlace para restablecer tu contraseña.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-purple-700 hover:text-purple-800 font-medium mt-2"
            >
              <ArrowLeft size={14} /> Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LogoMark size="md" />
          </div>
          <h1 className="font-heading text-2xl text-purple-950">Recuperar contraseña</h1>
          <p className="text-gray-500 text-sm mt-1">
            Te enviaremos un enlace para restablecerla
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white text-sm font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          <Link href="/login" className="inline-flex items-center gap-1 text-purple-700 hover:text-purple-800 font-medium">
            <ArrowLeft size={14} /> Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
