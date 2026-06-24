export function getEffectiveDuration(therapy: {
  is_pack: boolean
  session_duration_minutes?: number | null
  duration_minutes: number
}): number {
  return therapy.is_pack && therapy.session_duration_minutes
    ? therapy.session_duration_minutes
    : therapy.duration_minutes
}
