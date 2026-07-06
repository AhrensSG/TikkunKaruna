import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'
import { sendEmail, notifyAdmin, adminNewBookingHtml } from '@/emails'
import { bookingConfirmationHtml } from '@/emails/templates'
import { sendWhatsApp, notifyAdminWhatsApp } from '@/lib/whatsapp'

async function nextInvoiceNumber(): Promise<string> {
  const result = await db.execute(sql`
    SELECT invoice_number FROM invoices ORDER BY created_at DESC LIMIT 1
  `)
  const last = result.rows[0]?.invoice_number as string | undefined
  const year = new Date().getFullYear()
  if (!last) return `TKFAC-${year}-0001`
  const num = parseInt((last.split('-').pop() || '0'), 10)
  return `TKFAC-${year}-${String(num + 1).padStart(4, "0")}`
}

export interface StripeSession {
  id?: string
  metadata?: { booking_id?: string }
  customer_details?: { email?: string; name?: string; phone?: string; address?: { country?: string } }
  amount_total?: number
  currency?: string
}

export async function confirmBookingFromSession(stripeSession: StripeSession) {
  const bookingId = stripeSession.metadata?.booking_id
  if (!bookingId) return

  const existing = await db.execute(sql`
    SELECT id, status, user_id, stripe_session_id FROM bookings WHERE id = ${bookingId}
  `)
  if (existing.rows.length === 0) return
  if (existing.rows[0].status === 'confirmed') return

  const booking = existing.rows[0]
  const country = stripeSession.customer_details?.address?.country || null
  const amount = stripeSession.amount_total ?? 0
  const currency = stripeSession.currency || 'eur'

  const existingPayment = await db.execute(sql`
    SELECT 1 FROM payments WHERE stripe_payment_id = ${stripeSession.id}
  `)
  const paymentExists = existingPayment.rows.length > 0

  const invoiceNumber = await nextInvoiceNumber()

  const result = await db.transaction(async (tx) => {
    await tx.execute(sql`
      UPDATE bookings SET status = 'confirmed', stripe_session_id = ${stripeSession.id}, country = ${country} WHERE id = ${bookingId}
    `)

    await tx.execute(sql`
      UPDATE booking_sessions SET status = 'confirmed' WHERE booking_id = ${bookingId}
    `)

    if (!paymentExists) {
      await tx.execute(sql`
        INSERT INTO payments (booking_id, user_id, amount_cents, currency, status, stripe_payment_id)
        VALUES (${bookingId}, ${booking.user_id}, ${amount}, ${currency}, 'succeeded', ${stripeSession.id})
      `)
      await tx.execute(sql`
        INSERT INTO invoices (booking_id, user_id, invoice_number, amount_cents)
        VALUES (${bookingId}, ${booking.user_id}, ${invoiceNumber}, ${amount})
      `)
    }

    const userResult = await tx.execute(sql`
      SELECT u.email, u.phone, u.name as user_name, t.id as therapy_id, t.name as therapy_name,
             t.description as therapy_description, t.duration_minutes,
             t.is_pack, t.session_duration_minutes,
             b.start_time, b.user_id
      FROM bookings b
      JOIN therapies t ON t.id = b.therapy_id
      JOIN users u ON u.id = b.user_id
      WHERE b.id = ${bookingId}
    `)

    if (userResult.rows.length === 0) return null
    const info = userResult.rows[0] as {
      email: string; phone: string | null; user_name: string; therapy_id: string;
      therapy_name: string; therapy_description: string | null; duration_minutes: number;
      is_pack: boolean; session_duration_minutes: number | null;
      start_time: string; user_id: string;
    }

    const reqsResult = await tx.execute(sql`
      SELECT description FROM therapy_requirements WHERE therapy_id = ${info.therapy_id} ORDER BY sort_order
    `)
    let dateStr: string
    if (info.is_pack) {
      const sessionsResult = await tx.execute(sql`
        SELECT start_time FROM booking_sessions WHERE booking_id = ${bookingId} ORDER BY session_number
      `)
      dateStr = (sessionsResult.rows as { start_time: string }[]).map((s, i) =>
        `Sesión ${i + 1}: ${new Date(s.start_time).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
      ).join('\n')
    } else {
      dateStr = new Date(info.start_time).toLocaleDateString("es-ES", {
        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    }
    return { info, dateStr, invoiceNumber, requirements: (reqsResult.rows as { description: string }[]).map((r) => r.description) }
  })

  if (!result) return
  const { info, dateStr, invoiceNumber: invNum, requirements } = result

  if (!paymentExists) {
    await sendEmail(
      info.email,
      `✅ Reserva confirmada — ${info.therapy_name}`,
      bookingConfirmationHtml({
        userName: info.user_name,
        userEmail: info.email,
        therapyName: info.therapy_name,
        therapyDescription: info.therapy_description || '',
        durationMinutes: info.is_pack && info.session_duration_minutes ? info.session_duration_minutes : info.duration_minutes,
        dateStr,
        invoiceNumber: invNum,
        requirements,
      })
    )

    const waMsg = `✅ *Reserva confirmada — ${info.therapy_name}*\n\nHola ${info.user_name}, tu reserva ha sido confirmada.\n\n📅 ${dateStr.replace(/\n/g, '\n')}\n📄 Factura: ${invNum}\n\nGracias por confiar en TikkunKaruna 💜`
    if (info.phone) sendWhatsApp(info.phone, waMsg)
    notifyAdminWhatsApp(`📅 Nueva reserva: ${info.user_name} — ${info.therapy_name}\n📅 ${dateStr.replace(/\n/g, '\n')}`)

    notifyAdmin(
      `📅 Nueva reserva: ${info.user_name} — ${info.therapy_name}`,
      adminNewBookingHtml(info.user_name, info.email, info.therapy_name, dateStr)
    )
  }
}
