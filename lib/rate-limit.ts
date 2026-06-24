import pool from '@/lib/db'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const defaults: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 60_000,
}

export async function checkRateLimit(
  identifier: string,
  action: string,
  config: Partial<RateLimitConfig> = {}
): Promise<{ allowed: boolean; remaining: number }> {
  const { maxRequests, windowMs } = { ...defaults, ...config }
  const windowStart = new Date(Date.now() - windowMs)

  await pool.query(
    `DELETE FROM rate_limits WHERE expires_at < NOW()`
  )

  const { rows } = await pool.query(
    `SELECT COUNT(*) as count FROM rate_limits
     WHERE identifier = $1 AND action = $2 AND created_at >= $3`,
    [identifier, action, windowStart]
  )

  const count = parseInt(rows[0].count, 10)

  if (count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  const expiresAt = new Date(Date.now() + windowMs)
  await pool.query(
    `INSERT INTO rate_limits (identifier, action, expires_at) VALUES ($1, $2, $3)`,
    [identifier, action, expiresAt]
  )

  return { allowed: true, remaining: maxRequests - count - 1 }
}
