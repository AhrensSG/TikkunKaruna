'use client'

import { Loader2 } from 'lucide-react'
import Calendar from '@/components/Calendar'

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
  user_name: string
  therapy_name: string
  is_pack: boolean
  sessions: BookingSession[]
}

interface Props {
  booking: Booking
  selectedSession: string | null
  rescheduleDate: string
  selectedSlot: string
  availableSlots: string[]
  availableDates: string[]
  loadingSlots: boolean
  saving: boolean
  rescheduleMonth: number
  rescheduleYear: number
  onSessionSelect: (sessionId: string | null) => void
  onDateSelect: (date: string) => void
  onSlotSelect: (slot: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onReschedule: () => void
  onClose: () => void
}

export default function RescheduleModal({
  booking, selectedSession, rescheduleDate, selectedSlot,
  availableSlots, availableDates, loadingSlots, saving,
  rescheduleMonth, rescheduleYear,
  onSessionSelect, onDateSelect, onSlotSelect,
  onPrevMonth, onNextMonth, onReschedule, onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {booking.is_pack && selectedSession
            ? `Reprogramar sesión ${booking.sessions?.find((s) => s.id === selectedSession)?.session_number || ''}`
            : 'Reprogramar sesión'}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {booking.user_name} — {booking.therapy_name}
        </p>

        {booking.is_pack && !selectedSession ? (
          <div className="mb-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Selecciona qué sesión reprogramar:</p>
            {booking.sessions?.filter((s) => s.status === 'confirmed').map((s) => (
              <button
                key={s.id}
                onClick={() => onSessionSelect(s.id)}
                className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-sm transition-colors"
              >
                <span className="font-medium">Sesión {s.session_number}</span>
                <span className="text-gray-500 ml-2">
                  {new Date(s.start_time).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecciona una fecha disponible
              </label>
              <div className="border border-gray-200 rounded-xl p-3">
                <Calendar
                  year={rescheduleYear}
                  month={rescheduleMonth}
                  selectedDate={rescheduleDate}
                  onSelect={(date) => { onDateSelect(date); onSlotSelect('') }}
                  onPrevMonth={onPrevMonth}
                  onNextMonth={onNextMonth}
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
                        onClick={() => onSlotSelect(slot)}
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
          </>
        )}

        <div className="flex items-center justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            Cancelar
          </button>
          <button
            onClick={onReschedule}
            disabled={!selectedSlot || saving}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Guardando...' : 'Confirmar reprogramación'}
          </button>
        </div>
      </div>
    </div>
  )
}
