"use client"

import { useEffect, useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import {
  Sparkles, Clock, Euro, ArrowRight, Check, Loader2,
  ChevronLeft, CreditCard, ShieldCheck, CalendarDays,
  Info, Search, ListChecks, Package,
} from "lucide-react"
import Image from "next/image"
import Calendar from "@/components/Calendar"
import TermsCheckbox from "@/components/TermsCheckbox"
import BookingTimeline from "@/components/booking/BookingTimeline"

interface Therapy {
  id: string
  name: string
  description: string
  duration_minutes: number
  price_cents: number
  image_url: string
  requirements: string[]
  is_pack: boolean
  session_count: number | null
  session_duration_minutes: number | null
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
  const [searchQuery, setSearchQuery] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedAge, setAcceptedAge] = useState(false)
  const [packSessions, setPackSessions] = useState<{ date: string | null; time: string | null }[]>([])
  const [packSessionIndex, setPackSessionIndex] = useState(0)

  const filteredTherapies = useMemo(() => {
    if (!searchQuery.trim()) return therapies
    const q = searchQuery.toLowerCase()
    return therapies.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    )
  }, [therapies, searchQuery])

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (searchParams.get("canceled") === "true") {
      setStep(1)
      setSelectedTherapy(null)
      setSelectedDate(null)
      setSelectedTime(null)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
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

  const therapy = therapies.find((t) => t.id === selectedTherapy)

  const therapyPrice = useMemo(() => {
    if (!therapy) return ""
    return `${(therapy.price_cents / 100).toFixed(0)} €`
  }, [therapy])

  const prevSessionStart = useMemo(() => {
    if (!therapy?.is_pack || packSessionIndex === 0) return null
    const prev = packSessions[packSessionIndex - 1]
    if (!prev.date || !prev.time) return null
    return new Date(`${prev.date}T${prev.time}:00`).toISOString()
  }, [packSessions, packSessionIndex, therapy])
  const tzOffset = useMemo(() => String(new Date().getTimezoneOffset()), [])

  useEffect(() => {
    if (!selectedTherapy) return
    const params = new URLSearchParams({ year: String(calYear), month: String(calMonth), therapyId: selectedTherapy, tzOffset })
    if (prevSessionStart) params.set("after", prevSessionStart)
    fetch(`/api/availability/month?${params}`)
      .then((r) => r.json())
      .then((data) => setAvailableDates(data.dates || []))
      .catch(() => setAvailableDates([]))
  }, [calYear, calMonth, selectedTherapy, prevSessionStart, tzOffset])

  useEffect(() => {
    if (!selectedDate || !selectedTherapy) return
    const _therapy = therapies.find((t) => t.id === selectedTherapy)
    if (!_therapy) return
    const load = async () => {
      setSelectedTime(null)
      setSlotsLoading(true)
      const params = new URLSearchParams({ date: selectedDate, therapyId: selectedTherapy, tzOffset })
      if (prevSessionStart) params.set("after", prevSessionStart)
      try {
        const res = await fetch(`/api/availability?${params}`)
        const data = await res.json()
        setAvailableSlots(data.slots || [])
      } catch {
        setAvailableSlots([])
      } finally {
        setSlotsLoading(false)
      }
    }
    load()
  }, [selectedDate, selectedTherapy, therapies, prevSessionStart])

  const handleNext = () => {
    if (step === 1 && selectedTherapy) {
      if (therapy?.is_pack && therapy.session_count) {
        setPackSessions(Array.from({ length: therapy.session_count }, () => ({ date: null, time: null })))
        setPackSessionIndex(0)
        setSelectedDate(null)
        setSelectedTime(null)
        setStep(2)
      } else {
        setStep(2)
      }
    }
    else if (step === 2) {
      if (therapy?.is_pack) {
        const updated = [...packSessions]
        updated[packSessionIndex] = { date: selectedDate, time: selectedTime }
        setPackSessions(updated)
        if (packSessionIndex < packSessions.length - 1) {
          setPackSessionIndex(packSessionIndex + 1)
          setSelectedDate(null)
          setSelectedTime(null)
        } else {
          setStep(3)
        }
      } else {
        if (selectedDate && selectedTime) setStep(3)
      }
    }
  }

  const handleConfirm = async () => {
    if (!therapy) return
    if (!therapy.is_pack && (!selectedDate || !selectedTime)) return
    if (therapy.is_pack && packSessions.some((s) => !s.date || !s.time)) return

    setSubmitting(true)
    try {
      const body = therapy.is_pack
        ? {
            therapyId: therapy.id,
            sessions: packSessions.map((s) => ({
              start_time: new Date(`${s.date}T${s.time}:00`).toISOString(),
            })),
          }
        : {
            therapyId: therapy.id,
            start_time: new Date(`${selectedDate}T${selectedTime}:00`).toISOString(),
          }

      const res = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

      <BookingTimeline steps={STEPS} currentStep={step} />

      {/* Step 1: Therapies */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar terapia..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            />
          </div>

          {/* Therapy list */}
          <div className="space-y-3">
            {filteredTherapies.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-sm text-gray-400">
                No se encontraron terapias con &ldquo;{searchQuery}&rdquo;
              </div>
            )}
            {filteredTherapies.map((t) => {
              const isSelected = selectedTherapy === t.id
              return (
                <div
                  key={t.id}
                  className={`bg-white rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-purple-600 shadow-md shadow-purple-100"
                      : "border-gray-100 hover:border-purple-200"
                  }`}
                >
                  {/* Compact header — always visible */}
                  <button
                    onClick={() => setSelectedTherapy(isSelected ? null : t.id)}
                    className="w-full flex items-center gap-4 p-4 text-left"
                  >
                    {t.image_url ? (
                      <Image src={t.image_url} alt={t.name} width={56} height={56} className="rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                        <Sparkles size={20} className="text-purple-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{t.name}</h3>
                        {isSelected && <Check size={14} className="text-purple-600 shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{t.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-purple-700">{t.price_cents / 100} €</p>
                      <p className="text-xs text-gray-400">{formatDuration(t.duration_minutes)}</p>
                    </div>
                  </button>

                  {/* Expanded details */}
                  {isSelected && (
                    <div className="border-t border-purple-100 px-4 pb-5 pt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-purple-600">Duración</p>
                          <p className="font-semibold text-purple-900">{formatDuration(t.duration_minutes)}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-purple-600">Precio</p>
                          <p className="font-semibold text-purple-900">{t.price_cents / 100} €</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 leading-relaxed">{t.description}</p>

                      {t.requirements && t.requirements.length > 0 && (
                        <div>
                          <p className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-1.5">
                            <ListChecks size={12} /> Requisitos
                          </p>
                          <ul className="space-y-1">
                            {t.requirements.map((req, i) => (
                              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                                <span className="mt-1 w-1 h-1 rounded-full bg-purple-400 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <button
                        onClick={(e) => { e.stopPropagation(); handleNext() }}
                        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-3 rounded-xl transition-all"
                      >
                        Continuar con {t.name} <ArrowRight size={15} />
                      </button>
                    </div>
                  )}
                </div>
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
            {therapy.is_pack && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                  Sesión {packSessionIndex + 1} de {packSessions.length}
                </span>
              </div>
            )}
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
                <Package size={14} className="text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">{therapy.name}</span>
              </div>
              <div className="space-y-1 text-xs text-purple-700">
                {therapy.is_pack && therapy.session_duration_minutes && (
                  <p className="flex items-center gap-1">
                    <Clock size={11} /> {therapy.session_duration_minutes} min por sesión · {packSessions.length} sesiones
                  </p>
                )}
                {!therapy.is_pack && (
                  <p className="flex items-center gap-1">
                    <Clock size={11} /> {formatDuration(therapy.duration_minutes)}
                  </p>
                )}
                <p className="flex items-center gap-1">
                  <Euro size={11} /> {therapyPrice}
                </p>
              </div>
            </div>

            {/* Pack sessions summary */}
            {therapy.is_pack && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-700 mb-2">Sesiones del pack</h3>
                <div className="space-y-1.5">
                  {packSessions.map((s, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg ${
                        i === packSessionIndex ? 'bg-purple-100 text-purple-800 font-medium' :
                        s.date && s.time ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {s.date && s.time ? <Check size={11} className="text-green-500" /> : i + 1}
                      </span>
                      <span>
                        Sesión {i + 1}
                        {s.date && s.time && ` — ${new Date(s.date + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" })} ${s.time}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                {therapy.is_pack ? <Package size={22} className="text-white" /> : <Sparkles size={22} className="text-white" />}
              </div>
              <h2 className="text-lg font-bold">{therapy.name}</h2>
              <p className="text-sm text-purple-200 mt-0.5">
                {therapy.is_pack
                  ? `${packSessions.length} sesiones · ${therapy.session_duration_minutes} min cada una`
                  : formatDuration(therapy.duration_minutes)}
              </p>
            </div>

            {/* Details */}
            <div className="p-5 space-y-4">
              {therapy.is_pack ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Sesiones programadas</p>
                  {packSessions.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm bg-purple-50 rounded-lg p-3">
                      <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          {s.date ? new Date(s.date + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : ""}
                        </p>
                        <p className="text-xs text-gray-500">{s.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
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
                </>
              )}

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

          <TermsCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} ageChecked={acceptedAge} onAgeChange={setAcceptedAge} />

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
              disabled={submitting || !acceptedTerms || !acceptedAge}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-sm font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting ? "Procesando..." : "Pagar con tarjeta"}
              {!submitting && <CreditCard size={15} />}
            </button>
          </div>
        </div>
      )}

      {/* Sticky bottom bar — always visible on step 2 */}
      {step === 2 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto flex items-center justify-between h-16">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => {
                  if (therapy?.is_pack && packSessionIndex > 0) {
                    const prev = packSessions[packSessionIndex - 1]
                    setSelectedDate(prev.date)
                    setSelectedTime(prev.time)
                    setPackSessionIndex(packSessionIndex - 1)
                  } else {
                    setStep(1)
                  }
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  {therapy?.is_pack ? (
                    <span className="text-gray-500">
                      Sesión {packSessionIndex + 1} de {packSessions.length}
                      {selectedDate && ` · ${new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" })}`}
                      {selectedTime && ` · ${selectedTime}`}
                    </span>
                  ) : selectedDate || selectedTime ? (
                    <>
                      {selectedDate && (
                        <span className="text-gray-500">
                          {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                        </span>
                      )}
                      {selectedTime && (
                        <span className="text-gray-500">· {selectedTime}</span>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400">Selecciona fecha y hora</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={therapy?.is_pack ? !selectedDate || !selectedTime : !selectedDate || !selectedTime}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-all shrink-0"
            >
              {therapy?.is_pack && packSessionIndex < packSessions.length - 1
                ? `Siguiente (${packSessionIndex + 1}/${packSessions.length})`
                : 'Continuar'}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
