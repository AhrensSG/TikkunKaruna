import { escapeHtml } from "@/lib/escape"

export interface BookingDetails {
  userName: string
  userEmail: string
  therapyName: string
  therapyDescription: string
  durationMinutes: number
  dateStr: string
  invoiceNumber?: string
  requirements: string[]
}

function baseHtml(content: string, _preview: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif}
</style>
</head>
<body style="margin:0;padding:0;background:#f4f4f6;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f6;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:520px;background:#fff;border-radius:12px;overflow:hidden;">
        <tr><td style="padding:32px 32px 0 32px;background:linear-gradient(135deg,#4a1a5e,#7b2d8e);text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:600;">TikkunKaruna</h1>
          <p style="color:rgba(255,255,255,.75);margin:4px 0 0 0;font-size:13px;">Terapias Holísticas</p>
        </td></tr>
        <tr><td style="padding:32px;">
          ${content}
        </td></tr>
        <tr><td style="padding:16px 32px;background:#f9f9fb;text-align:center;border-top:1px solid #eee;">
          <p style="margin:0;color:#999;font-size:12px;">TikkunKaruna — Terapias Holísticas</p>
          <p style="margin:4px 0 0 0;color:#bbb;font-size:11px;">Inma · inma@tikkunkaruna.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function therapyDetailsTable(details: BookingDetails): string {
  const reqsHtml = details.requirements.length > 0
    ? `<tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;vertical-align:top;width:100px;">Condiciones</td>
       <td style="padding:8px 12px;"><ul style="margin:0;padding-left:16px;">
         ${details.requirements.map(r => `<li style="margin-bottom:4px;color:#444;font-size:13px;">${escapeHtml(r)}</li>`).join('')}
       </ul></td></tr>`
    : ''

  return `<table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
    <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;width:100px;">Terapia</td>
        <td style="padding:8px 12px;">${escapeHtml(details.therapyName)}</td></tr>
    <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Duración</td>
        <td style="padding:8px 12px;">${details.durationMinutes} min</td></tr>
    <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Fecha y hora</td>
        <td style="padding:8px 12px;">${details.dateStr}</td></tr>
    ${details.therapyDescription ? `<tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;vertical-align:top;">Descripción</td>
        <td style="padding:8px 12px;color:#555;font-size:13px;">${escapeHtml(details.therapyDescription)}</td></tr>` : ''}
    ${details.invoiceNumber ? `<tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Factura</td>
        <td style="padding:8px 12px;">${escapeHtml(details.invoiceNumber)}</td></tr>` : ''}
    ${reqsHtml}
  </table>`
}

export function bookingConfirmationHtml(details: BookingDetails): string {
  const content = `
    <h2 style="color:#4a1a5e;margin:0 0 8px 0;font-size:20px;">¡Reserva confirmada! ✅</h2>
    <p style="color:#555;margin:0 0 4px 0;font-size:14px;">Hola <strong>${escapeHtml(details.userName)}</strong>,</p>
    <p style="color:#555;margin:0 0 16px 0;font-size:14px;">Tu sesión ha sido confirmada. Aquí tienes todos los detalles:</p>
    ${therapyDetailsTable(details)}
    <div style="background:#fff3e0;border-left:4px solid #e67e22;padding:12px 16px;margin:16px 0;border-radius:4px;font-size:13px;color:#666;">
      <strong style="color:#e67e22;">📌 Importante:</strong>
      <p style="margin:6px 0 0 0;">Si necesitas cancelar o reprogramar, por favor avisa con al menos 24 horas de antelación.</p>
    </div>
    <p style="color:#666;font-size:14px;margin:16px 0 0 0;">Gracias por confiar en TikkunKaruna. 🙏</p>
  `
  return baseHtml(content, `Reserva confirmada — ${escapeHtml(details.therapyName)}`)
}

export function reminderHtml(details: BookingDetails): string {
  const content = `
    <h2 style="color:#4a1a5e;margin:0 0 8px 0;font-size:20px;">⏰ Recordatorio de sesión</h2>
    <p style="color:#555;margin:0 0 4px 0;font-size:14px;">Hola <strong>${escapeHtml(details.userName)}</strong>,</p>
    <p style="color:#555;margin:0 0 16px 0;font-size:14px;">Te recordamos que tu sesión comienza en aproximadamente <strong>1 hora</strong>. Aquí tienes los detalles:</p>
    ${therapyDetailsTable(details)}
    <div style="background:#e8f5e9;border-left:4px solid #43a047;padding:12px 16px;margin:16px 0;border-radius:4px;font-size:13px;color:#555;">
      <strong style="color:#2e7d32;">💜 Recuerda:</strong>
      <ul style="margin:6px 0 0 0;padding-left:16px;">
        ${details.requirements.length > 0
          ? details.requirements.map(r => `<li style="margin-bottom:3px;">${escapeHtml(r)}</li>`).join('')
          : '<li>Prepara un espacio tranquilo y cómodo para la sesión</li>'}
        <li>Conéctate 5 minutos antes para evitar retrasos</li>
        <li>Usa auriculares para una mejor experiencia</li>
      </ul>
    </div>
    <p style="color:#666;font-size:14px;margin:16px 0 0 0;">¡Te esperamos! 🙏</p>
  `
  return baseHtml(content, `Recordatorio — ${escapeHtml(details.therapyName)}`)
}

export function welcomeHtml(userName: string): string {
  const content = `
    <h2 style="color:#4a1a5e;margin:0 0 8px 0;font-size:20px;">¡Bienvenida a TikkunKaruna! ✨</h2>
    <p style="color:#555;margin:0 0 4px 0;font-size:14px;">Hola <strong>${escapeHtml(userName)}</strong>,</p>
    <p style="color:#555;margin:0 0 16px 0;font-size:14px;">Gracias por registrarte. Tu camino hacia el bienestar comienza aquí.</p>
    <div style="background:#f3e5f5;border-left:4px solid #7b1fa2;padding:16px;margin:16px 0;border-radius:4px;">
      <p style="margin:0 0 8px 0;color:#4a1a5e;font-weight:600;font-size:14px;">💜 ¿Qué puedes hacer ahora?</p>
      <ul style="margin:0;padding-left:18px;color:#555;font-size:13px;line-height:1.8;">
        <li>Explorar las <strong>terapias disponibles</strong> y elegir la que mejor se adapte a ti</li>
        <li>Reservar tu <strong>primera sesión</strong> en solo unos clics</li>
        <li>Acceder a tu <strong>panel personal</strong> para gestionar tus citas</li>
      </ul>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://tikkunkaruna.com/terapias" style="display:inline-block;background:linear-gradient(135deg,#4a1a5e,#7b2d8e);color:#fff;text-decoration:none;padding:12px 28px;border-radius:24px;font-size:14px;font-weight:600;">Ver terapias disponibles</a>
    </div>
    <p style="color:#888;font-size:12px;margin:16px 0 0 0;">Estas sesiones no sustituyen procesos médicos ni la atención de profesionales de la salud; se trabaja exclusivamente en el campo energético de las personas como complemento al bienestar personal.</p>
  `
  return baseHtml(content, 'Bienvenida a TikkunKaruna')
}

export function adminNewUserStyledHtml(userName: string, userEmail: string): string {
  const now = new Date().toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
  const content = `
    <h2 style="color:#4a1a5e;margin:0 0 8px 0;font-size:20px;">👤 Nuevo registro</h2>
    <p style="color:#555;margin:0 0 16px 0;font-size:14px;">Se ha registrado un nuevo usuario en la plataforma.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;width:100px;">Nombre</td>
          <td style="padding:8px 12px;">${escapeHtml(userName)}</td></tr>
      <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Email</td>
          <td style="padding:8px 12px;">${escapeHtml(userEmail)}</td></tr>
      <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Fecha</td>
          <td style="padding:8px 12px;">${now}</td></tr>
    </table>
  `
  return baseHtml(content, `Nuevo registro — ${escapeHtml(userName)}`)
}

export function adminNewBookingStyledHtml(userName: string, userEmail: string, therapyName: string, dateStr: string): string {
  const content = `
    <h2 style="color:#4a1a5e;margin:0 0 8px 0;font-size:20px;">📅 Nueva reserva</h2>
    <p style="color:#555;margin:0 0 16px 0;font-size:14px;">Se ha recibido una nueva reserva en la plataforma.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
      <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;width:100px;">Cliente</td>
          <td style="padding:8px 12px;">${escapeHtml(userName)}</td></tr>
      <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Email</td>
          <td style="padding:8px 12px;">${escapeHtml(userEmail)}</td></tr>
      <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Terapia</td>
          <td style="padding:8px 12px;">${escapeHtml(therapyName)}</td></tr>
      <tr><td style="padding:8px 12px;background:#f9f9f9;font-weight:600;">Fecha y hora</td>
          <td style="padding:8px 12px;">${dateStr}</td></tr>
    </table>
    <div style="text-align:center;margin:16px 0 0 0;">
      <a href="https://tikkunkaruna.com/admin/bookings" style="display:inline-block;background:linear-gradient(135deg,#4a1a5e,#7b2d8e);color:#fff;text-decoration:none;padding:10px 24px;border-radius:24px;font-size:13px;font-weight:600;">Ver panel de administración</a>
    </div>
  `
  return baseHtml(content, `Nueva reserva — ${escapeHtml(userName)}`)
}
