"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Sparkles, Clock, Euro, ArrowRight, Check, Loader2,
  ChevronLeft, CreditCard, ShieldCheck, CalendarDays,
  Info,
} from "lucide-react"
import Calendar from "@/components/Calendar"

interface Therapy {
  id: string
  name: string
  description: string
  duration_minutes: number
  price_cents: number
  image_url: string
  requirements: string[]
}

const STEPS = [
  { num: 1, label: "Terapia", desc: "Elige tu terapia" },
  { num: 2, label: "Fecha y hora", desc: "Selecciona el horario" },
  { num: 3, label: "Pago", desc: "Confirma y paga" },
]

function formatDuration(minutes: number) {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}min` : `${h}h`
  }
  return `${minutes}min`
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
  const [availableDates, setAvailableDates] = useState<string[]>([])

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
    if (!selectedTherapy) return
    fetch(`/api/availability/month?year=${calYear}&month=${calMonth}&therapyId=${selectedTherapy}`)
      .then((r) => r.json())
      .then((data) => setAvailableDates(data.dates || []))
      .catch(() => setAvailableDates([]))
  }, [calYear, calMonth, selectedTherapy])

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

  const therapyPrice = useMemo(() => {
    if (!therapy) return ""
    return `${(therapy.price_cents / 100).toFixed(0)} €`
  }, [therapy])

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
        <div className="text-center">
          <Loader2 size={24} className="animate-spin text-purple-600 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">Cargando terapias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reservar Terapia</h1>
        <p className="text-gray-500 text-sm mt-1">Completa los pasos para reservar tu sesión.</p>
      </div>

      {searchParams.get("canceled") === "true" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-center gap-2">
          <Info size={16} className="shrink-0" />
          El pago fue cancelado. Puedes intentarlo de nuevo.
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step === s.num
                      ? "bg-purple-600 text-white ring-4 ring-purple-100"
                      : step > s.num
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > s.num ? <Check size={16} /> : s.num}
                </div>
                <span className={`text-xs mt-1.5 font-medium hidden sm:block ${step === s.num ? "text-purple-700" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 mt-[-1.25rem] sm:mt-[-1.75rem] rounded-full ${
                  step > s.num ? "bg-green-400" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-gray-400 mt-2 sm:hidden">
          Paso {step} de 3: {STEPS[step - 1].desc}
        </p>
      </div>

      {/* Step 1: Therapies */}
      {step === 1 && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {therapies.map((t) => {
              const isSelected = selectedTherapy === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTherapy(t.id)}
                  className={`text-left bg-white rounded-xl border-2 p-5 transition-all ${
                    isSelected
                      ? "border-purple-600 shadow-md shadow-purple-100"
                      : "border-gray-100 hover:border-purple-200 hover:shadow-sm"
                  }`}
                >
                  {t.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.image_url} alt={t.name} className="w-full h-28 object-cover rounded-lg mb-3" />
                  ) : (
                    <div className="w-full h-28 bg-purple-50 rounded-lg mb-3 flex items-center justify-center">
                      <Sparkles size={28} className="text-purple-300" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">{t.name}</h3>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                        <Check size={11} className="text-white" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{t.description}</p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={11} /> {formatDuration(t.duration_minutes)}
                    </span>
                    <span className="text-purple-700 font-semibold text-sm">{t.price_cents / 100} €</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && therapy && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarDays size={15} className="text-purple-600" />
              Selecciona un día disponible
            </h3>
            <Calendar
              year={calYear}
              month={calMonth}
              selectedDate={selectedDate}
              onSelect={(date) => { setSelectedDate(date); setSelectedTime(null) }}
              onPrevMonth={() => {
                if (calMonth === 1) { setCalYear(calYear - 1); setCalMonth(12) }
                else setCalMonth(calMonth - 1)
              }}
              onNextMonth={() => {
                if (calMonth === 12) { setCalYear(calYear + 1); setCalMonth(1) }
                else setCalMonth(calMonth + 1)
              }}
              availableDates={availableDates}
            />
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Disponible
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-200" /> No disponible
              </span>
            </div>
          </div>

          {/* Time slots + Therapy info */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Horarios disponibles</h3>
              {!selectedDate && (
                <p className="text-gray-400 text-sm text-center py-8">
                  Selecciona una fecha en el calendario
                </p>
              )}
              {slotsLoading && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 py-8">
                  <Loader2 size={14} className="animate-spin" />
                  Cargando...
                </div>
              )}
              {selectedDate && !slotsLoading && availableSlots.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-8">
                  No hay horarios libres para esta fecha
                </p>
              )}
              {selectedDate && !slotsLoading && availableSlots.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`text-sm py-2.5 rounded-lg border transition-all font-medium ${
                        selectedTime === time
                          ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                          : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Therapy summary */}
            <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">{therapy.name}</span>
              </div>
              <div className="space-y-1 text-xs text-purple-700">
                <p className="flex items-center gap-1">
                  <Clock size={11} /> {formatDuration(therapy.duration_minutes)}
                </p>
                <p className="flex items-center gap-1">
                  <Euro size={11} /> {therapyPrice}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirm & Pay */}
      {step === 3 && therapy && (
        <div className="max-w-lg mx-auto space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-5 text-center text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
                <Sparkles size={22} className="text-white" />
              </div>
              <h2 className="text-lg font-bold">{therapy.name}</h2>
              <p className="text-sm text-purple-200 mt-0.5">{formatDuration(therapy.duration_minutes)}</p>
            </div>

            {/* Details */}
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <CalendarDays size={16} className="text-purple-500" />
                <div>
                  <p className="text-gray-500 text-xs">Fecha</p>
                  <p className="font-medium text-gray-900">
                    {selectedDate ? new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", {
                      day: "numeric", month: "long", year: "numeric",
                    }) : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-purple-500" />
                <div>
                  <p className="text-gray-500 text-xs">Horario</p>
                  <p className="font-medium text-gray-900">{selectedTime}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Total</span>
                  <span className="text-2xl font-bold text-purple-700">{therapyPrice}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 flex items-start gap-2 text-xs text-amber-800">
            <ShieldCheck size={14} className="shrink-0 mt-0.5" />
            <p>Pago seguro procesado por Stripe. No almacenamos tus datos bancarios.</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              disabled={submitting}
              className="flex-1 border border-gray-200 text-gray-700 text-sm font-medium py-3 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all"
            >
              Atrás
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-sm font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting ? "Procesando..." : "Pagar con tarjeta"}
              {!submitting && <CreditCard size={15} />}
            </button>
          </div>
        </div>
      )}

      {/* Sticky bottom bar — always visible on steps 1 & 2 */}
      {(step === 1 || step === 2) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto flex items-center justify-between h-16">
            {/* Selection summary */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => step === 2 ? setStep(1) : null}
                className={`text-gray-400 hover:text-gray-600 transition-colors ${step === 1 ? "invisible" : ""}`}
              >
                <ChevronLeft size={20} />
              </button>
              <div className="min-w-0">
                {step === 1 && selectedTherapy && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {therapies.find((t) => t.id === selectedTherapy)?.name}
                    </span>
                    <span className="text-xs text-purple-600 font-medium">
                      {(() => {
                        const t = therapies.find((t) => t.id === selectedTherapy)
                        return t ? `${t.price_cents / 100} €` : ""
                      })()}
                    </span>
                  </div>
                )}
                {step === 2 && (
                  <div className="flex items-center gap-2 text-sm">
                    {selectedDate && (
                      <span className="text-gray-500">
                        {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                      </span>
                    )}
                    {selectedTime && (
                      <span className="text-gray-500">· {selectedTime}</span>
                    )}
                    {(!selectedDate || !selectedTime) && (
                      <span className="text-gray-400">Selecciona fecha y hora</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Continue button */}
            <button
              onClick={handleNext}
              disabled={step === 1 ? !selectedTherapy : !selectedDate || !selectedTime}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-all shrink-0"
            >
              Continuar <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
