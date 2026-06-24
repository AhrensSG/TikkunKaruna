export function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function hoursBetween(a: Date, b: Date): number {
  return (a.getTime() - b.getTime()) / 3_600_000
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 3_600_000)
}

export function parseSessionDateTime(dateStr: string, timeStr: string): Date {
  return new Date(`${dateStr}T${timeStr}:00`)
}
