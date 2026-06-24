"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react"
import LogoMark from "@/components/ui/LogoMark"

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirm) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Error al restablecer la contraseña")
      } else {
        setDone(true)
      }
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-600" />
          </div>
        </div>
        <h1 className="font-heading text-xl text-purple-950">Enlace inválido</h1>
        <p className="text-gray-500 text-sm">El enlace de recuperación no es válido o falta el token.</p>
        <Link
          href="/forgot-password"
          className="inline-block bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Solicitar nuevo enlace
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-green-600" />
          </div>
        </div>
        <h1 className="font-heading text-xl text-purple-950">Contraseña actualizada</h1>
        <p className="text-gray-500 text-sm">Tu contraseña se restableció correctamente.</p>
        <Link
          href="/login"
          className="inline-block bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 space-y-4">
      <div className="text-center">
        <h1 className="font-heading text-xl text-purple-950">Nueva contraseña</h1>
        <p className="text-gray-500 text-sm mt-1">Elige una contraseña nueva para tu cuenta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Nueva contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirmar contraseña</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repite la contraseña"
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white text-sm font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? "Restableciendo..." : "Restablecer contraseña"}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <LogoMark size="md" />
        </div>
        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 text-center">
            <p className="text-gray-500 text-sm">Cargando...</p>
          </div>
        }>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  )
}
