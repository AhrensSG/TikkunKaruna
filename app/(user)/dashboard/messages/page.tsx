"use client"

import { useEffect, useState, useCallback } from "react"
import { Loader2, MessageSquare, CalendarDays, Heart, ChevronDown } from "lucide-react"
import { formatDate, formatTime } from "@/lib/format"

interface Message {
  id: string
  admin_notes: string
  start_time: string
  end_time: string
  status: string
  therapy_name: string
  message_read_at: string | null
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchMessages = useCallback(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((data) => {
        setMessages(data.messages || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const handleToggle = async (id: string) => {
    const isOpening = expandedId !== id

    if (isOpening) {
      const msg = messages.find((m) => m.id === id)
      if (msg && !msg.message_read_at) {
        await fetch(`/api/messages/${id}/read`, { method: "POST" }).catch(() => {})
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, message_read_at: new Date().toISOString() } : m))
        )
      }
    }

    setExpandedId(isOpening ? id : null)
  }

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

      <div className="space-y-3">
        {messages.map((m) => {
          const isExpanded = expandedId === m.id
          const isUnread = !m.message_read_at

          return (
            <div
              key={m.id}
              className={`bg-white rounded-xl border overflow-hidden transition-all ${
                isUnread ? "border-purple-300 shadow-sm shadow-purple-100" : "border-gray-200"
              }`}
            >
              {/* Header */}
              <button
                onClick={() => handleToggle(m.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-purple-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isUnread ? "bg-purple-200" : "bg-gray-100"
                    }`}
                  >
                    <MessageSquare
                      size={18}
                      className={isUnread ? "text-purple-700" : "text-gray-400"}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900 truncate">{m.therapy_name}</p>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <CalendarDays size={11} />
                      {formatDate(m.start_time)} · {formatTime(m.start_time)}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform shrink-0 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Message body */}
              {isExpanded && (
                <div className="px-4 pb-4">
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
