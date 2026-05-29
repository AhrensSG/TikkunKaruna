import { config } from 'fs'
import { readFileSync } from 'fs'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

// Carga manual de .env.local para scripts fuera del contexto de Next.js
const envFile = new URL('../.env.local', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
for (const line of readFileSync(envFile, 'utf8').split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function seedAdmin() {
  const email = 'admin@tikkunkaruna.com'
  const password = 'Admin1234!'

  const hash = await bcrypt.hash(password, 10)

  await pool.query(
    `INSERT INTO users (name, email, phone, password, role)
     VALUES ($1, $2, '', $3, 'admin')
     ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password, role = 'admin'`,
    ['Administrador', email, hash]
  )

  console.log(`Admin creado: ${email} / ${password}`)
  await pool.end()
}

seedAdmin().catch((err) => {
  console.error(err)
  process.exit(1)
})
