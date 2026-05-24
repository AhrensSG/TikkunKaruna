'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sidebarLinks = [
  { href: '/admin', label: 'Panel', icon: '📊' },
  { href: '/admin/therapies', label: 'Terapias', icon: '🧘' },
  { href: '/admin/schedule', label: 'Horarios', icon: '⏰' },
  { href: '/admin/users', label: 'Usuarios', icon: '👥' },
  { href: '/admin/invoices', label: 'Facturación', icon: '🧾' },
  { href: '/admin/images', label: 'Imágenes', icon: '🖼️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-gray-300 min-h-screen p-4 hidden lg:block">
      <div className="text-xl font-bold text-white mb-8 px-3">Admin</div>
      <nav className="space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
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
