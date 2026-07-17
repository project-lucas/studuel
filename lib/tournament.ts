// Tournoi des écoles du week-end — logique pure, sans React ni Supabase.
// Chaque week-end (samedi 00:00 → lundi 00:00, en UTC comme toutes les clés de
// jour de l'app), les élèves marquent des points (XP de leurs défis) pour leur
// école-clan. Ici : la fenêtre courante, les libellés d'état et la
// normalisation du classement renvoyé par l'RPC `school_tournament_standings`
// (migration 162).

export interface SchoolStanding {
  schoolId: string
  name: string
  city: string | null
  /** Points du tournoi (XP cumulés des élèves de l'école sur le week-end). */
  points: number
  /** Nombre d'élèves ayant marqué. */
  students: number
  rank: number
}

function parseKey(dayKey: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return null
  const d = new Date(`${dayKey}T00:00:00Z`)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * Libellé d'état en français : pendant le week-end « Dernier jour ! » /
 * « Jusqu'à dimanche soir », sinon le compte à rebours vers samedi.
 */
export function tournamentStatusLabel(todayKey: string): string {
  const today = parseKey(todayKey)
  if (!today) return 'Chaque week-end'
  const weekday = (today.getUTCDay() + 6) % 7

  if (weekday === 5) return "En cours — jusqu'à dimanche soir"
  if (weekday === 6) return 'En cours — dernier jour !'
  const days = 5 - weekday
  return days === 1 ? 'Commence demain' : `Commence dans ${days} jours`
}

/**
 * Normalise les entrées du classement des écoles (souvent `unknown` côté
 * Supabase). Trie par points décroissants et (re)calcule les rangs 1..n ;
 * les lignes invalides sont ignorées.
 */
export function normalizeTournamentStandings(rows: unknown): SchoolStanding[] {
  if (!Array.isArray(rows)) return []
  const clean = rows.flatMap((r): Omit<SchoolStanding, 'rank'>[] => {
    const o = r as Record<string, unknown>
    const schoolId = String(o?.school_id ?? '')
    const name = String(o?.name ?? '').trim()
    const points = Number(o?.points)
    if (!schoolId || !name || !Number.isFinite(points)) return []
    const students = Number(o?.students)
    const city = String(o?.city ?? '').trim()
    return [
      {
        schoolId,
        name,
        city: city || null,
        points: Math.max(0, Math.round(points)),
        students:
          Number.isFinite(students) && students > 0 ? Math.round(students) : 0,
      },
    ]
  })
  clean.sort(
    (a, b) => b.points - a.points || (a.schoolId < b.schoolId ? -1 : 1),
  )
  return clean.map((e, i) => ({ ...e, rank: i + 1 }))
}

export interface TournamentBoard {
  /** Clé du samedi du tournoi affiché (`YYYY-MM-DD`), ou null si inconnue. */
  tournamentStart: string | null
  /** Vrai si le tournoi est en cours (week-end), faux = résultats du dernier. */
  isOpen: boolean
  /** Mon école, pour surligner sa ligne (null si pas de clan choisi). */
  mySchoolId: string | null
  standings: SchoolStanding[]
}

/**
 * Normalise le JSONB de l'RPC `school_tournament_standings` (migration 162).
 * Renvoie null si la donnée est absente/illisible (migration pas passée,
 * visiteur…) — l'appelant retombe alors sur la vitrine mockée.
 */
export function normalizeTournamentBoard(data: unknown): TournamentBoard | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null
  const o = data as Record<string, unknown>
  const start = String(o?.tournament_start ?? '')
  return {
    tournamentStart: /^\d{4}-\d{2}-\d{2}$/.test(start) ? start : null,
    isOpen: o?.is_open === true,
    mySchoolId: o?.my_school_id ? String(o.my_school_id) : null,
    standings: normalizeTournamentStandings(o?.entries),
  }
}
