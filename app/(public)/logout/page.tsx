"use client"

import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, CheckCircle } from "lucide-react"

export default function LogoutPage() {
  const [status, setStatus] = useState<"signing-out" | "done">("signing-out")

  useEffect(() => {
    signOut({ redirect: false }).then(() => setStatus("done"))
  }, [])

  return (
    <section className="bg-purple-950 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
      </div>
      <div className="relative z-10 max-w-md mx-auto px-4 text-center">
        {status === "signing-out" ? (
          <>
            <Loader2 size={40} className="mx-auto text-gold-400 animate-spin mb-6" />
            <h1 className="font-heading text-3xl text-white mb-3">Cerrando sesión...</h1>
            <p className="text-purple-300 font-body">Espera un momento, por favor.</p>
          </>
        ) : (
          <>
            <CheckCircle size={48} className="mx-auto text-green-400 mb-6" />
            <h1 className="font-heading text-3xl text-white mb-3">Sesión cerrada</h1>
            <p className="text-purple-300 font-body mb-8">
              Has cerrado sesión correctamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-purple-950 font-semibold px-6 py-3 rounded-full transition-all"
              >
                Volver a acceder
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-purple-600 hover:border-gold-500 text-purple-200 hover:text-gold-400 font-body px-6 py-3 rounded-full transition-all"
              >
                Ir al inicio
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
