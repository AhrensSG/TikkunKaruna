"use client"

const sessions = [
  { therapy: "Reiki", date: "10 jun 2026", time: "17:00", status: "Completada", price: "50 €" },
  { therapy: "Sanación Emocional", date: "3 jun 2026", time: "16:00", status: "Completada", price: "65 €" },
  { therapy: "Meditación Guiada", date: "25 may 2026", time: "18:00", status: "Completada", price: "40 €" },
  { therapy: "Reiki", date: "15 may 2026", time: "17:00", status: "Cancelada", price: "0 €" },
  { therapy: "Terapia Energética", date: "8 may 2026", time: "11:00", status: "Completada", price: "55 €" },
]

const statusColor: Record<string, string> = {
  Completada: "text-green-700 bg-green-100",
  Cancelada: "text-red-700 bg-red-100",
  Confirmada: "text-blue-700 bg-blue-100",
}

export default function HistoryPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historial de Terapias</h1>
        <p className="text-gray-500 text-sm mt-1">Todas tus sesiones registradas.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">4</p>
          <p className="text-xs text-gray-500 mt-1">Sesiones completadas</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">1</p>
          <p className="text-xs text-gray-500 mt-1">Canceladas</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">210 €</p>
          <p className="text-xs text-gray-500 mt-1">Total invertido</p>
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
              {sessions.map((s) => (
                <tr key={`${s.therapy}-${s.date}-${s.time}`} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{s.therapy}</td>
                  <td className="px-4 py-3 text-gray-600">{s.date}</td>
                  <td className="px-4 py-3 text-gray-600">{s.time}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[s.status] || ""}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-900">{s.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
