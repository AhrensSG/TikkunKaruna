import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth-helpers'
import { adminBucket } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  const adminError = await requireAdmin()
  if (adminError) return adminError

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const folder = (formData.get('folder') as string) || 'therapies'

  if (!file) {
    return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Tipo de archivo no permitido' }, { status: 400 })
  }

  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'El archivo supera el tamaño máximo de 10 MB' }, { status: 400 })
  }

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const fileName = `${folder}/${Date.now()}-${cleanName}`
  const blob = adminBucket.file(fileName)

  await blob.save(buffer, {
    metadata: { contentType: file.type },
  })

  await blob.makePublic()

  const publicUrl = `https://storage.googleapis.com/${adminBucket.name}/${blob.name}`

  return NextResponse.json({ url: publicUrl })
}
