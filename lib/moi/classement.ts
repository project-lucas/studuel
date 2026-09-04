import {
  COHORT_MIN,
  cohortLabel,
  ordinal,
  type GradeStandings,
  type Standing,
} from '@/lib/percentile'

/**
 * LE BLOC « TON CLASSEMENT » DE L'ONGLET MOI — la règle, pure et testée. Le
 * composant `components/moi/Classement.tsx` ne fait que la dessiner.
 *
 * Ce module ne décide RIEN du classement lui-même : les trois mesures, la
 * cohorte par niveau, le plancher de 100 élèves et les arrondis contre l'élève
 * vivent dans `lib/percentile` (décisions du 01/08/2026, à ne pas rediscuter
 * ici). Il traduit seulement un `Standing` déjà tranché en ce que l'écran
 * montre : un grand titre, la place d'un marqueur dans une foule, la longueur
 * d'une jauge, et le chiffre qui défile pendant l'animation.
 */

/** Le nombre de silhouettes de la foule : cinquante, une par deux pour cent. */
export const NB_BARRES = 50

/**
 * Le compteur part de la médiane, jamais de zéro : « Top 50 % » est vrai pour
 * tout le monde à l'instant zéro, « Top 0 % » ne l'est pour personne. Le
 * chiffre ne fait que se préciser en descendant vers la vraie valeur.
 */
export const DEPART_COMPTEUR = 50

/** La mesure de cet onglet : le temps de travail (cf. décision n° 1 du 01/08). */
export const MESURE_ASSIDUITE = 'au temps de travail'

export type TitreClassement = {
  /** Ce qui s'écrit en grand : « Top 8 % », « Mieux que 60 % », « 4e ». */
  grand: string
  /** La ligne dessous : « des 5e, au temps de travail », « sur 61 des 5e ». */
  petit: string
}

/**
 * Le titre du bloc pour une place donnée. `null` quand il n'y a rien d'honnête
 * à dire : le bloc affiche alors une invitation, jamais un zéro.
 */
export function titreClassement(
  standing: Standing,
  grade: string | null | undefined,
  mesure: string = MESURE_ASSIDUITE,
): TitreClassement | null {
  const who = cohortLabel(grade)
  switch (standing.kind) {
    case 'pourcentage':
      return {
        grand:
          standing.side === 'top'
            ? `Top ${standing.value} %`
            : `Mieux que ${standing.value} %`,
        petit: `${who}, ${mesure}`,
      }
    case 'rang':
      return { grand: ordinal(standing.rank), petit: `sur ${standing.total} ${who}` }
    case 'aucun':
      return null
  }
}

/**
 * La place du marqueur dans la foule, de 0 (le premier, tout à gauche) à 1
 * (le dernier, tout à droite). C'est la fraction de la cohorte qui est devant
 * ou au niveau de l'élève — le percentile brut, ou rang/total sous le plancher.
 * `null` sans classement.
 */
export function placeDansLaFoule(standing: Standing): number | null {
  switch (standing.kind) {
    case 'pourcentage':
      return clamp01(standing.raw)
    case 'rang':
      return clamp01(standing.rank / standing.total)
    case 'aucun':
      return null
  }
}

/**
 * La longueur d'une jauge, 0..1 : la part de la cohorte que l'élève DEVANCE.
 * Le premier remplit tout, le dernier rien.
 */
export function jauge(standing: Standing): number {
  const place = placeDansLaFoule(standing)
  return place === null ? 0 : 1 - place
}

/** « top 15 % », « mieux que 60 % », « 4e / 61 » — court, pour une ligne d'axe. */
export function libelleAxe(standing: Standing): string | null {
  switch (standing.kind) {
    case 'pourcentage':
      return standing.side === 'top'
        ? `top ${standing.value} %`
        : `mieux que ${standing.value} %`
    case 'rang':
      return `${ordinal(standing.rank)} / ${standing.total}`
    case 'aucun':
      return null
  }
}

export type AxeSecondaire = {
  cle: 'arene' | 'maitrise'
  titre: string
  standing: Standing
}

/**
 * Les deux autres mesures, sous la principale : l'arène (trophées) et la
 * MEILLEURE matière en maîtrise — la place la plus haute, pas la première de
 * la liste. Une mesure sans classement ne prend pas de ligne : une jauge vide
 * sous un « top 8 % » se lirait comme un échec.
 */
export function axesSecondaires(standings: GradeStandings): AxeSecondaire[] {
  const axes: AxeSecondaire[] = []
  if (standings.trophies.kind !== 'aucun') {
    axes.push({ cle: 'arene', titre: 'Arène · trophées', standing: standings.trophies })
  }
  const meilleure = standings.maitrise
    .map((m) => ({ ...m, place: placeDansLaFoule(m.standing) }))
    .filter((m): m is typeof m & { place: number } => m.place !== null)
    .sort((a, b) => a.place - b.place)[0]
  if (meilleure) {
    axes.push({
      cle: 'maitrise',
      titre: `Maîtrise · ${meilleure.subject}`,
      standing: meilleure.standing,
    })
  }
  return axes
}

/**
 * Le chiffre affiché pendant l'animation : il part de `depart` et se précise
 * vers `arrivee` avec une sortie douce (il ralentit en arrivant, comme le
 * marqueur). `k` est l'avancement, 0..1.
 */
export function valeurAnimee(depart: number, arrivee: number, k: number): number {
  const t = clamp01(k)
  const ease = 1 - Math.pow(1 - t, 3)
  return Math.round(depart + (arrivee - depart) * ease)
}

/**
 * Sous le plancher de cohorte, le pourcentage n'existe pas encore : on dit
 * combien d'élèves de la classe sont inscrits, et combien il en faut. `null`
 * dès que le pourcentage est ouvert (ou sans classement du tout).
 */
export function progressionCohorte(
  standing: Standing,
): { total: number; requis: number; ratio: number } | null {
  if (standing.kind !== 'rang') return null
  return {
    total: standing.total,
    requis: COHORT_MIN,
    ratio: clamp01(standing.total / COHORT_MIN),
  }
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.min(1, Math.max(0, n))
}
