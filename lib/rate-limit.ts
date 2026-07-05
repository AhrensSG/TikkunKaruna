import { db } from '@/lib/db'
import { rateLimits } from '@/lib/db/schema'
import { and, eq, gte, sql, lt } from 'drizzle-orm'

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

  await db.delete(rateLimits).where(
    lt(rateLimits.expiresAt, new Date())
  )

  const [row] = await db
    .select({ count: sql<number>`COUNT(*)::int` })
    .from(rateLimits)
    .where(
      and(
        eq(rateLimits.identifier, identifier),
        eq(rateLimits.action, action),
        gte(rateLimits.createdAt, windowStart),
      )
    )

  const count = row?.count ?? 0

  if (count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  const expiresAt = new Date(Date.now() + windowMs)
  await db.insert(rateLimits).values({
    identifier,
    action,
    expiresAt,
    createdAt: new Date(),
  })

  return { allowed: true, remaining: maxRequests - count - 1 }
}
