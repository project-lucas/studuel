// -----------------------------------------------------------------------------
// Le classement en pourcentage — « Top 2 % des 3e ».
//
// Logique PURE (convention projet) : la base fournit un rang et une taille de
// cohorte, ce module décide ce qu'on a le droit d'en dire. Aucune requête ici,
// aucun React ; tout est testable. Cadrage complet : docs/CADRAGE-PERCENTILE.md
//
// Trois règles gouvernent tout le fichier, dans cet ordre :
//
//   1. On n'affiche JAMAIS un pourcentage sur une cohorte trop petite. Sur 60
//      élèves, « top 2 % » veut dire premier et bouge de cinq points dès qu'un
//      copain joue. On retombe alors sur le rang brut, qui est vrai à toute
//      taille.
//   2. On lit toujours le chiffre du bon côté. Dans la moitié haute, c'est la
//      position (« top 12 % ») ; dans la moitié basse, c'est le chemin déjà
//      fait (« mieux que 32 % »). Même donnée, jamais une gifle : la moitié des
//      élèves d'une app de soutien scolaire sont sous la médiane par
//      construction.
//   3. Les arrondis vont toujours CONTRE l'élève. Top 2,3 % s'affiche « top
//      5 % », « mieux que 34 % » s'affiche « mieux que 30 % ». Un élève ne doit
//      jamais pouvoir démontrer que l'app l'a flatté — c'est ce qui rend les
//      bons chiffres croyables.
// -----------------------------------------------------------------------------

import type { GradeLevel } from './types'

/**
 * Taille minimale de cohorte pour qu'un pourcentage ait un sens. En dessous,
 * `standingFor` renvoie un rang brut.
 *
 * 100 n'est pas un chiffre rond posé au hasard : c'est le seuil à partir duquel
 * « top 1 % » désigne au moins une personne réelle. En dessous, la plus fine
 * des bandes affichables serait déjà un mensonge arithmétique.
 */
export const COHORT_MIN = 100

/**
 * Bandes d'affichage du haut de tableau, en pourcents. Un percentile brut est
 * remonté à la première bande qui le contient — 2,3 % devient « top 5 % ».
 *
 * Elles servent deux choses à la fois : l'honnêteté (l'arrondi défavorise
 * l'élève) et la STABILITÉ. Passer de « top 2,1 % » à « top 2,4 % » se lirait
 * comme une chute alors qu'il ne s'est rien passé ; « top 5 % » ne bouge pas de
 * la semaine.
 */
export const TOP_BANDS = [1, 2, 5, 10, 25, 50] as const

/** Pas d'arrondi de la formulation basse (« mieux que 30 % »). */
const BETTER_STEP = 5

/**
 * Nombre minimal de quiz passés dans une matière pour entrer à son classement
 * de maîtrise. Sans lui, un seul 10/10 chanceux placerait n'importe qui premier.
 */
export const MASTERY_MIN_QUIZZES = 3

/** Ce que la base sait dire : une place dans une cohorte. */
export type CohortStanding = {
  /** Rang de l'élève, 1 = premier. */
  rank: number
  /** Nombre d'élèves classés dans la cohorte, l'élève compris. */
  total: number
}

/**
 * Ce qu'on a le droit d'afficher. Union discriminée : l'appelant est obligé de
 * traiter le cas « cohorte trop petite », il ne peut pas l'oublier.
 */
export type Standing =
  /** Cohorte suffisante : on parle en pourcentage. */
  | {
      kind: 'pourcentage'
      /** Moitié haute (`top`) ou basse (`mieux`) — décide de la formulation. */
      side: 'top' | 'mieux'
      /** La bande à afficher, déjà arrondie contre l'élève. */
      value: number
      /** Percentile brut (rang/total, dans ]0, 1]) — pour les tests et le tri. */
      raw: number
    }
  /** Cohorte trop petite : on dit le rang, qui est vrai à toute taille. */
  | { kind: 'rang'; rank: number; total: number }
  /** Rien à dire : élève non classé, ou donnée absente. */
  | { kind: 'aucun' }

/**
 * Première bande contenant `pct`. 0,4 → 1 ; 2,3 → 5 ; 40 → 50.
 * Au-delà de la dernière bande on ne remonte plus : c'est la moitié basse, elle
 * se formule autrement.
 */
export function topBandFor(pct: number): number {
  return TOP_BANDS.find((band) => pct <= band) ?? 50
}

/**
 * Le verdict affichable pour une place donnée.
 *
 * `rank` hors bornes ou `total` non entier renvoient `aucun` plutôt que de
 * propager un NaN jusqu'à l'écran : les compteurs viennent de la base, une
 * migration à moitié passée ne doit pas afficher « top NaN % ».
 */
export function standingFor(input: CohortStanding | null | undefined): Standing {
  if (!input) return { kind: 'aucun' }

  const { rank, total } = input
  if (!Number.isFinite(rank) || !Number.isFinite(total)) return { kind: 'aucun' }
  if (total < 1 || rank < 1 || rank > total) return { kind: 'aucun' }

  if (total < COHORT_MIN) return { kind: 'rang', rank, total }

  // Percentile de tête : la fraction de la cohorte qu'on occupe avec les
  // meilleurs. Le premier de 1 000 est à 0,1 % ; le dernier est à 100 %.
  const raw = rank / total

  // On bascule à la médiane, là où les deux formulations disent la même chose.
  if (raw <= 0.5) {
    return { kind: 'pourcentage', side: 'top', value: topBandFor(raw * 100), raw }
  }

  // Moitié basse : la part de la cohorte que l'élève DEVANCE, arrondie au
  // multiple de 5 inférieur (« mieux que 34 % » → 30 %).
  const better = ((total - rank) / total) * 100
  const value = Math.floor(better / BETTER_STEP) * BETTER_STEP
  return { kind: 'pourcentage', side: 'mieux', value, raw }
}

/**
 * Le nom de la cohorte tel qu'il se dit : « des 3e », « des Terminales ».
 * `null` quand le niveau est inconnu — l'appelant retombe alors sur
 * « des élèves », et surtout ne prétend pas comparer à une classe précise.
 */
export function cohortLabel(grade: GradeLevel | string | null | undefined): string {
  const g = String(grade ?? '').trim()
  if (!g) return 'des élèves'
  // « Tle » ne se lit pas à voix haute, contrairement à tous les autres niveaux
  // qui s'écrivent comme ils se disent. La voie technologique se compare à
  // elle-même : un Tle techno ne suit pas les mêmes épreuves qu'un Tle général,
  // le ranger dans « les Terminales » comparerait deux populations différentes.
  if (g === 'Tle') return 'des Terminales'
  if (g === 'Tle techno') return 'des Terminales techno'
  return `des ${g}`
}

/**
 * La phrase complète, prête à poser sous un compteur.
 * Renvoie `null` quand il n'y a rien d'honnête à dire — l'appelant n'affiche
 * alors simplement pas la ligne.
 */
export function standingLabel(
  standing: Standing,
  grade: GradeLevel | string | null | undefined,
): string | null {
  const who = cohortLabel(grade)

  switch (standing.kind) {
    case 'pourcentage':
      return standing.side === 'top'
        ? `Top ${standing.value} % ${who}`
        : `Mieux que ${standing.value} % ${who}`
    case 'rang':
      return `${ordinal(standing.rank)} sur ${standing.total} ${who}`
    case 'aucun':
      return null
  }
}

/** « 1er », « 2e », « 61e » — l'exception française du premier. */
export function ordinal(n: number): string {
  return n === 1 ? '1er' : `${n}e`
}

// ------------------------------------------------------------ lecture de la RPC

/** Les trois classements rendus par `my_grade_standings()` (migration 223). */
export type GradeStandings = {
  /** Niveau de l'élève, `null` s'il ne l'a pas renseigné. */
  grade: string | null
  /** Compétition — le compteur de trophées. */
  trophies: Standing
  /** Travail fourni — le temps de travail cumulé. */
  assiduite: Standing
  /** Maîtrise, une entrée par matière où l'élève est classé. */
  maitrise: readonly { subject: string; standing: Standing }[]
}

/** Aucun classement — la valeur de repli, jamais `null` chez l'appelant. */
export const EMPTY_STANDINGS: GradeStandings = {
  grade: null,
  trophies: { kind: 'aucun' },
  assiduite: { kind: 'aucun' },
  maitrise: [],
}

function readCohort(value: unknown): CohortStanding | null {
  if (!value || typeof value !== 'object') return null
  const { rank, total } = value as Record<string, unknown>
  if (typeof rank !== 'number' || typeof total !== 'number') return null
  return { rank, total }
}

/**
 * Normalise la charge utile de `my_grade_standings()`.
 *
 * Tolérante par construction : la RPC peut manquer (migration 223 pas encore
 * passée), renvoyer `null` (élève déconnecté) ou une forme partielle. Dans tous
 * ces cas on rend `EMPTY_STANDINGS` — l'app affiche simplement une ligne de
 * moins, elle ne casse pas et n'invente aucun chiffre.
 */
export function parseGradeStandings(raw: unknown): GradeStandings {
  if (!raw || typeof raw !== 'object') return EMPTY_STANDINGS

  const row = raw as Record<string, unknown>
  const grade = typeof row.grade === 'string' && row.grade.trim() ? row.grade : null

  const maitrise = Array.isArray(row.maitrise)
    ? row.maitrise.flatMap((entry) => {
        if (!entry || typeof entry !== 'object') return []
        const { subject } = entry as Record<string, unknown>
        if (typeof subject !== 'string' || !subject.trim()) return []
        const standing = standingFor(readCohort(entry))
        // Une matière sans place exploitable n'a rien à dire : on la retire
        // plutôt que d'afficher une ligne muette.
        if (standing.kind === 'aucun') return []
        return [{ subject, standing }]
      })
    : []

  return {
    grade,
    trophies: standingFor(readCohort(row.trophies)),
    assiduite: standingFor(readCohort(row.assiduite)),
    maitrise,
  }
}

/**
 * Vrai quand la place mérite d'être fêtée : entrer dans une bande haute est un
 * événement, gagner trois places ne l'est pas. Sert la bulle partageable
 * (`PalierCelebration`) — l'appelant compare à la dernière bande mémorisée.
 *
 * Seules les bandes strictement au-dessus de la médiane comptent : « tu entres
 * dans le top 50 % » n'est pas une nouvelle qu'on affiche en grand.
 */
export function isCelebrationBand(standing: Standing): boolean {
  return (
    standing.kind === 'pourcentage' &&
    standing.side === 'top' &&
    standing.value < 50
  )
}
