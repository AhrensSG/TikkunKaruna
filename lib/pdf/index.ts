import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

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
  const gray = rgb(0.42, 0.42, 0.42)
  const dark = rgb(0.067, 0.094, 0.153)
  const border = rgb(0.9, 0.9, 0.9)

  const margin = 50
  const rightX = width - margin
  const contentWidth = rightX - margin

  let y = page.getHeight() - margin

  // Header
  p.drawText('TikkunKaruna', { x: margin, y, size: 24, font: bold, color: purple })
  y -= 20
  p.drawText('Terapias Holísticas · Péndulo Hebreo & Reiki', { x: margin, y, size: 10, font, color: gray })
  y -= 10

  // Line
  p.drawLine({ start: { x: margin, y }, end: { x: rightX, y }, thickness: 2, color: purple })
  y -= 25

  // Invoice title
  p.drawText('FACTURA', { x: margin, y, size: 18, font: bold, color: purple })
  y -= 16
  p.drawText(`Nº ${data.invoice_number}`, { x: margin, y, size: 10, font, color: gray })

  p.drawText(
    `Fecha: ${new Date(data.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    { x: margin, y, size: 10, font, color: gray }
  )
  y -= 30

  // Separator
  p.drawLine({ start: { x: margin, y }, end: { x: rightX, y }, thickness: 1, color: border })
  y -= 20

  // Client section
  p.drawText('Cliente', { x: margin, y, size: 11, font: bold, color: dark })
  y -= 14
  p.drawText(data.user_name, { x: margin, y, size: 10, font, color: dark })
  y -= 14
  p.drawText(data.user_email, { x: margin, y, size: 10, font, color: dark })

  // Therapy on right side
  p.drawText('Terapia', { x: margin + contentWidth - 150, y: y + 28, size: 11, font: bold, color: dark })
  p.drawText(data.therapy_name, { x: margin + contentWidth - 150, y: y + 14, size: 10, font, color: dark })

  y -= 30

  // Table header
  p.drawLine({ start: { x: margin, y }, end: { x: rightX, y }, thickness: 1, color: border })
  y -= 14

  p.drawText('Concepto', { x: margin, y, size: 9, font: bold, color: gray })
  p.drawText('Cant.', { x: margin + 200, y, size: 9, font: bold, color: gray })
  p.drawText('Importe', { x: rightX - 80, y, size: 9, font: bold, color: gray })
  y -= 14

  p.drawLine({ start: { x: margin, y }, end: { x: rightX, y }, thickness: 1, color: border })
  y -= 18

  // Table row
  p.drawText(data.therapy_name, { x: margin, y, size: 10, font, color: dark })
  p.drawText('1', { x: margin + 200, y, size: 10, font, color: dark })
  p.drawText(`${(data.amount_cents / 100).toFixed(2)} €`, { x: rightX - 80, y, size: 10, font, color: dark })
  y -= 30

  // Total
  p.drawLine({ start: { x: margin, y }, end: { x: rightX, y }, thickness: 1, color: border })
  y -= 18

  p.drawText('Total', { x: margin, y, size: 12, font: bold, color: purple })
  p.drawText(`${(data.amount_cents / 100).toFixed(2)} €`, { x: rightX - 80, y, size: 12, font: bold, color: purple })

  // Footer
  y = 80
  p.drawLine({ start: { x: margin, y }, end: { x: rightX, y }, thickness: 1, color: border })
  y -= 14
  p.drawText('TikkunKaruna · www.tikkunkaruna.com', { x: margin, y, size: 8, font, color: gray })
  p.drawText('Gracias por confiar en nosotros.', { x: margin + contentWidth - 150, y, size: 8, font, color: gray })

  const pdfBytes = await doc.save()
  return Buffer.from(pdfBytes)
}
