// Temps de travail — logique pure de formatage.
// Le temps est mesuré en secondes par le chronomètre du Défi (voir DefiTimer)
// et cumulé sur profiles.work_seconds.

// Les noms français des jours et des mois. Ils vivent ICI parce que trois
// écrans les recopiaient à l'identique (« Mercredi 2 septembre » chez Marcel,
// « il y a 3 jours » dans son historique…) : une seule liste, et l'app parle
// d'une seule voix. `JOURS_FR` est indexé par `Date.getDay()` (0 = dimanche).
export const JOURS_FR = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
] as const

export const MOIS_FR = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
] as const

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

// La date ET l'heure murales de Paris, champ par champ. `formatToParts` plutôt
// qu'un `format` découpé : l'ordre et les séparateurs d'une locale ne sont pas
// un contrat, les `type` des parties le sont.
const PARIS_PARTS = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

/** L'heure murale de Paris à cet instant, relue comme si c'était de l'UTC. */
function parisWallClockMs(date: Date): number {
  const parts = PARIS_PARTS.formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value)
  return Date.UTC(
    part('year'),
    part('month') - 1,
    part('day'),
    part('hour'),
    part('minute'),
    part('second'),
  )
}

/** Décalage de Paris sur UTC à cet instant, en ms (+1 h l'hiver, +2 h l'été). */
function parisOffsetMs(date: Date): number {
  const aLaSeconde = Math.floor(date.getTime() / 1000) * 1000
  return parisWallClockMs(new Date(aLaSeconde)) - aLaSeconde
}

/**
 * Le jour de Paris ('YYYY-MM-DD') à cet instant. ≠ `toDayKey` (lib/streak), qui
 * lit le jour UTC : entre 22 h et minuit l'été, Paris est déjà au lendemain.
 */
export function parisDayKey(date: Date): string {
  return new Date(parisWallClockMs(date)).toISOString().slice(0, 10)
}

/**
 * L'instant de minuit, heure de Paris, du jour `dayKey` ('YYYY-MM-DD').
 * Le décalage est relu À L'INSTANT VISÉ : le samedi et le lundi d'un week-end
 * de changement d'heure n'ont pas le même.
 */
export function minuitParis(dayKey: string): Date {
  const utc = Date.parse(`${dayKey}T00:00:00Z`)
  // Clé illisible : une date invalide, jamais une exception (`formatToParts`
  // jette une RangeError sur un instant NaN).
  if (Number.isNaN(utc)) return new Date(Number.NaN)
  const premier = utc - parisOffsetMs(new Date(utc))
  const decalage = parisOffsetMs(new Date(premier))
  return new Date(utc - decalage)
}

// Format « heures » toujours en h : « 0 h », « 0 h 03 », « 2 h 05 », « 12 h ».
export function formatHours(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, '0')}`
}
