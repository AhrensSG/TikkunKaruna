export function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m} min` : `${h}h`
  }
  return `${minutes} min`
}

export function centsToEuros(cents: number): string {
  return `${(cents / 100).toFixed(0)} €`
}

export function formatEuro(cents: number): string {
  return (cents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2 }) + ' €'
}

export function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  })
}

export function formatDateShortDot(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).replace(".", "")
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  })
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDateStr(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function formatDateStrShort(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  })
}
