// -----------------------------------------------------------------------------
// LA PROGRESSION DANS LE CAHIER — barème, déblocage, récompenses.
//
// Miroir des règles que la base applique (migration 372, `exercice_terminer`
// et `exercice_commencer`) : si elles divergeaient, la page promettrait des
// gemmes que le serveur ne verse pas, ou ouvrirait un exercice qu'il refuse.
//
//   · chaque question a DEUX essais : juste du premier coup = 2 points, juste
//     au second (après le coup de pouce) = 1 point, sinon 0 ;
//   · l'exercice est RÉUSSI à la moitié des points : c'est lui qui ouvre le
//     suivant et qui verse les gemmes — une fois par exercice ;
//   · « Sans faute » : tout juste du premier coup. Un sceau, pas une monnaie.
// -----------------------------------------------------------------------------

import type { Etoiles } from './types'

export const ESSAIS_PAR_QUESTION = 2
export const POINTS_PREMIER_ESSAI = 2
export const POINTS_SECOND_ESSAI = 1
/** Part des points à atteindre pour réussir (et débloquer la suite). */
export const SEUIL_REUSSITE = 0.5

/** Les gemmes d'un exercice réussi, selon ses étoiles (réglables en base). */
export const GEMMES_PAR_ETOILES: Record<Etoiles, number> = { 1: 5, 2: 10, 3: 15 }
/** L'XP d'un exercice réussi. */
export const XP_PAR_ETOILES: Record<Etoiles, number> = { 1: 20, 2: 35, 3: 50 }

/** L'état d'une question pendant un passage. */
export type EtatQuestion = { essais: number; juste: boolean }

export function questionFinie(e: EtatQuestion): boolean {
  return e.juste || e.essais >= ESSAIS_PAR_QUESTION
}

export function pointsQuestion(e: EtatQuestion): number {
  if (!e.juste) return 0
  return e.essais <= 1 ? POINTS_PREMIER_ESSAI : POINTS_SECOND_ESSAI
}

export type Bilan = { score: number; max: number; reussi: boolean; parfait: boolean }

export function bilan(etats: EtatQuestion[]): Bilan {
  const max = etats.length * POINTS_PREMIER_ESSAI
  const score = etats.reduce((s, e) => s + pointsQuestion(e), 0)
  return {
    score,
    max,
    reussi: max > 0 && score >= max * SEUIL_REUSSITE,
    parfait: max > 0 && score === max,
  }
}

export type ResultatEleve = { reussi: boolean; parfait: boolean; meilleurScore: number; max: number }

export type EtatExercice = 'reussi' | 'ouvert' | 'verrouille'

/**
 * L'état de chaque exercice d'un chapitre : le premier est toujours ouvert,
 * chacun des suivants s'ouvre quand le précédent est réussi. Un exercice déjà
 * réussi le reste (même si l'on a retiré son prédécesseur du catalogue).
 */
export function etatsExercices(
  exercices: readonly { id: string; position: number }[],
  resultats: ReadonlyMap<string, Pick<ResultatEleve, 'reussi'>>,
): Map<string, EtatExercice> {
  const tries = [...exercices].sort((a, b) => a.position - b.position)
  const etats = new Map<string, EtatExercice>()
  let precedentReussi = true
  for (const ex of tries) {
    const reussi = resultats.get(ex.id)?.reussi === true
    etats.set(ex.id, reussi ? 'reussi' : precedentReussi ? 'ouvert' : 'verrouille')
    precedentReussi = reussi
  }
  return etats
}

/** Le mot du bilan, selon le score — encourageant d'abord, jamais humiliant. */
export function motDuBilan(b: Bilan): string {
  if (b.parfait) return 'Sans faute !'
  const r = b.max > 0 ? b.score / b.max : 0
  if (r >= 0.8) return 'Très bien joué !'
  if (r >= SEUIL_REUSSITE) return 'Exercice réussi !'
  if (r >= 0.25) return 'Presque ! Encore un essai ?'
  return 'Pas grave, on recommence ?'
}

/** « 1 étoile », « 3 étoiles » — pour les lecteurs d'écran. */
export function libelleEtoiles(n: Etoiles): string {
  return `${n} étoile${n > 1 ? 's' : ''}`
}
