'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, CalendarDays, CreditCard, Sparkles } from 'lucide-react'

const statsCards = [
  { href: '/admin/users', label: 'Usuarios', icon: Users, color: 'text-purple-600 bg-purple-100' },
  { href: '/admin/therapies', label: 'Terapias', icon: Sparkles, color: 'text-gold-600 bg-gold-100' },
  { href: '/admin/schedule', label: 'Horarios', icon: CalendarDays, color: 'text-blue-600 bg-blue-100' },
  { href: '/admin/invoices', label: 'Facturación', icon: CreditCard, color: 'text-green-600 bg-green-100' },
]

export default function AdminPage() {
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    fetch('/api/admin/users')
      .then((r) => r.json())
      .then((d) => setUserCount((d.users || []).length))
      .catch(() => {})
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Panel de Administración</h1>
      <p className="text-gray-500 text-sm mb-8">Bienvenido al panel de gestión de TikkunKaruna</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map(({ href, label, icon: Icon, color }) => (
          <Link key={href} href={href}>
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon size={20} />
              </div>
              <p className="text-sm font-semibold text-gray-900">{label}</p>
              {href === '/admin/users' && (
                <p className="text-xs text-gray-500 mt-0.5">{userCount} registrados</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
