"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { CalendarDays, Clock, Award, Loader2 } from "lucide-react"

interface Booking {
  id: string
  start_time: string
  end_time: string
  status: string
  therapy_name: string
  price_cents: number
  amount_cents: number
  payment_status: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
}

function formatDateFull(iso: string) {
  const d = new Date(iso)
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
  return `${days[d.getDay()]} ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin')
      return
    }

    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        setBookings(data.bookings || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [user, router])

  if (user?.role === 'admin') return null

  const now = new Date()

  const upcomingSessions = bookings
    .filter((b) => new Date(b.start_time) > now && b.status === "confirmed")
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  const nextSession = upcomingSessions[0] || null

  const completed = bookings.filter((b) => b.status === "completed")

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Panel de Usuario</h1>
        <p className="text-gray-500 text-sm mt-1">Bienvenido de nuevo. Gestiona tus terapias desde aquí.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-purple-600 bg-purple-100">
            <CalendarDays size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Próxima sesión</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
              {nextSession ? `${formatDate(nextSession.start_time)} · ${formatTime(nextSession.start_time)}` : "Sin reservas"}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-gold-600 bg-gold-100">
            <Award size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Terapias realizadas</p>
            <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{completed.length}</p>
          </div>
        </div>
      </div>

      {/* Next session + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next session card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <CalendarDays size={16} className="text-purple-600" />
            Próxima sesión
          </h2>
          {upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map((s) => (
                <div key={s.id} className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-lg shrink-0">
                    {s.therapy_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{s.therapy_name}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                      <Clock size={13} />
                      {formatDateFull(s.start_time)} · {formatTime(s.start_time)} — {formatTime(s.end_time)}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full shrink-0">
                    {s.status === "confirmed" ? "Confirmada" : "Pendiente"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <p className="text-sm text-gray-400">No tienes próximas sesiones.</p>
            </div>
          )}
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
          {bookings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Aún no tienes actividad.</p>
          ) : (
            bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <p className="text-sm text-gray-700">
                  {b.status === "completed" ? "Sesión completada" : b.status === "cancelled" ? "Sesión cancelada" : "Reserva"} de {b.therapy_name}
                </p>
                <span className="text-xs text-gray-400 shrink-0">{formatDate(b.start_time)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
