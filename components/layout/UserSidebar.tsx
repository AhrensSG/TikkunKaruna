'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sidebarLinks = [
  { href: '/dashboard', label: 'Panel', icon: '📊' },
  { href: '/dashboard/book', label: 'Reservar terapia', icon: '📅' },
  { href: '/dashboard/history', label: 'Historial', icon: '📋' },
  { href: '/dashboard/payments', label: 'Pagos', icon: '💳' },
  { href: '/dashboard/invoices', label: 'Facturas', icon: '🧾' },
  { href: '/dashboard/profile', label: 'Mi perfil', icon: '👤' },
]

export default function UserSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4 hidden lg:block">
      <nav className="space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
