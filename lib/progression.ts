// -----------------------------------------------------------------------------
// LA DÉFINITION UNIQUE du pourcentage d'une matière.
//
// Elle vit ici, seule, parce qu'elle était calculée à DEUX endroits qui ne se
// parlaient pas : `app/reviser/page.tsx` (les couronnes des cartes matières) et
// `lib/coach/couverture.ts` (l'écran Progrès de Marcel). Tant que les deux
// disaient la même chose, la duplication passait inaperçue ; le jour où la
// définition change, l'app se contredit à deux onglets d'écart.
//
// CE QUE MESURE LE POURCENTAGE, DEPUIS LE 2026-08-01 : la maîtrise de ce qui a
// été COMMENCÉ, pas l'avancement dans le programme de l'année.
//
// Avant, un chapitre jamais ouvert comptait pour zéro dans la moyenne. Un élève
// à 1 chapitre sur 10, maîtrisé à 80 %, voyait « 10 % ». Ce n'était pas faux,
// c'était la réponse à une autre question — et surtout, l'app n'avait aucun
// moyen de savoir si les 9 chapitres restants avaient été traités en classe.
// Elle punissait l'élève pour un programme que son prof n'avait pas encore
// abordé.
//
// La migration 224 apporte la pièce manquante : l'élève déclare ce que le prof
// a traité. Le dénominateur devient ce périmètre-là.
//
// CE QUE ÇA NE DIT PLUS, ET QU'IL FAUT AFFICHER À CÔTÉ : la couverture. Un élève
// à 1 chapitre sur 10 affichera 80 % — trois semaines avant le brevet, ce chiffre
// seul serait un mensonge par omission. `progressionMatiere` renvoie donc TOUJOURS
// `commences` et `total` avec le pourcentage : tout écran qui montre l'un a les
// deux autres sous la main, sans requête ni calcul supplémentaire.
//
// Logique PURE, aucun accès base.
// -----------------------------------------------------------------------------

import { MASTERY_THRESHOLDS, type ChapterState } from './mastery'

export type ChapitreProgression = {
  /** Maîtrise mesurée par l'app (0–1) : quiz joués, leçons terminées. */
  value: number
  /** Ce que l'app a pu OBSERVER — jamais ce que l'élève déclare. */
  state: ChapterState
  /** L'élève a déclaré que le prof a traité ce chapitre (migration 224). */
  vuEnCours: boolean
}

/**
 * Un chapitre entre-t-il dans le calcul ?
 *
 * Deux façons d'y entrer, et la seconde n'est pas un détail : un élève qui a
 * déjà joué un quiz sur un chapitre l'a évidemment commencé. Lui demander de le
 * cocher EN PLUS serait lui faire ressaisir ce que l'app a sous les yeux — et
 * le premier oubli ferait remonter son pourcentage sans raison.
 */
export function chapitreCommence(c: ChapitreProgression): boolean {
  return c.vuEnCours || c.state !== 'a_commencer'
}

export type ProgressionMatiere = {
  /** Maîtrise moyenne SUR LES CHAPITRES COMMENCÉS, en pourcent (0–100). */
  pct: number
  /** Chapitres pris en compte dans `pct`. Zéro ⇒ `pct` vaut 0 et ne veut rien dire. */
  commences: number
  /** Chapitres du niveau, commencés ou non. */
  total: number
  /** Chapitres maîtrisés. */
  solides: number
  /** Chapitres commencés mais pas acquis. */
  enRoute: number
  /** Chapitres ni vus en cours, ni ouverts dans l'app. */
  jamais: number
}

export function progressionMatiere(
  chapitres: readonly ChapitreProgression[],
): ProgressionMatiere {
  let somme = 0
  let commences = 0
  let solides = 0
  let enRoute = 0

  for (const c of chapitres) {
    if (!chapitreCommence(c)) continue
    commences += 1
    // Une valeur absente ou aberrante ne doit pas faire exploser la moyenne :
    // le catalogue est alimenté par des migrations écrites à la main.
    const value = Number.isFinite(c.value) ? Math.max(0, Math.min(1, c.value)) : 0
    somme += value
    if (c.state === 'maitrise') solides += 1
    else enRoute += 1
  }

  return {
    pct: commences === 0 ? 0 : Math.round((somme / commences) * 100),
    commences,
    total: chapitres.length,
    solides,
    enRoute,
    jamais: chapitres.length - commences,
  }
}

/**
 * Ce que le pourcentage de la matière GAGNERAIT si ce chapitre était maîtrisé.
 *
 * C'est la pièce qui fait passer l'écran Progrès du constat à l'action : un
 * chapitre à 0 % parmi 5 commencés ne dit rien à l'élève, « +20 % » lui dit où
 * appuyer. Le chiffre n'est donc pas une estimation — c'est une PROMESSE, et il
 * est calculé par la même fonction que le pourcentage affiché : on rejoue
 * `progressionMatiere` avec ce seul chapitre porté à 1, et on prend l'écart.
 * Impossible, par construction, que le bouton promette 20 points et que la
 * barre n'en bouge que de 19.
 *
 * Zéro sur un chapitre PAS ENCORE COMMENCÉ, et ce n'est pas un oubli : l'ouvrir
 * l'ajoute au dénominateur, si bien que le pourcentage de la matière peut
 * BAISSER. Promettre un gain là serait mentir.
 */
export function gainSiMaitrise(
  chapitres: readonly ChapitreProgression[],
  index: number,
): number {
  const cible = chapitres[index]
  if (!cible || !chapitreCommence(cible)) return 0

  const avant = progressionMatiere(chapitres)
  const apres = progressionMatiere(
    chapitres.map((c, i) => (i === index ? { ...c, value: 1 } : c)),
  )
  return Math.max(0, apres.pct - avant.pct)
}

/**
 * La priorité d'une matière — ce qui décide de sa couleur et de sa place dans
 * la liste.
 *
 * `rien` n'est PAS une alerte, et c'est le changement le plus important : une
 * matière dont le prof n'a rien traité n'a rien à réviser. L'ancien écran la
 * peignait en rouge à 0 % — il reprochait à l'élève le calendrier de son
 * établissement.
 *
 * Les seuils sont ceux de la maîtrise d'un chapitre (`MASTERY_THRESHOLDS`), pas
 * des valeurs inventées ici : une matière est « solide » quand elle est au
 * niveau où un chapitre serait dit maîtrisé.
 */
export type Priorite = 'rien' | 'urgente' | 'attention' | 'ok'

export function prioriteFor(p: ProgressionMatiere): Priorite {
  if (p.commences === 0) return 'rien'
  return prioriteMaitrise(p.pct)
}

/**
 * La priorité d'un pourcentage SEUL, sans son assiette.
 *
 * Extraite de `prioriteFor` pour qu'une ligne de CHAPITRE puisse porter la même
 * couleur que sa matière, avec exactement les mêmes seuils. Sans elle, l'écran
 * Progrès aurait redéfini « fragile » dans son coin — et un chapitre à 79 %
 * aurait pu s'afficher violet sous une matière ambre.
 */
export function prioriteMaitrise(pct: number): Exclude<Priorite, 'rien'> {
  if (pct < MASTERY_THRESHOLDS.fragile * 100) return 'urgente'
  if (pct < MASTERY_THRESHOLDS.mastered * 100) return 'attention'
  return 'ok'
}

/** Ordre d'affichage : le plus urgent d'abord, le « rien à faire » en dernier. */
export const RANG_PRIORITE: Record<Priorite, number> = {
  urgente: 0,
  attention: 1,
  ok: 2,
  rien: 3,
}

/**
 * Maîtrise moyenne sur plusieurs matières, pondérée par le nombre de chapitres
 * COMMENCÉS — pas par le total. Une matière dont rien n'a été traité ne pèse
 * donc rien, au lieu de tirer la moyenne générale vers le bas.
 */
export function progressionGlobale(
  matieres: readonly ProgressionMatiere[],
): number {
  const commences = matieres.reduce((s, m) => s + m.commences, 0)
  if (commences === 0) return 0
  const pondere = matieres.reduce((s, m) => s + m.pct * m.commences, 0)
  return Math.round(pondere / commences)
}
