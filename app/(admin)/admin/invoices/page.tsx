'use client'

import { useEffect, useState } from 'react'
import { FileText, Loader2, Search, X } from 'lucide-react'

interface Invoice {
  id: string
  invoice_number: string
  amount_cents: number
  created_at: string
  user_name: string
  user_email: string
  therapy_name: string
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/invoices')
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data.invoices || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = search.trim()
    ? invoices.filter(
        (inv) =>
          inv.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
          inv.user_name.toLowerCase().includes(search.toLowerCase()) ||
          inv.therapy_name.toLowerCase().includes(search.toLowerCase())
      )
    : invoices

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
          <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} facturas</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por número, cliente o terapia..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Factura</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Cliente</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Terapia</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Importe</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <span className="inline-flex items-center gap-1.5">
                      <FileText size={14} className="text-purple-500" />
                      {inv.invoice_number}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{inv.user_name}</span>
                    <span className="text-gray-500 text-xs block">{inv.user_email}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{inv.therapy_name}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{inv.amount_cents / 100} €</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(inv.created_at).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <FileText size={36} className="mx-auto text-gray-300 mb-2" />
                    {search ? 'Ninguna factura coincide con la búsqueda' : 'No hay facturas'}
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
