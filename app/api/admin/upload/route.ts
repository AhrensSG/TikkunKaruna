import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { auth } from '@/lib/auth.config'

export const dynamic = 'force-dynamic'

const BUCKET  = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!
const LIMITS  = { image: 10 * 1024 * 1024, video: 500 * 1024 * 1024 }
const IMAGES  = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const VIDEOS  = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    const formData = await req.formData()
    const file   = formData.get('file')   as File   | null
    const folder = formData.get('folder') as string | null ?? 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
    }

    const isImage = IMAGES.includes(file.type)
    const isVideo = VIDEOS.includes(file.type)

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: `Tipo no permitido: ${file.type}` }, { status: 400 })
    }

    const limit = isImage ? LIMITS.image : LIMITS.video
    if (file.size > limit) {
      return NextResponse.json(
        { error: `El archivo supera el límite de ${limit / 1024 / 1024} MB` },
        { status: 400 }
      )
    }

    // Ruta en Firebase Storage
    const safeName = file.name.replace(/\s+/g, '_')
    const filePath = `${folder}/${Date.now()}-${safeName}`

    // Token de descarga — incluido en la URL pública final
    const token  = randomUUID()
    const buffer = Buffer.from(await file.arrayBuffer())

    // Firebase Storage REST API — servidor a servidor, sin CORS
    const uploadUrl =
      `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o` +
      `?uploadType=media&name=${encodeURIComponent(filePath)}`

    const fbRes = await fetch(uploadUrl, {
      method:  'POST',
      headers: {
        'Content-Type': file.type,
      },
      body: buffer,
    })

    if (!fbRes.ok) {
      const errText = await fbRes.text()
      console.error('Firebase Storage error:', fbRes.status, errText)
      return NextResponse.json(
        { error: `Firebase Storage ${fbRes.status}: ${errText}` },
        { status: 502 }
      )
    }

    const fbData = await fbRes.json()

    const downloadToken = fbData.downloadTokens ?? token
    const downloadUrl =
      `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/` +
      `${encodeURIComponent(filePath)}?alt=media&token=${downloadToken}`

    return NextResponse.json({ url: downloadUrl })
  } catch (err: any) {
    console.error('POST /api/admin/upload:', err)
    return NextResponse.json({ error: err.message ?? 'Error al subir archivo' }, { status: 500 })
  }
}
