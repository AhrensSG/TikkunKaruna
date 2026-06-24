"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { Camera, Save, Loader2, ChevronDown } from "lucide-react"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

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

export default function ProfilePage() {
  const { data: session, update } = useSession()

  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    image: session?.user?.image || "",
  })
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  const [imgError, setImgError] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: "", newPwd: "", confirm: "" })
  const [countryDial, setCountryDial] = useState("+34")
  const [countryOpen, setCountryOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const countryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!session?.user?.id) return

    setForm({
      name: session.user.name || "",
      email: session.user.email || "",
      phone: "",
      image: session.user.image || "",
    })

    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data.user) return
        const existingPhone = data.user.phone || ""
        let dial = "+34"
        let num = existingPhone
        const matched = COUNTRIES.find((c) => existingPhone.startsWith(c.dial))
        if (matched) {
          dial = matched.dial
          num = existingPhone.slice(matched.dial.length)
        }
        setCountryDial(dial)
        setPhoneNumber(num)
        setForm({
          name: data.user.name || session.user.name || "",
          email: data.user.email || session.user.email || "",
          phone: existingPhone,
          image: data.user.image || session.user.image || "",
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session?.user?.id])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const storageRef = ref(storage, `avatars/${session?.user.id}-${Date.now()}`)
    const task = uploadBytesResumable(storageRef, file)

    task.on(
      "state_changed",
      () => {},
      () => { setUploading(false) },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref)
        setImgError(false)
        setForm((f) => ({ ...f, image: url }))
        setUploading(false)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const body: any = { name: form.name, phone: countryDial + phoneNumber, image: form.image }

      if (passwordForm.newPwd) {
        if (passwordForm.newPwd !== passwordForm.confirm) {
          setMessage({ type: "error", text: "Las contraseñas no coinciden" })
          setSaving(false)
          return
        }
        if (passwordForm.newPwd.length < 6) {
          setMessage({ type: "error", text: "Mínimo 6 caracteres" })
          setSaving(false)
          return
        }
        body.currentPassword = passwordForm.current
        body.newPassword = passwordForm.newPwd
      }

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Error al guardar" })
      } else {
        setMessage({ type: "ok", text: "Perfil actualizado correctamente" })
        setPasswordForm({ current: "", newPwd: "", confirm: "" })
        await update({ name: form.name, image: form.image })
      }
    } catch {
      setMessage({ type: "error", text: "Error de conexión" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona tus datos personales y foto de perfil.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Foto de perfil</h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              {form.image && !imgError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.image}
                  alt="Avatar"
                  onError={() => setImgError(true)}
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold text-2xl">
                  {form.name.charAt(0)}
                </div>
              )}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} className="text-gray-600" />}
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{form.name}</p>
              <p className="text-xs text-gray-500">JPG, PNG o GIF. Máx 2MB.</p>
            </div>
          </div>
          <input ref={inputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
        </div>

        {/* Personal data */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Datos personales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Nombre completo</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Teléfono</label>
              <div className="flex">
                <div className="relative" ref={countryRef}>
                  <button
                    type="button"
                    onClick={() => setCountryOpen(!countryOpen)}
                    className="flex items-center gap-1 h-full border border-gray-300 rounded-l-lg px-2.5 py-2 text-sm bg-gray-50 hover:bg-gray-100 transition-colors whitespace-nowrap"
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
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="600 00 00 00"
                  className="flex-1 border border-l-0 border-gray-300 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Cambiar contraseña</h2>
          <p className="text-xs text-gray-500 mb-4">Dejalo vacío si no querés cambiarla.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Contraseña actual</label>
              <input
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Nueva contraseña</label>
              <input
                type="password"
                value={passwordForm.newPwd}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPwd: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirmar</label>
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`text-sm px-4 py-2.5 rounded-lg ${
              message.type === "ok"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            <Save size={15} />
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  )
}
