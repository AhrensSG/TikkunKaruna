"use client"

import { useState, FormEvent } from "react"
import { CheckCircle, Loader2 } from "lucide-react"

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!form.name || !form.email || !form.message) {
      setError("Completa los campos obligatorios (*)")
      return
    }
    if (!accepted) {
      setError("Debes aceptar la política de privacidad")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Error al enviar")
      } else {
        setDone(true)
      }
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="bg-white rounded-2xl border border-green-200 p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={28} className="text-green-600" />
        </div>
        <h3 className="font-heading text-xl text-purple-950 mb-2">Mensaje enviado</h3>
        <p className="text-purple-500 text-sm">Te responderemos lo antes posible. Gracias por escribirnos.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nombre" className="block text-purple-700 text-sm font-body font-medium mb-1.5">
            Nombre *
          </label>
          <input
            id="nombre"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Tu nombre"
            className="w-full border border-purple-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 rounded-xl px-4 py-3 text-purple-900 placeholder-purple-300 text-sm font-body outline-none transition-all bg-white"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-purple-700 text-sm font-body font-medium mb-1.5">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="tu@email.com"
            className="w-full border border-purple-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 rounded-xl px-4 py-3 text-purple-900 placeholder-purple-300 text-sm font-body outline-none transition-all bg-white"
          />
        </div>
      </div>

      <div>
        <label htmlFor="asunto" className="block text-purple-700 text-sm font-body font-medium mb-1.5">
          Asunto
        </label>
        <input
          id="asunto"
          type="text"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="¿En qué podemos ayudarte?"
          className="w-full border border-purple-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 rounded-xl px-4 py-3 text-purple-900 placeholder-purple-300 text-sm font-body outline-none transition-all bg-white"
        />
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-purple-700 text-sm font-body font-medium mb-1.5">
          Mensaje *
        </label>
        <textarea
          id="mensaje"
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Cuéntanos cómo podemos ayudarte..."
          className="w-full border border-purple-200 focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20 rounded-xl px-4 py-3 text-purple-900 placeholder-purple-300 text-sm font-body outline-none transition-all bg-white resize-none"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="privacidad"
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="mt-0.5 accent-gold-500"
        />
        <label htmlFor="privacidad" className="text-purple-500 text-xs font-body leading-relaxed">
          He leído y acepto la{" "}
          <a href="/privacidad" className="text-gold-600 hover:underline">
            Política de privacidad
          </a>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gold-500 hover:bg-gold-400 disabled:bg-gold-300 text-purple-950 font-semibold py-3.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-gold-500/25 text-sm flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  )
}
