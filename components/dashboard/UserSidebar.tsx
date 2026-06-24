'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  CalendarPlus,
  ClipboardList,
  FileText,
  UserCircle,
  MessageSquareText,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const sidebarLinks = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/dashboard/book', label: 'Reservar terapia', icon: CalendarPlus },
  { href: '/dashboard/messages', label: 'Mensajes', icon: MessageSquareText },
  { href: '/dashboard/history', label: 'Historial', icon: ClipboardList },
  { href: '/dashboard/invoices', label: 'Facturas', icon: FileText },
  { href: '/dashboard/profile', label: 'Mi perfil', icon: UserCircle },
]

export default function UserSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetch('/api/messages')
      .then((r) => r.json())
      .then((data) => setUnreadCount(data.unread || 0))
      .catch(() => {})
  }, [pathname])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 flex flex-col hidden lg:flex">
        {/* User info */}
        <div className="p-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            {user?.image ? (
              <Image src={user.image} alt="" width={36} height={36} className="rounded-full object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "Usuario"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-purple-100 text-purple-800 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-purple-700' : 'text-gray-400'} />
                <span className="flex-1">{label}</span>
                {href === '/dashboard/messages' && unreadCount > 0 && (
                  <span className="bg-purple-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-tight">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex lg:hidden">
        {sidebarLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] transition-colors relative ${
                isActive
                  ? 'text-purple-700 font-semibold'
                  : 'text-gray-500'
              }`}
            >
              <Icon size={18} />
              {label}
              {href === '/dashboard/messages' && unreadCount > 0 && (
                <span className="absolute top-0.5 right-1/4 bg-purple-600 text-white text-[8px] font-bold px-1 rounded-full min-w-[14px] text-center leading-tight translate-x-3">
                  {unreadCount}
                </span>
              )}
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Salir
        </button>
      </nav>
    </>
  )
}
