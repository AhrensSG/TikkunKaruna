"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Calendar, Clock, ArrowRight, Loader2 } from "lucide-react"

interface BookingData {
  booking_id: string
  start_time: string
  end_time: string
  status: string
  stripe_session_id: string
  therapy_name: string
  therapy_description: string
  duration_minutes: number
  price_cents: number
  image_url: string
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const bookingId = searchParams.get("booking_id")

  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!sessionId) {
      setError("No se encontró el identificador de la sesión")
      setLoading(false)
      return
    }

    const params = new URLSearchParams({ session_id: sessionId })
    if (bookingId) params.set("booking_id", bookingId)

    fetch(`/api/payments/session?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.booking) {
          setBooking(data.booking)
        } else {
          setError(data.error || "Error al obtener la reserva")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Error de conexión")
        setLoading(false)
      })
  }, [sessionId, bookingId])

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  function formatTime(iso: string) {
    const d = new Date(iso)
    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
  }

  function formatDuration(minutes: number) {
    if (minutes >= 60) {
      const h = Math.floor(minutes / 60)
      const m = minutes % 60
      return m > 0 ? `${h}h ${m} min` : `${h}h`
    }
    return `${minutes} min`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-purple-600 mx-auto mb-3" />
          <p className="text-purple-600 text-sm">Verificando tu reserva...</p>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-600 text-2xl">!</span>
        </div>
        <p className="text-gray-700 font-medium">{error || "Reserva no encontrada"}</p>
        <Link
          href="/dashboard/history"
          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
        >
          Ir a mis reservas →
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-24 pb-16">
      <div className="max-w-lg mx-auto px-4">
        {/* Success icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="font-heading text-3xl text-purple-950 mb-2">
            {booking.status === "pending" ? "Procesando pago..." : "¡Reserva confirmada!"}
          </h1>
          <p className="text-purple-600 text-sm">
            {booking.status === "pending"
              ? "El pago se está procesando. Recibirás un email de confirmación en breve."
              : "Tu pago se ha procesado correctamente. Aquí tienes los detalles de tu sesión:"}
          </p>
        </div>

        {/* Booking card */}
        <div className="bg-white rounded-2xl border border-purple-100 overflow-hidden mb-8">
          {booking.image_url && (
            <div className="w-full h-44 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={booking.image_url}
                alt={booking.therapy_name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 space-y-4">
            <h2 className="font-heading text-xl text-purple-950">{booking.therapy_name}</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-purple-600">
                <Calendar size={16} />
                <span>{formatDate(booking.start_time)}</span>
              </div>
              <div className="flex items-center gap-3 text-purple-600">
                <Clock size={16} />
                <span>
                  {formatTime(booking.start_time)} — {formatTime(booking.end_time)}
                  <span className="text-purple-400 ml-2">({formatDuration(booking.duration_minutes)})</span>
                </span>
              </div>
            </div>

            <div className="border-t border-purple-100 pt-3 flex justify-between items-center">
              <span className="text-gray-500 text-sm">Total pagado</span>
              <span className="font-heading text-2xl text-gold-600 font-bold">
                {(booking.price_cents / 100).toFixed(0)} €
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/dashboard/history"
          className="flex items-center justify-center gap-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-xl transition-colors"
        >
          Ver todas mis reservas
          <ArrowRight size={16} />
        </Link>

        <p className="text-center text-xs text-gray-400 mt-4">
          Si tienes alguna duda, puedes contactarnos en cualquier momento.
        </p>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-purple-600 mx-auto mb-3" />
          <p className="text-purple-600 text-sm">Verificando tu reserva...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
