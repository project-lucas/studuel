// « Juice » des sessions de quiz et de flashcards — logique PURE (la sensation
// de récompense, pas son rendu). Les players ne font qu'afficher et jouer.
//
// L'idée : une bonne réponse isolée, c'est plat. Ce qui accroche, c'est la SÉRIE
// qui monte — le son grimpe, le badge grossit, la vibration change. C'est le
// même ressort que Duolingo/Kahoot, et c'est ce qui transforme un questionnaire
// en jeu.

/** Palier de série : dicte le ton visuel ET sonore de la récompense. */
export type ComboTier = 'aucun' | 'chaud' | 'feu' | 'inarretable'

// Seuils choisis courts exprès : la première récompense tombe dès 2 bonnes
// réponses, sinon l'élève abandonne avant d'avoir goûté à l'escalade.
export const COMBO_HOT = 2
export const COMBO_FIRE = 4
export const COMBO_UNSTOPPABLE = 7

export function comboTier(streak: number): ComboTier {
  if (streak >= COMBO_UNSTOPPABLE) return 'inarretable'
  if (streak >= COMBO_FIRE) return 'feu'
  if (streak >= COMBO_HOT) return 'chaud'
  return 'aucun'
}

/** Texte du badge de série, ou null quand il n'y a rien à fêter. */
export function comboLabel(streak: number): string | null {
  switch (comboTier(streak)) {
    case 'inarretable':
      return `Inarrêtable ×${streak}`
    case 'feu':
      return `En feu ×${streak}`
    case 'chaud':
      return `×${streak}`
    default:
      return null
  }
}

// Demi-tons ajoutés à la note de récompense selon la série. On monte d'un
// demi-ton par bonne réponse, PLAFONNÉ : sans plafond la récompense finit dans
// les aigus désagréables et se retourne contre le joueur.
export const MAX_COMBO_SEMITONES = 12

export function comboSemitones(streak: number): number {
  if (streak <= 1) return 0
  return Math.min(streak - 1, MAX_COMBO_SEMITONES)
}

/** Fréquence d'une note transposée de `semitones` demi-tons (gamme tempérée). */
export function transpose(freq: number, semitones: number): number {
  return freq * Math.pow(2, semitones / 12)
}

// Vibrations (ms). Courte et sèche sur une bonne réponse — une vibration longue
// à chaque question deviendrait vite agaçante ; un motif à deux temps sur une
// erreur, qui se ressent comme un « non ».
export const BUZZ_GOOD = 12
export const BUZZ_GREAT = 22
export const BUZZ_WRONG: number[] = [18, 40, 18]

/** Motif de vibration d'une réponse, selon qu'elle est juste et sa série. */
export function buzzPattern(good: boolean, streak: number): number | number[] {
  if (!good) return BUZZ_WRONG
  return comboTier(streak) === 'aucun' ? BUZZ_GOOD : BUZZ_GREAT
}
