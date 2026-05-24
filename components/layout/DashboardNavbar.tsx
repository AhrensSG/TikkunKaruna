'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardNavbar() {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <nav className="bg-white border-b border-gray-200 h-16 flex items-center px-6">
      <Link
        href={isAdmin ? '/admin' : '/dashboard'}
        className="text-lg font-bold text-indigo-600"
      >
        TikkunKaruna
      </Link>

      <div className="ml-auto flex items-center gap-4">
        <Link
          href={isAdmin ? '/' : '/'}
          className="text-sm text-gray-600 hover:text-indigo-600"
        >
          Volver al sitio
        </Link>
        <button className="text-sm text-gray-600 hover:text-red-600">
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
