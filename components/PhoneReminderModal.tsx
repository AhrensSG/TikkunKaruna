'use client'

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { Phone, ChevronDown, Loader2 } from "lucide-react"

const COUNTRIES = [
  { code: "ES", name: "España", dial: "+34", flag: "🇪🇸" },
  { code: "AR", name: "Argentina", dial: "+54", flag: "🇦🇷" },
  { code: "MX", name: "México", dial: "+52", flag: "🇲🇽" },
  { code: "CO", name: "Colombia", dial: "+57", flag: "🇨🇴" },
  { code: "CL", name: "Chile", dial: "+56", flag: "🇨🇱" },
  { code: "PE", name: "Perú", dial: "+51", flag: "🇵🇪" },
  { code: "UY", name: "Uruguay", dial: "+598", flag: "🇺🇾" },
  { code: "EC", name: "Ecuador", dial: "+593", flag: "🇪🇨" },
  { code: "VE", name: "Venezuela", dial: "+58", flag: "🇻🇪" },
  { code: "CR", name: "Costa Rica", dial: "+506", flag: "🇨🇷" },
  { code: "PA", name: "Panamá", dial: "+507", flag: "🇵🇦" },
  { code: "DO", name: "República Dominicana", dial: "+1", flag: "🇩🇴" },
  { code: "US", name: "Estados Unidos", dial: "+1", flag: "🇺🇸" },
  { code: "GB", name: "Reino Unido", dial: "+44", flag: "🇬🇧" },
  { code: "FR", name: "Francia", dial: "+33", flag: "🇫🇷" },
  { code: "DE", name: "Alemania", dial: "+49", flag: "🇩🇪" },
  { code: "IT", name: "Italia", dial: "+39", flag: "🇮🇹" },
  { code: "PT", name: "Portugal", dial: "+351", flag: "🇵🇹" },
]

export default function PhoneReminderModal() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [countryDial, setCountryDial] = useState("+34")
  const [countryOpen, setCountryOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [checked, setChecked] = useState(false)
  const countryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    if (checked) return

    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        setChecked(true)
        if (data.user?.phone) return

        fetch("/api/bookings")
          .then((r) => r.json())
          .then((bData) => {
            const now = new Date()
            const hasUpcoming = (bData.bookings || []).some((b: { status: string; start_time: string; sessions?: { status: string; start_time: string }[] }) => {
              if (b.status !== "confirmed") return false
              if (new Date(b.start_time) > now) return true
              if (b.sessions) {
                return b.sessions.some((s) => s.status === "confirmed" && new Date(s.start_time) > now)
              }
              return false
            })
            if (hasUpcoming) {
              const matched = COUNTRIES.find((c) => data.user.phone?.startsWith(c.dial))
              if (matched) {
                setCountryDial(matched.dial)
                setPhoneNumber(data.user.phone.slice(matched.dial.length))
              }
              setOpen(true)
            }
          })
          .catch(() => {})
      })
      .catch(() => { setChecked(true) })
  }, [user, checked])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSave = async () => {
    const digits = phoneNumber.replace(/\D/g, "")
    if (digits.length < 6) {
      setError("Ingresá un número de teléfono válido")
      return
    }
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: countryDial + phoneNumber }),
      })
      if (res.ok) {
        setOpen(false)
      } else {
        setError("Error al guardar. Intentá de nuevo.")
      }
    } catch {
      setError("Error de conexión")
    }
    setSaving(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
            <Phone size={26} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Necesitamos tu teléfono</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Inma te va a llamar a este número para darte indicaciones y enviarte recordatorios de tus sesiones. Es obligatorio para confirmar la reserva.
          </p>
        </div>

        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">Tu número de teléfono</label>
          <div className="flex">
            <div className="relative" ref={countryRef}>
              <button
                type="button"
                onClick={() => setCountryOpen(!countryOpen)}
                className="flex items-center gap-1 h-full border border-gray-300 rounded-l-lg px-2.5 py-2.5 text-sm bg-gray-50 hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                <span className="text-base leading-none">{COUNTRIES.find((c) => c.dial === countryDial)?.flag}</span>
                <span className="text-gray-700 text-sm font-medium">{countryDial}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {countryOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => { setCountryDial(c.dial); setCountryOpen(false) }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-purple-50 transition-colors ${
                        countryDial === c.dial ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-700"
                      }`}
                    >
                      <span className="text-base leading-none">{c.flag}</span>
                      <span className="flex-1">{c.name}</span>
                      <span className="text-gray-400 text-xs">{c.dial}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => { setPhoneNumber(e.target.value); setError("") }}
              placeholder="600 00 00 00"
              className="flex-1 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-5">
          <p className="text-xs text-amber-800 leading-relaxed">
            Este número se usará para que Inma pueda contactarte y enviarte recordatorios de tus sesiones vía WhatsApp o llamada.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {saving ? "Guardando..." : "Guardar y continuar"}
        </button>
      </div>
    </div>
  )
}
