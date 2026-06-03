"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  Sparkles, Clock, Euro, ArrowRight, Check, Loader2,
  ArrowLeft, ShieldCheck,
} from "lucide-react"

interface Therapy {
  id: string
  name: string
  description: string
  duration_minutes: number
  price_cents: number
  image_url: string
}

const timeSlots = [
  "10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00",
]

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

export default function ReservarPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session, status } = useSession()
  const router = useRouter()

  const [therapy, setTherapy] = useState<Therapy | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<2 | 3>(2)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/therapies")
      .then((res) => res.json())
      .then((data) => {
        const t = (data.therapies || []).find((t: Therapy) => t.id === id)
        setTherapy(t || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const handlePay = async () => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/reservar/${id}`)
      return
    }

    if (!therapy || !selectedDate || !selectedTime) return
    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          therapyId: therapy.id,
          date: `2026-06-${selectedDate.padStart(2, "0")}`,
          time: selectedTime,
        }),
      })

      const data = await res.json()

      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Error al procesar el pago")
        setSubmitting(false)
      }
    } catch {
      setError("Error de conexión")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <div className="text-purple-600 text-sm">Cargando...</div>
      </div>
    )
  }

  if (!therapy) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white gap-4">
        <p className="text-gray-500">Terapia no encontrada</p>
        <Link href="/terapias" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
          ← Ver todas las terapias
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Back */}
        <Link
          href="/terapias"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver a terapias
        </Link>

        {/* Steps */}
        <div className="flex items-center gap-2 text-sm mb-10">
          {["Seleccionar terapia", "Fecha y hora", "Pago"].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i === 0
                    ? "bg-green-500 text-white"
                    : step === i + 1
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < 1 ? <Check size={14} /> : i + 1}
              </div>
              <span className={step === i + 1 ? "text-gray-900 font-medium text-sm" : "text-gray-400 text-sm"}>
                {label}
              </span>
              {i < 2 && <ArrowRight size={14} className="text-gray-300 mx-1" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left: Therapy detail */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden sticky top-24">
              {therapy.image_url && (
                <div className="w-full h-48 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={therapy.image_url} alt={therapy.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <h1 className="font-heading text-2xl text-purple-950 mb-2">{therapy.name}</h1>
                <p className="text-purple-600 text-sm leading-relaxed mb-5">{therapy.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-purple-500">
                    <Clock size={15} />
                    {therapy.duration_minutes >= 60
                      ? `${Math.floor(therapy.duration_minutes / 60)}h ${therapy.duration_minutes % 60 || ""}`
                      : `${therapy.duration_minutes} min`}
                  </div>
                  <span className="text-purple-200">|</span>
                  <span className="font-heading text-xl text-gold-600 font-medium">
                    {therapy.price_cents / 100} €
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking flow */}
          <div className="lg:col-span-3">
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Elige fecha y hora</h2>
                  <p className="text-sm text-gray-500">Selecciona el día y horario para tu sesión.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Día</h3>
                    <div className="grid grid-cols-6 gap-2">
                      {days.map((day) => (
                        <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
                          {day}
                        </div>
                      ))}
                      {Array.from({ length: 30 }).map((_, i) => {
                        const date = i + 1
                        const isSelected = selectedDate === String(date)
                        return (
                          <button
                            key={i}
                            onClick={() => setSelectedDate(String(date))}
                            className={`text-center text-sm py-2 rounded-lg transition-colors ${
                              isSelected
                                ? "bg-purple-600 text-white"
                                : "hover:bg-purple-50 text-gray-700"
                            }`}
                          >
                            {date}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Horario</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`text-sm py-2.5 rounded-lg transition-colors ${
                            selectedTime === time
                              ? "bg-purple-600 text-white"
                              : "hover:bg-purple-50 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedDate || !selectedTime}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                  >
                    Continuar <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={26} className="text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Confirmar reserva</h2>
                </div>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Terapia</span>
                    <span className="font-medium text-gray-900">{therapy.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Fecha</span>
                    <span className="font-medium text-gray-900">Junio {selectedDate}, 2026</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Horario</span>
                    <span className="font-medium text-gray-900">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Duración</span>
                    <span className="font-medium text-gray-900">{therapy.duration_minutes} min</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Total</span>
                    <span className="font-bold text-xl text-purple-700">{therapy.price_cents / 100} €</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
                    {error}
                  </div>
                )}

                <button
                  onClick={handlePay}
                  disabled={submitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {status === "unauthenticated"
                    ? "Iniciar sesión para pagar"
                    : submitting
                      ? "Procesando..."
                      : "Pagar con tarjeta"}
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
                  <ShieldCheck size={13} />
                  Pago seguro con Stripe
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ← Atrás
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
