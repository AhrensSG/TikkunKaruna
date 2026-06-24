'use client'

import { Loader2, AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  itemName?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  loading?: boolean
  error?: string | null
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  message,
  itemName,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  loading = false,
  error = null,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null

  const confirmColors =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      : 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'

  const iconBg =
    variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'

  const iconColor =
    variant === 'danger' ? 'text-red-600' : 'text-amber-600'

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          <div className={`shrink-0 w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
            <AlertTriangle size={20} className={iconColor} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-bold text-gray-900">{title}</h2>
              <button
                onClick={onCancel}
                disabled={loading}
                className="shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">{message}</p>
            {itemName && (
              <p className="text-sm font-semibold text-gray-900 mt-1 bg-purple-50 rounded-lg px-3 py-2 truncate">
                {itemName}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 mt-3 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${confirmColors}`}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Eliminando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
