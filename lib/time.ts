// Temps de travail — logique pure de formatage.
// Le temps est mesuré en secondes par le chronomètre du Défi (voir DefiTimer)
// et cumulé sur profiles.work_seconds.

// Formate une durée en minutes : « 45 min », « 3 h », « 12 h 05 ».
export function formatDuration(minutes: number): string {
  const total = Math.max(0, Math.round(minutes))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${String(m).padStart(2, '0')}`
}

// Formate une durée en secondes ; en dessous d'une minute, message doux.
export function formatDurationFromSeconds(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  if (s < 60) return 'moins d’1 min'
  return formatDuration(Math.floor(s / 60))
}

// Format « heures » toujours en h : « 0 h », « 0 h 03 », « 2 h 05 », « 12 h ».
export function formatHours(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`
}
