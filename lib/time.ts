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

// -----------------------------------------------------------------------------
// Heure « élève ». Tout ce qui est destiné à l'élève (créneaux de trajet, heure
// d'un rappel) se lit en Europe/Paris : le serveur, lui, tourne en UTC, et le
// décalage change deux fois par an. Une conversion implicite dérive donc d'une
// heure entre mars et octobre.
// -----------------------------------------------------------------------------

const PARIS_TIME = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23', // jamais « 24:xx » à minuit
})

/** Heure et minute de Paris correspondant à un instant donné. */
export function parisHourMinute(date: Date): { hour: number; minute: number } {
  const [hour, minute] = PARIS_TIME.format(date).split(':').map(Number)
  return { hour, minute }
}

// Format « heures » toujours en h : « 0 h », « 0 h 03 », « 2 h 05 », « 12 h ».
export function formatHours(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`
}
