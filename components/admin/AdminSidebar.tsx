'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Sparkles,
  CalendarDays,
  Users,
  FileText,
  CalendarCheck,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const sidebarLinks = [
  { href: '/admin', label: 'Panel', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Reservas', icon: CalendarCheck },
  { href: '/admin/therapies', label: 'Terapias', icon: Sparkles },
  { href: '/admin/schedule', label: 'Horarios', icon: CalendarDays },
  { href: '/admin/users', label: 'Usuarios', icon: Users },
  { href: '/admin/invoices', label: 'Facturación', icon: FileText },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const content = (
    <div className="flex flex-col h-full">
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-purple-100 text-purple-800 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-purple-700' : 'text-gray-400'} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-200 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
        >
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-200 lg:hidden ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {content}
      </aside>

      {/* Desktop sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 flex-col hidden lg:flex">
        {content}
      </aside>
    </>
  )
}
