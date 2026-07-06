"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import {
  Sparkles, Clock, ArrowRight, Check, Loader2,
  ArrowLeft, ShieldCheck, Video, ListChecks, Package,
} from "lucide-react"
import Calendar from "@/components/Calendar"
import TermsCheckbox from "@/components/TermsCheckbox"

interface Therapy {
  id: string
  name: string
  description: string
  duration_minutes: number
  price_cents: number
  image_url: string
  video_url: string
  requirements: string[]
  is_pack: boolean
  session_count: number | null
  session_duration_minutes: number | null
}



export default function ReservarPage() {
  const { id } = useParams<{ id: string }>()
  const { status } = useSession()
  const router = useRouter()

  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth() + 1)

  const [therapy, setTherapy] = useState<Therapy | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<2 | 3>(2)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedAge, setAcceptedAge] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [packSessions, setPackSessions] = useState<{ date: string | null; time: string | null }[]>([])
  const [packSessionIndex, setPackSessionIndex] = useState(0)

  useEffect(() => {
    fetch("/api/therapies")
      .then((res) => res.json())
      .then((data) => {
        const t = (data.therapies || []).find((t: Therapy) => t.id === id)
        setTherapy(t || null)
        if (t?.is_pack && t.session_count) {
          setPackSessions(Array.from({ length: t.session_count }, () => ({ date: null, time: null })))
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const prevSessionStart = useMemo(() => {
    if (!therapy?.is_pack || packSessionIndex === 0) return null
    const prev = packSessions[packSessionIndex - 1]
    if (!prev.date || !prev.time) return null
    return new Date(`${prev.date}T${prev.time}:00`).toISOString()
  }, [packSessions, packSessionIndex, therapy])

  useEffect(() => {
    if (!selectedDate || !id) return
    const load = async () => {
      setSelectedTime(null)
      setSlotsLoading(true)
      const params = new URLSearchParams({ date: selectedDate, therapyId: id })
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
  }, [selectedDate, id, prevSessionStart])

  useEffect(() => {
    if (!id) return
    const params = new URLSearchParams({ year: String(calYear), month: String(calMonth), therapyId: id })
    if (prevSessionStart) params.set("after", prevSessionStart)
    fetch(`/api/availability/month?${params}`)
      .then((r) => r.json())
      .then((data) => setAvailableDates(data.dates || []))
      .catch(() => setAvailableDates([]))
  }, [calYear, calMonth, id, prevSessionStart])

  const handlePay = async () => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/reservar/${id}`)
      return
    }

    if (!therapy) return
    if (!therapy.is_pack && (!selectedDate || !selectedTime)) return
    if (therapy.is_pack && packSessions.some((s) => !s.date || !s.time)) return

    setSubmitting(true)
    setError("")

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
        setError(data.error || "Error al procesar el pago")
        setSubmitting(false)
      }
    } catch {
      setError("Error de conexión")
      setSubmitting(false)
    }
  }

  const handlePackNext = () => {
    if (!therapy?.is_pack) {
      setStep(3)
      return
    }
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-24">
      <div className="max-w-5xl mx-auto px-4">
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
                <div className="relative w-full h-48 overflow-hidden">
                  <Image src={therapy.image_url} alt={therapy.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
                </div>
              )}
              <div className="p-6 space-y-5">
                <div>
                  <h1 className="font-heading text-2xl text-purple-950 mb-3">{therapy.name}</h1>
                  <p className="text-purple-700 text-sm leading-relaxed">{therapy.description}</p>
                </div>

                {/* Meta: duration + price */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-purple-500">
                    <Clock size={15} />
                    {therapy.duration_minutes >= 60
                      ? `${Math.floor(therapy.duration_minutes / 60)}h ${therapy.duration_minutes % 60 || ""}`
                      : `${therapy.duration_minutes} min`}
                  </div>
                  <span className="text-purple-200">|</span>
                  <span className="text-xl text-purple-700 font-semibold">
                    {therapy.price_cents / 100} €
                  </span>
                </div>

                {/* Requisitos / condiciones */}
                {therapy.requirements && therapy.requirements.length > 0 && (
                  <div>
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold text-purple-900 mb-2">
                      <ListChecks size={15} className="text-gold-500" />
                      Requisitos / Condiciones
                    </h3>
                    <ul className="space-y-1.5">
                      {therapy.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-purple-600">
                          <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Video */}
                {therapy.video_url && (
                  <div>
                    <h3 className="flex items-center gap-1.5 text-sm font-semibold text-purple-900 mb-2">
                      <Video size={15} className="text-gold-500" />
                      Video explicativo
                    </h3>
                    <div className="aspect-video rounded-xl overflow-hidden bg-purple-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={therapy.video_url}
                        alt={`Video de ${therapy.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Booking flow */}
          <div className="lg:col-span-3">
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  {therapy.is_pack ? (
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-bold text-gray-900">Elige fecha y hora</h2>
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                        Sesión {packSessionIndex + 1} de {packSessions.length}
                      </span>
                    </div>
                  ) : (
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Elige fecha y hora</h2>
                  )}
                  <p className="text-sm text-gray-500">
                    {therapy.is_pack
                      ? `Selecciona el día y horario para la sesión ${packSessionIndex + 1}.`
                      : 'Selecciona el día y horario para tu sesión.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calendar */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Día</h3>
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
                      availableDates={availableDates}
                    />
                  </div>

                  {/* Time slots */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      Horario
                      {slotsLoading && <span className="text-gray-400 font-normal text-xs ml-2">Cargando...</span>}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {!selectedDate && (
                        <p className="text-gray-400 text-sm col-span-2 text-center py-6">Selecciona una fecha primero</p>
                      )}
                      {slotsLoading && (
                        <p className="text-gray-400 text-sm col-span-2 text-center py-6">Cargando horarios...</p>
                      )}
                      {selectedDate && !slotsLoading && availableSlots.length === 0 && (
                        <p className="text-gray-400 text-sm col-span-2 text-center py-6">No hay horarios disponibles para esta fecha</p>
                      )}
                      {selectedDate && !slotsLoading && availableSlots.map((time) => (
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

                {therapy.is_pack && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4">
                    <h3 className="text-xs font-semibold text-gray-700 mb-2">Sesiones del pack</h3>
                    <div className="space-y-1.5">
                      {packSessions.map((s, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg cursor-pointer ${
                            i === packSessionIndex ? 'bg-purple-100 text-purple-800 font-medium' :
                            s.date && s.time ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'
                          }`}
                          onClick={() => {
                            if (s.date && s.time) {
                              const updated = [...packSessions]
                              updated[packSessionIndex] = { date: selectedDate, time: selectedTime }
                              setPackSessions(updated)
                              setSelectedDate(s.date)
                              setSelectedTime(s.time)
                              setPackSessionIndex(i)
                            }
                          }}
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

                <div className="flex justify-end">
                  <button
                    onClick={handlePackNext}
                    disabled={!selectedDate || !selectedTime}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                  >
                    {therapy.is_pack && packSessionIndex < packSessions.length - 1
                      ? `Siguiente sesión (${packSessionIndex + 1}/${packSessions.length})`
                      : 'Continuar'}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-lg">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    {therapy.is_pack ? <Package size={26} className="text-purple-600" /> : <Sparkles size={26} className="text-purple-600" />}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Confirmar reserva</h2>
                </div>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Terapia</span>
                    <span className="font-medium text-gray-900">{therapy.name}</span>
                  </div>

                  {therapy.is_pack ? (
                    <>
                      {packSessions.map((s, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-500">Sesión {i + 1}</span>
                          <span className="font-medium text-gray-900 text-right">
                            {s.date ? new Date(s.date + "T12:00:00").toLocaleDateString("es-ES", { day: "numeric", month: "short" }) : ""}{s.time ? ` ${s.time}` : ""}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Duración por sesión</span>
                        <span className="font-medium text-gray-900">{therapy.session_duration_minutes} min</span>
                      </div>
                    </>
                  ) : (
                    <>
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
                        <span className="font-medium text-gray-900">
                          {therapy.duration_minutes >= 60
                            ? `${Math.floor(therapy.duration_minutes / 60)}h ${therapy.duration_minutes % 60 || ""}`
                            : `${therapy.duration_minutes} min`}
                        </span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Total</span>
                    <span className="font-bold text-xl text-purple-700">{therapy.price_cents / 100} €</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 leading-relaxed mb-4">
                  <p className="flex items-start gap-1.5">
                    <span className="mt-0.5 shrink-0 text-amber-500">ℹ</span>
                    Estas sesiones no sustituyen procesos médicos ni la atención de profesionales de la salud; se trabaja exclusivamente en el campo energético de las personas como complemento al bienestar personal.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
                    {error}
                  </div>
                )}

                <div className="mb-4">
                  <TermsCheckbox checked={acceptedTerms} onChange={setAcceptedTerms} ageChecked={acceptedAge} onAgeChange={setAcceptedAge} />
                </div>

                <button
                  onClick={handlePay}
                  disabled={submitting || !acceptedTerms || !acceptedAge}
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
