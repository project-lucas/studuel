// Mode COOP — logique pure des sessions coopératives (deux élèves, une équipe).
// Le principe : on affronte ENSEMBLE une série de questions plus corsées, avec
// des vies PARTAGÉES. Une question est « sauvée » dès que l'un des deux la
// réussit (l'entraide est le cœur du mode) ; elle ne coûte une vie que si les
// DEUX se trompent. Le transport temps réel vit dans components/useCoop.ts ;
// ici, tout est pur et testable. On réutilise la graine partagée de duel-live
// pour que les deux joueurs voient la même suite de questions.

export { orderQuestionIds } from './duel-live'

// Réglages de la partie coop.
export const COOP_QUESTIONS = 10 // longueur de la série d'équipe
export const COOP_LIVES = 3 // cœurs partagés
export const COOP_SECONDS = 12 // temps par question (le « plus dur » : ça presse)

// Nom du canal Realtime d'une session coop.
export function coopChannelName(sessionId: string): string {
  return `coop-${sessionId}`
}

// Une réponse déclarée (par soi ou par le partenaire) via broadcast.
export type CoopAnswer = {
  q: number // index de la question, 0-based
  correct: boolean
}

export type CoopQuestionState = 'cleared' | 'failed' | 'pending'

// État d'une question donnée, vu de l'équipe : sauvée si l'un des deux l'a
// réussie ; ratée si les deux ont répondu et se sont trompés ; en attente sinon.
export function coopQuestionState(
  mine: CoopAnswer[],
  theirs: CoopAnswer[],
  q: number,
): CoopQuestionState {
  const m = mine.find((a) => a.q === q)
  const t = theirs.find((a) => a.q === q)
  if ((m && m.correct) || (t && t.correct)) return 'cleared'
  if (m && t) return 'failed' // les deux ont répondu, aucun juste
  return 'pending'
}

export type CoopStatus = {
  cleared: number // questions sauvées
  failed: number // questions ratées (une vie chacune)
  livesLeft: number
  outcome: 'won' | 'lost' | null
}

// Bilan d'équipe à partir des réponses des deux camps.
export function coopStatus(
  mine: CoopAnswer[],
  theirs: CoopAnswer[],
  total: number = COOP_QUESTIONS,
  lives: number = COOP_LIVES,
): CoopStatus {
  let cleared = 0
  let failed = 0
  for (let q = 0; q < total; q++) {
    const s = coopQuestionState(mine, theirs, q)
    if (s === 'cleared') cleared++
    else if (s === 'failed') failed++
  }
  const livesLeft = Math.max(0, lives - failed)
  let outcome: 'won' | 'lost' | null = null
  if (livesLeft <= 0) outcome = 'lost'
  else if (cleared >= total) outcome = 'won'
  return { cleared, failed, livesLeft, outcome }
}

// Score d'équipe = questions sauvées (sert à l'XP via recordChallenge).
export function coopScore(mine: CoopAnswer[], theirs: CoopAnswer[]): number {
  return coopStatus(mine, theirs).cleared
}

// Combien de questions le partenaire a-t-il déjà traitées (pour le HUD live).
export function partnerProgress(theirs: CoopAnswer[], total: number = COOP_QUESTIONS): number {
  return theirs.filter((a) => a.q >= 0 && a.q < total).length
}
