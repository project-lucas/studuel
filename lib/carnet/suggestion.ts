// -----------------------------------------------------------------------------
// LA SUGGESTION DU CARNET — un seul bloc en tête, qui répond à « qu'est-ce que
// je fais maintenant ? ».
//
// Le carnet ouvrait sur DEUX blocs héros (« 12 cartes à revoir » et « En
// premier : Maths ») qui doublaient le + flottant et se contredisaient :
// l'un parlait de cartes, l'autre de cours, l'anneau disait « 0/30 ».
// Depuis le 10/09/2026 (Lucas), UN bloc, trois états, décidés ici :
//   · REPRENDRE — un cours a quelque chose à réviser (cartes dues, contrôle qui
//     approche, cartes jamais vues) : « Reprendre Maths, 8 cartes, environ
//     4 min » avec ▶. LE COURS DE LA DERNIÈRE SÉANCE d'abord (Lucas :
//     « elle doit être liée à chaque dernière session ») — reprendre, c'est
//     reprendre où on s'est arrêté ; s'il n'a plus rien à donner, ou si
//     l'élève n'a jamais révisé, c'est `coursPrioritaire` qui choisit et dit
//     pourquoi ;
//   · REMPLIR — rien de dû, mais un dossier est vide : « Ton dossier Physique
//     attend ses questions », avec « Coller mon cours » qui ouvre l'IA sur ce
//     dossier. C'est là que suggérer et créer se rejoignent : suggérer, c'est
//     proposer de remplir ;
//   · CRÉER — le carnet est vide : « Crée ton premier dossier ».
// Un carnet où tout est rempli et rien n'est dû REPREND quand même (la
// dernière séance, sinon le cours le moins revu, « à revoir pour
// entretenir ») : un bloc vide ne suggère rien.
//
// Logique PURE, aucun accès base. Les dates sont des clés UTC `YYYY-MM-DD`.
// -----------------------------------------------------------------------------

import {
  coursPrioritaire,
  joursEntre,
  minutesPour,
  raisonPriorite,
  scoreUrgence,
  type CoursCarnet,
} from './priorite'

export type Suggestion =
  | {
      type: 'reprendre'
      cours: CoursCarnet
      /** La raison du choix, en français (« 8 cartes dues »). */
      raison: string
      /** Les cartes que la séance va toucher. */
      cartes: number
      minutes: number
      /** Clé de jour de la dernière séance sur ce cours, ou null s'il n'a jamais été revu. */
      derniereSeance: string | null
    }
  | { type: 'remplir'; cours: CoursCarnet }
  | { type: 'creer' }

/** Les cartes qu'une séance sur ce cours va toucher : les dues, sinon les neuves, sinon toutes. */
export function cartesASeance(cours: CoursCarnet): number {
  if (cours.dueCount > 0) return cours.dueCount
  if (cours.nouvelles > 0) return cours.nouvelles
  return cours.questionCount
}

/**
 * Le dossier vide à remplir en premier : le plus récemment touché — c'est
 * celui que l'élève vient de créer, il a le cours sous la main.
 */
export function dossierAremplir(cours: readonly CoursCarnet[]): CoursCarnet | null {
  const vides = cours.filter((c) => !c.archive && c.questionCount === 0)
  if (vides.length === 0) return null
  return [...vides].sort((a, b) => {
    if (a.updatedAt !== b.updatedAt) return a.updatedAt < b.updatedAt ? 1 : -1
    return a.title.localeCompare(b.title, 'fr')
  })[0]
}

/**
 * Le cours de la DERNIÈRE SÉANCE : le plus récemment revu, s'il est encore
 * vivant et a des cartes. À égalité de jour, le plus urgent.
 */
export function coursDerniereSeance(cours: readonly CoursCarnet[], aujourdhui: string): CoursCarnet | null {
  const revus = cours.filter((c) => !c.archive && c.questionCount > 0 && c.dernierRevuLe !== null)
  if (revus.length === 0) return null
  return [...revus].sort((a, b) => {
    const ra = a.dernierRevuLe ?? ''
    const rb = b.dernierRevuLe ?? ''
    if (ra !== rb) return ra < rb ? 1 : -1
    return scoreUrgence(b, aujourdhui) - scoreUrgence(a, aujourdhui)
  })[0]
}

/** « aujourd'hui », « hier », « il y a n jours » — ou null si jamais revu. */
export function libelleDerniereSeance(derniereSeance: string | null, aujourdhui: string): string | null {
  if (!derniereSeance) return null
  const il_y_a = joursEntre(derniereSeance, aujourdhui)
  if (!Number.isFinite(il_y_a) || il_y_a < 0) return null
  if (il_y_a === 0) return 'dernière séance aujourd’hui'
  if (il_y_a === 1) return 'dernière séance hier'
  return `dernière séance il y a ${il_y_a} jours`
}

export function suggestionCarnet(cours: readonly CoursCarnet[], aujourdhui: string): Suggestion {
  const priorite = coursPrioritaire(cours, aujourdhui)
  const reprendre = (c: CoursCarnet): Suggestion => {
    const cartes = cartesASeance(c)
    return {
      type: 'reprendre',
      cours: c,
      raison: raisonPriorite(c, aujourdhui),
      cartes,
      minutes: minutesPour(cartes),
      derniereSeance: c.dernierRevuLe,
    }
  }

  // 1. La dernière séance, si elle a encore quelque chose à donner.
  const derniere = coursDerniereSeance(cours, aujourdhui)
  if (derniere && scoreUrgence(derniere, aujourdhui) > 0) return reprendre(derniere)

  // 2. Sinon, quelque chose à réviser ailleurs : c'est toujours ça avant le reste.
  if (priorite && scoreUrgence(priorite.cours, aujourdhui) > 0) return reprendre(priorite.cours)

  // 3. Rien d'urgent, mais un dossier attend ses questions.
  const vide = dossierAremplir(cours)
  if (vide) return { type: 'remplir', cours: vide }

  // 4. Tout est rempli, rien n'est dû : entretenir — la dernière séance
  //    d'abord, sinon le moins revu. Sinon, créer.
  if (derniere) return reprendre(derniere)
  if (priorite) return reprendre(priorite.cours)
  return { type: 'creer' }
}
