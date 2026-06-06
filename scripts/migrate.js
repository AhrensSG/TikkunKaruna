const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function migrate() {
  const dir = path.join(__dirname, '..', 'migrations')
  const files = fs.readdirSync(dir).sort()

  for (const file of files) {
    if (!file.endsWith('.sql')) continue
    const sql = fs.readFileSync(path.join(dir, file), 'utf8')
    try {
      await pool.query(sql)
      console.log(`✓ ${file}`)
    } catch (err) {
      if (err.code === '42P07' || err.code === '42710') {
        console.log(`- ${file} (already applied)`)
      } else {
        throw err
      }
    }
  }

  console.log('All migrations applied.')
  await pool.end()
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
