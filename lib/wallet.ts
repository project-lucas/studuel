// Portefeuille de progression — XP stocké, niveau, série, gains de gemmes.
//
// C'est la SOURCE UNIQUE du nouveau système d'économie (migration 192) :
//   • l'XP se GAGNE par activité (barème forfaitaire ci-dessous), s'écrit en
//     base (user_wallet + xp_events) côté Server Action uniquement, et n'est
//     plus recalculée depuis l'historique (lib/xp.computeXp ne sert plus que
//     de repli d'affichage tant que le portefeuille n'existe pas) ;
//   • le NIVEAU est un palier cumulatif simple : passer du niveau n au niveau
//     n+1 coûte 100 × n XP (niveau 2 à 100 XP, niveau 3 à 300, niveau 4 à
//     600…) ;
//   • les GEMMES 💎 restent la monnaie du contenu (lib/gems.ts) mais gagnent
//     ici leurs sources de JEU — rares et jalonnées, jamais sur une activité
//     standard : chapitre 3 couronnes, palier de série, victoire de défi,
//     passage de niveau.
//
// Miroir SQL assumé : les fonctions `wallet_award_xp` / `wallet_award_gems`
// de la migration 192 reprennent CES montants et CETTE formule de niveau.
// Toute évolution doit toucher les deux.

// ------------------------------------------------------------------ barème XP

/** XP forfaitaire par activité — affiché sur l'item AVANT de jouer (« +20 XP »). */
export const XP_AWARDS = {
  /** Quiz complété. */
  quiz: 20,
  /** Bonus de quiz brillant (≥ QUIZ_BONUS_RATIO de bonnes réponses). */
  quizBonus: 10,
  /** Session de flashcards terminée. */
  flashcards: 10,
  /** Défi de leçon relevé (gagné ou perdu : on récompense d'avoir joué). */
  defi: 25,
} as const

/** Seuil du bonus de quiz : 8/10 et au-delà. */
export const QUIZ_BONUS_RATIO = 0.8

/** Sources d'XP acceptées par la RPC `wallet_award_xp` (miroir SQL). */
export type XpSource = 'quiz' | 'quiz_top' | 'flashcards' | 'defi' | 'defi_arena'

/** XP d'un quiz terminé : forfait + bonus si ≥ 8/10. */
export function xpForQuiz(score: number, total: number): number {
  return XP_AWARDS.quiz + (isQuizTop(score, total) ? XP_AWARDS.quizBonus : 0)
}

/** Le quiz mérite-t-il le bonus (≥ 80 % de bonnes réponses) ? */
export function isQuizTop(score: number, total: number): boolean {
  return total > 0 && score / total >= QUIZ_BONUS_RATIO
}

/** Source RPC d'un quiz selon son score (le montant est fixé côté SQL). */
export function quizXpSource(score: number, total: number): XpSource {
  return isQuizTop(score, total) ? 'quiz_top' : 'quiz'
}

// ------------------------------------------------------------------- niveaux

// Passer du niveau n au niveau n+1 coûte 100 × n XP. Le total cumulé pour
// ATTEINDRE le niveau L vaut donc 100 × (1 + 2 + … + (L−1)) = 50·L·(L−1).
export const XP_PER_LEVEL_STEP = 100

/** XP cumulé nécessaire pour atteindre le niveau `level` (0 au niveau 1). */
export function xpForLevel(level: number): number {
  const l = Math.max(1, Math.floor(level))
  return 50 * l * (l - 1)
}

/** Niveau atteint avec `xp` XP cumulés (≥ 1). */
export function levelFromXp(xp: number): number {
  const safe = Math.max(0, Math.floor(xp))
  // Inverse de xpForLevel : 50·L² − 50·L − xp ≤ 0.
  return Math.max(1, Math.floor((1 + Math.sqrt(1 + safe / 12.5)) / 2))
}

// Titres fun par niveau (jamais scolaires) — hérités de l'ancien système,
// re-mappés sur les nouveaux paliers. Au-delà du dernier, le titre reste.
const LEVEL_TITLES = [
  'Nouveau 🐣',
  'Apprenti 🌱',
  'Curieux 🔍',
  'Régulier 🔁',
  'Sérieux 📈',
  'Cerveau en construction 🧠',
  'Machine à réviser ⚙️',
  'Stratège 🎯',
  'Expert 🏅',
  'Légende 👑',
] as const

export type WalletLevelInfo = {
  level: number
  title: string
  currentXp: number
  /** XP cumulé du prochain niveau. */
  nextAt: number
  /** Progression 0..1 vers le prochain niveau. */
  progress: number
}

export function walletLevelInfo(xp: number): WalletLevelInfo {
  const currentXp = Math.max(0, Math.floor(xp))
  const level = levelFromXp(currentXp)
  const floor = xpForLevel(level)
  const nextAt = xpForLevel(level + 1)
  return {
    level,
    title: LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1],
    currentXp,
    nextAt,
    progress: Math.min(1, (currentXp - floor) / (nextAt - floor)),
  }
}

// -------------------------------------------------------------- gains de 💎

/**
 * Les SEULES sources de gemmes en jeu — jamais sur une activité standard,
 * sinon la monnaie du contenu perd sa rareté (cf. doctrine de lib/gems.ts).
 * Montants dans l'échelle ×30 de la migration 192 (un chapitre coûte 30).
 */
export const GEM_AWARDS = {
  /** Chapitre complété 3 couronnes (une seule fois par chapitre). */
  chapterCrowns: 30,
  /** Palier de série : tous les 7 jours consécutifs. */
  streak7: 20,
  /** Victoire d'un défi (une fois par leçon et par jour). */
  defiWin: 10,
  /** Passage de niveau (une seule fois par niveau). */
  levelUp: 15,
} as const

export type GemSource = keyof typeof GEM_AWARDS

/** Un palier de série (multiple de 7 jours) vient-il d'être atteint ? */
export const STREAK_REWARD_EVERY = 7

export function isStreakMilestone(streakDays: number): boolean {
  const d = Math.floor(streakDays)
  return d > 0 && d % STREAK_REWARD_EVERY === 0
}

// ------------------------------------------------------------------- série

export type StoredStreak = {
  streakDays: number
  /** Clé UTC 'YYYY-MM-DD' de la dernière activité, null si jamais joué. */
  lastActivityDate: string | null
}

/**
 * Série stockée après une activité le jour `todayKey` : même jour → inchangée,
 * lendemain → +1, sinon → repart à 1. (L'affichage de la flamme, lui, reste
 * la série DÉRIVÉE de lib/streak — clémence Duolingo comprise ; ce compteur
 * stocké ne sert qu'à verser la récompense des paliers de 7 jours.)
 */
export function nextStreak(prev: StoredStreak, todayKey: string): StoredStreak {
  if (prev.lastActivityDate === todayKey) return prev
  const yesterday = new Date(`${todayKey}T00:00:00Z`)
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const yesterdayKey = yesterday.toISOString().slice(0, 10)
  return {
    streakDays:
      prev.lastActivityDate === yesterdayKey
        ? Math.max(0, Math.floor(prev.streakDays)) + 1
        : 1,
    lastActivityDate: todayKey,
  }
}

// ------------------------------------------------------------------ libellés

/** « +20 XP » — la promesse affichée sur l'item avant de jouer. */
export function xpChip(amount: number): string {
  return `+${Math.max(0, Math.floor(amount))} XP`
}
