"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sparkles, Clock, Euro, ArrowRight, Check, Loader2 } from "lucide-react"
import Calendar from "@/components/Calendar"

interface Therapy {
  id: string
  name: string
  description: string
  duration_minutes: number
  price_cents: number
  image_url: string
}



export default function BookPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [therapies, setTherapies] = useState<Therapy[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth() + 1)

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedTherapy, setSelectedTherapy] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get("canceled") === "true") {
      setStep(1)
      setSelectedTherapy(null)
      setSelectedDate(null)
      setSelectedTime(null)
    }
  }, [searchParams])

  useEffect(() => {
    fetch("/api/therapies")
      .then((res) => res.json())
      .then((data) => {
        setTherapies(data.therapies || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedDate || !selectedTherapy) return
    const therapy = therapies.find((t) => t.id === selectedTherapy)
    if (!therapy) return

    setSlotsLoading(true)
    setSelectedTime(null)

    fetch(`/api/availability?date=${selectedDate}&therapyId=${selectedTherapy}`)
      .then((res) => res.json())
      .then((data) => {
        setAvailableSlots(data.slots || [])
        setSlotsLoading(false)
      })
      .catch(() => setSlotsLoading(false))
  }, [selectedDate, selectedTherapy, therapies])

  const therapy = therapies.find((t) => t.id === selectedTherapy)

  const handleNext = () => {
    if (step === 1 && selectedTherapy) setStep(2)
    else if (step === 2 && selectedDate && selectedTime) setStep(3)
  }

  const handleConfirm = async () => {
    if (!therapy || !selectedDate || !selectedTime) return
    setSubmitting(true)

    try {
      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          therapyId: therapy.id,
          date: selectedDate,
          time: selectedTime,
        }),
      })

      const data = await res.json()

      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || "Error al procesar el pago")
        setSubmitting(false)
      }
    } catch {
      alert("Error de conexión")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Cargando terapias...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reservar Terapia</h1>
        <p className="text-gray-500 text-sm mt-1">Elige tu terapia, fecha y horario.</p>
      </div>

      {searchParams.get("canceled") === "true" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          El pago fue cancelado. Puedes intentarlo de nuevo.
        </div>
      )}

      {searchParams.get("success") === "true" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
          ¡Pago confirmado! Tu sesión está reservada.
        </div>
      )}

      {/* Steps indicator */}
      <div className="flex items-center gap-2 text-sm">
        {["Terapia", "Fecha y hora", "Pago"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === i + 1
                  ? "bg-purple-600 text-white"
                  : step > i + 1
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {step > i + 1 ? <Check size={13} /> : i + 1}
            </div>
            <span className={step === i + 1 ? "text-gray-900 font-medium" : "text-gray-400"}>{label}</span>
            {i < 2 && <ArrowRight size={14} className="text-gray-300 mx-1" />}
          </div>
        ))}
      </div>

      {/* Step 1: Select therapy */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {therapies.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTherapy(t.id)}
              className={`text-left bg-white rounded-xl border p-5 transition-all ${
                selectedTherapy === t.id
                  ? "border-purple-500 ring-2 ring-purple-200"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <h3 className="font-semibold text-gray-900">{t.name}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                <span className="flex items-center gap-1"><Clock size={12} />{t.duration_minutes} min</span>
                <span className="flex items-center gap-1"><Euro size={12} />{t.price_cents / 100} €</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Date & time */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Selecciona un día</h3>
            <Calendar
              year={calYear}
              month={calMonth}
              selectedDate={selectedDate}
              onSelect={(date) => setSelectedDate(date)}
              onPrevMonth={() => {
                if (calMonth === 1) { setCalYear(calYear - 1); setCalMonth(12) }
                else setCalMonth(calMonth - 1)
              }}
              onNextMonth={() => {
                if (calMonth === 12) { setCalYear(calYear + 1); setCalMonth(1) }
                else setCalMonth(calMonth + 1)
              }}
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Horario</h3>
            <div className="grid grid-cols-3 gap-2">
              {!selectedDate && (
                <p className="text-gray-400 text-sm col-span-3 text-center py-6">Selecciona una fecha primero</p>
              )}
              {slotsLoading && (
                <p className="text-gray-400 text-sm col-span-3 text-center py-6">Cargando horarios...</p>
              )}
              {selectedDate && !slotsLoading && availableSlots.length === 0 && (
                <p className="text-gray-400 text-sm col-span-3 text-center py-6">No hay horarios disponibles para esta fecha</p>
              )}
              {selectedDate && !slotsLoading && availableSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`text-sm py-2 rounded-lg transition-colors ${
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
      )}

      {/* Step 3: Confirm & Pay */}
      {step === 3 && therapy && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
              <Sparkles size={24} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">{therapy.name}</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">Fecha</span>
              <span className="font-medium text-gray-900">
                {selectedDate ? new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : ""}
              </span>
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
              <span className="font-bold text-lg text-purple-700">{therapy.price_cents / 100} €</span>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(2)}
              disabled={submitting}
              className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Atrás
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting ? "Procesando..." : "Pagar con tarjeta"}
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            Pago seguro a través de Stripe
          </p>
        </div>
      )}

      {/* Navigation buttons for steps 1 & 2 */}
      {(step === 1 || step === 2) && (
        <div className="flex justify-between">
          <button
            onClick={() => step === 2 ? setStep(1) : null}
            className={`text-sm text-gray-500 hover:text-gray-700 ${step === 1 ? "invisible" : ""}`}
          >
            ← Atrás
          </button>
          <button
            onClick={handleNext}
            disabled={step === 1 ? !selectedTherapy : !selectedDate || !selectedTime}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Continuar <ArrowRight size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
