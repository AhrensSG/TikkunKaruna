'use client'

import { useEffect, useState, useMemo } from 'react'
import { CalendarDays, Search, X, Loader2, MessageSquare, Calendar as CalendarIcon } from 'lucide-react'
import Calendar from '@/components/Calendar'

interface Booking {
  id: string
  therapy_id: string
  start_time: string
  end_time: string
  status: string
  created_at: string
  user_name: string
  user_email: string
  therapy_name: string
  price_cents: number
  admin_notes: string | null
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const [completing, setCompleting] = useState<Booking | null>(null)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const [viewNotes, setViewNotes] = useState<{ name: string; notes: string } | null>(null)

  const [rescheduling, setRescheduling] = useState<Booking | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [savingReschedule, setSavingReschedule] = useState(false)
  const [rescheduleMonth, setRescheduleMonth] = useState(new Date().getMonth() + 1)
  const [rescheduleYear, setRescheduleYear] = useState(new Date().getFullYear())
  const [availableDates, setAvailableDates] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!rescheduling) return
    fetch(`/api/availability/month?year=${rescheduleYear}&month=${rescheduleMonth}&therapyId=${rescheduling.therapy_id}`)
      .then((r) => r.json())
      .then((data) => setAvailableDates(data.dates || []))
      .catch(() => setAvailableDates([]))
  }, [rescheduleYear, rescheduleMonth, rescheduling])

  useEffect(() => {
    if (!rescheduling || !rescheduleDate) {
      setAvailableSlots([])
      setSelectedSlot('')
      return
    }
    setLoadingSlots(true)
    setSelectedSlot('')
    fetch(`/api/availability?date=${rescheduleDate}&therapyId=${rescheduling.therapy_id}`)
      .then((r) => r.json())
      .then((data) => {
        setAvailableSlots(data.slots || [])
        setLoadingSlots(false)
      })
      .catch(() => {
        setAvailableSlots([])
        setLoadingSlots(false)
      })
  }, [rescheduleDate, rescheduling])

  const filtered = useMemo(() => {
    let result = bookings
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.user_name.toLowerCase().includes(q) ||
          b.therapy_name.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q)
      )
    }
    if (filterStatus !== 'all') {
      result = result.filter((b) => b.status === filterStatus)
    }
    return result
  }, [bookings, search, filterStatus])

  const handleComplete = async () => {
    if (!completing) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/bookings/${completing.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      if (res.ok) {
        const data = await res.json()
        setBookings((prev) =>
          prev.map((b) => (b.id === completing.id ? { ...b, status: 'completed', admin_notes: data.booking.admin_notes } : b))
        )
        setCompleting(null)
        setNotes('')
      } else {
        alert('Error al completar la sesión')
      }
    } catch {
      alert('Error de conexión')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} reservas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, terapia o ID..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmadas</option>
          <option value="cancelled">Canceladas</option>
          <option value="completed">Completadas</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Cliente</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Terapia</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Fecha</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Importe</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => {
                    if (b.status === 'confirmed') { setCompleting(b); setNotes('') }
                    else if (b.status === 'completed' && b.admin_notes) setViewNotes({ name: b.user_name, notes: b.admin_notes })
                  }}
                  className={`border-b border-gray-100 ${
                    b.status === 'confirmed' || (b.status === 'completed' && b.admin_notes)
                      ? 'cursor-pointer hover:bg-gray-50'
                      : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{b.user_name}</span>
                    <span className="text-gray-500 text-xs block">{b.user_email}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{b.therapy_name}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {new Date(b.start_time).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{b.price_cents / 100} €</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status === 'pending' ? 'Pendiente' : b.status === 'confirmed' ? 'Confirmada' : b.status === 'cancelled' ? 'Cancelada' : b.status === 'completed' ? 'Completada' : b.status}
                    </span>
                    {b.admin_notes && (
                      <MessageSquare size={12} className="ml-1.5 text-purple-500 inline align-middle" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {b.status === 'confirmed' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setRescheduling(b); setRescheduleDate(''); setAvailableSlots([]); setSelectedSlot(''); setRescheduleMonth(new Date().getMonth() + 1); setRescheduleYear(new Date().getFullYear()) }}
                        className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        <CalendarIcon size={13} />
                        Reprogramar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <CalendarDays size={36} className="mx-auto text-gray-300 mb-2" />
                    {search || filterStatus !== 'all' ? 'Ninguna reserva coincide' : 'No hay reservas'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Completar sesión */}
      {completing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Completar sesión</h2>
            <p className="text-sm text-gray-500 mb-4">
              {completing.user_name} — {completing.therapy_name}
            </p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mensaje de Inma para {completing.user_name.split(' ')[0]}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Escribe aquí tu mensaje post-sesión..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">Opcional. Se mostrará al cliente en sus sesiones completadas.</p>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setCompleting(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleComplete}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? 'Guardando...' : 'Marcar como completada'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reprogramar */}
      {rescheduling && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Reprogramar sesión</h2>
            <p className="text-sm text-gray-500 mb-4">
              {rescheduling.user_name} — {rescheduling.therapy_name}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona una fecha disponible
              </label>
              <div className="border border-gray-200 rounded-xl p-3">
                <Calendar
                  year={rescheduleYear}
                  month={rescheduleMonth}
                  selectedDate={rescheduleDate}
                  onSelect={(date) => { setRescheduleDate(date); setSelectedSlot('') }}
                  onPrevMonth={() => {
                    if (rescheduleMonth === 1) { setRescheduleMonth(12); setRescheduleYear(rescheduleYear - 1) }
                    else setRescheduleMonth(rescheduleMonth - 1)
                  }}
                  onNextMonth={() => {
                    if (rescheduleMonth === 12) { setRescheduleMonth(1); setRescheduleYear(rescheduleYear + 1) }
                    else setRescheduleMonth(rescheduleMonth + 1)
                  }}
                  availableDates={availableDates}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Días con disponibilidad
              </p>
            </div>

            {rescheduleDate && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Horarios disponibles — {new Date(rescheduleDate + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </label>
                {loadingSlots ? (
                  <div className="flex items-center gap-2 text-sm text-gray-500 py-3">
                    <Loader2 size={14} className="animate-spin" />
                    Cargando horarios...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-red-500 py-3">No hay horarios disponibles para esta fecha</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                          selectedSlot === slot
                            ? 'border-purple-600 bg-purple-50 text-purple-700 font-medium'
                            : 'border-gray-200 text-gray-700 hover:border-purple-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
              <button
                onClick={() => { setRescheduling(null); setRescheduleDate(''); setAvailableSlots([]); setSelectedSlot(''); setRescheduleMonth(new Date().getMonth() + 1); setRescheduleYear(new Date().getFullYear()) }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!selectedSlot) return
                  setSavingReschedule(true)
                  try {
                    const res = await fetch(`/api/admin/bookings/${rescheduling.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ start_time: `${rescheduleDate}T${selectedSlot}:00` }),
                    })
                    if (res.ok) {
                      const data = await res.json()
                      setBookings((prev) =>
                        prev.map((b) =>
                          b.id === rescheduling.id
                            ? { ...b, start_time: data.booking.start_time, end_time: data.booking.end_time }
                            : b
                        )
                      )
                      setRescheduling(null)
                      setRescheduleDate('')
                      setAvailableSlots([])
                      setSelectedSlot('')
                      setRescheduleMonth(new Date().getMonth() + 1)
                      setRescheduleYear(new Date().getFullYear())
                    } else {
                      alert('Error al reprogramar')
                    }
                  } catch {
                    alert('Error de conexión')
                  }
                  setSavingReschedule(false)
                }}
                disabled={!selectedSlot || savingReschedule}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {savingReschedule && <Loader2 size={14} className="animate-spin" />}
                {savingReschedule ? 'Guardando...' : 'Confirmar reprogramación'}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewNotes && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={18} className="text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Mensaje de Inma</h2>
            </div>
            <p className="text-xs text-gray-400 mb-3">Para {viewNotes.name}</p>
            <div className="bg-purple-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {viewNotes.notes}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setViewNotes(null)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
