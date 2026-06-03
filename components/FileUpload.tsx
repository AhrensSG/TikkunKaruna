'use client'

import { useState, useRef } from 'react'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'
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
  const [progress, setProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const isVideo = accept === 'video/*'
  const hasFile = !!currentUrl

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setProgress(0)

    const fileName = `${Date.now()}-${file.name}`
    const storageRef = ref(storage, `${folder}/${fileName}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
      },
      (error) => {
        console.error('Upload error:', error)
        setUploading(false)
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        onUpload(url)
        setUploading(false)
      }
    )
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
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Loader2 size={16} className="animate-spin" />
          <span>Subiendo... {progress}%</span>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {hasFile && !uploading && (
        <div className="relative inline-block">
          {isVideo ? (
            <video src={currentUrl} className="h-24 rounded-lg border border-gray-200" controls />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt={label} className="h-24 w-24 object-cover rounded-lg border border-gray-200" />
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
