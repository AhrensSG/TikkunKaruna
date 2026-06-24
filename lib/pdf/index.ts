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
  therapy_price_cents?: number
  therapy_duration_minutes?: number
  country?: string | null
}

export async function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
  const doc = await PDFDocument.create()
  const page = doc.addPage([595.28, 841.89])
  const { width, height } = page.getSize()

  const sans = await doc.embedFont(StandardFonts.Helvetica)
  const sansBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const serif = await doc.embedFont(StandardFonts.TimesRoman)
  const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold)

  const text = rgb(0.15, 0.15, 0.15)
  const muted = rgb(0.55, 0.55, 0.55)
  const purple = rgb(0.42, 0.247, 0.627)
  const gold = rgb(0.722, 0.565, 0.165)
  const line = rgb(0.88, 0.88, 0.88)
  const green = rgb(0.18, 0.49, 0.196)
  const white = rgb(1, 1, 1)
  const creamBg = rgb(0.988, 0.984, 0.976)

  const mL = 55
  const mR = 55
  const cw = width - mL - mR

  const totalCents = data.amount_cents
  const isSpain = data.country === 'ES'
  const baseCents = isSpain ? Math.round(totalCents / 1.21) : totalCents
  const ivaCents = isSpain ? totalCents - baseCents : 0

  const fmt = (c: number) => `${(c / 100).toFixed(2).replace('.', ',')} \u20AC`
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

  const logoPath = path.join(process.cwd(), 'public', 'LogoC.png')
  let logo: { img: any; w: number; h: number } | null = null
  try {
    const bytes = fs.readFileSync(logoPath)
    const img = await doc.embedPng(bytes)
    const d = img.scale(0.035)
    logo = { img, w: d.width, h: d.height }
  } catch {}

  // ── Top accent ──
  page.drawRectangle({ x: 0, y: height - 110, width, height: 110, color: creamBg })
  page.drawLine({
    start: { x: 0, y: height - 4 },
    end: { x: width, y: height - 4 },
    thickness: 2, color: gold,
  })
  page.drawLine({
    start: { x: 0, y: height - 7 },
    end: { x: width, y: height - 7 },
    thickness: 0.5, color: purple,
  })

  let y = height - 36

  // ── LEFT: Logo + brand ──
  if (logo) {
    page.drawRectangle({ x: mL, y: y - logo.h, width: logo.w, height: logo.h, color: white })
    page.drawImage(logo.img, { x: mL, y: y - logo.h, width: logo.w, height: logo.h })
  }

  const bx = mL + (logo ? logo.w + 12 : 0)
  page.drawText('Tikkun Karuna', { x: bx, y: y - 2, size: 18, font: serifBold, color: purple })
  page.drawText('Terapia Hol\u00EDstica Integrativa', { x: bx, y: y - 20, size: 9, font: sansBold, color: gold })
  page.drawText('Sunnafreyr18 Group SL', { x: bx, y: y - 36, size: 9, font: sans, color: muted })
  page.drawText('CIF B23897952  \u00B7  Carrer de les Barques 2, piso 2, 46002 Valencia', {
    x: bx, y: y - 50, size: 9, font: sans, color: muted,
  })

  // ── RIGHT: Invoice meta ──
  const rx = width - mR
  page.drawText('Factura', {
    x: rx - serif.widthOfTextAtSize('Factura', 28), y, size: 28, font: serif, color: purple,
  })
  page.drawText(data.invoice_number, {
    x: rx - sans.widthOfTextAtSize(data.invoice_number, 10), y: y - 32, size: 10, font: sansBold, color: gold,
  })
  page.drawText(fmtDate(data.created_at), {
    x: rx - sans.widthOfTextAtSize(fmtDate(data.created_at), 9), y: y - 46, size: 9, font: sans, color: muted,
  })

  y -= Math.max(logo?.h ?? 0, 70)

  // ── Separator ──
  page.drawLine({ start: { x: mL, y }, end: { x: width - mR, y }, thickness: 1, color: line })
  y -= 22

  // ── PARTIES ──
  const partiesTop = y

  page.drawText('EMISOR', { x: mL, y, size: 8, font: sansBold, color: purple })
  y -= 16
  page.drawText('Sunnafreyr18 Group SL', { x: mL, y, size: 12, font: serifBold, color: text })
  y -= 16
  page.drawText('CIF B23897952', { x: mL, y, size: 10, font: sans, color: muted })
  y -= 14
  page.drawText('Carrer de les Barques 2, piso 2', { x: mL, y, size: 10, font: sans, color: muted })
  y -= 14
  page.drawText('46002 Valencia, Valencia', { x: mL, y, size: 10, font: sans, color: muted })

  const cx = mL + cw * 0.5 + 10
  let cy = partiesTop
  page.drawText('CLIENTE', { x: cx, y: cy, size: 8, font: sansBold, color: purple })
  cy -= 16
  page.drawText(data.user_name, { x: cx, y: cy, size: 12, font: serifBold, color: text })
  cy -= 16
  page.drawText(data.user_email, { x: cx, y: cy, size: 10, font: sans, color: muted })

  y = Math.min(y, cy) - 20

  // ── Separator ──
  page.drawLine({ start: { x: mL, y }, end: { x: width - mR, y }, thickness: 1, color: line })
  y -= 18

  // ── SERVICES ──
  page.drawText('SERVICIOS', { x: mL, y, size: 8, font: sansBold, color: purple })
  y -= 16

  const colDesc = mL + 8
  const colQty = mL + cw * (isSpain ? 0.62 : 0.70)
  const colUnit = mL + cw * (isSpain ? 0.74 : 0.84)
  const colIva = mL + cw * 0.86
  const colTotal = mL + cw - 8

  const rt = (t: string, x: number) => {
    page.drawText(t, { x: x - sansBold.widthOfTextAtSize(t, 9), y, size: 9, font: sansBold, color: purple })
  }

  page.drawText('Descripci\u00F3n', { x: colDesc, y, size: 9, font: sansBold, color: purple })
  rt('Cant.', colQty)
  rt(isSpain ? 'Precio' : 'Importe', colUnit)
  if (isSpain) rt('IVA', colIva)
  rt('Total', colTotal)

  y -= 4
  page.drawLine({ start: { x: mL, y }, end: { x: width - mR, y }, thickness: 1, color: line })
  y -= 16

  const dur = data.therapy_duration_minutes ?? 60
  page.drawText(data.therapy_name, { x: colDesc, y, size: 11, font: sans, color: text })
  page.drawText(`Sesi\u00F3n individual \u2014 ${dur} min`, { x: colDesc, y: y - 14, size: 9, font: sans, color: muted })

  const rtd = (t: string, x: number) => {
    page.drawText(t, { x: x - sans.widthOfTextAtSize(t, 10), y: y + 2, size: 10, font: sans, color: text })
  }
  rtd('1', colQty)
  rtd(fmt(isSpain ? baseCents : totalCents), colUnit)
  if (isSpain) rtd(fmt(ivaCents), colIva)
  rtd(fmt(totalCents), colTotal)

  y -= 28
  page.drawLine({ start: { x: mL, y }, end: { x: width - mR, y }, thickness: 1, color: line })
  y -= 18

  // ── TOTALS ──
  const tx = mL + cw * 0.52
  const tVx = mL + cw - 8

  const totalRow = (label: string, cents: number, isTotal: boolean) => {
    const f = isTotal ? serifBold : sans
    const fs = isTotal ? 14 : 10
    const fc = isTotal ? purple : muted
    const vf = isTotal ? serifBold : sans
    const vfs = isTotal ? 16 : 10
    const vfc = isTotal ? purple : text
    const val = fmt(cents)
    page.drawText(label, { x: tx, y, size: fs, font: f, color: fc })
    page.drawText(val, { x: tVx - vf.widthOfTextAtSize(val, vfs), y, size: vfs, font: vf, color: vfc })
  }

  if (isSpain) {
    totalRow('Base imponible', baseCents, false)
    y -= 16
    totalRow('IVA (21%)', ivaCents, false)
    y -= 10
    page.drawLine({ start: { x: tx, y }, end: { x: tVx, y }, thickness: 1, color: line })
    y -= 18
    totalRow('Total', totalCents, true)
  } else {
    totalRow('Total', totalCents, true)
  }

  y -= 28

  // ── PAYMENT ──
  page.drawLine({ start: { x: mL, y }, end: { x: width - mR, y }, thickness: 1, color: line })
  y -= 14
  page.drawText('FORMA DE PAGO', { x: mL, y, size: 8, font: sansBold, color: purple })
  y -= 14
  page.drawText('Tarjeta bancaria (Stripe)', { x: mL, y, size: 10, font: sans, color: text })
  page.drawText('Pago recibido con anterioridad a la emisi\u00F3n de esta factura', {
    x: mL, y: y - 14, size: 9, font: sans, color: muted,
  })
  if (!isSpain) {
    y -= 14
    const ivaNote = data.country
      ? `Operaci\u00F3n no sujeta a IVA (art. 69 LIVA) — cliente en ${data.country}`
      : 'Operaci\u00F3n no sujeta a IVA (art. 69 LIVA)'
    page.drawText(ivaNote, { x: mL, y, size: 8, font: sans, color: muted })
  }

  const pagado = 'Pagado'
  page.drawText(pagado, {
    x: width - mR - serifBold.widthOfTextAtSize(pagado, 14),
    y: y - 4, size: 14, font: serifBold, color: green,
  })

  y -= 36

  // ── FOOTER ──
  page.drawLine({ start: { x: mL, y }, end: { x: width - mR, y }, thickness: 1, color: line })
  y -= 2
  page.drawLine({ start: { x: mL + cw * 0.35, y }, end: { x: width - mR - cw * 0.35, y }, thickness: 0.5, color: purple })
  y -= 14

  const footerText = 'TikkunKaruna.com  \u00B7  Sunnafreyr18 Group SL  \u00B7  CIF B23897952  \u00B7  Valencia, Espa\u00F1a'
  page.drawText(footerText, {
    x: width / 2 - sans.widthOfTextAtSize(footerText, 8) / 2,
    y, size: 8, font: sans, color: muted,
  })

  const pdfBytes = await doc.save()
  return Buffer.from(pdfBytes)
}
