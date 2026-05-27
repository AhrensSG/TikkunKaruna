"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { CalendarDays, Clock, CreditCard, History, Award } from "lucide-react"

const stats = [
  { label: "Próxima sesión", value: "Vie 13 jun · 17:00", icon: CalendarDays, color: "text-purple-600 bg-purple-100" },
  { label: "Terapias realizadas", value: "12", icon: Award, color: "text-gold-600 bg-gold-100" },
  { label: "Próximo pago", value: "50 €", icon: CreditCard, color: "text-green-600 bg-green-100" },
  { label: "Miembro desde", value: "Ene 2026", icon: History, color: "text-blue-600 bg-blue-100" },
]

const nextSession = {
  therapy: "Reiki",
  date: "Viernes 13 de junio de 2026",
  time: "17:00 - 18:00",
  therapist: "Inma",
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin')
    }
  }, [user, router])

  if (user?.role === 'admin') return null

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Usuario</h1>
        <p className="text-gray-500 text-sm mt-1">Bienvenido de nuevo. Gestiona tus terapias desde aquí.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Next session + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next session card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <CalendarDays size={16} className="text-purple-600" />
            Próxima sesión
          </h2>
          <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-lg">
              {nextSession.therapy.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{nextSession.therapy}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                <Clock size={13} />
                {nextSession.date} · {nextSession.time}
              </p>
              <p className="text-xs text-gray-500">Con {nextSession.therapist}</p>
            </div>
            <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full shrink-0">
              Confirmada
            </span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
          <div className="space-y-2">
            <a
              href="/dashboard/book"
              className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Reservar terapia
            </a>
            <a
              href="/dashboard/history"
              className="block w-full text-center border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Ver historial
            </a>
            <a
              href="/dashboard/profile"
              className="block w-full text-center border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              Editar perfil
            </a>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Actividad reciente</h2>
        <div className="space-y-3">
          {[
            { action: "Sesión de Reiki completada", date: "10 jun 2026" },
            { action: "Pago de 50 € confirmado", date: "10 jun 2026" },
            { action: "Factura #2026-0012 generada", date: "10 jun 2026" },
            { action: "Reserva de Sanación Emocional confirmada", date: "8 jun 2026" },
          ].map(({ action, date }) => (
            <div key={action} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <p className="text-sm text-gray-700">{action}</p>
              <span className="text-xs text-gray-400 shrink-0">{date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
