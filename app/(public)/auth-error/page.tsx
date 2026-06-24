import type { Metadata } from "next"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, LogIn } from "lucide-react"

export const metadata: Metadata = {
  title: "Error de autenticación | TikkunKaruna",
}

export default function AuthErrorPage() {
  return (
    <section className="bg-purple-950 min-h-screen flex items-center justify-center relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
      </div>
      <div className="relative z-10 max-w-md mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-red-400" />
        </div>
        <h1 className="font-heading text-3xl text-white mb-3">
          Error de autenticación
        </h1>
        <p className="text-purple-300 font-body mb-2">
          Ha ocurrido un problema al iniciar sesión.
        </p>
        <p className="text-purple-400 text-sm font-body mb-8">
          Puede que el enlace haya expirado, que las credenciales no sean
          correctas o que haya un problema temporal con el proveedor de acceso.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-purple-950 font-semibold px-6 py-3 rounded-full transition-all"
          >
            <LogIn size={16} />
            Volver a acceder
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-purple-600 hover:border-gold-500 text-purple-200 hover:text-gold-400 font-body px-6 py-3 rounded-full transition-all"
          >
            <ArrowLeft size={16} />
            Ir al inicio
          </Link>
        </div>
      </div>
    </section>
  )
}
