"use client"

import { useEffect, useState } from "react"
import { Loader2, MessageSquare, CalendarDays, Clock, Heart } from "lucide-react"

interface Message {
  id: string
  admin_notes: string
  start_time: string
  end_time: string
  status: string
  therapy_name: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        setMessages(data.messages || [])
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
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare size={22} className="text-purple-600" />
          Mensajes de Inma
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {messages.length > 0
            ? `Tienes ${messages.length} mensaje${messages.length !== 1 ? "s" : ""} de tus terapias`
            : "Aún no tienes mensajes. Cuando completes una terapia, Inma te dejará un mensaje aquí."}
        </p>
      </div>

      {messages.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Heart size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 text-sm">Tus mensajes aparecerán aquí después de cada sesión.</p>
        </div>
      )}

      <div className="space-y-4">
        {messages.map((m) => {
          const isExpanded = expandedId === m.id
          return (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-purple-200 transition-colors"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : m.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-purple-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <MessageSquare size={18} className="text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{m.therapy_name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <CalendarDays size={11} />
                      {formatDate(m.start_time)} · {formatTime(m.start_time)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700`}>
                    {isExpanded ? "Ocultar" : "Leer"}
                  </span>
                </div>
              </button>

              {/* Message body */}
              {isExpanded && (
                <div className="px-5 pb-5">
                  <div className="border-t border-gray-100 pt-4">
                    <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-100">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {m.admin_notes}
                      </p>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-3 text-xs text-purple-400">
                      <Heart size={11} />
                      <span>Inma · TikkunKaruna</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
