"use client"

const payments = [
  { id: "ch_1", therapy: "Reiki", date: "10 jun 2026", amount: "50 €", method: "Visa ···· 4242", status: "Pagado" },
  { id: "ch_2", therapy: "Sanación Emocional", date: "3 jun 2026", amount: "65 €", method: "Visa ···· 4242", status: "Pagado" },
  { id: "ch_3", therapy: "Meditación Guiada", date: "25 may 2026", amount: "40 €", method: "Visa ···· 4242", status: "Pagado" },
  { id: "ch_4", therapy: "Terapia Energética", date: "8 may 2026", amount: "55 €", method: "Mastercard ···· 1234", status: "Pagado" },
]

export default function PaymentsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historial de Pagos</h1>
        <p className="text-gray-500 text-sm mt-1">Todos tus pagos realizados a través de la plataforma.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-500 mt-1">Pagos realizados</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-700">210 €</p>
          <p className="text-xs text-gray-500 mt-1">Total pagado</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">0 €</p>
          <p className="text-xs text-gray-500 mt-1">Pendiente</p>
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
                <th className="text-left px-4 py-3 font-medium text-gray-600">Método</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Importe</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.therapy}</td>
                  <td className="px-4 py-3 text-gray-600">{p.date}</td>
                  <td className="px-4 py-3 text-gray-600">{p.method}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{p.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        Todos los pagos se procesan de forma segura a través de{" "}
        <strong>Stripe</strong>. Los reembolsos se gestionan desde el panel de administración.
      </div>
    </div>
  )
}
