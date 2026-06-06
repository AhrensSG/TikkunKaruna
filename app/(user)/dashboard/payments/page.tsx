"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

interface Payment {
  id: string
  amount_cents: number
  currency: string
  status: string
  created_at: string
  stripe_payment_id: string
  therapy_name: string
}

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  succeeded: "Pagado",
  failed: "Fallido",
  refunded: "Reembolsado",
}

const statusColor: Record<string, string> = {
  Pagado: "text-green-700 bg-green-100",
  Pendiente: "text-yellow-700 bg-yellow-100",
  Fallido: "text-red-700 bg-red-100",
  Reembolsado: "text-blue-700 bg-blue-100",
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "")
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/payments/history")
      .then((r) => r.json())
      .then((data) => {
        setPayments(data.payments || [])
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
        <h1 className="text-2xl font-bold text-gray-900">Historial de Pagos</h1>
        <p className="text-gray-500 text-sm mt-1">Todos tus pagos realizados a través de la plataforma.</p>
      </div>



      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Terapia</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Importe</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-400 text-sm">
                    Aún no tienes pagos registrados.
                  </td>
                </tr>
              )}
              {payments.map((p) => {
                const label = statusLabels[p.status] || p.status
                return (
                  <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.therapy_name}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(p.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[label] || ""}`}>
                        {label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      {(Number(p.amount_cents) / 100).toFixed(2)} €
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
