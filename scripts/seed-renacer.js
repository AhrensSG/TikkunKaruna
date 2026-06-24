require('dotenv').config({ path: '.env.local' })

const { initializeApp, getApps, cert } = require('firebase-admin/app')
const { getStorage } = require('firebase-admin/storage')
const { Pool } = require('pg')
const fs = require('fs')

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined

const app =
  getApps().length === 0
    ? initializeApp({
        credential: serviceAccount ? cert(serviceAccount) : undefined,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      })
    : getApps()[0]

const bucket = getStorage(app).bucket()
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const imgPath = 'C:/Users/ahren/Documents/Proyectos/TikkunKaruna/ING/IMG_6624.jpg'
  const fileName = 'therapies/' + Date.now() + '-IMG_6624.jpg'
  const buf = fs.readFileSync(imgPath)
  const blob = bucket.file(fileName)
  await blob.save(buf, { metadata: { contentType: 'image/jpeg' } })
  await blob.makePublic()
  const url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
  console.log('Imagen subida:', url)

  const r = await pool.query(
    `INSERT INTO therapies (name, description, duration_minutes, price_cents, is_active, image_url, video_url, sort_order)
     VALUES ($1, $2, $3, $4, true, $5, '', 21)
     RETURNING id`,
    [
      'Pack Proceso Renacer 6D (Péndulo + Reiki)',
      'Pack de acompañamiento energético profundo en el que trabajamos un foco específico durante 6 sesiones, combinando Péndulo Hebreo + Reiki para una transformación progresiva y estable. Es el pack más elegido.',
      570,
      33300,
      url,
    ]
  )
  const id = r.rows[0].id
  console.log('Terapia creada:', id)

  const reqs = [
    'Sesión 1: Evaluación energética + inicio del trabajo (120 min)',
    'Sesión 2-3-4: Limpieza, desbloqueo y trabajo profundo (90 min c/u)',
    'Sesión 5: Integración y estabilización energética (90 min)',
    'Sesión 6: Cierre, equilibrio y consolidación del proceso (90 min)',
  ]
  const values = reqs.map((_, i) => `($1, $${i + 2})`).join(', ')
  await pool.query(
    `INSERT INTO therapy_requirements (therapy_id, description) VALUES ${values}`,
    [id, ...reqs]
  )
  console.log('Requisitos añadidos:', reqs.length)
  pool.end()
}

main().catch((e) => {
  console.error(e)
  pool.end()
})
