"use client"

import { Download, Eye } from "lucide-react"

const invoices = [
  { id: "INV-2026-0012", therapy: "Reiki", date: "10 jun 2026", amount: "50 €", status: "Emitida" },
  { id: "INV-2026-0011", therapy: "Sanación Emocional", date: "3 jun 2026", amount: "65 €", status: "Emitida" },
  { id: "INV-2026-0010", therapy: "Meditación Guiada", date: "25 may 2026", amount: "40 €", status: "Emitida" },
  { id: "INV-2026-0009", therapy: "Terapia Energética", date: "8 may 2026", amount: "55 €", status: "Emitida" },
]

export default function InvoicesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Facturas</h1>
        <p className="text-gray-500 text-sm mt-1">Descarga tus facturas en PDF.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-500 mt-1">Facturas emitidas</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">210 €</p>
          <p className="text-xs text-gray-500 mt-1">Total facturado</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">Al día</p>
          <p className="text-xs text-gray-500 mt-1">Estado fiscal</p>
        </div>
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Importe</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-900 font-medium">{inv.id}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.therapy}</td>
                  <td className="px-4 py-3 text-gray-600">{inv.date}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{inv.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Ver">
                        <Eye size={15} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Descargar">
                        <Download size={15} />
                      </button>
                    </div>
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
