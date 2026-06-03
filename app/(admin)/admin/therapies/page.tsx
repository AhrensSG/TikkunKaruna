'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, EyeOff, Sparkles, Search, X } from 'lucide-react'
import type { Therapy } from '@/types'

export default function TherapiesPage() {
  const [therapies, setTherapies] = useState<Therapy[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterPriceMin, setFilterPriceMin] = useState('')
  const [filterPriceMax, setFilterPriceMax] = useState('')

  const fetchTherapies = () => {
    fetch('/api/admin/therapies')
      .then((res) => res.json())
      .then((data) => {
        setTherapies(data.therapies || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchTherapies()
  }, [])

  const filtered = useMemo(() => {
    let result = therapies

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      )
    }

    if (filterStatus === 'active') result = result.filter((t) => t.is_active)
    else if (filterStatus === 'inactive') result = result.filter((t) => !t.is_active)

    const min = Number(filterPriceMin)
    const max = Number(filterPriceMax)
    if (min > 0) result = result.filter((t) => t.price_cents / 100 >= min)
    if (max > 0) result = result.filter((t) => t.price_cents / 100 <= max)

    return result
  }, [therapies, search, filterStatus, filterPriceMin, filterPriceMax])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar la terapia "${name}"?`)) return

    try {
      const res = await fetch(`/api/admin/therapies/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setTherapies((prev) => prev.filter((t) => t.id !== id))
      }
    } catch {
      alert('Error al eliminar la terapia')
    }
  }

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/admin/therapies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !current }),
      })
      if (res.ok) {
        setTherapies((prev) =>
          prev.map((t) => (t.id === id ? { ...t, is_active: !current } : t))
        )
      }
    } catch {
      alert('Error al cambiar el estado')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-sm">Cargando terapias...</p>
      </div>
    )
  }

  const hasActiveFilters = search || filterStatus !== 'all' || filterPriceMin || filterPriceMax

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Terapias</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} de {therapies.length} terapias</p>
        </div>
        <Link
          href="/admin/therapies/new"
          className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white text-sm font-medium rounded-lg hover:bg-purple-800 transition-colors"
        >
          <Plus size={16} />
          Nueva Terapia
        </Link>
      </div>

      {/* ── Filtros ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Buscar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Estado */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Solo activas</option>
            <option value="inactive">Solo inactivas</option>
          </select>

          {/* Precio min */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">€</span>
            <input
              type="number"
              value={filterPriceMin}
              onChange={(e) => setFilterPriceMin(e.target.value)}
              placeholder="Mín"
              className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              min={0}
            />
            <span className="text-gray-400 text-xs">—</span>
            <input
              type="number"
              value={filterPriceMax}
              onChange={(e) => setFilterPriceMax(e.target.value)}
              placeholder="Máx"
              className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              min={0}
            />
          </div>

          {/* Limpiar filtros */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearch('')
                setFilterStatus('all')
                setFilterPriceMin('')
                setFilterPriceMax('')
              }}
              className="text-sm text-purple-700 hover:text-purple-800 font-medium whitespace-nowrap"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* ── Lista ── */}
      <div className="grid gap-4">
        {filtered.map((therapy) => (
          <div
            key={therapy.id}
            className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow"
          >
            <div className="w-16 h-16 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 overflow-hidden">
              {therapy.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={therapy.image_url} alt={therapy.name} className="w-full h-full object-cover" />
              ) : (
                <Sparkles size={24} className="text-purple-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 truncate">{therapy.name}</h3>
                {!therapy.is_active && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                    <EyeOff size={12} />
                    Inactiva
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate mt-0.5">
                {therapy.duration_minutes} min · {therapy.price_cents / 100} €
                {therapy.requirements && therapy.requirements.length > 0 && ` · ${therapy.requirements.length} requisito${therapy.requirements.length > 1 ? 's' : ''}`}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggleActive(therapy.id, therapy.is_active)}
                className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors shrink-0 ${
                  therapy.is_active ? 'bg-green-400' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    therapy.is_active ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>

              {therapy.video_url && (
                <span className="text-xs text-gray-400 mr-1">🎬</span>
              )}
              <Link
                href={`/admin/therapies/${therapy.id}`}
                className="p-2 text-gray-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Pencil size={16} />
              </Link>
              <button
                onClick={() => handleDelete(therapy.id, therapy.name)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Sparkles size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">
              {hasActiveFilters ? 'Ninguna terapia coincide con los filtros' : 'No hay terapias todavía'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={() => {
                  setSearch('')
                  setFilterStatus('all')
                  setFilterPriceMin('')
                  setFilterPriceMax('')
                }}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-700 text-white text-sm font-medium rounded-lg hover:bg-purple-800 transition-colors"
              >
                Limpiar filtros
              </button>
            ) : (
              <Link
                href="/admin/therapies/new"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-700 text-white text-sm font-medium rounded-lg hover:bg-purple-800 transition-colors"
              >
                <Plus size={16} />
                Crear primera terapia
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
