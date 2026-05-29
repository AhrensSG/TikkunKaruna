'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { uploadImage, uploadVideo } from '@/lib/firebase-storage'
import type { Therapy } from '@/types'

// ─── Types ────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '',
  subtitle: '',
  description: '',
  duration_minutes: 60,
  price_cents: 0,
  is_active: true,
  image_url: '',
  video_url: '',
  category: 'pendulo_hebreo' as Therapy['category'],
  modality: 'distancia' as Therapy['modality'],
  is_pack: false,
  session_count: 1,
  tag: '',
  sort_order: 0,
}

type FormData = typeof EMPTY_FORM

// ─── Helpers ─────────────────────────────────────────────────
function isFirebaseUrl(url: string) {
  return url.startsWith('https://firebasestorage.googleapis.com')
}

function imgSrc(url: string) {
  if (!url) return null
  if (url.startsWith('/') || url.startsWith('http')) return url
  return `/sesiones/${url}`
}

// ─── Upload zone sub-components ──────────────────────────────
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
      <div
        className="bg-teal-500 h-1.5 rounded-full transition-all duration-150"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────
export default function TherapiesPage() {
  const [therapies, setTherapies] = useState<Therapy[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Therapy | null>(null)
  const [form, setForm] = useState<FormData>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Therapy | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  // Upload state
  const [imgUploading, setImgUploading] = useState(false)
  const [imgProgress, setImgProgress] = useState(0)
  const [vidUploading, setVidUploading] = useState(false)
  const [vidProgress, setVidProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')

  const imgInputRef = useRef<HTMLInputElement>(null)
  const vidInputRef = useRef<HTMLInputElement>(null)

  // ── Data ──────────────────────────────────────────────────
  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/therapies')
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        console.error('Error cargando terapias:', data.error)
        setLoading(false)
        return
      }
      const data = await res.json()
      setTherapies(data.therapies || [])
    } catch (err) {
      console.error('Error cargando terapias:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // ── Modal ────────────────────────────────────────────────
  function openCreate() {
    setEditing(null)
    setForm(EMPTY_FORM)
    setError('')
    setUploadError('')
    setModalOpen(true)
  }

  function openEdit(t: Therapy) {
    setEditing(t)
    setForm({
      name: t.name,
      subtitle: t.subtitle,
      description: t.description,
      duration_minutes: t.duration_minutes,
      price_cents: t.price_cents,
      is_active: t.is_active,
      image_url: t.image_url,
      video_url: t.video_url,
      category: t.category,
      modality: t.modality,
      is_pack: t.is_pack,
      session_count: t.session_count,
      tag: t.tag,
      sort_order: t.sort_order,
    })
    setError('')
    setUploadError('')
    setModalOpen(true)
  }

  // ── Image upload ─────────────────────────────────────────
  async function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImgUploading(true)
    setImgProgress(0)
    setUploadError('')
    try {
      const url = await uploadImage(file, {
        folder: 'therapies/images',
        onProgress: ({ percent }) => setImgProgress(percent),
      })
      setForm((f) => ({ ...f, image_url: url }))
    } catch (err: any) {
      setUploadError(err.message)
    } finally {
      setImgUploading(false)
      if (imgInputRef.current) imgInputRef.current.value = ''
    }
  }

  // ── Video upload ─────────────────────────────────────────
  async function handleVideoFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setVidUploading(true)
    setVidProgress(0)
    setUploadError('')
    try {
      const url = await uploadVideo(file, {
        folder: 'therapies/videos',
        onProgress: ({ percent }) => setVidProgress(percent),
      })
      setForm((f) => ({ ...f, video_url: url }))
    } catch (err: any) {
      setUploadError(err.message)
    } finally {
      setVidUploading(false)
      if (vidInputRef.current) vidInputRef.current.value = ''
    }
  }

  // ── Save ─────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const url = editing ? `/api/admin/therapies/${editing.id}` : '/api/admin/therapies'
    const method = editing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        duration_minutes: Number(form.duration_minutes),
        price_cents: Number(form.price_cents),
        session_count: Number(form.session_count),
        sort_order: Number(form.sort_order),
      }),
    })

    if (res.ok) {
      setModalOpen(false)
      load()
    } else {
      const data = await res.json()
      setError(data.error || 'Error al guardar')
    }
    setSaving(false)
  }

  // ── Delete ────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const res = await fetch(`/api/admin/therapies/${deleteTarget.id}`, { method: 'DELETE' })
    if (res.ok) { setDeleteTarget(null); load() }
    setDeleting(false)
  }

  const categoryLabel: Record<Therapy['category'], string> = {
    pendulo_hebreo: 'Péndulo Hebreo',
    reiki: 'Reiki',
    combinado: 'Combinado',
  }

  const isUploading = imgUploading || vidUploading

  // ── Render ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Cargando terapias...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Terapias</h1>
          <p className="text-gray-500 text-sm mt-1">{therapies.length} terapias registradas</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Nueva terapia
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Terapia</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Categoría</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Duración</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Precio</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Tipo</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Media</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Estado</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {therapies.map((t) => {
                const src = imgSrc(t.image_url)
                return (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {src ? (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                            <Image src={src} alt={t.name} fill className="object-cover" sizes="40px" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center text-gray-300 text-lg">
                            ✦
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 leading-tight">{t.name}</p>
                          {t.subtitle && (
                            <p className="text-gray-400 text-xs mt-0.5 line-clamp-1 max-w-[200px]">{t.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{categoryLabel[t.category]}</td>
                    <td className="px-4 py-3 text-gray-600">{t.duration_minutes} min</td>
                    <td className="px-4 py-3 text-gray-600">{(t.price_cents / 100).toFixed(2)} €</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        t.is_pack ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {t.is_pack ? `Pack · ${t.session_count}` : 'Individual'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${t.image_url ? 'bg-green-400' : 'bg-gray-200'}`} title={t.image_url ? 'Imagen' : 'Sin imagen'} />
                        <span className={`w-1.5 h-1.5 rounded-full ${t.video_url ? 'bg-blue-400' : 'bg-gray-200'}`} title={t.video_url ? 'Vídeo' : 'Sin vídeo'} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        t.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {t.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => openEdit(t)} className="text-teal-600 hover:text-teal-800 text-xs font-medium">Editar</button>
                      <button onClick={() => setDeleteTarget(t)} className="text-red-500 hover:text-red-700 text-xs font-medium">Eliminar</button>
                    </td>
                  </tr>
                )
              })}
              {therapies.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">No hay terapias registradas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal crear / editar ─────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-gray-900">
                {editing ? 'Editar terapia' : 'Nueva terapia'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Nombre de la terapia"
                />
              </div>

              {/* Subtítulo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Frase corta descriptiva"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              {/* Categoría + Modalidad */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as Therapy['category'] })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="pendulo_hebreo">Péndulo Hebreo</option>
                    <option value="reiki">Reiki</option>
                    <option value="combinado">Combinado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modalidad</label>
                  <select
                    value={form.modality}
                    onChange={(e) => setForm({ ...form, modality: e.target.value as Therapy['modality'] })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="distancia">A distancia</option>
                    <option value="presencial">Presencial</option>
                  </select>
                </div>
              </div>

              {/* Duración + Precio */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duración (min) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.duration_minutes}
                    onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio (€) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={0.01}
                    value={(form.price_cents / 100).toFixed(2)}
                    onChange={(e) =>
                      setForm({ ...form, price_cents: Math.round(parseFloat(e.target.value) * 100) })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Pack */}
              <div className="flex items-start gap-6">
                <div className="flex items-center gap-2 pt-1">
                  <input
                    id="is_pack"
                    type="checkbox"
                    checked={form.is_pack}
                    onChange={(e) => setForm({ ...form, is_pack: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="is_pack" className="text-sm text-gray-700">Es un pack</label>
                </div>
                {form.is_pack && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nº de sesiones</label>
                    <input
                      type="number"
                      min={2}
                      value={form.session_count}
                      onChange={(e) => setForm({ ...form, session_count: Number(e.target.value) })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                )}
              </div>

              {/* ── IMAGEN ──────────────────────────────────── */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">Imagen</p>

                {/* Preview */}
                {form.image_url && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                    {(() => {
                      const src = imgSrc(form.image_url)
                      return src ? (
                        <Image src={src} alt="Preview" fill className="object-cover" sizes="600px" />
                      ) : null
                    })()}
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image_url: '' })}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow"
                    >
                      ×
                    </button>
                    {isFirebaseUrl(form.image_url) && (
                      <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        Firebase
                      </span>
                    )}
                  </div>
                )}

                {/* Upload button */}
                <div className="flex gap-2">
                  <input
                    ref={imgInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleImageFile}
                    disabled={imgUploading}
                  />
                  <button
                    type="button"
                    onClick={() => imgInputRef.current?.click()}
                    disabled={imgUploading}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-teal-400 hover:text-teal-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {imgUploading ? (
                      <>{imgProgress}% subiendo...</>
                    ) : (
                      <>{form.image_url ? '↑ Cambiar imagen' : '↑ Subir imagen'}</>
                    )}
                  </button>
                  <span className="text-xs text-gray-400 self-center">JPG, PNG, WEBP · máx 10 MB</span>
                </div>
                {imgUploading && <ProgressBar value={imgProgress} />}

                {/* Manual URL fallback */}
                <div>
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="O pega una URL directamente…"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>
              </div>

              {/* ── VÍDEO ───────────────────────────────────── */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-700">Vídeo <span className="text-gray-400 font-normal">(opcional)</span></p>

                {/* Current video status */}
                {form.video_url && (
                  <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-blue-500 text-base">▶</span>
                      <span className="text-xs text-blue-700 font-medium truncate">
                        {isFirebaseUrl(form.video_url) ? 'Vídeo subido en Firebase Storage' : form.video_url}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, video_url: '' })}
                      className="shrink-0 ml-2 text-blue-400 hover:text-red-500 text-xs"
                    >
                      Quitar
                    </button>
                  </div>
                )}

                {/* Upload button */}
                <div className="flex gap-2">
                  <input
                    ref={vidInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                    className="hidden"
                    onChange={handleVideoFile}
                    disabled={vidUploading}
                  />
                  <button
                    type="button"
                    onClick={() => vidInputRef.current?.click()}
                    disabled={vidUploading}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {vidUploading ? (
                      <>{vidProgress}% subiendo...</>
                    ) : (
                      <>{form.video_url ? '↑ Cambiar vídeo' : '↑ Subir vídeo'}</>
                    )}
                  </button>
                  <span className="text-xs text-gray-400 self-center">MP4, WEBM, MOV · máx 500 MB</span>
                </div>
                {vidUploading && (
                  <>
                    <ProgressBar value={vidProgress} />
                    <p className="text-xs text-gray-400">Los vídeos grandes pueden tardar varios minutos…</p>
                  </>
                )}
              </div>

              {/* Badge + Orden + Activa */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Más solicitada"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    id="is_active"
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="is_active" className="text-sm text-gray-700">Activa</label>
                </div>
              </div>

              {/* Errors */}
              {uploadError && (
                <p className="text-orange-500 text-sm bg-orange-50 px-3 py-2 rounded-lg">{uploadError}</p>
              )}
              {error && (
                <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-60"
                >
                  {saving ? 'Guardando...' : isUploading ? 'Subiendo archivo...' : editing ? 'Guardar cambios' : 'Crear terapia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal eliminar ────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Eliminar terapia</h2>
            <p className="text-gray-600 text-sm mb-6">
              ¿Seguro que quieres eliminar <strong>{deleteTarget.name}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-60"
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
