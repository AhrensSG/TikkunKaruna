'use client'

import { useEffect, useState, useMemo, Fragment } from 'react'
import { CalendarDays, Search, X, Loader2, MessageSquare, Calendar as CalendarIcon, Package, ChevronDown, ChevronRight } from 'lucide-react'
import CompleteSessionModal from '@/components/admin/CompleteSessionModal'
import RescheduleModal from '@/components/admin/RescheduleModal'
import ViewNotesModal from '@/components/admin/ViewNotesModal'
import { bookingStatusColors } from '@/lib/constants'

interface BookingSession {
  id: string
  session_number: number
  start_time: string
  end_time: string
  status: string
  admin_notes: string | null
}

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
  is_pack: boolean
  session_count: number | null
  sessions: BookingSession[]
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

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
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const rescheduleAfter = useMemo(() => {
    if (!rescheduling?.is_pack || !selectedSession) return null
    const sessions = rescheduling.sessions || []
    const idx = sessions.findIndex((s) => s.id === selectedSession)
    if (idx <= 0) return null
    return new Date(sessions[idx - 1].start_time).toISOString()
  }, [rescheduling, selectedSession])

  useEffect(() => {
    if (!rescheduling) return
    const params = new URLSearchParams({ year: String(rescheduleYear), month: String(rescheduleMonth), therapyId: rescheduling.therapy_id })
    if (rescheduleAfter) params.set('after', rescheduleAfter)
    fetch(`/api/availability/month?${params}`)
      .then((r) => r.json())
      .then((data) => setAvailableDates(data.dates || []))
      .catch(() => setAvailableDates([]))
  }, [rescheduleYear, rescheduleMonth, rescheduling, rescheduleAfter])

  useEffect(() => {
    if (!rescheduling || !rescheduleDate) return
    const load = async () => {
      setSelectedSlot('')
      setLoadingSlots(true)
      try {
        const params = new URLSearchParams({ date: rescheduleDate, therapyId: rescheduling.therapy_id })
        if (rescheduleAfter) params.set('after', rescheduleAfter)
        const r = await fetch(`/api/availability?${params}`)
        const data = await r.json()
        setAvailableSlots(data.slots || [])
      } catch {
        setAvailableSlots([])
      } finally {
        setLoadingSlots(false)
      }
    }
    load()
  }, [rescheduleDate, rescheduling, rescheduleAfter])

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
    if (filterType === 'pack') {
      result = result.filter((b) => b.is_pack)
    } else if (filterType === 'single') {
      result = result.filter((b) => !b.is_pack)
    }
    return result
  }, [bookings, search, filterStatus, filterType])

  const handleComplete = async () => {
    if (!completing) return
    setSaving(true)
    try {
      if (completing.is_pack && selectedSession) {
        const res = await fetch(`/api/admin/booking-sessions/${selectedSession}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes }),
        })
        if (res.ok) {
          const data = await res.json()
          setBookings((prev) =>
            prev.map((b) => {
              if (b.id !== completing.id) return b
              const updatedSessions = (b.sessions || []).map((s) =>
                s.id === selectedSession ? { ...s, status: 'completed', admin_notes: data.session.admin_notes } : s
              )
              const allCompleted = updatedSessions.every((s) => s.status === 'completed')
              return { ...b, sessions: updatedSessions, status: allCompleted ? 'completed' : b.status }
            })
          )
          setCompleting(null)
          setNotes('')
          setSelectedSession(null)
        } else {
          alert('Error al completar la sesión')
        }
      } else {
        const res = await fetch(`/api/admin/bookings/${completing.id}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes }),
        })
        if (res.ok) {
          const data = await res.json()
          setBookings((prev) =>
            prev.map((b) => (b.id === completing.id ? { ...b, status: 'completed', admin_notes: data.booking.admin_notes, sessions: (b.sessions || []).map((s) => ({ ...s, status: 'completed' })) } : b))
          )
          setCompleting(null)
          setNotes('')
          setSelectedSession(null)
        } else {
          alert('Error al completar la sesión')
        }
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
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">{filtered.length} reservas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-0">
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
          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="confirmed">Confirmadas</option>
              <option value="completed">Completadas</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
            >
              <option value="all">Todas</option>
              <option value="single">Terapias</option>
              <option value="pack">Packs</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
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
              {filtered.map((b) => {
                const isExpanded = expandedRows.has(b.id)
                const hasSessions = b.is_pack && b.sessions && b.sessions.length > 0
                return (
                  <Fragment key={b.id}>
                    <tr
                      onClick={() => {
                        if (b.is_pack) {
                          setExpandedRows((prev) => {
                            const next = new Set(prev)
                            if (next.has(b.id)) next.delete(b.id)
                            else next.add(b.id)
                            return next
                          })
                        } else if (b.status === 'confirmed') {
                          setCompleting(b); setNotes(''); setSelectedSession(null)
                        } else if (b.status === 'completed' && b.admin_notes) {
                          setViewNotes({ name: b.user_name, notes: b.admin_notes })
                        }
                      }}
                      className={`border-b border-gray-100 ${
                        b.is_pack || b.status === 'confirmed' || (b.status === 'completed' && b.admin_notes)
                          ? 'cursor-pointer hover:bg-gray-50'
                          : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">{b.user_name}</span>
                        <span className="text-gray-500 text-xs block">{b.user_email}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-600">{b.therapy_name}</span>
                        {b.is_pack && (
                          <span className="inline-flex items-center gap-1 ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 align-middle">
                            <Package size={10} />
                            Pack
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {hasSessions ? (
                          <span>
                            {b.sessions.length} sesiones
                            {isExpanded ? <ChevronDown size={12} className="inline ml-1 text-gray-400" /> : <ChevronRight size={12} className="inline ml-1 text-gray-400" />}
                          </span>
                        ) : (
                          new Date(b.start_time).toLocaleDateString('es-ES', {
                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                          })
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{b.price_cents / 100} €</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${bookingStatusColors[b.status] || 'bg-gray-100 text-gray-600'}`}>
                          {b.status === 'pending' ? 'Pendiente' : b.status === 'confirmed' ? 'Confirmada' : b.status === 'cancelled' ? 'Cancelada' : b.status === 'completed' ? 'Completada' : b.status}
                        </span>
                        {b.admin_notes && (
                          <MessageSquare size={12} className="ml-1.5 text-purple-500 inline align-middle" />
                        )}
                        {hasSessions && (
                          <span className="text-[10px] text-gray-400 ml-1">
                            {b.sessions.filter((s) => s.status === 'completed').length}/{b.sessions.length}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {b.status === 'confirmed' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setRescheduling(b); setRescheduleDate(''); setAvailableSlots([]); setSelectedSlot(''); setSelectedSession(null); setRescheduleMonth(new Date().getMonth() + 1); setRescheduleYear(new Date().getFullYear()) }}
                            className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
                          >
                            <CalendarIcon size={13} />
                            Reprogramar
                          </button>
                        )}
                      </td>
                    </tr>
                    {isExpanded && hasSessions && (
                      <>
                        {b.sessions.map((s) => (
                          <tr key={s.id} className={`border-b border-gray-100 bg-gray-50 ${s.status === 'confirmed' ? 'cursor-pointer hover:bg-purple-50' : ''}`}
                            onClick={() => {
                              if (s.status === 'confirmed') {
                                setCompleting(b); setNotes(''); setSelectedSession(s.id)
                              } else if (s.status === 'completed' && s.admin_notes) {
                                setViewNotes({ name: b.user_name, notes: s.admin_notes })
                              }
                            }}
                          >
                            <td className="px-4 py-2 pl-10">
                              <span className="text-xs text-gray-500">Sesión {s.session_number}</span>
                            </td>
                            <td className="px-4 py-2 text-xs text-gray-500"></td>
                            <td className="px-4 py-2 text-xs text-gray-600">
                              {new Date(s.start_time).toLocaleDateString('es-ES', {
                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                              })}
                            </td>
                            <td className="px-4 py-2"></td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${bookingStatusColors[s.status] || 'bg-gray-100 text-gray-600'}`}>
                                {s.status === 'confirmed' ? 'Confirmada' : s.status === 'completed' ? 'Completada' : s.status}
                              </span>
                              {s.admin_notes && <MessageSquare size={10} className="ml-1 text-purple-500 inline" />}
                            </td>
                            <td className="px-4 py-2">
                              {s.status === 'confirmed' && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); setRescheduling(b); setSelectedSession(s.id); setRescheduleDate(''); setAvailableSlots([]); setSelectedSlot(''); setRescheduleMonth(new Date().getMonth() + 1); setRescheduleYear(new Date().getFullYear()) }}
                                  className="flex items-center gap-1 text-[10px] font-medium text-purple-600 hover:text-purple-800 transition-colors"
                                >
                                  <CalendarIcon size={11} />
                                  Reprogramar
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </Fragment>
                )
              })}
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

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-100">
          {filtered.map((b) => {
            const isExpanded = expandedRows.has(b.id)
            const hasSessions = b.is_pack && b.sessions && b.sessions.length > 0
            return (
              <div key={b.id}>
                <div
                  onClick={() => {
                    if (b.is_pack) {
                      setExpandedRows((prev) => {
                        const next = new Set(prev)
                        if (next.has(b.id)) next.delete(b.id)
                        else next.add(b.id)
                        return next
                      })
                    } else if (b.status === 'confirmed') {
                      setCompleting(b); setNotes(''); setSelectedSession(null)
                    } else if (b.status === 'completed' && b.admin_notes) {
                      setViewNotes({ name: b.user_name, notes: b.admin_notes })
                    }
                  }}
                  className={`p-3 space-y-2 ${
                    b.is_pack || b.status === 'confirmed' || (b.status === 'completed' && b.admin_notes)
                      ? 'cursor-pointer'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{b.user_name}</p>
                      <p className="text-xs text-gray-500 truncate">{b.user_email}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${bookingStatusColors[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status === 'pending' ? 'Pendiente' : b.status === 'confirmed' ? 'Confirmada' : b.status === 'cancelled' ? 'Cancelada' : b.status === 'completed' ? 'Completada' : b.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="truncate">{b.therapy_name}</span>
                    {b.is_pack && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-700 shrink-0">
                        <Package size={10} />
                        Pack
                      </span>
                    )}
                    <span className="font-semibold text-gray-900 ml-auto">{b.price_cents / 100} €</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    {hasSessions ? (
                      <span className="flex items-center gap-1">
                        {b.sessions.length} sesiones
                        <span className="text-[10px] text-gray-400">
                          ({b.sessions.filter((s) => s.status === 'completed').length}/{b.sessions.length})
                        </span>
                        {isExpanded ? <ChevronDown size={12} className="text-gray-400" /> : <ChevronRight size={12} className="text-gray-400" />}
                      </span>
                    ) : (
                      <span>
                        {new Date(b.start_time).toLocaleDateString('es-ES', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      {b.admin_notes && <MessageSquare size={12} className="text-purple-500" />}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setRescheduling(b); setRescheduleDate(''); setAvailableSlots([]); setSelectedSlot(''); setSelectedSession(null); setRescheduleMonth(new Date().getMonth() + 1); setRescheduleYear(new Date().getFullYear()) }}
                          className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors"
                        >
                          <CalendarIcon size={12} />
                          Reprogramar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                {isExpanded && hasSessions && (
                  <div className="bg-gray-50 border-t border-gray-100 px-3 py-2 space-y-1.5">
                    {b.sessions.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          if (s.status === 'confirmed') {
                            setCompleting(b); setNotes(''); setSelectedSession(s.id)
                          } else if (s.status === 'completed' && s.admin_notes) {
                            setViewNotes({ name: b.user_name, notes: s.admin_notes })
                          }
                        }}
                        className={`flex items-center justify-between py-1.5 px-2 rounded-lg text-xs ${
                          s.status === 'confirmed' ? 'cursor-pointer hover:bg-purple-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-gray-500 shrink-0">Sesión {s.session_number}</span>
                          <span className="text-gray-600 truncate">
                            {new Date(s.start_time).toLocaleDateString('es-ES', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${bookingStatusColors[s.status] || 'bg-gray-100 text-gray-600'}`}>
                            {s.status === 'confirmed' ? 'Confirmada' : s.status === 'completed' ? 'Completada' : s.status}
                          </span>
                          {s.admin_notes && <MessageSquare size={10} className="text-purple-500" />}
                          {s.status === 'confirmed' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setRescheduling(b); setSelectedSession(s.id); setRescheduleDate(''); setAvailableSlots([]); setSelectedSlot(''); setRescheduleMonth(new Date().getMonth() + 1); setRescheduleYear(new Date().getFullYear()) }}
                              className="text-purple-600 hover:text-purple-800 font-medium"
                            >
                              <CalendarIcon size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <CalendarDays size={36} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm">{search || filterStatus !== 'all' ? 'Ninguna reserva coincide' : 'No hay reservas'}</p>
            </div>
          )}
        </div>
      </div>

      {completing && (
        <CompleteSessionModal
          booking={completing}
          notes={notes}
          selectedSession={selectedSession}
          saving={saving}
          onNotesChange={setNotes}
          onSessionSelect={setSelectedSession}
          onComplete={handleComplete}
          onClose={() => { setCompleting(null); setSelectedSession(null) }}
        />
      )}

      {rescheduling && (
        <RescheduleModal
          booking={rescheduling}
          selectedSession={selectedSession}
          rescheduleDate={rescheduleDate}
          selectedSlot={selectedSlot}
          availableSlots={availableSlots}
          availableDates={availableDates}
          loadingSlots={loadingSlots}
          saving={savingReschedule}
          rescheduleMonth={rescheduleMonth}
          rescheduleYear={rescheduleYear}
          onSessionSelect={setSelectedSession}
          onDateSelect={(date) => { setRescheduleDate(date); setSelectedSlot('') }}
          onSlotSelect={setSelectedSlot}
          onPrevMonth={() => {
            if (rescheduleMonth === 1) { setRescheduleMonth(12); setRescheduleYear(rescheduleYear - 1) }
            else setRescheduleMonth(rescheduleMonth - 1)
          }}
          onNextMonth={() => {
            if (rescheduleMonth === 12) { setRescheduleMonth(1); setRescheduleYear(rescheduleYear + 1) }
            else setRescheduleMonth(rescheduleMonth + 1)
          }}
          onReschedule={async () => {
            if (!selectedSlot) return
            setSavingReschedule(true)
            try {
              const body: Record<string, string> = { start_time: new Date(`${rescheduleDate}T${selectedSlot}:00`).toISOString() }
              if (selectedSession) body.session_id = selectedSession
              const res = await fetch(`/api/admin/bookings/${rescheduling.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
              })
              if (res.ok) {
                const data = await res.json()
                setBookings((prev) =>
                  prev.map((b) => {
                    if (b.id !== rescheduling.id) return b
                    if (selectedSession) {
                      const updatedSessions = (b.sessions || []).map((s) =>
                        s.id === selectedSession ? { ...s, start_time: data.booking.start_time, end_time: data.booking.end_time } : s
                      )
                      return { ...b, sessions: updatedSessions }
                    }
                    return { ...b, start_time: data.booking.start_time, end_time: data.booking.end_time }
                  })
                )
                setRescheduling(null)
                setRescheduleDate('')
                setAvailableSlots([])
                setSelectedSlot('')
                setSelectedSession(null)
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
          onClose={() => { setRescheduling(null); setRescheduleDate(''); setAvailableSlots([]); setSelectedSlot(''); setSelectedSession(null); setRescheduleMonth(new Date().getMonth() + 1); setRescheduleYear(new Date().getFullYear()) }}
        />
      )}

      {viewNotes && (
        <ViewNotesModal
          name={viewNotes.name}
          notes={viewNotes.notes}
          onClose={() => setViewNotes(null)}
        />
      )}
    </div>
  )
}
