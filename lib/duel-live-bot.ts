// -----------------------------------------------------------------------------
// LE ROBOT DU DUEL EN DIRECT — un rival d'entraînement qui joue le protocole
// du duel temps réel (components/useLiveDuel) à la place d'un second joueur.
//
// POURQUOI. Le duel en direct exige que quelqu'un scanne le QR code de l'hôte.
// Sans second appareil, l'écran d'attente ne se termine jamais, et tout ce qui
// vient après (les manches, « En attente de la manche du rival… », le verdict
// BO3, l'enregistrement) reste intestable. Le robot prend la place du joueur
// absent : il « rejoint », il déclare ses manches à son rythme, il gagne ou il
// perd — par les MÊMES fonctions (lib/duel-live.liveWinner) que le vrai duel.
//
// LA RÈGLE D'HONNÊTETÉ tient ici comme dans la course : le robot vient du banc
// (lib/duel/bots), il est marqué IA à l'écran, et il n'a pas d'établissement.
//
// Tout est PUR et DÉTERMINISTE : même robot, même graine, même manche → même
// résultat. Le transport (minuteries, état React) vit dans le hook.
// -----------------------------------------------------------------------------

import { ROUND_SIZE, seededRng } from '@/lib/defi-modes'
import { botById } from '@/lib/duel/bots'
import { paceFactor } from '@/lib/duel/rival'
import type { RoundRecord } from '@/lib/duel-live'

/** Le délai avant que le robot « rejoigne » la partie, en millisecondes. */
export const BOT_JOIN_MIN_MS = 900
export const BOT_JOIN_MAX_MS = 2200

/**
 * Temps de réflexion du robot PAR QUESTION, avant le tempérament. Plus court
 * que dans la course (3 à 7 s) : une manche de cinq questions doit se boucler
 * en 10 à 20 s, sinon l'élève qui a fini attend une demi-minute devant un
 * écran vide.
 */
export const BOT_QUESTION_MIN_MS = 2000
export const BOT_QUESTION_MAX_MS = 4200

/** Précision du robot, bornée pour que le duel reste gagnable — et perdable. */
const ACCURACY_MIN = 0.4
const ACCURACY_MAX = 0.85

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n))
}

/** Combien de temps le robot met à rejoindre, tiré de la graine. */
export function botJoinDelayMs(seed: string): number {
  const rng = seededRng(`${seed}#robot-rejoint`)
  return Math.round(BOT_JOIN_MIN_MS + rng() * (BOT_JOIN_MAX_MS - BOT_JOIN_MIN_MS))
}

/**
 * La précision d'un robot face à un élève d'un niveau donné : sa force
 * (−1..1) la déplace d'un peu, le niveau de l'élève la relève doucement — un
 * élève de niveau 10 mérite un rival qui vise mieux qu'au niveau 1.
 */
export function botAccuracy(strength: number, myLevel: number): number {
  const s = clamp(Number.isFinite(strength) ? strength : 0, -1, 1)
  const level = Number.isFinite(myLevel) ? Math.max(1, Math.floor(myLevel)) : 1
  return clamp(0.55 + 0.12 * s + 0.02 * (level - 1), ACCURACY_MIN, ACCURACY_MAX)
}

/**
 * La manche d'un robot : ses bonnes réponses et son temps, comme s'il l'avait
 * jouée. Null si le robot est inconnu — jamais une manche inventée.
 *
 * Le tempérament déforme le temps, pas la précision : une « flèche » boucle sa
 * première manche vite et ralentit, un « finisseur » fait l'inverse. La
 * progression (0 = première manche, 1 = dernière possible) rejoue la courbe
 * de la course sur l'échelle d'un BO3.
 */
export function botRound(
  botId: string,
  seed: string,
  roundIndex: number,
  myLevel = 1,
): RoundRecord | null {
  const bot = botById(botId)
  if (!bot) return null
  const round = Number.isFinite(roundIndex) ? Math.max(0, Math.floor(roundIndex)) : 0
  const rng = seededRng(`${seed}#robot-${bot.id}#manche-${round}`)
  const accuracy = botAccuracy(bot.strength, myLevel)
  // Le BO3 compte au plus trois manches : la progression va de 0 à 1 dessus.
  const progress = clamp(round / 2, 0, 1)

  let correct = 0
  let timeMs = 0
  for (let i = 0; i < ROUND_SIZE; i += 1) {
    if (rng() < accuracy) correct += 1
    const base = BOT_QUESTION_MIN_MS + rng() * (BOT_QUESTION_MAX_MS - BOT_QUESTION_MIN_MS)
    timeMs += base * paceFactor(bot.temperament, progress, rng)
  }

  return {
    round,
    correct,
    timeMs: Math.round(
      clamp(timeMs, ROUND_SIZE * BOT_QUESTION_MIN_MS * 0.7, ROUND_SIZE * BOT_QUESTION_MAX_MS * 1.6),
    ),
  }
}
