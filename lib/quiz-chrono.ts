// -----------------------------------------------------------------------------
// LE CHRONO DES SUPPORTS — le quiz et les flashcards à la manière du duel.
//
// Lucas, 16/09/2026 : « je veux que quiz, flashcards… soient proches du modèle
// PvP, avec le côté limite de temps ; si le temps atteint zéro, ça quitte —
// comme ça pas de fausse session en route. Ainsi il s'entraîne à répondre vite
// et bien et se prépare pour le mode PvP qui est basé là-dessus. »
//
// Trois règles, communes aux deux supports :
//
//   1. UN BUDGET pour toute la manche, proportionnel au paquet : 12 s par
//      question, borné. Huit questions font 96 s — l'ordre de grandeur de la
//      course du duel (90 s, cf. lib/duel/course). Le temps est MIS EN COMMUN :
//      une réponse rapide en garde pour une question plus dure, exactement
//      comme dans la course où l'on ne chronomètre pas question par question.
//
//   2. UNE BONNE RÉPONSE REND DU TEMPS (+3 s), comme le Contre-la-montre du
//      salon (lib/defi-modes : +5 s). Moins qu'au salon, parce qu'ici le
//      paquet est fini et le budget déjà large. Une erreur n'en RETIRE pas :
//      elle coûte déjà le point, et un quiz d'entraînement qui punit deux fois
//      la même faute fait fuir avant la fin.
//
//   3. À ZÉRO, LA MANCHE EST ABANDONNÉE : rien n'est écrit — ni session, ni
//      note, ni répétition espacée. C'est la règle demandée (« pas de fausse
//      session ») : une manche à moitié faite n'est pas une note à moitié
//      bonne, et une note gonflée par des réponses jamais données mentirait
//      dans la maîtrise du chapitre.
//
// Le chrono ne court que PENDANT qu'une question attend sa réponse. Il se
// suspend pendant la lecture de la correction : la course du duel n'a pas de
// correction à lire, le quiz en a une — la faire payer en secondes reviendrait
// à pousser l'élève à ne pas la lire, l'inverse du but.
//
// Pur et testé. Les players (QuizPlayer, LessonFlashcards) ne font que lire.
// -----------------------------------------------------------------------------

/** Secondes accordées par question du paquet. */
export const CHRONO_SECONDES_PAR_QUESTION = 12
/** Ce qu'une bonne réponse rend. */
export const CHRONO_BONUS_BONNE_REPONSE = 3
/** Plancher : un paquet de deux questions garde de quoi lire un énoncé. */
export const CHRONO_MIN_SECONDES = 30
/** Plafond : au-delà, ce n'est plus une course. */
export const CHRONO_MAX_SECONDES = 180
/** Sous ce seuil, le cadran passe en alerte (corail) et la manche se tend. */
export const CHRONO_ALERTE_SECONDES = 10

/** Le budget de la manche, pour un paquet de `nombreQuestions`. */
export function budgetChrono(nombreQuestions: number): number {
  const n = Number.isFinite(nombreQuestions) ? Math.max(0, Math.floor(nombreQuestions)) : 0
  const brut = n * CHRONO_SECONDES_PAR_QUESTION
  return Math.max(CHRONO_MIN_SECONDES, Math.min(CHRONO_MAX_SECONDES, brut))
}

/**
 * Le temps qu'il reste après une réponse : une bonne rend `BONUS`, une erreur
 * ne change rien. Jamais au-dessus du plafond, jamais sous zéro.
 */
export function chronoApresReponse(secondes: number, bonne: boolean): number {
  const s = Number.isFinite(secondes) ? secondes : 0
  const suivant = bonne ? s + CHRONO_BONUS_BONNE_REPONSE : s
  return Math.max(0, Math.min(CHRONO_MAX_SECONDES, suivant))
}

/** Une seconde de moins — plancher zéro. */
export function chronoTick(secondes: number): number {
  return Math.max(0, Math.floor(secondes) - 1)
}

/** Le budget est-il épuisé ? */
export function tempsEcoule(secondes: number): boolean {
  return secondes <= 0
}

/** Le cadran doit-il s'alarmer ? (jamais quand la manche est déjà finie) */
export function chronoEnAlerte(secondes: number): boolean {
  return secondes > 0 && secondes <= CHRONO_ALERTE_SECONDES
}

/** « 1:36 », « 0:07 » — le format du cadran de la course (mm:ss, minutes nues). */
export function formatChrono(secondes: number): string {
  const s = Math.max(0, Math.floor(secondes))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

/** Part du budget restante, 0..1 — la jauge du cadran. */
export function chronoRatio(secondes: number, budget: number): number {
  if (budget <= 0) return 0
  return Math.max(0, Math.min(1, secondes / budget))
}
