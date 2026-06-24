"use client"

import { useEffect, useState, useMemo } from "react"
import { Download, Loader2, CreditCard, FileText } from "lucide-react"
import { paymentStatusLabels, paymentStatusColors } from "@/lib/constants"

interface Invoice {
  id: string
  invoice_number: string
  amount_cents: number
  created_at: string
  therapy_name: string
}

interface Payment {
  id: string
  amount_cents: number
  currency: string
  status: string
  created_at: string
  stripe_payment_id: string
  therapy_name: string
}

type UnifiedItem = {
  key: string
  type: "factura" | "pago"
  therapy_name: string
  date: string
  iso: string
  amount_cents: number
  invoice_id?: string
  invoice_number?: string
  payment_status?: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "")
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/invoices").then((r) => r.json()).then((d) => setInvoices(d.invoices || [])).catch(() => {}),
      fetch("/api/payments/history").then((r) => r.json()).then((d) => setPayments(d.payments || [])).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const unified = useMemo(() => {
    const items: UnifiedItem[] = []

    for (const inv of invoices) {
      items.push({
        key: `inv-${inv.id}`,
        type: "factura",
        therapy_name: inv.therapy_name,
        date: formatDate(inv.created_at),
        iso: inv.created_at,
        amount_cents: inv.amount_cents,
        invoice_id: inv.id,
        invoice_number: inv.invoice_number,
      })
    }

    const _invoiceIds = new Set(invoices.map((i) => i.therapy_name.toLowerCase().trim()))
    void _invoiceIds
    for (const p of payments) {
      if (p.status !== "succeeded") continue
      items.push({
        key: `pay-${p.id}`,
        type: "pago",
        therapy_name: p.therapy_name,
        date: formatDate(p.created_at),
        iso: p.created_at,
        amount_cents: p.amount_cents,
        payment_status: paymentStatusLabels[p.status] || p.status,
      })
    }

    items.sort((a, b) => new Date(b.iso).getTime() - new Date(a.iso).getTime())
    return items
  }, [invoices, payments])

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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Facturas</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">Historial de facturas y pagos.</p>
      </div>

      {/* Desktop table / Mobile cards */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Terapia</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Importe</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {unified.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-sm">
                    Aún no tienes facturas ni pagos.
                  </td>
                </tr>
              )}
              {unified.map((item) => (
                <tr key={item.key} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {item.type === "factura" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        <FileText size={11} />
                        Factura
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <CreditCard size={11} />
                        Pago
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.therapy_name}</td>
                  <td className="px-4 py-3 text-gray-600">{item.date}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    {(item.amount_cents / 100).toFixed(2)} €
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.type === "factura" ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-[10px] text-gray-400 font-mono">{item.invoice_number}</span>
                        <a
                          href={`/api/invoices/${item.invoice_id}/pdf`}
                          className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs font-medium transition-colors"
                        >
                          <Download size={13} />
                          PDF
                        </a>
                      </div>
                    ) : (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${paymentStatusColors[item.payment_status || ""] || ""}`}>
                        {item.payment_status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-gray-100">
          {unified.length === 0 ? (
            <div className="px-4 py-10 text-center text-gray-400 text-sm">Aún no tienes facturas ni pagos.</div>
          ) : (
            unified.map((item) => (
              <div key={item.key} className="p-3 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {item.type === "factura" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full">
                          <FileText size={10} />
                          Factura
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                          <CreditCard size={10} />
                          Pago
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{item.therapy_name}</p>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 shrink-0">
                    {(item.amount_cents / 100).toFixed(2)} €
                  </span>
                </div>
                <div className="flex items-center justify-end">
                  {item.type === "factura" ? (
                    <a
                      href={`/api/invoices/${item.invoice_id}/pdf`}
                      className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 text-xs font-medium"
                    >
                      <Download size={12} />
                      {item.invoice_number} — PDF
                    </a>
                  ) : (
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${paymentStatusColors[item.payment_status || ""] || ""}`}>
                      {item.payment_status}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
