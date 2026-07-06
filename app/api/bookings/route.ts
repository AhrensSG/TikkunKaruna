import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { bookings as bookingsTable, therapies, payments, therapyRequirements, bookingSessions } from '@/lib/db/schema'
import { auth } from '@/lib/auth.config'
import { eq, sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const rows = await db
    .select({
      id: bookingsTable.id,
      start_time: bookingsTable.startTime,
      end_time: bookingsTable.endTime,
      status: bookingsTable.status,
      therapy_name: therapies.name,
      price_cents: therapies.priceCents,
      amount_cents: payments.amountCents,
      payment_status: payments.status,
      admin_notes: bookingsTable.adminNotes,
      requirements: sql`COALESCE(json_agg(${therapyRequirements.description} ORDER BY ${therapyRequirements.sortOrder}) FILTER (WHERE ${therapyRequirements.description} IS NOT NULL), '[]')`,
    })
    .from(bookingsTable)
    .innerJoin(therapies, eq(bookingsTable.therapyId, therapies.id))
    .leftJoin(payments, eq(payments.bookingId, bookingsTable.id))
    .leftJoin(therapyRequirements, eq(therapyRequirements.therapyId, therapies.id))
    .where(eq(bookingsTable.userId, session.user.id))
    .groupBy(bookingsTable.id, therapies.name, therapies.priceCents, payments.amountCents, payments.status)
    .orderBy(sql`${bookingsTable.startTime} DESC`)

  const result = []
  for (const row of rows) {
    const sessions = await db
      .select({
        id: bookingSessions.id,
        session_number: bookingSessions.sessionNumber,
        start_time: bookingSessions.startTime,
        end_time: bookingSessions.endTime,
        status: bookingSessions.status,
      })
      .from(bookingSessions)
      .where(eq(bookingSessions.bookingId, row.id))
      .orderBy(bookingSessions.sessionNumber)

    result.push({ ...row, sessions })
  }

  return NextResponse.json({ bookings: result })
}
