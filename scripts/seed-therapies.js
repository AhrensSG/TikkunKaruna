const { initializeApp } = require('firebase/app')
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage')
const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

// ─── Firebase Client SDK ───────────────────────────────────
// Rules are open (allow read, write: if true), so no auth needed
const app = initializeApp({
  apiKey: 'AIzaSyAuxKMfPPiXmGnoKjjnyeeNoz1e8D0t1eI',
  authDomain: 'grupostart-fd312.firebaseapp.com',
  projectId: 'grupostart-fd312',
  storageBucket: 'grupostart-fd312.appspot.com',
  messagingSenderId: '1024913397672',
  appId: '1:1024913397672:web:aea05b3acc2fafe0de2f9d',
})
const storage = getStorage(app)

// ─── PostgreSQL ─────────────────────────────────────────────
const pool = new Pool({
  connectionString:
    'postgresql://postgres:postgres@localhost:5432/tikkunkaruna',
})

// ─── Helper: upload image & get URL ────────────────────────
async function uploadImage(localPath) {
  const fileName = `therapies/${Date.now()}-${path.basename(localPath)}`
  const fileBuffer = fs.readFileSync(localPath)
  const storageRef = ref(storage, fileName)
  await uploadBytes(storageRef, fileBuffer)
  return getDownloadURL(storageRef)
}

// ─── Therapy data ──────────────────────────────────────────
const therapies = [
  // ── SESIONES DE PÉNDULO HEBREO ────────────────────────────
  {
    name: 'Reprogramación Energética',
    description:
      'Limpieza energética profunda diseñada para identificar y liberar los bloqueos que afectan tu bienestar físico, emocional o vital. Ideal si estás atravesando momentos de estrés, ansiedad, agotamiento, confusión mental, inseguridad o interferencias externas.',
    duration_minutes: 90,
    price_cents: 7500,
    image: 'IMG_6593.JPG',
    requirements: [],
  },
  {
    name: 'Desbloqueo de Chakras Esenciales',
    description:
      'Desbloqueo de los chakras esenciales y activación de tus canales de luz para que la energía circule de forma correcta y fluida por todo tu sistema energético. Ideal si sientes bloqueo energético, falta de vitalidad, desequilibrio interior o desconexión contigo misma.',
    duration_minutes: 60,
    price_cents: 6500,
    image: 'IMG_6578.jpg',
    requirements: [],
  },
  {
    name: 'Desbloqueo de Chakras Secundarios',
    description:
      'Desbloqueo de los chakras secundarios y activación de tus canales de luz. Ideal si sientes bloqueo energético localizado en zonas puntuales del cuerpo, cansancio o sobrecarga en áreas determinadas, o necesidad de reforzar la fluidez del sistema energético.',
    duration_minutes: 60,
    price_cents: 6500,
    image: 'IMG_6580.JPG',
    requirements: [],
  },
  {
    name: 'Desbloqueo de Chakras de Luz',
    description:
      'Desbloqueo de los chakras superiores y la activación de sus canales de luz, favoreciendo una mayor conexión, claridad y expansión del sistema energético. Ideal si sientes falta de claridad, desconexión o bloqueo a nivel energético sutil.',
    duration_minutes: 60,
    price_cents: 6500,
    image: 'IMG_6581.JPG',
    requirements: [],
  },
  {
    name: 'Sellado del Aura',
    description:
      'Identificación de fugas energéticas en el campo energético y reparación y sellado de las mismas. Ideal para eliminar fugas energéticas, restaurar el equilibrio del sistema energético y reforzar la protección del campo energético.',
    duration_minutes: 60,
    price_cents: 6500,
    image: 'IMG_6583.JPG',
    requirements: [],
  },
  {
    name: 'Desintoxicación Energética de Hígado',
    description:
      'El hígado es el órgano clave para atraer a la tierra y materializar tus proyectos y deseos del alma. Cuando el hígado está saturado de emociones densas (rabia, ira, celos…), se genera un bloqueo que dificulta que tus metas se manifiesten. Esta sesión ayuda a eliminar emociones estancadas, desbloquear la manifestación de proyectos y conectar con tu corazón.',
    duration_minutes: 90,
    price_cents: 7500,
    image: 'IMG_6591.JPG',
    requirements: ['Se recomienda haber realizado primero el pack RESET ENERGETICO'],
  },
  {
    name: 'Sanación de Karma',
    description:
      'El karma es la energía que busca equilibrar acciones del pasado. En esta sesión identificamos y liberamos el karma que te afecta en este momento, sin importar si su origen es familiar, personal, económico, de relaciones o incluso de otras vidas. Ayuda a romper patrones, liberar ataduras y recuperar tu libertad.',
    duration_minutes: 90,
    price_cents: 7500,
    image: 'IMG_6589.JPG',
    requirements: ['Se recomienda haber realizado primero el pack RESET ENERGETICO'],
  },
  {
    name: 'Limpieza y Armonización de los Canales de Conexión',
    description:
      'Trabajo sobre las conexiones espirituales: el SER, el YO SUPERIOR y los GUIAS ESPIRITUALES. Para que la vida fluya y cumplamos nuestro propósito, las conexiones deben estar en armonía. Ideal si sientes falta de dirección, desconexión con tu propósito, parálisis o vivir sin rumbo.',
    duration_minutes: 90,
    price_cents: 8000,
    image: 'IMG_6609.JPG',
    requirements: ['Se debe haber realizado primero el pack RESET ENERGETICO'],
  },
  {
    name: 'Activación Letras Hebreas',
    description:
      'Las letras hebreas poseen una vibración específica que conecta directamente con la energía del alma. En esta sesión se trabaja la integración de las 22 letras hebreas y las 5 letras finales en el campo energético, aportando una armonización profunda de nuestro sistema energético.',
    duration_minutes: 90,
    price_cents: 7000,
    image: 'IMG_6610.JPG',
    requirements: ['Se debe haber realizado primero el pack RESET ENERGETICO'],
  },
  {
    name: 'Limpieza Energética de Espacios',
    description:
      'Los lugares que habitamos acumulan cargas energéticas que pueden afectarnos. En esta sesión identificamos las energías que rompen la armonía, liberamos y limpiamos por completo el espacio, y elevamos la vibración del lugar para transformarlo en un imán de bienestar, paz y equilibrio.',
    duration_minutes: 120,
    price_cents: 12000,
    image: 'IMG_6605.JPG',
    requirements: [],
  },
  {
    name: 'Mascotas',
    description:
      'Nuestros queridos amigos peludos forman parte de la familia y su equilibrio energético influye en su bienestar. Se tratan igual que las personas: liberando aquello que no les permite estar en armonía e integrando la vibración más adecuada para ellos de forma personalizada.',
    duration_minutes: 60,
    price_cents: 7500,
    image: 'IMG_6607.JPG',
    requirements: [],
  },

  // ── PACKS DE PÉNDULO HEBREO ──────────────────────────────
  {
    name: 'Reset Energético Básico',
    description:
      'Pack recomendado si nunca te has realizado sesiones de Péndulo Hebreo. Actúa como un reinicio energético global, ayudando a recuperar claridad, fuerza y dirección. Incluye 3 sesiones: Reprogramación Energética, Desbloqueo de Chakras Esenciales y Sellado del Aura.',
    duration_minutes: 150,
    price_cents: 16000,
    image: 'IMG_6584.JPG',
    requirements: [
      'Sesión 1: Reprogramación Energética (90 min)',
      'Sesión 2: Desbloqueo de Chakras Esenciales (60 min)',
      'Sesión 3: Sellado del Aura (60 min)',
    ],
  },
  {
    name: 'Reset Energético Premium',
    description:
      'Pack recomendado si nunca te has realizado sesiones de Péndulo Hebreo. Reinicio energético global que además desbloquea y armoniza todos los puntos energéticos. Incluye 5 sesiones.',
    duration_minutes: 330,
    price_cents: 27500,
    image: 'IMG_6586.JPG',
    requirements: [
      'Sesión 1: Reprogramación Energética (90 min)',
      'Sesión 2: Desbloqueo y armonización de Chakras Esenciales (60 min)',
      'Sesión 3: Desbloqueo y armonización de Chakras Secundarios (60 min)',
      'Sesión 4: Desbloqueo y armonización de Chakras de Luz (60 min)',
      'Sesión 5: Sellado del Aura (60 min)',
    ],
  },
  {
    name: 'Pack Chakras',
    description:
      'Programa diseñado para desbloquear y armonizar todos los chakras: esenciales, secundarios y de luz. Incluye 3 sesiones en días diferentes para integrar bien la energía.',
    duration_minutes: 180,
    price_cents: 16000,
    image: 'IMG_6585.JPG',
    requirements: [
      'Sesión 1: Desbloqueo de Chakras Esenciales (60 min)',
      'Sesión 2: Desbloqueo de Chakras Secundarios (60 min)',
      'Sesión 3: Desbloqueo de Chakras de Luz (60 min)',
    ],
  },
  {
    name: 'Pack Frecuencia Divina',
    description:
      'Diseñado para recuperar la conexión con tu propia esencia, tu conciencia y tu equipo espiritual. Libera energías densas y bloqueos que interfieren con el bienestar. Incluye 4 sesiones.',
    duration_minutes: 330,
    price_cents: 22000,
    image: 'IMG_6587.JPG',
    requirements: [
      'Sesión 1: Reprogramación Energética (90 min)',
      'Sesión 2: Desbloqueo y armonización de Chakras de Luz (60 min)',
      'Sesión 3: Limpieza y Armonización de Canales de Conexión (90 min)',
      'Sesión 4: Protocolo personalizado para abrir la comunicación con el Ser Superior',
    ],
  },

  // ── SESIONES DE REIKI ─────────────────────────────────────
  {
    name: 'Reiki Armonización de Chakras',
    description:
      'Sesión enfocada en equilibrar y armonizar los centros energéticos del cuerpo (chakras), ayudando a recuperar sensación de estabilidad, bienestar y fluidez energética. Ideal para personas que sienten cansancio, bloqueo energético, estrés, desmotivación o desequilibrio interior.',
    duration_minutes: 45,
    price_cents: 3500,
    image: 'reiki armonizacion chackras.jpeg',
    requirements: [],
  },
  {
    name: 'Reiki Emocional',
    description:
      'Sesión enfocada en acompañar emociones y aportar calma mental y emocional. Ayuda a liberar tensión emocional y favorecer estados de tranquilidad y bienestar. Ideal para momentos de ansiedad, tristeza, estrés, agotamiento emocional o cambios personales.',
    duration_minutes: 45,
    price_cents: 3500,
    image: 'IMG_6620.jpg',
    requirements: [],
  },
  {
    name: 'Reiki Angelical',
    description:
      'Sesión energética profunda que combina la energía Reiki con conexión angelical. Crea un espacio de paz, luz y acompañamiento espiritual. Ideal para personas que sienten necesidad de paz emocional, conexión espiritual, liberar cargas energéticas o recuperar equilibrio interior.',
    duration_minutes: 60,
    price_cents: 5000,
    image: 'IMG_6621.jpg',
    requirements: [],
  },
  {
    name: 'Reiki en la Línea del Tiempo',
    description:
      'Sesión enfocada en trabajar la energía a través de la línea temporal. Opción pasado: armonizar emociones relacionadas con bloqueos, recuerdos o situaciones del pasado. Opción futuro: preparar energéticamente eventos importantes que generan nervios, miedo o inseguridad.',
    duration_minutes: 60,
    price_cents: 4500,
    image: 'IMG_6622.jpg',
    requirements: [],
  },

  // ── PACKS DE REIKI ────────────────────────────────────────
  {
    name: 'Pack Bienestar',
    description:
      'Acompañamiento energético mediante varias sesiones para trabajar el bienestar de forma progresiva y profunda. Ideal para mantener equilibrio emocional, trabajar procesos personales, reducir estrés continuado y crear una rutina de bienestar energético. Incluye 4 sesiones de 45 minutos.',
    duration_minutes: 180,
    price_cents: 12000,
    image: 'IMG_6571.jpg',
    requirements: [
      '4 sesiones de 45 minutos en días diferentes para la integración de la energía',
    ],
  },
  {
    name: 'Pack Proceso Renacer 6D (Péndulo + Reiki)',
    description:
      'Pack de acompañamiento energético profundo en el que trabajamos un foco específico durante 6 sesiones, combinando Péndulo Hebreo + Reiki para una transformación progresiva y estable. Es el pack más elegido.',
    duration_minutes: 570,
    price_cents: 33300,
    image: 'IMG_6624.jpg',
    requirements: [
      'Sesión 1: Evaluación energética + inicio del trabajo (120 min)',
      'Sesión 2-3-4: Limpieza, desbloqueo y trabajo profundo (90 min c/u)',
      'Sesión 5: Integración y estabilización energética (90 min)',
      'Sesión 6: Cierre, equilibrio y consolidación del proceso (90 min)',
    ],
  },
]

const ING_DIR = path.join(__dirname, '..', 'ING')

async function main() {
  for (const t of therapies) {
    const localPath = path.join(ING_DIR, t.image)
    if (!fs.existsSync(localPath)) {
      console.error(`❌ Imagen no encontrada: ${localPath}`)
      continue
    }

    console.log(`📤 Subiendo ${t.image}...`)
    const imageUrl = await uploadImage(localPath)
    console.log(`✅ Imagen subida: ${imageUrl}`)

    const result = await pool.query(
      `INSERT INTO therapies (name, description, duration_minutes, price_cents, is_active, image_url, video_url)
       VALUES ($1, $2, $3, $4, true, $5, '')
       RETURNING id`,
      [t.name, t.description, t.duration_minutes, t.price_cents, imageUrl]
    )

    const therapyId = result.rows[0].id
    console.log(`✅ Terapia creada: ${t.name} (${therapyId})`)

    if (t.requirements && t.requirements.length > 0) {
      const values = t.requirements
        .map((_, i) => `($1, $${i + 2})`)
        .join(', ')
      await pool.query(
        `INSERT INTO therapy_requirements (therapy_id, description) VALUES ${values}`,
        [therapyId, ...t.requirements]
      )
      console.log(`   Requisitos: ${t.requirements.length} añadidos`)
    }
  }

  console.log('\n🎉 ¡Todas las terapias han sido creadas!')
  pool.end()
}

main().catch((err) => {
  console.error('Error:', err)
  pool.end()
})
