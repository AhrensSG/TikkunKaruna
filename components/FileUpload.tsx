'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, FileVideo, Image as ImageIcon, Loader2 } from 'lucide-react'

interface FileUploadProps {
  onUpload: (url: string) => void
  onRemove: () => void
  currentUrl?: string
  accept?: string
  folder?: string
  label?: string
}

export default function FileUpload({
  onUpload,
  onRemove,
  currentUrl,
  accept = 'image/*',
  folder = 'therapies',
  label = 'Imagen',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const isVideo = accept === 'video/*'
  const hasFile = !!currentUrl

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al subir archivo')
      }

      const data = await res.json()
      onUpload(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir archivo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="hidden"
      />

      {!hasFile && !uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {isVideo ? <FileVideo size={16} /> : <ImageIcon size={16} />}
          Subir {label}
          <Upload size={14} className="text-gray-400" />
        </button>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 size={16} className="animate-spin" />
          Subiendo...
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}

      {hasFile && !uploading && (
        <div className="relative inline-block">
          {isVideo ? (
            <video src={currentUrl} className="h-24 rounded-lg border border-gray-200" controls />
          ) : (
            <Image src={currentUrl} alt={label} width={96} height={96} className="object-cover rounded-lg border border-gray-200" />
          )}
          <button
            type="button"
            onClick={() => {
              onRemove()
              if (inputRef.current) inputRef.current.value = ''
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
