'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Loader2, Plus, Trash2, Save, CalendarDays, Clock, Ban, CheckCircle2, XCircle, Copy,
} from 'lucide-react'

interface WeeklyEntry {
  id?: string
  day_of_week: number
  start_time: string
  end_time: string
}

interface Exception {
  id: string
  exception_date: string
  start_time: string | null
  end_time: string | null
  is_available: boolean
  reason: string
}

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const ACTIVE_DAYS = [1, 2, 3, 4, 5, 6]

function timeToStr(t: string) {
  if (!t) return ''
  return t.length <= 5 ? t : t.slice(0, 5)
}

export default function SchedulePage() {
  const [weekly, setWeekly] = useState<WeeklyEntry[]>([])
  const [exceptions, setExceptions] = useState<Exception[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [newExceptionDate, setNewExceptionDate] = useState('')
  const [newExceptionReason, setNewExceptionReason] = useState('')
  const [newExceptionAllDay, setNewExceptionAllDay] = useState(true)

  const fetchSchedule = useCallback(() => {
    setLoading(true)
    fetch('/api/admin/schedule')
      .then((r) => r.json())
      .then((data) => {
        setWeekly(data.weekly || [])
        setExceptions(data.exceptions || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchSchedule() }, [fetchSchedule])

  const getSlotsForDay = (day: number) => {
    return weekly.filter((e) => e.day_of_week === day)
  }

  const addSlot = (day: number) => {
    setWeekly([...weekly, { day_of_week: day, start_time: '09:00', end_time: '10:00' }])
  }

  const removeSlot = (index: number) => {
    setWeekly(weekly.filter((_, i) => i !== index))
  }

  const updateSlot = (index: number, field: 'start_time' | 'end_time', value: string) => {
    const updated = [...weekly]
    updated[index] = { ...updated[index], [field]: value }
    setWeekly(updated)
  }

  const isValidRange = (s: WeeklyEntry) => {
    if (!s.start_time || !s.end_time) return false
    const [sh, sm] = s.start_time.split(':').map(Number)
    const [eh, em] = s.end_time.split(':').map(Number)
    return (eh * 60 + em) - (sh * 60 + sm) >= 30
  }

  const copyDayToAll = (day: number) => {
    const daySlots = weekly.filter((e) => e.day_of_week === day)
    if (daySlots.length === 0) return
    const others = weekly.filter((e) => e.day_of_week !== day)
    const newSlots: WeeklyEntry[] = []
    for (const d of ACTIVE_DAYS) {
      if (d === day) continue
      for (const s of daySlots) {
        newSlots.push({ day_of_week: d, start_time: s.start_time, end_time: s.end_time })
      }
    }
    setWeekly([...others, ...newSlots])
  }

  const handleSave = async () => {
    const invalid = weekly.filter((s) => !isValidRange(s))
    if (invalid.length > 0) {
      alert('Hay rangos con hora inicio igual o posterior a la de fin. Corregilos antes de guardar.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/schedule', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekly }),
      })
      if (res.ok) {
        const data = await res.json()
        setWeekly(data.weekly || [])
      } else {
        alert('Error al guardar')
      }
    } catch {
      alert('Error de conexión')
    }
    setSaving(false)
  }

  const handleAddException = async () => {
    if (!newExceptionDate) return
    try {
      const res = await fetch('/api/admin/schedule/exceptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exception_date: newExceptionDate,
          is_available: false,
          reason: newExceptionReason,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setExceptions([data.exception, ...exceptions])
        setNewExceptionDate('')
        setNewExceptionReason('')
        setNewExceptionAllDay(true)
      } else {
        alert('Error al crear excepción')
      }
    } catch {
      alert('Error de conexión')
    }
  }

  const handleDeleteException = async (id: string) => {
    if (!confirm('¿Eliminar esta excepción?')) return
    try {
      const res = await fetch(`/api/admin/schedule/exceptions/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setExceptions(exceptions.filter((e) => e.id !== id))
      }
    } catch {
      alert('Error al eliminar')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurar Horarios</h1>
        <p className="text-gray-500 text-sm mt-1">Define los horarios disponibles para cada día de la semana.</p>
      </div>

      {/* Weekly schedule */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Horario semanal</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white text-sm font-medium rounded-lg hover:bg-purple-800 disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>

        <div className="space-y-3">
          {ACTIVE_DAYS.map((day) => {
            const slots = getSlotsForDay(day)
            const hasValid = slots.some((s) => isValidRange(s))
            return (
              <div key={day} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 py-3 border-b border-gray-100 last:border-0">
                <div className="sm:w-28 shrink-0 sm:pt-1 flex items-center gap-1.5">
                  {hasValid ? (
                    <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                  ) : (
                    <XCircle size={14} className="text-gray-300 shrink-0" />
                  )}
                  <span className="text-sm font-semibold text-gray-900">{DAYS[day]}</span>
                </div>
                <div className="flex-1 space-y-2">
                  {slots.length === 0 && (
                    <p className="text-sm text-gray-400 italic">Sin horario</p>
                  )}
                  {slots.map((slot, idx) => {
                    const globalIdx = weekly.indexOf(slot)
                    const valid = isValidRange(slot)
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="time"
                          value={timeToStr(slot.start_time)}
                          onChange={(e) => updateSlot(globalIdx, 'start_time', e.target.value)}
                          className={`px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${valid ? 'border-gray-300' : 'border-red-300 bg-red-50'}`}
                        />
                        <span className="text-gray-400 text-sm">—</span>
                        <input
                          type="time"
                          value={timeToStr(slot.end_time)}
                          onChange={(e) => updateSlot(globalIdx, 'end_time', e.target.value)}
                          className={`px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${valid ? 'border-gray-300' : 'border-red-300 bg-red-50'}`}
                        />
                        <button
                          onClick={() => removeSlot(globalIdx)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )
                  })}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => addSlot(day)}
                      className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <Plus size={12} />
                      Añadir
                    </button>
                    {slots.length > 0 && (
                      <button
                        onClick={() => copyDayToAll(day)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-700 font-medium"
                      >
                        <Copy size={12} />
                        Copiar a todos los días
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Exceptions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Ban size={18} className="text-red-500" />
          <h2 className="text-lg font-semibold text-gray-900">Excepciones (días bloqueados)</h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-6">
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
            <input
              type="date"
              value={newExceptionDate}
              onChange={(e) => setNewExceptionDate(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-medium text-gray-600 mb-1">Motivo</label>
            <input
              type="text"
              value={newExceptionReason}
              onChange={(e) => setNewExceptionReason(e.target.value)}
              placeholder="Ej: Festivo nacional"
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>
          <button
            onClick={handleAddException}
            disabled={!newExceptionDate}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <Plus size={14} />
            Bloquear día
          </button>
        </div>

        {exceptions.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No hay excepciones registradas.</p>
        ) : (
          <div className="space-y-2">
            {exceptions.map((exc) => (
              <div key={exc.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 gap-1 sm:gap-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <CalendarDays size={14} className="text-red-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(exc.exception_date + 'T12:00:00').toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                  {exc.reason && (
                    <span className="text-sm text-gray-500">— {exc.reason}</span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteException(exc.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
