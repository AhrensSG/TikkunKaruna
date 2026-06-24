'use client'

import { MessageSquare } from 'lucide-react'

interface Props {
  name: string
  notes: string
  onClose: () => void
}

export default function ViewNotesModal({ name, notes, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={18} className="text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Mensaje de Inma</h2>
        </div>
        <p className="text-xs text-gray-400 mb-3">Para {name}</p>
        <div className="bg-purple-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
          {notes}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
