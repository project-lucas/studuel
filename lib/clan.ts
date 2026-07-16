// -----------------------------------------------------------------------------
// « Écoles = clans » — chaque élève appartient à une école qui fait office de
// clan ; le classement du Défi se décline par école. Un élève a une école de
// COLLÈGE et/ou de LYCÉE ; le clan ACTIF est celui de son cycle courant (dérivé
// de sa classe). Données dans schools + profiles.college_school_id /
// lycee_school_id (migration 159). Logique pure et testable (convention projet).
// -----------------------------------------------------------------------------

export type SchoolLevel = 'college' | 'lycee'

export const SCHOOL_LEVELS: readonly SchoolLevel[] = ['college', 'lycee']

export const SCHOOL_LEVEL_LABEL: Record<SchoolLevel, string> = {
  college: 'Collège',
  lycee: 'Lycée',
}

// Classes de lycée (2de, 1re, Tle) ; tout le reste (collège 6e→3e, ou inconnu)
// retombe côté collège, cycle d'entrée.
const LYCEE_GRADES = new Set(['2de', '1re', 'Tle'])

// Le cycle (donc le clan) correspondant à une classe. Par défaut collège.
export function schoolLevelForGrade(grade: string | null | undefined): SchoolLevel {
  if (typeof grade !== 'string') return 'college'
  return LYCEE_GRADES.has(grade) ? 'lycee' : 'college'
}

export function isSchoolLevel(v: unknown): v is SchoolLevel {
  return v === 'college' || v === 'lycee'
}

export type School = {
  id: string
  name: string
  city: string | null
  level: SchoolLevel
}

export type ClanEntry = {
  id: string
  name: string
  trophies: number
  rank: number
}

// Un classement (clan ou national) : le podium (top N) + ma position globale.
export type Ranking = {
  schoolId: string | null // null pour le national ou sans école
  schoolName: string | null
  myRank: number | null // ma place (peut être hors du top affiché)
  total: number // nombre de joueurs classés
  entries: ClanEntry[]
}

const str = (v: unknown): string => (typeof v === 'string' ? v : '')
const int = (v: unknown): number => {
  const n = Number(v)
  return Number.isFinite(n) ? Math.round(n) : 0
}

export function normalizeSchool(raw: unknown): School | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const id = str(o.id)
  const name = str(o.name).trim()
  if (id.length === 0 || name.length === 0 || !isSchoolLevel(o.level)) return null
  const city = str(o.city).trim()
  return { id, name, city: city.length > 0 ? city : null, level: o.level }
}

export function normalizeSchoolList(raw: unknown): School[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map(normalizeSchool)
    .filter((s): s is School => s !== null)
}

function normalizeEntry(raw: unknown): ClanEntry | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  const id = str(o.id)
  const name = str(o.name).trim()
  if (id.length === 0) return null
  return {
    id,
    name: name.length > 0 ? name : 'Élève',
    trophies: Math.max(0, int(o.trophies)),
    rank: Math.max(1, int(o.rank)),
  }
}

// Normalise le JSONB renvoyé par clan_ranking / national_ranking. Robuste aux
// formes partielles (école absente → schoolId null, entries vide).
export function normalizeRanking(raw: unknown): Ranking {
  const o = (raw ?? {}) as Record<string, unknown>
  const schoolId = str(o.school_id)
  const schoolName = str(o.school_name).trim()
  const entries = Array.isArray(o.entries)
    ? o.entries
        .map(normalizeEntry)
        .filter((e): e is ClanEntry => e !== null)
        .sort((a, b) => a.rank - b.rank)
    : []
  const myRankRaw = o.my_rank
  return {
    schoolId: schoolId.length > 0 ? schoolId : null,
    schoolName: schoolName.length > 0 ? schoolName : null,
    myRank:
      myRankRaw === null || myRankRaw === undefined ? null : Math.max(1, int(myRankRaw)),
    total: Math.max(0, int(o.total)),
    entries,
  }
}

// « 1er », « 2e », « 12e »… (français).
export function ordinalFr(n: number): string {
  return n === 1 ? '1er' : `${n}e`
}

// Accroche de position : « 12e sur 87 » ou « Sois le premier à marquer des
// trophées ! » quand le classement est vide.
export function rankHeadline(myRank: number | null, total: number): string {
  if (total === 0 || myRank === null) {
    return 'Marque des trophées en Défi pour entrer au classement.'
  }
  return `${ordinalFr(myRank)} sur ${total}`
}
