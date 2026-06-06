'use client'

import { useEffect, useState, useMemo } from 'react'
import { CalendarDays, Search, X, Loader2 } from 'lucide-react'

interface Booking {
  id: string
  start_time: string
  end_time: string
  status: string
  created_at: string
  user_name: string
  user_email: string
  therapy_name: string
  price_cents: number
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

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

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
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
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
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <CalendarDays size={36} className="mx-auto text-gray-300 mb-2" />
                    {search || filterStatus !== 'all' ? 'Ninguna reserva coincide' : 'No hay reservas'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
