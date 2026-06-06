"use client"

import { useEffect, useState } from "react"
import { Download, Loader2 } from "lucide-react"

interface Invoice {
  id: string
  invoice_number: string
  amount_cents: number
  created_at: string
  therapy_name: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "")
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/invoices")
      .then((r) => r.json())
      .then((data) => {
        setInvoices(data.invoices || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

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
        <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
        <p className="text-gray-500 text-sm mt-1">Descarga tus facturas en PDF.</p>
      </div>



      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Factura</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Terapia</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Importe</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Descargar</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">
                    Aún no tienes facturas.
                  </td>
                </tr>
              )}
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-900 font-medium">{inv.invoice_number}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.therapy_name}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(inv.created_at)}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {(Number(inv.amount_cents) / 100).toFixed(2)} €
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={`/api/invoices/${inv.id}/pdf`}
                      className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700 text-xs font-medium transition-colors"
                    >
                      <Download size={14} />
                      PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
