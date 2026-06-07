"use client"

import { useEffect, useState } from "react"
import { Loader2, MessageSquare } from "lucide-react"

interface Booking {
  id: string
  start_time: string
  end_time: string
  status: string
  therapy_name: string
  price_cents: number
  amount_cents: number
  payment_status: string
  admin_notes: string | null
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
}

const statusColor: Record<string, string> = {
  Completada: "text-green-700 bg-green-100",
  Cancelada: "text-red-700 bg-red-100",
  Confirmada: "text-blue-700 bg-blue-100",
  Pendiente: "text-yellow-700 bg-yellow-100",
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "")
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
}

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [viewNotes, setViewNotes] = useState<{ therapy: string; notes: string } | null>(null)

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        setBookings(data.bookings || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const now = new Date()
  const completed = bookings.filter((b) => b.status === "completed")
  const upcoming = bookings.filter((b) => new Date(b.start_time) > now && b.status !== "cancelled")
  const cancelled = bookings.filter((b) => b.status === "cancelled")

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historial de Terapias</h1>
        <p className="text-gray-500 text-sm mt-1">Todas tus sesiones registradas.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{completed.length}</p>
          <p className="text-xs text-gray-500 mt-1">Sesiones {completed.length === 1 ? "completada" : "completadas"}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{upcoming.length}</p>
          <p className="text-xs text-gray-500 mt-1">{upcoming.length === 1 ? "Próxima" : "Próximas"}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{cancelled.length}</p>
          <p className="text-xs text-gray-500 mt-1">{cancelled.length === 1 ? "Cancelada" : "Canceladas"}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Terapia</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Hora</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Importe</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">
                    Aún no tienes reservas.
                  </td>
                </tr>
              )}
              {bookings.map((b) => {
                const label = statusLabels[b.status] || b.status
                return (
                  <tr key={b.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        <span>{b.therapy_name}</span>
                        {b.status === "completed" && b.admin_notes && (
                          <button
                            onClick={() => setViewNotes({ therapy: b.therapy_name, notes: b.admin_notes! })}
                            className="text-purple-500 hover:text-purple-700"
                            title="Ver mensaje de Inma"
                          >
                            <MessageSquare size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(b.start_time)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatTime(b.start_time)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[label] || ""}`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">
                      {b.payment_status === "succeeded" ? `${(Number(b.amount_cents) / 100).toFixed(0)} €` : "—"}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Mensaje de Inma */}
      {viewNotes && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={18} className="text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Mensaje de Inma</h2>
            </div>
            <p className="text-xs text-gray-400 mb-3">Para tu sesión de {viewNotes.therapy}</p>
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
