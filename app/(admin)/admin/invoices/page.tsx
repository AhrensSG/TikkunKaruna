'use client'

import { useEffect, useState } from 'react'
import { FileText, Download, Search, X, Loader2, Euro, TrendingUp, Receipt, CreditCard } from 'lucide-react'

interface Stats {
  totalRevenueCents: number
  refundedCents: number
  netRevenueCents: number
  totalPayments: number
  monthRevenueCents: number
  monthCount: number
  totalInvoices: number
  monthly: { month: string; count: number; revenue_cents: number }[]
}

interface Payment {
  id: string
  amount_cents: number
  currency: string
  status: string
  created_at: string
  stripe_payment_id: string
  user_name: string
  user_email: string
  therapy_name: string
  invoice_number: string | null
  invoice_id: string | null
}

function formatEuro(cents: number) {
  return (cents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' €'
}

function formatMonth(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '')
}

export default function AdminInvoicesPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {}),
      fetch('/api/admin/payments').then(r => r.json()).then(d => setPayments(d.payments || [])).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const filtered = search.trim()
    ? payments.filter(p =>
        p.user_name.toLowerCase().includes(search.toLowerCase()) ||
        p.therapy_name.toLowerCase().includes(search.toLowerCase()) ||
        (p.invoice_number || '').toLowerCase().includes(search.toLowerCase())
      )
    : payments

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Facturación</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen de ingresos y pagos</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-green-600 bg-green-100">
            <Euro size={20} />
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Ingresos totales</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{stats ? formatEuro(stats.netRevenueCents) : '—'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-purple-600 bg-purple-100">
            <TrendingUp size={20} />
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Este mes</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{stats ? formatEuro(stats.monthRevenueCents) : '—'}</p>
          {stats && <p className="text-xs text-gray-400 mt-0.5">{stats.monthCount} sesiones</p>}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-blue-600 bg-blue-100">
            <Receipt size={20} />
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Facturas emitidas</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{stats?.totalInvoices || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-gold-600 bg-gold-100">
            <CreditCard size={20} />
          </div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Sesiones pagadas</p>
          <p className="text-xl font-bold text-gray-900 mt-1">{stats?.totalPayments || 0}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, terapia o nº factura..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Payments table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Cliente</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Terapia</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Importe</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Fecha</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Factura</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">PDF</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{p.user_name}</span>
                    <span className="text-gray-500 text-xs block">{p.user_email}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.therapy_name}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{p.amount_cents / 100} €</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(p.created_at)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">
                    {p.invoice_number || '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {p.invoice_id ? (
                      <a
                        href={`/api/admin/invoices/${p.invoice_id}/pdf`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 text-xs font-medium"
                      >
                        <Download size={13} />
                        PDF
                      </a>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <CreditCard size={36} className="mx-auto text-gray-300 mb-2" />
                    {search ? 'Ningún pago coincide' : 'No hay pagos'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly revenue table */}
      {stats && stats.monthly && stats.monthly.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-purple-600" />
            Ingresos por mes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-3 py-2 font-medium text-gray-600">Mes</th>
                  <th className="text-right px-3 py-2 font-medium text-gray-600">Sesiones</th>
                  <th className="text-right px-3 py-2 font-medium text-gray-600">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {stats.monthly.map((m) => (
                  <tr key={m.month} className="border-b border-gray-50">
                    <td className="px-3 py-2.5 text-gray-900 font-medium capitalize">{formatMonth(m.month)}</td>
                    <td className="px-3 py-2.5 text-right text-gray-600">{m.count}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-gray-900">{formatEuro(m.revenue_cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
