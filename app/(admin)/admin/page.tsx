'use client'

import { useEffect, useState, useMemo } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Loader2, Package } from 'lucide-react'

interface BookingSession {
  id: string
  session_number: number
  start_time: string
  end_time: string
  status: string
}

interface Booking {
  id: string
  start_time: string
  end_time: string
  status: string
  user_name: string
  user_email: string
  therapy_name: string
  price_cents: number
  is_pack: boolean
  sessions: BookingSession[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
}

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace('.', '')
}

const todayStr = () => {
  const d = new Date()
  return toDateStr(d.getFullYear(), d.getMonth() + 1, d.getDate())
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState(todayStr())

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(r => r.json())
      .then(d => { setBookings(d.bookings || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const daysWithBookings = useMemo(() => {
    const set = new Set<string>()
    for (const b of bookings) {
      if (b.status === 'confirmed') {
        const d = new Date(b.start_time)
        set.add(toDateStr(d.getFullYear(), d.getMonth() + 1, d.getDate()))
      }
      if (b.sessions) {
        for (const s of b.sessions) {
          if (s.status === 'confirmed') {
            const d = new Date(s.start_time)
            set.add(toDateStr(d.getFullYear(), d.getMonth() + 1, d.getDate()))
          }
        }
      }
    }
    return set
  }, [bookings])

  const dayBookings = useMemo(() => {
    if (!selectedDate) return []
    const result: { booking: Booking; session?: BookingSession }[] = []
    for (const b of bookings) {
      const d = new Date(b.start_time)
      if (toDateStr(d.getFullYear(), d.getMonth() + 1, d.getDate()) === selectedDate) {
        result.push({ booking: b })
      }
      if (b.sessions) {
        for (const s of b.sessions) {
          const sd = new Date(s.start_time)
          if (toDateStr(sd.getFullYear(), sd.getMonth() + 1, sd.getDate()) === selectedDate && s.status === 'confirmed') {
            result.push({ booking: b, session: s })
          }
        }
      }
    }
    return result.sort((a, b) => {
      const aTime = a.session ? new Date(a.session.start_time).getTime() : new Date(a.booking.start_time).getTime()
      const bTime = b.session ? new Date(b.session.start_time).getTime() : new Date(b.booking.start_time).getTime()
      return aTime - bTime
    })
  }, [bookings, selectedDate])

  const upcomingBookings = useMemo(() => {
    const now = new Date()
    return bookings
      .filter((b) => b.status === 'confirmed')
      .flatMap((b) => {
        if (b.sessions && b.sessions.length > 0) {
          return b.sessions
            .filter((s) => s.status === 'confirmed' && new Date(s.start_time) > now)
            .map((s) => ({ ...b, id: s.id, start_time: s.start_time, end_time: s.end_time, session: s }))
        }
        return new Date(b.start_time) > now ? [b] : []
      })
      .sort((a: any, b: any) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 10)
  }, [bookings])

  const days = useMemo(() => {
    const first = new Date(calYear, calMonth - 1, 1)
    const last = new Date(calYear, calMonth, 0)
    const startPad = first.getDay()
    const total = last.getDate()
    return { startPad, total, first, last }
  }, [calYear, calMonth])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Panel de Administración</h1>
      <p className="text-gray-500 text-sm mb-8">Bienvenido al panel de gestión de TikkunKaruna</p>

      {/* Calendar + Day bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Calendar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => {
                if (calMonth === 1) { setCalMonth(12); setCalYear(calYear - 1) }
                else setCalMonth(calMonth - 1)
              }}
              className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-500 hover:text-purple-700 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-semibold text-gray-900 capitalize">
              {new Date(calYear, calMonth - 1).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => {
                if (calMonth === 12) { setCalMonth(1); setCalYear(calYear + 1) }
                else setCalMonth(calMonth + 1)
              }}
              className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-500 hover:text-purple-700 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">{d}</div>
            ))}
            {Array.from({ length: days.startPad }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {Array.from({ length: days.total }).map((_, i) => {
              const day = i + 1
              const dateStr = toDateStr(calYear, calMonth, day)
              const hasBookings = daysWithBookings.has(dateStr)
              const isSelected = selectedDate === dateStr
              const isToday = dateStr === todayStr()

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`relative text-center text-sm py-2 rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-purple-600 text-white font-semibold'
                      : isToday
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'hover:bg-purple-50 text-gray-700'
                  }`}
                >
                  {day}
                  {hasBookings && (
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-purple-500'
                    }`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Bookings for selected date */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={16} className="text-purple-600" />
            <h2 className="text-sm font-semibold text-gray-900">
              {selectedDate === todayStr() ? 'Hoy' : new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h2>
            {dayBookings.length > 0 && (
              <span className="text-xs text-gray-400">· {dayBookings.length} sesión{dayBookings.length !== 1 ? 'es' : ''}</span>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-purple-600" /></div>
          ) : dayBookings.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No hay sesiones para esta fecha</p>
          ) : (
            <div className="space-y-2">
              {dayBookings.map(({ booking: b, session: s }) => (
                <div key={s ? s.id : b.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm shrink-0">
                    {b.user_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {b.user_name}
                      {s && <span className="text-xs text-purple-500 ml-1">S{s.session_number}</span>}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={11} />
                      {s ? `${formatTime(s.start_time)} — ${formatTime(s.end_time)}` : `${formatTime(b.start_time)} — ${formatTime(b.end_time)}`} · {b.therapy_name}
                      {b.is_pack && <Package size={10} className="text-purple-400 ml-0.5" />}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusColors[b.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabels[b.status] || b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Próximas terapias */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
          <CalendarDays size={16} className="text-purple-600" />
          Próximas sesiones
        </h2>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-purple-600" /></div>
        ) : upcomingBookings.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No hay próximas sesiones</p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {upcomingBookings.map((b: any) => (
              <div key={b.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm shrink-0">
                  {b.user_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{b.user_name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    {formatDateShort(b.start_time)} · {formatTime(b.start_time)} — {formatTime(b.end_time)}
                    {b.session && <span className="text-xs font-medium text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-full mx-1">Sesión {b.session.session_number}</span>}
                    {' · '}{b.therapy_name}
                    {b.is_pack && <Package size={10} className="text-purple-400 ml-0.5" />}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${statusColors[b.status] || 'bg-gray-100 text-gray-600'}`}>
                  {statusLabels[b.status] || b.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
