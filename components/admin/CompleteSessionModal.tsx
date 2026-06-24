'use client'

import { Loader2 } from 'lucide-react'

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
  user_name: string
  therapy_name: string
  is_pack: boolean
  sessions: BookingSession[]
}

interface Props {
  booking: Booking
  notes: string
  selectedSession: string | null
  saving: boolean
  onNotesChange: (notes: string) => void
  onSessionSelect: (sessionId: string | null) => void
  onComplete: () => void
  onClose: () => void
}

export default function CompleteSessionModal({
  booking, notes, selectedSession, saving,
  onNotesChange, onSessionSelect, onComplete, onClose,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          {booking.is_pack && selectedSession
            ? `Completar sesión ${booking.sessions?.find((s) => s.id === selectedSession)?.session_number || ''}`
            : 'Completar sesión'}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {booking.user_name} — {booking.therapy_name}
        </p>

        {booking.is_pack && !selectedSession ? (
          <div className="mb-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Selecciona qué sesión completar:</p>
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
            {booking.sessions?.filter((s) => s.status === 'confirmed').length === 0 && (
              <p className="text-sm text-gray-400">Todas las sesiones están completadas.</p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mensaje de Inma para {booking.user_name.split(' ')[0]}
            </label>
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Escribe aquí tu mensaje post-sesión..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">Opcional. Se mostrará al cliente en sus sesiones completadas.</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={() => { onSessionSelect(null); onClose() }}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onComplete}
            disabled={saving || (booking.is_pack && !selectedSession)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? 'Guardando...' : 'Marcar como completada'}
          </button>
        </div>
      </div>
    </div>
  )
}
