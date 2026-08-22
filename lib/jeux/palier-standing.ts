// -----------------------------------------------------------------------------
// LE CLASSEMENT DE RAPIDITÉ d'un palier — « Top 5 % des joueurs ».
//
// Un record de temps tout seul ne dit rien : 1 min 24 s, est-ce bien ? La
// réponse n'existe que par rapport aux autres. Ce module traduit une place
// (rang, nombre de joueurs) en une phrase qu'on a le DROIT d'afficher.
//
// Il ne réinvente rien : les règles d'honnêteté sont celles de `lib/percentile`
// (pas de pourcentage sous 100 joueurs, arrondi toujours contre l'élève,
// formulation retournée sous la médiane). Seule la COHORTE change — ici ce ne
// sont pas les élèves d'une classe, mais tous ceux qui ont bouclé ce palier de
// ce jeu. D'où un module à part plutôt qu'un `cohortLabel` de plus.
// -----------------------------------------------------------------------------
import { ordinal, standingFor, type Standing } from '@/lib/percentile'
import { PALIER_LEVELS, isPalierLevel, type PalierLevel } from '@/lib/jeux/paliers'

/** Ma place sur un palier, telle que la base la connaît. */
export type PalierTimeStanding = {
  level: PalierLevel
  /** Mon meilleur temps enregistré, en millisecondes. */
  bestMs: number
  /** Mon rang, 1 = le plus rapide. */
  rank: number
  /** Nombre de joueurs classés sur ce palier, moi compris. */
  total: number
}

export type PalierStandings = Partial<Record<PalierLevel, PalierTimeStanding>>

/** Le verdict affichable pour une place, ou « aucun » quand il n'y a rien à dire. */
export function speedStanding(
  place: PalierTimeStanding | null | undefined,
): Standing {
  if (!place) return { kind: 'aucun' }
  return standingFor({ rank: place.rank, total: place.total })
}

/**
 * La phrase posée sous le chrono. `null` quand on n'a rien d'honnête à dire —
 * l'écran n'affiche alors pas la ligne plutôt que d'inventer un pourcentage.
 *
 * Sous 100 joueurs (`COHORT_MIN`), on annonce le RANG BRUT : « 3e sur 12 » est
 * vrai à toute taille, là où « top 25 % » d'une poignée de joueurs bougerait de
 * dix points dès qu'un copain lance une partie.
 */
export function speedLabel(standing: Standing): string | null {
  switch (standing.kind) {
    case 'pourcentage':
      return standing.side === 'top'
        ? `Top ${standing.value} % des joueurs`
        : `Plus rapide que ${standing.value} % des joueurs`
    case 'rang':
      return `${ordinal(standing.rank)} sur ${standing.total} joueurs`
    case 'aucun':
      return null
  }
}

/** Raccourci : la place → la phrase, ou null. */
export function speedLabelFor(
  place: PalierTimeStanding | null | undefined,
): string | null {
  return speedLabel(speedStanding(place))
}

/**
 * Normalise ce que renvoie la RPC `palier_standings` (migration 313).
 *
 * Tolérante par construction, comme `parseGradeStandings` : la RPC peut manquer
 * (migration pas encore exécutée), rendre `null` (visiteur) ou une forme
 * partielle. Dans tous ces cas on rend un classement VIDE — la carte affiche
 * alors le chrono local sans pourcentage, elle ne casse pas.
 */
export function parsePalierStandings(raw: unknown): PalierStandings {
  if (!Array.isArray(raw)) return {}
  const standings: PalierStandings = {}
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue
    const row = entry as Record<string, unknown>
    const level = Number(row.palier)
    const bestMs = Number(row.best_ms)
    const rank = Number(row.rank)
    const total = Number(row.total)
    if (!isPalierLevel(level)) continue
    if (!Number.isFinite(bestMs) || bestMs <= 0) continue
    // `Number(null)` vaut 0, qui est fini : sans borne basse, une colonne nulle
    // passerait pour un rang et l'écran afficherait « 0e sur 4 ».
    if (!Number.isFinite(rank) || rank < 1) continue
    if (!Number.isFinite(total) || total < rank) continue
    standings[level] = {
      level,
      bestMs: Math.round(bestMs),
      rank: Math.round(rank),
      total: Math.round(total),
    }
  }
  return standings
}

/** Vrai si au moins un palier est classé (sert à masquer une section vide). */
export function hasAnyStanding(standings: PalierStandings): boolean {
  return PALIER_LEVELS.some((level) => standings[level] !== undefined)
}
