export const BUFFER_MINUTES = 30
export const MIN_HOURS_FROM_NOW = 24
export const MIN_HOURS_BETWEEN_SESSIONS = 24
export const DEFAULT_DURATION_MINUTES = 60
export const STRIPE_CURRENCY = 'eur'
export const MS_PER_MINUTE = 60_000
export const MS_PER_HOUR = 3_600_000
export const MS_PER_DAY = 86_400_000

export const bookingStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-blue-100 text-blue-800',
}

export const bookingStatusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Completada',
}

export const paymentStatusLabels: Record<string, string> = {
  pending: 'Pendiente',
  succeeded: 'Pagado',
  failed: 'Fallido',
  refunded: 'Reembolsado',
}

export const paymentStatusColors: Record<string, string> = {
  Pagado: 'text-green-700 bg-green-100',
  Pendiente: 'text-yellow-700 bg-yellow-100',
  Fallido: 'text-red-700 bg-red-100',
  Reembolsado: 'text-blue-700 bg-blue-100',
}
