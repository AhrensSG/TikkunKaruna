// Las subidas van a /api/admin/upload (servidor Next.js → Firebase REST API).
// Esto evita todos los problemas de CORS y autenticación del cliente.

export type UploadProgress = {
  percent: number
  bytesTransferred: number
  totalBytes: number
}

export type UploadOptions = {
  onProgress?: (progress: UploadProgress) => void
  folder?: string
  fileName?: string
}

// ─── Core: XHR para reportar progreso real ────────────────────
function uploadToServer(
  file: File,
  folder: string,
  options: Pick<UploadOptions, 'onProgress' | 'fileName'> = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const body = new FormData()
    body.append('file', file, options.fileName ?? file.name)
    body.append('folder', folder)

    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        options.onProgress?.({
          percent: Math.round((e.loaded / e.total) * 100),
          bytesTransferred: e.loaded,
          totalBytes: e.total,
        })
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText)
          resolve(data.url)
        } catch {
          reject(new Error('Respuesta inesperada del servidor'))
        }
      } else {
        try {
          const data = JSON.parse(xhr.responseText)
          reject(new Error(data.error ?? `Error ${xhr.status}`))
        } catch {
          reject(new Error(`Error ${xhr.status}`))
        }
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Error de red')))
    xhr.addEventListener('abort', () => reject(new Error('Subida cancelada')))

    xhr.open('POST', '/api/admin/upload')
    xhr.send(body)
  })
}

// ─── API pública ──────────────────────────────────────────────
export async function uploadImage(
  file: File,
  options: UploadOptions = {}
): Promise<string> {
  const accepted = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!accepted.includes(file.type))
    throw new Error('Tipo de imagen no permitido. Usa JPG, PNG, WEBP o GIF.')
  if (file.size > 10 * 1024 * 1024)
    throw new Error('La imagen supera el límite de 10 MB.')

  return uploadToServer(file, options.folder ?? 'therapies/images', options)
}

export async function uploadVideo(
  file: File,
  options: UploadOptions = {}
): Promise<string> {
  const accepted = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
  if (!accepted.includes(file.type))
    throw new Error('Tipo de vídeo no permitido. Usa MP4, WEBM o MOV.')
  if (file.size > 500 * 1024 * 1024)
    throw new Error('El vídeo supera el límite de 500 MB.')

  return uploadToServer(file, options.folder ?? 'therapies/videos', options)
}

export async function deleteFile(_url: string): Promise<void> {
  // TODO: implementar borrado via API route si se necesita
}
