import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

interface InvoiceData {
  invoice_number: string
  amount_cents: number
  created_at: string
  therapy_name: string
  user_name: string
  user_email: string
}

export async function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  const doc = await PDFDocument.create()
  const page = doc.addPage()
  const { width } = page.getSize()

  const p = page
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)

  const purple = rgb(0.345, 0.11, 0.529)
  const gold = rgb(0.83, 0.66, 0.33)
  const gray = rgb(0.42, 0.42, 0.42)
  const dark = rgb(0.067, 0.094, 0.153)
  const border = rgb(0.9, 0.9, 0.9)
  const lightBg = rgb(0.976, 0.953, 0.976)

  const margin = 50
  const rightX = width - margin
  const contentWidth = rightX - margin

  // ── Logo ──
  const logoPath = path.join(process.cwd(), 'public', 'LogoC.png')
  const logoBytes = fs.readFileSync(logoPath)
  const logoImage = await doc.embedPng(logoBytes)
  const logoDims = logoImage.scale(0.12)

  let y = page.getHeight() - margin

  // White background behind logo (hides PNG transparency checkerboard)
  const logoPad = 4
  p.drawRectangle({
    x: margin - logoPad,
    y: y - logoDims.height - logoPad,
    width: logoDims.width + logoPad * 2,
    height: logoDims.height + logoPad * 2,
    color: rgb(1, 1, 1),
  })

  // Logo on the left
  p.drawImage(logoImage, {
    x: margin,
    y: y - logoDims.height,
    width: logoDims.width,
    height: logoDims.height,
  })

  // Company name next to logo
  p.drawText('TikkunKaruna', {
    x: margin + logoDims.width + 14,
    y: y - 8,
    size: 20,
    font: bold,
    color: purple,
  })
  p.drawText('Terapias Holísticas · Péndulo Hebreo & Reiki', {
    x: margin + logoDims.width + 14,
    y: y - 28,
    size: 9,
    font,
    color: gray,
  })

  // Invoice number and date on the right
  const invoiceLabel = 'FACTURA'
  const invoiceLabelWidth = bold.widthOfTextAtSize(invoiceLabel, 18)
  p.drawText(invoiceLabel, {
    x: rightX - invoiceLabelWidth,
    y: y - 8,
    size: 18,
    font: bold,
    color: gold,
  })

  const invNumWidth = font.widthOfTextAtSize(data.invoice_number, 10)
  p.drawText(data.invoice_number, {
    x: rightX - invNumWidth,
    y: y - 26,
    size: 10,
    font: bold,
    color: dark,
  })

  const dateStr = new Date(data.created_at).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const dateWidth = font.widthOfTextAtSize(dateStr, 9)
  p.drawText(dateStr, {
    x: rightX - dateWidth,
    y: y - 40,
    size: 9,
    font,
    color: gray,
  })

  y -= logoDims.height + 30

  // ── Divider ──
  p.drawLine({ start: { x: margin, y }, end: { x: rightX, y }, thickness: 2, color: purple })
  y -= 20

  // ── Sender info ──
  p.drawText('TikkunKaruna', { x: margin, y, size: 9, font: bold, color: purple })
  y -= 12
  p.drawText('Inma — Terapeuta Holística', { x: margin, y, size: 8, font, color: gray })
  y -= 12
  p.drawText('hola@tikkunkaruna.com', { x: margin, y, size: 8, font, color: gray })
  y -= 12
  p.drawText('España', { x: margin, y, size: 8, font, color: gray })

  // ── Bill to (right side) ──
  const billX = margin + contentWidth - 180
  p.drawText('FACTURAR A', { x: billX, y: y + 48, size: 9, font: bold, color: purple })
  p.drawText(data.user_name, { x: billX, y: y + 36, size: 9, font: bold, color: dark })
  p.drawText(data.user_email, { x: billX, y: y + 24, size: 8, font, color: gray })

  y -= 30

  // ── Separator ──
  p.drawLine({ start: { x: margin, y }, end: { x: rightX, y }, thickness: 1, color: border })
  y -= 16

  // ── Table header ──
  p.drawRectangle({
    x: margin,
    y: y - 12,
    width: contentWidth,
    height: 24,
    color: purple,
  })
  p.drawText('DESCRIPCIÓN', { x: margin + 12, y: y - 3, size: 9, font: bold, color: rgb(1, 1, 1) })
  p.drawText('CANT', { x: margin + 340, y: y - 3, size: 9, font: bold, color: rgb(1, 1, 1) })
  p.drawText('IMPORTE', { x: rightX - 80, y: y - 3, size: 9, font: bold, color: rgb(1, 1, 1) })

  y -= 30

  // ── Table row (alternating background) ──
  p.drawRectangle({
    x: margin,
    y: y - 10,
    width: contentWidth,
    height: 24,
    color: lightBg,
  })
  p.drawText(data.therapy_name, { x: margin + 12, y: y - 1, size: 9, font, color: dark })
  p.drawText('1', { x: margin + 345, y: y - 1, size: 9, font, color: dark })
  p.drawText(`${(data.amount_cents / 100).toFixed(2)} €`, { x: rightX - 80, y: y - 1, size: 9, font, color: dark })

  y -= 30

  // ── Total row ──
  p.drawLine({ start: { x: margin, y }, end: { x: rightX, y }, thickness: 2, color: purple })
  y -= 18

  const totalLabel = 'TOTAL'
  p.drawText(totalLabel, { x: margin, y, size: 14, font: bold, color: purple })
  const totalAmount = `${(data.amount_cents / 100).toFixed(2)} €`
  const totalWidth = bold.widthOfTextAtSize(totalAmount, 14)
  p.drawText(totalAmount, { x: rightX - totalWidth, y, size: 14, font: bold, color: purple })

  y -= 30

  // ── Payment info ──
  p.drawLine({ start: { x: margin, y }, end: { x: rightX, y }, thickness: 1, color: border })
  y -= 14
  p.drawText('Método de pago: Tarjeta de crédito/débito (Stripe)', { x: margin, y, size: 8, font, color: gray })
  y -= 12
  p.drawText('Pagado en su totalidad', { x: margin, y, size: 8, font, color: gray })

  // ── Footer ──
  y = 80
  p.drawLine({ start: { x: margin, y }, end: { x: rightX, y }, thickness: 1, color: border })
  y -= 14
  p.drawText('TikkunKaruna · hola@tikkunkaruna.com · www.tikkunkaruna.com', {
    x: margin, y, size: 8, font, color: gray,
  })
  p.drawText('Gracias por confiar en nosotros.', {
    x: margin + contentWidth - 130, y, size: 8, font, color: gray,
  })

  const pdfBytes = await doc.save()
  return Buffer.from(pdfBytes)
}
