export function getEffectiveDuration(therapy: {
  is_pack: boolean
  session_duration_minutes?: number | null
  duration_minutes: number
} | {
  isPack: boolean
  sessionDurationMinutes?: number | null
  durationMinutes: number
}): number {
  if ('isPack' in therapy) {
    return therapy.isPack && therapy.sessionDurationMinutes
      ? therapy.sessionDurationMinutes
      : therapy.durationMinutes
  }
  return therapy.is_pack && therapy.session_duration_minutes
    ? therapy.session_duration_minutes
    : therapy.duration_minutes
}
