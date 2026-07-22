// XP & niveaux — ANCIEN système dérivé de l'activité, conservé comme REPLI.
//
// Depuis la migration 192, la source de vérité de l'XP est le portefeuille
// stocké (user_wallet + xp_events, barème forfaitaire dans lib/wallet.ts).
// Ce module reste pour deux usages précis :
//   • `computeXp` — repli d'affichage tant que le portefeuille n'existe pas
//     (migration pas passée, ou compte sans activité depuis) ; c'est AUSSI la
//     formule que la RPC `wallet_ensure` (192) rejoue en SQL pour rétro-remplir
//     l'XP d'ouverture du portefeuille — toute évolution doit toucher les deux ;
//   • `XP_RULES` — barème de l'ARÈNE Défi (modes Blitz/Boss/Chrono…), dont
//     l'XP par session reste proportionnelle au score, enregistrée avec la
//     session puis versée au portefeuille via la source 'defi_arena'.
// Les niveaux et titres vivent désormais dans lib/wallet.walletLevelInfo.

import { XP_AWARDS, xpForQuiz } from '@/lib/wallet'

export const XP_RULES = {
  quizPerCorrect: 10,
  quizBonus: 20,
  deckPerCard: 5,
  deckBonus: 20,
  lesson: 15,
  challengePerCorrect: 10,
  challengeBonus: 30, // le défi du jour paye un peu plus : c'est LE geste
  commuteBonus: 20, // exploit de trajet : défi joué pendant le trajet retour
} as const

export function computeXp(input: {
  quizzes: { score: number }[]
  decks: { cards_count: number }[]
  lessonsCount: number
  challengesXp: number
}): number {
  const quizXp = input.quizzes.reduce(
    (s, q) => s + q.score * XP_RULES.quizPerCorrect + XP_RULES.quizBonus,
    0,
  )
  const deckXp = input.decks.reduce(
    (s, d) => s + d.cards_count * XP_RULES.deckPerCard + XP_RULES.deckBonus,
    0,
  )
  return (
    quizXp + deckXp + input.lessonsCount * XP_RULES.lesson + input.challengesXp
  )
}

// Paliers cumulés → titres fun (jamais scolaires).
const LEVELS: { xp: number; title: string }[] = [
  { xp: 0, title: 'Nouveau 🐣' },
  { xp: 100, title: 'Apprenti 🌱' },
  { xp: 250, title: 'Curieux 🔍' },
  { xp: 500, title: 'Régulier 🔁' },
  { xp: 900, title: 'Sérieux 📈' },
  { xp: 1400, title: 'Cerveau en construction 🧠' },
  { xp: 2000, title: 'Machine à réviser ⚙️' },
  { xp: 3000, title: 'Stratège 🎯' },
  { xp: 4500, title: 'Expert 🏅' },
  { xp: 6500, title: 'Légende 👑' },
]

export type LevelInfo = {
  level: number // 1..10
  title: string
  currentXp: number
  nextAt: number | null // XP du prochain palier (null au max)
  progress: number // 0..1 vers le prochain palier
}

export function levelFor(xp: number): LevelInfo {
  let index = 0
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) index = i
  }
  const next = LEVELS[index + 1] ?? null
  const floor = LEVELS[index].xp
  return {
    level: index + 1,
    title: LEVELS[index].title,
    currentXp: xp,
    nextAt: next ? next.xp : null,
    progress: next ? (xp - floor) / (next.xp - floor) : 1,
  }
}

// XP gagnée par UNE session, pour l'annoncer à l'élève à la fin.
//
// Aligné sur le barème FORFAITAIRE du portefeuille (lib/wallet.XP_AWARDS) :
// c'est ce que la Server Action verse réellement, donc ce que l'écran de fin
// doit annoncer — la promesse « +20 XP » affichée sur l'item avant de jouer et
// la récompense affichée après doivent être le même nombre.
//
// L'XP tombe MÊME à 0 bonne réponse : on récompense d'être venu réviser, on ne
// punit pas l'échec (doctrine du projet, cf. la douceur du barème de trophées).
export function sessionXp(
  kind: 'quiz' | 'deck' | 'review',
  score: number,
  total: number,
): number {
  if (kind === 'deck') return XP_AWARDS.flashcards
  // Une session « À revoir » paye comme un quiz : c'est le geste qu'on veut
  // quotidien, il ne doit pas rapporter moins que le quiz de la leçon.
  return xpForQuiz(score, total)
}
