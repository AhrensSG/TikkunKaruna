import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateInvoicePdf } from '@/lib/pdf'
import { requireAdmin } from '@/lib/auth-helpers'
import { sql } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  try {
    const { id } = await params

    const result = await db.execute(sql`
      SELECT i.*, t.name AS therapy_name, t.price_cents AS therapy_price_cents, t.duration_minutes AS therapy_duration_minutes, u.name AS user_name, u.email AS user_email, b.country
      FROM invoices i
      JOIN bookings b ON b.id = i.booking_id
      JOIN therapies t ON t.id = b.therapy_id
      JOIN users u ON u.id = i.user_id
      WHERE i.id = ${id}
    `)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 })
    }

    const inv = result.rows[0] as {
      invoice_number: string; amount_cents: number; created_at: string;
      therapy_name: string; user_name: string; user_email: string;
      therapy_price_cents: number; therapy_duration_minutes: number; country: string | null;
    }

    const pdfBuffer = await generateInvoicePdf({
      invoice_number: inv.invoice_number,
      amount_cents: inv.amount_cents,
      created_at: inv.created_at,
      therapy_name: inv.therapy_name,
      user_name: inv.user_name,
      user_email: inv.user_email,
      therapy_price_cents: inv.therapy_price_cents,
      therapy_duration_minutes: inv.therapy_duration_minutes,
      country: inv.country,
    })

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="factura-${inv.invoice_number}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating admin invoice PDF:', error)
    return NextResponse.json({ error: 'Error al generar la factura' }, { status: 500 })
  }
}
