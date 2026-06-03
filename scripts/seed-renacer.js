const { initializeApp } = require('firebase/app')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')
const { Pool } = require('pg')
const fs = require('fs')

const app = initializeApp({
  apiKey: 'AIzaSyAuxKMfPPiXmGnoKjjnyeeNoz1e8D0t1eI',
  authDomain: 'grupostart-fd312.firebaseapp.com',
  projectId: 'grupostart-fd312',
  storageBucket: 'grupostart-fd312.appspot.com',
  messagingSenderId: '1024913397672',
  appId: '1:1024913397672:web:aea05b3acc2fafe0de2f9d',
})
const storage = getStorage(app)
const pool = new Pool({ connectionString: 'postgresql://postgres:postgres@localhost:5432/tikkunkaruna' })

async function main() {
  const imgPath = 'C:/Users/ahren/Documents/Proyectos/TikkunKaruna/ING/IMG_6624.jpg'
  const fileName = 'therapies/' + Date.now() + '-IMG_6624.jpg'
  const buf = fs.readFileSync(imgPath)
  const storageRef = ref(storage, fileName)
  await uploadBytes(storageRef, buf)
  const url = await getDownloadURL(storageRef)
  console.log('Imagen subida:', url)

  const r = await pool.query(
    `INSERT INTO therapies (name, description, duration_minutes, price_cents, is_active, image_url, video_url)
     VALUES ($1, $2, $3, $4, true, $5, '')
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
