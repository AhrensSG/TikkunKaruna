'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, EyeOff, Sparkles, Search, X, Package } from 'lucide-react'
import type { Therapy } from '@/types'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function TherapiesPage() {
  const [therapies, setTherapies] = useState<Therapy[]>([])
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterPriceMin, setFilterPriceMin] = useState('')
  const [filterPriceMax, setFilterPriceMax] = useState('')

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

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

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/admin/therapies/${deleteTarget.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        setTherapies((prev) => prev.filter((t) => t.id !== deleteTarget.id))
        setDeleteTarget(null)
      } else {
        setDeleteError(data.error || 'Error al eliminar la terapia')
      }
    } catch {
      setDeleteError('Error de conexión')
    }
    setDeleteLoading(false)
  }

  const handleSortOrder = async (id: string, value: number) => {
    setTherapies((prev) =>
      prev.map((t) => (t.id === id ? { ...t, sort_order: value } : t))
    )
    try {
      await fetch(`/api/admin/therapies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: value }),
      })
    } catch {
      // ignore
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
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Terapias</h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">{filtered.length} de {therapies.length} terapias</p>
        </div>
        <Link
          href="/admin/therapies/new"
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-700 text-white text-sm font-medium rounded-lg hover:bg-purple-800 transition-colors"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Nueva Terapia</span>
        </Link>
      </div>

      {/* ── Filtros ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          {/* Buscar */}
          <div className="relative flex-1 min-w-0">
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

          <div className="flex items-center gap-3 flex-wrap">
            {/* Estado */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
              className="flex-1 sm:flex-none px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white"
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
      </div>

      {/* ── Lista ── */}
      <div className="grid gap-4">
        {filtered.map((therapy) => (
          <div
            key={therapy.id}
            className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:shadow-sm transition-shadow"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 overflow-hidden">
              {therapy.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={therapy.image_url} alt={therapy.name} className="w-full h-full object-cover" />
              ) : (
                <Sparkles size={24} className="text-purple-400" />
              )}
            </div>

            <div className="flex-1 min-w-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 truncate">{therapy.name}</h3>
                  {!therapy.is_active && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      <EyeOff size={12} />
                      Inactiva
                    </span>
                  )}
                  {therapy.is_pack && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      <Package size={12} />
                      Pack · {therapy.session_count} sesiones
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {therapy.duration_minutes} min · {therapy.price_cents / 100} €
                  {therapy.is_pack && therapy.session_duration_minutes && ` · ${therapy.session_duration_minutes} min/sesión`}
                  {therapy.requirements && therapy.requirements.length > 0 && ` · ${therapy.requirements.length} requisito${therapy.requirements.length > 1 ? 's' : ''}`}
                </p>
              </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 mt-2 sm:mt-0">
              {/* Orden en home */}
              <div className="flex items-center gap-1">
                <span className="hidden sm:inline text-xs text-gray-400">Home</span>
                  <input
                    type="number"
                    min={0}
                    value={therapy.sort_order ?? 0}
                    onChange={(e) => {
                      const raw = e.target.value
                      const num = raw === '' ? 0 : parseInt(raw) || 0
                      handleSortOrder(therapy.id, num)
                    }}
                    onFocus={(e) => e.target.select()}
                    className="w-10 sm:w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
              </div>

              <button
                onClick={() => handleToggleActive(therapy.id, therapy.is_active)}
                className={`relative inline-flex h-6 w-9 sm:w-10 items-center rounded-full transition-colors shrink-0 ${
                  therapy.is_active ? 'bg-green-400' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                    therapy.is_active ? 'translate-x-4 sm:translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>

              {therapy.video_url && (
                <span className="hidden sm:inline text-xs text-gray-400 mr-1">🎬</span>
              )}
              <Link
                href={`/admin/therapies/${therapy.id}`}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <Pencil size={15} />
              </Link>
              <button
                onClick={() => { setDeleteTarget({ id: therapy.id, name: therapy.name }); setDeleteError(null) }}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
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
      {/* Delete confirmation modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Eliminar terapia"
        message="¿Estás seguro de que deseas eliminar esta terapia? Se desactivará y dejará de mostrarse en la web. Podrás restaurarla más tarde."
        itemName={deleteTarget?.name}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        loading={deleteLoading}
        error={deleteError}
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setDeleteTarget(null); setDeleteError(null) }}
      />
    </div>
  )
}
