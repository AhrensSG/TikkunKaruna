'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function DashboardNavbar() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-6 shrink-0">
      <Link href="/" className="text-lg font-bold text-purple-700 tracking-tight hover:text-purple-800 transition-colors">
        Tikkun<span className="text-gold-600">Karuna</span>
      </Link>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {user && (
          <>
            <span className="hidden sm:block text-xs text-gray-400 mr-1">
              {user.name}
            </span>
            <span className="w-7 h-7 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-xs sm:hidden">
              {user.name.charAt(0)}
            </span>
          </>
        )}
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 hover:text-purple-600 transition-colors"
          title="Volver al sitio"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Volver al sitio</span>
        </Link>
        <span className="text-gray-200 select-none hidden sm:inline">|</span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 hover:text-red-600 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </nav>
  )
}
