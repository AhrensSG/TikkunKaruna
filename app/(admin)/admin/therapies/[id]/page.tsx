'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import FileUpload from '@/components/FileUpload'
import type { Therapy } from '@/types'

export default function EditTherapyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [duration_minutes, setDurationMinutes] = useState(60)
  const [price_cents, setPriceCents] = useState(5000)
  const [is_active, setIsActive] = useState(true)
  const [image_url, setImageUrl] = useState('')
  const [video_url, setVideoUrl] = useState('')
  const [requirements, setRequirements] = useState<string[]>([''])

  useEffect(() => {
    fetch(`/api/admin/therapies/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then((data) => {
        const t: Therapy = data.therapy
        setName(t.name)
        setDescription(t.description)
        setDurationMinutes(t.duration_minutes)
        setPriceCents(t.price_cents)
        setIsActive(t.is_active)
        setImageUrl(t.image_url)
        setVideoUrl(t.video_url)
        setRequirements(t.requirements?.length ? t.requirements : [''])
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const filteredReqs = requirements.filter((r) => r.trim())

    const res = await fetch(`/api/admin/therapies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        duration_minutes,
        price_cents,
        is_active,
        image_url,
        video_url,
        requirements: filteredReqs,
      }),
    })

    if (res.ok) {
      router.push('/admin/therapies')
    } else {
      const data = await res.json()
      alert(data.error || 'Error al guardar la terapia')
      setSaving(false)
    }
  }

  const addRequirement = () => setRequirements([...requirements, ''])
  const removeRequirement = (i: number) => setRequirements(requirements.filter((_, idx) => idx !== i))
  const updateRequirement = (i: number, val: string) => {
    const updated = [...requirements]
    updated[i] = val
    setRequirements(updated)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Cargando terapia...</p>
      </div>
    )
  }

  if (notFound) {
    return (
      <div>
        <Link href="/admin/therapies" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft size={16} />
          Volver a terapias
        </Link>
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">Terapia no encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link
        href="/admin/therapies"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver a terapias
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Editar Terapia</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Duración (minutos)</label>
              <input
                type="number"
                value={duration_minutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                min={15}
                step={15}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Precio (céntimos)</label>
              <input
                type="number"
                value={price_cents}
                onChange={(e) => setPriceCents(Number(e.target.value))}
                min={0}
                step={100}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price_cents / 100)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={is_active}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-purple-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
            </label>
            <span className="text-sm text-gray-700">Terapia activa</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Multimedia</h2>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Imagen</label>
            <FileUpload
              onUpload={(url) => setImageUrl(url)}
              onRemove={() => setImageUrl('')}
              currentUrl={image_url}
              accept="image/*"
              label="Imagen"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Video</label>
            <FileUpload
              onUpload={(url) => setVideoUrl(url)}
              onRemove={() => setVideoUrl('')}
              currentUrl={video_url}
              accept="video/*"
              label="Video"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-700">Requisitos</h2>
            <button
              type="button"
              onClick={addRequirement}
              className="flex items-center gap-1 text-sm text-purple-700 hover:text-purple-800 transition-colors"
            >
              <Plus size={14} />
              Añadir
            </button>
          </div>

          {requirements.map((req, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={req}
                onChange={(e) => updateRequirement(i, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                placeholder="Ej: Ropa cómoda"
              />
              {requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRequirement(i)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-700 text-white text-sm font-medium rounded-lg hover:bg-purple-800 disabled:opacity-50 transition-colors"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <Link
            href="/admin/therapies"
            className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
