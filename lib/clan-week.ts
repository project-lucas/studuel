// -----------------------------------------------------------------------------
// « Clan hebdo » — la semaine de clan, du lundi au dimanche.
//
// Pourquoi : dans Clash Royale, la rétention à 30 jours ne vient pas du
// gameplay, elle vient du clan. Un élève revient parce que quatre camarades
// comptent sur lui et que la semaine se clôt dimanche soir. C'est le seul
// système de l'app qui crée une obligation SOCIALE plutôt qu'individuelle.
//
// Le clan, ici, c'est l'école (lib/clan) : pas de groupe à créer, pas d'invitation
// à envoyer — l'élève est déjà dans un clan le jour de son inscription.
//
// Convention projet : jours = clés UTC 'YYYY-MM-DD', la semaine commence lundi.
// Pur et testable ; les tables (supabase/204) ne font que stocker.
// -----------------------------------------------------------------------------

// --- Le cycle hebdomadaire -------------------------------------------------------

const DAY_MS = 86_400_000

/** Index du jour dans la semaine, lundi = 0 (convention projet). */
export function weekdayIndex(day: string): number {
  const t = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(t)) return 0
  // getUTCDay : dimanche = 0 → on décale pour que lundi vaille 0.
  return (new Date(t).getUTCDay() + 6) % 7
}

/** La clé de la semaine qui contient ce jour : la clé UTC de SON lundi.
 *  Une seule identité pour toute la semaine — c'est elle qui sert de clé de
 *  regroupement en base et de clé de classement. */
export function weekKeyOf(day: string): string {
  const t = Date.parse(`${day}T00:00:00Z`)
  if (Number.isNaN(t)) return day
  return new Date(t - weekdayIndex(day) * DAY_MS).toISOString().slice(0, 10)
}

/** Bornes d'une semaine : son lundi et son dimanche (clés UTC, inclusives). */
export function weekBounds(weekKey: string): { start: string; end: string } {
  const start = weekKeyOf(weekKey)
  const t = Date.parse(`${start}T00:00:00Z`)
  const end = Number.isNaN(t)
    ? start
    : new Date(t + 6 * DAY_MS).toISOString().slice(0, 10)
  return { start, end }
}

/** Jours restants avant la clôture (dimanche inclus) : 7 le lundi, 1 le
 *  dimanche. Jamais 0 — tant que la semaine court, il reste à jouer. */
export function daysLeftInWeek(today: string): number {
  return 7 - weekdayIndex(today)
}

/** Le compte à rebours affiché sur la carte du clan. L'urgence de la fin de
 *  semaine est le moteur : le dimanche doit se lire différemment du lundi. */
export function countdownLabel(today: string): string {
  const left = daysLeftInWeek(today)
  if (left <= 1) return 'Dernier jour !'
  if (left === 2) return 'Plus que 2 jours'
  return `${left} jours restants`
}

/** La semaine se termine bientôt : la carte passe en rouge et la notification
 *  « ton clan a besoin de toi » se déclenche. */
export function isEndgame(today: string): boolean {
  return daysLeftInWeek(today) <= 2
}

// --- Le barème de contribution ------------------------------------------------------
// Ce que l'élève RAPPORTE à son clan. Volontairement centré sur le duel : la
// boucle principale doit être le premier moyen d'aider les autres.

export type ClanEvent =
  | 'duel_win'
  | 'duel_play'
  | 'session_prepa'
  | 'revision'
  | 'quest_day'

export const CLAN_POINTS: Record<ClanEvent, number> = {
  duel_win: 30, // gagner un duel de 90 s
  duel_play: 10, // le jouer suffit déjà à contribuer — on récompense la présence
  session_prepa: 25, // une session du plan de préparation terminée
  revision: 15, // une révision (file « À revoir ») terminée
  quest_day: 50, // les 3 quêtes du jour bouclées
}

export function clanPointsFor(event: ClanEvent): number {
  return CLAN_POINTS[event] ?? 0
}

/** Plafond quotidien de contribution : au-delà, un élève qui joue six heures
 *  d'affilée porterait son clan à lui seul et retirerait tout enjeu aux autres.
 *  Le clan doit être une somme de présences, pas un exploit solitaire. */
export const DAILY_CONTRIBUTION_CAP = 300

export function cappedContribution(alreadyToday: number, gain: number): number {
  const done = Math.max(0, Math.round(alreadyToday))
  const room = Math.max(0, DAILY_CONTRIBUTION_CAP - done)
  return Math.min(room, Math.max(0, Math.round(gain)))
}

// --- Classement et récompenses --------------------------------------------------

/** Une école dans le classement hebdomadaire des clans. */
export type ClanWeekEntry = {
  schoolId: string
  schoolName: string
  points: number
  members: number
  rank: number
}

/** Ce que l'écran affiche : mon clan, sa place, et le podium. */
export type ClanWeekBoard = {
  weekKey: string
  myClan: ClanWeekEntry | null
  /** Ma contribution personnelle à ce total. */
  myPoints: number
  /** Les meilleurs contributeurs de MON clan (l'émulation entre camarades). */
  topMembers: { id: string; name: string; points: number }[]
  entries: ClanWeekEntry[]
  total: number
}

export type ClanReward = {
  /** Palier atteint — sert d'identité de récompense et de visuel. */
  tier: 'or' | 'argent' | 'bronze' | 'participation' | 'aucune'
  gems: number
  xp: number
  label: string
}

const NO_REWARD: ClanReward = {
  tier: 'aucune',
  gems: 0,
  xp: 0,
  label: 'Contribue pour débloquer le coffre du clan',
}

/** Contribution personnelle minimale pour toucher la récompense de clan : on
 *  ne récolte pas le travail des autres sans avoir joué. */
export const MIN_POINTS_TO_CLAIM = 50

/**
 * La récompense de fin de semaine, selon la place du clan ET la contribution
 * personnelle. Le classement fait le prestige, la contribution fait le droit.
 */
export function clanWeekReward(rank: number | null, myPoints: number): ClanReward {
  if (myPoints < MIN_POINTS_TO_CLAIM || rank === null || rank < 1) return NO_REWARD
  if (rank === 1) {
    return { tier: 'or', gems: 150, xp: 300, label: 'Clan n°1 — coffre d’or' }
  }
  if (rank <= 3) {
    return { tier: 'argent', gems: 90, xp: 200, label: 'Podium — coffre d’argent' }
  }
  if (rank <= 10) {
    return { tier: 'bronze', gems: 50, xp: 120, label: 'Top 10 — coffre de bronze' }
  }
  return {
    tier: 'participation',
    gems: 20,
    xp: 60,
    label: 'Coffre de participation',
  }
}

/** L'accroche de la carte : ce qu'il manque pour monter d'un palier. C'est
 *  l'information qui fait rejouer un dimanche soir. */
export function gapHeadline(board: ClanWeekBoard): string {
  const mine = board.myClan
  if (!mine) return 'Rejoins une école pour jouer avec ton clan.'
  if (mine.rank === 1) return 'Ton clan est en tête. Tiens la position !'
  const above = board.entries.find((e) => e.rank === mine.rank - 1)
  if (!above) return `${mine.points.toLocaleString('fr-FR')} points cette semaine`
  const gap = Math.max(0, above.points - mine.points)
  if (gap === 0) return `À égalité avec ${above.schoolName} !`
  return `${gap.toLocaleString('fr-FR')} points pour doubler ${above.schoolName}`
}

/** Ma part dans le total du clan, en pourcentage entier (0 si le clan est à 0). */
export function myShare(board: ClanWeekBoard): number {
  const total = board.myClan?.points ?? 0
  if (total <= 0) return 0
  return Math.min(100, Math.round((board.myPoints / total) * 100))
}

// --- Normalisation des lignes Supabase ---------------------------------------------

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const int = (v: unknown): number => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.round(n) : 0
}

function normalizeEntry(raw: unknown): ClanWeekEntry | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const schoolId = str(o.school_id)
  if (schoolId.length === 0) return null
  const name = str(o.school_name).trim()
  return {
    schoolId,
    schoolName: name.length > 0 ? name : 'École',
    points: Math.max(0, int(o.points)),
    members: Math.max(0, int(o.members)),
    rank: Math.max(1, int(o.rank)),
  }
}

/** Normalise le JSONB renvoyé par la RPC `clan_week_board`. Robuste aux formes
 *  partielles : un clan absent n'est pas une erreur, c'est un élève sans école. */
export function normalizeClanWeekBoard(raw: unknown, today: string): ClanWeekBoard {
  const o = (raw ?? {}) as Record<string, unknown>
  const entries = Array.isArray(o.entries)
    ? o.entries
        .map(normalizeEntry)
        .filter((e): e is ClanWeekEntry => e !== null)
        .sort((a, b) => a.rank - b.rank)
    : []
  const members = Array.isArray(o.top_members)
    ? o.top_members.flatMap((m) => {
        if (!m || typeof m !== 'object') return []
        const r = m as Record<string, unknown>
        const id = str(r.id)
        if (id.length === 0) return []
        const name = str(r.name).trim()
        return [
          { id, name: name.length > 0 ? name : 'Élève', points: Math.max(0, int(r.points)) },
        ]
      })
    : []
  const weekKey = str(o.week_key)
  return {
    weekKey: weekKey.length > 0 ? weekKey : weekKeyOf(today),
    myClan: normalizeEntry(o.my_clan),
    myPoints: Math.max(0, int(o.my_points)),
    topMembers: members.sort((a, b) => b.points - a.points),
    entries,
    total: Math.max(0, int(o.total)),
  }
}
