// -----------------------------------------------------------------------------
// LA PLACE À L'ÉPREUVE ULTIME — la cote, le rang mondial, le rang dans la classe.
//
// Le mondial est celui qui donne son sens à l'épreuve : c'est là qu'un 6e
// dépasse un Terminale, parce que tout le monde y joue exactement la même chose.
// Le classement par classe reste à côté, parce qu'il rassure quand le mondial
// écrase — et parce que « 1er des 6e » est une vraie nouvelle.
//
// Les règles d'affichage sont celles de `lib/percentile` : pas de pourcentage
// sous 100 joueurs (on annonce le rang brut, vrai à toute taille), arrondi
// toujours contre le joueur, formulation retournée sous la médiane.
// -----------------------------------------------------------------------------
import { cohortLabel, ordinal, standingFor, type Standing } from '@/lib/percentile'
import { coteTitle } from '@/lib/jeux/ultime'

/** Ma place à l'épreuve, telle que la base la connaît (migration 314). */
export type UltimeStanding = {
  cote: number
  bestLevel: number
  runs: number
  /** Classe déclarée, ou null si l'élève ne l'a pas renseignée. */
  grade: string | null
  /** Rang mondial, 1 = meilleure cote. */
  rank: number
  total: number
  /** Rang dans sa classe — null quand la classe est inconnue. */
  gradeRank: number | null
  gradeTotal: number | null
}

function num(value: unknown): number | null {
  const n = Number(value)
  return Number.isFinite(n) ? Math.round(n) : null
}

/**
 * Normalise ce que rendent `record_ultime_run` et `ultime_standing`.
 *
 * Tolérante par construction : la RPC peut manquer (migration 314 pas encore
 * exécutée), rendre `null` (jamais joué, ou visiteur) ou une forme partielle.
 * Dans tous ces cas on rend `null` — l'écran affiche le niveau atteint sans
 * cote ni classement, et n'invente aucun chiffre.
 */
export function parseUltimeStanding(raw: unknown): UltimeStanding | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const row = raw as Record<string, unknown>
  const cote = num(row.cote)
  const rank = num(row.rank)
  const total = num(row.total)
  if (cote === null || cote < 0) return null
  if (rank === null || rank < 1) return null
  if (total === null || total < rank) return null
  const gradeRank = num(row.grade_rank)
  const gradeTotal = num(row.grade_total)
  const coherent =
    gradeRank !== null && gradeTotal !== null && gradeRank >= 1 && gradeTotal >= gradeRank
  return {
    cote,
    bestLevel: Math.max(0, num(row.best_level) ?? 0),
    runs: Math.max(0, num(row.runs) ?? 0),
    grade:
      typeof row.grade === 'string' && row.grade.trim() ? row.grade : null,
    rank,
    total,
    gradeRank: coherent ? gradeRank : null,
    gradeTotal: coherent ? gradeTotal : null,
  }
}

/** Le titre porté par cette cote (« Virtuose »). */
export function standingTitle(standing: UltimeStanding | null): string | null {
  return standing ? coteTitle(standing.cote) : null
}

export function worldStanding(standing: UltimeStanding | null): Standing {
  if (!standing) return { kind: 'aucun' }
  return standingFor({ rank: standing.rank, total: standing.total })
}

export function gradeStanding(standing: UltimeStanding | null): Standing {
  if (!standing || standing.gradeRank === null || standing.gradeTotal === null) {
    return { kind: 'aucun' }
  }
  return standingFor({ rank: standing.gradeRank, total: standing.gradeTotal })
}

/**
 * La phrase du classement MONDIAL. « des joueurs » et non « des élèves » : sur
 * cette épreuve la cohorte n'a ni classe ni âge, c'est tout son intérêt.
 */
export function worldLabel(standing: UltimeStanding | null): string | null {
  const s = worldStanding(standing)
  switch (s.kind) {
    case 'pourcentage':
      return s.side === 'top'
        ? `Top ${s.value} % mondial`
        : `Devant ${s.value} % des joueurs`
    case 'rang':
      return `${ordinal(s.rank)} sur ${s.total} joueurs`
    case 'aucun':
      return null
  }
}

/** La phrase du classement de CLASSE (« 1er des 6e »). */
export function gradeLabel(standing: UltimeStanding | null): string | null {
  const s = gradeStanding(standing)
  const who = cohortLabel(standing?.grade)
  switch (s.kind) {
    case 'pourcentage':
      return s.side === 'top'
        ? `Top ${s.value} % ${who}`
        : `Devant ${s.value} % ${who}`
    case 'rang':
      return `${ordinal(s.rank)} sur ${s.total} ${who}`
    case 'aucun':
      return null
  }
}
