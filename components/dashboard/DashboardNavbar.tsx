'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LogOut, Menu, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

interface Props {
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}

export default function DashboardNavbar({ onToggleSidebar, sidebarOpen }: Props) {
  const router = useRouter()
  const { logout } = useAuth()

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
        <Link
          href="/"
          className="hidden lg:flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 hover:text-purple-600 transition-colors"
          title="Volver al sitio"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Volver al sitio</span>
        </Link>
        <span className="text-gray-200 select-none hidden lg:inline">|</span>
        <button
          onClick={handleLogout}
          className="hidden lg:flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 hover:text-red-600 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>

        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-gray-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            title="Menú"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
      </div>
    </nav>
  )
}
