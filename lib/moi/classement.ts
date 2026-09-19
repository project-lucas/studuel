import { cohortLabel, ordinal, standingFor, type Standing } from '@/lib/percentile'

/**
 * LE BLOC « TON CLASSEMENT » DE L'ONGLET MOI — la règle, pure et testée. Le
 * composant `components/moi/Classement.tsx` ne fait que la dessiner.
 *
 * Ce module ne décide RIEN du classement lui-même : le plancher de 100 élèves
 * et les arrondis contre l'élève vivent dans `lib/percentile` (décisions du
 * 01/08/2026, à ne pas rediscuter ici). Il traduit seulement un `Standing`
 * déjà tranché en ce que l'écran montre : un grand titre, la place d'un
 * marqueur dans une foule, et le chiffre qui défile pendant l'animation.
 *
 * DEUX FILTRES, UNE PLACE À LA FOIS (Lucas, 18/09/2026). Le bloc empilait
 * l'assiduité en grand, une jauge d'inscrits (« 3 / 100 inscrits · le %
 * s'ouvre à 100 élèves »), puis l'arène et la meilleure matière en petit : on
 * ne comprenait plus ce qui était classé contre quoi. Il ne montre plus qu'une
 * mesure, au choix de l'élève :
 *   - « Temps de travail » : sa place parmi les élèves de son niveau, au temps
 *     de travail cumulé (`my_grade_standings`, migration 223) ;
 *   - « Trophées » : sa place NATIONALE au total de trophées de l'arène
 *     (`national_ranking`, migration 166) — le classement national de l'arène.
 */

/** Le nombre de silhouettes de la foule : cinquante, une par deux pour cent. */
export const NB_BARRES = 50

/**
 * Le compteur part de la médiane, jamais de zéro : « Top 50 % » est vrai pour
 * tout le monde à l'instant zéro, « Top 0 % » ne l'est pour personne. Le
 * chiffre ne fait que se préciser en descendant vers la vraie valeur.
 */
export const DEPART_COMPTEUR = 50

export type FiltreClassement = 'travail' | 'trophees'

/** Les filtres, dans l'ordre de l'écran — le premier est celui qu'on voit. */
export const FILTRES_CLASSEMENT: readonly { id: FiltreClassement; label: string }[] = [
  { id: 'travail', label: 'Temps de travail' },
  { id: 'trophees', label: 'Trophées' },
]

/** Contre qui l'élève se mesure, et à quoi : ce que disent le titre et la foule. */
export type CadreClassement = {
  /** La cohorte, telle qu'elle se dit : « des 5e », « en France ». */
  qui: string
  /** La mesure : « au temps de travail total », « aux trophées ». */
  mesure: string
  /** Le bout droit de la foule : « Toute la classe », « Toute la France ». */
  finDeFoule: string
}

export function cadreClassement(
  filtre: FiltreClassement,
  grade: string | null | undefined,
): CadreClassement {
  return filtre === 'travail'
    ? {
        qui: cohortLabel(grade),
        mesure: 'au temps de travail total',
        finDeFoule: 'Toute la classe',
      }
    : { qui: 'en France', mesure: 'aux trophées', finDeFoule: 'Toute la France' }
}

export type TitreClassement = {
  /** Ce qui s'écrit en grand : « Top 8 % », « Mieux que 60 % », « 4e ». */
  grand: string
  /** La ligne dessous : « des 5e, au temps de travail total », « sur 61 en France ». */
  petit: string
}

/**
 * Le titre du bloc pour une place donnée. `null` quand il n'y a rien d'honnête
 * à dire : le bloc affiche alors une invitation, jamais un zéro.
 */
export function titreClassement(
  standing: Standing,
  cadre: Pick<CadreClassement, 'qui' | 'mesure'>,
): TitreClassement | null {
  switch (standing.kind) {
    case 'pourcentage':
      return {
        grand:
          standing.side === 'top'
            ? `Top ${standing.value} %`
            : `Mieux que ${standing.value} %`,
        petit: `${cadre.qui}, ${cadre.mesure}`,
      }
    case 'rang':
      return {
        grand: ordinal(standing.rank),
        petit: `sur ${standing.total} ${cadre.qui}`,
      }
    case 'aucun':
      return null
  }
}

/** Ce que le bloc dit à l'élève pas encore classé, filtre par filtre. */
export function invitationClassement(filtre: FiltreClassement): {
  titre: string
  texte: string
} {
  return filtre === 'travail'
    ? {
        titre: 'Ta place se joue à la première session.',
        texte:
          'Révise dix minutes : tu entres dans le classement des élèves de ton niveau, au temps de travail.',
      }
    : {
        titre: 'Ta place se joue au premier duel.',
        texte: 'Gagne des trophées dans l’arène : tu entres dans le classement national.',
      }
}

/**
 * Ma place au classement NATIONAL des trophées, depuis ce que rend
 * `national_ranking()` une fois normalisé (`normalizeRanking`, lib/clan).
 *
 * Sans trophée, l'élève n'est pas classé. La RPC le range quand même — parmi
 * tous les comptes à zéro, départagé par son identifiant — mais ce rang serait
 * tiré au sort, et il se lirait comme un verdict.
 */
export function standingNational(
  ranking: { myRank: number | null; total: number } | null | undefined,
  trophees: number,
): Standing {
  if (!ranking || ranking.myRank === null) return { kind: 'aucun' }
  if (!Number.isFinite(trophees) || trophees <= 0) return { kind: 'aucun' }
  return standingFor({ rank: ranking.myRank, total: ranking.total })
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
 * Le chiffre affiché pendant l'animation : il part de `depart` et se précise
 * vers `arrivee` avec une sortie douce (il ralentit en arrivant, comme le
 * marqueur). `k` est l'avancement, 0..1.
 */
export function valeurAnimee(depart: number, arrivee: number, k: number): number {
  const t = clamp01(k)
  const ease = 1 - Math.pow(1 - t, 3)
  return Math.round(depart + (arrivee - depart) * ease)
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.min(1, Math.max(0, n))
}
