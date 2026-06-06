"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

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
  const completed = bookings.filter((b) => b.status === "completed" || b.status === "confirmed")
  const pending = bookings.filter((b) => new Date(b.start_time) > now)
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
          <p className="text-2xl font-bold text-gray-900">{pending.length}</p>
          <p className="text-xs text-gray-500 mt-1">{pending.length === 1 ? "Pendiente" : "Pendientes"}</p>
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
                    <td className="px-4 py-3 font-medium text-gray-900">{b.therapy_name}</td>
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
    </div>
  )
}
