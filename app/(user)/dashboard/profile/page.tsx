"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { Camera, Save, Loader2 } from "lucide-react"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { storage } from "@/lib/firebase"

export default function ProfilePage() {
  const { data: session, update } = useSession()

  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    image: session?.user?.image || "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  const [imgError, setImgError] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: "", newPwd: "", confirm: "" })
  const inputRef = useRef<HTMLInputElement>(null)

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
        setForm({
          name: data.user.name || session.user.name || "",
          email: data.user.email || session.user.email || "",
          phone: data.user.phone || "",
          image: data.user.image || session.user.image || "",
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [session?.user?.id])

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
      const body: any = { name: form.name, phone: form.phone, image: form.image }

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
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
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
