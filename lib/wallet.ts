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
//
// L'XP MESURE CE QU'ON A ACQUIS, PAS CE QU'ON A CLIQUÉ.
//
// Elle a d'abord compté les gestes : quiz 20, flashcards 10, défi 25, sans
// distinguer la première fois de la cinquantième. Un élève qui refaisait le même
// quiz facile cinquante fois montait de niveau exactement comme celui qui avait
// maîtrisé cinquante chapitres — le niveau ne disait donc rien de lui.
//
// LE MODÈLE VIENT DE CLASH ROYALE, et il est contre-intuitif : on n'y gagne pas
// d'XP en jouant des matchs, on en gagne en AMÉLIORANT SES CARTES. Le King Level
// ne mesure pas le temps passé, il mesure la collection qu'on a bâtie. Transposé
// ici : l'XP ne paye que l'ACQUISITION, et chaque acquisition ne se paye
// qu'UNE FOIS — l'index `xp_events_once_per_key` (migration 192) le garantit,
// puisque toute source porte désormais une clé obligatoire.
//
// CE QU'ON NE RETIRE PAS. Rejouer continue de payer en trophées (le classement),
// en couronnes (la piste de saison) et en écus (la boutique). Seule l'XP
// s'arrête, parce qu'elle dit désormais autre chose : on sépare « j'ai joué » de
// « j'ai appris », et chaque unité en prend une.
//
// ORDRE DE GRANDEUR VOULU. Un élève de 4e a ~250 leçons et ~60 chapitres :
// 250 × 5 + 60 × 130 ≈ 9 000 XP, soit le niveau 14 pour une année entièrement
// travaillée. Le niveau est donc BORNÉ par le programme, plus par l'endurance.

/** XP forfaitaire par acquisition — affichée avant le geste (« +5 XP »). */
export const XP_AWARDS = {
  /** Une leçon lue, la première fois. */
  lecon: 5,
  /** Une carte de révision qui passe en « acquise » (intervalle ≥ 21 j). */
  carte: 5,
  /** La 1re couronne d'un chapitre. */
  couronne1: 30,
  /** La 2e. */
  couronne2: 40,
  /** La 3e — le chapitre est maîtrisé. */
  couronne3: 60,
} as const

/** Sources d'XP encore versées. Toutes exigent une clé : rien n'est répétable. */
export type XpSource = keyof typeof XP_AWARDS

/**
 * Sources HISTORIQUES, plus jamais versées.
 *
 * Elles restent déclarées parce que `xp_events` en contient des centaines de
 * milliers de lignes et que le CHECK de la table les accepte toujours. L'XP
 * déjà gagnée reste acquise — c'est le SOCLE GELÉ : personne ne redescend d'un
 * niveau parce que le barème a changé. Seuls les versements NEUFS s'arrêtent.
 */
export type XpSourceHistorique =
  | 'quiz'
  | 'quiz_top'
  | 'flashcards'
  | 'defi'
  | 'defi_arena'
  | 'quests'
  | 'clan_week'

/** La source d'XP du palier de couronne franchi (1, 2 ou 3). */
export function couronneSource(palier: 1 | 2 | 3): XpSource {
  return palier === 1 ? 'couronne1' : palier === 2 ? 'couronne2' : 'couronne3'
}

/**
 * Les paliers de couronne franchis en passant de `avant` à `apres`.
 *
 * Un seul quiz peut faire sauter un chapitre de 0 à 3 couronnes : il doit alors
 * payer les TROIS paliers (30 + 40 + 60), pas seulement le dernier. À l'inverse
 * une régression ne rend rien — l'XP ne redescend jamais, c'est ce qui la rend
 * lisible comme un CV.
 */
export function paliersFranchis(avant: number, apres: number): (1 | 2 | 3)[] {
  const de = Math.max(0, Math.min(3, Math.floor(avant)))
  const a = Math.max(0, Math.min(3, Math.floor(apres)))
  const out: (1 | 2 | 3)[] = []
  for (let p = de + 1; p <= a; p += 1) out.push(p as 1 | 2 | 3)
  return out
}

/** L'XP totale que valent les paliers franchis de `avant` à `apres`. */
export function xpPourCouronnes(avant: number, apres: number): number {
  return paliersFranchis(avant, apres).reduce(
    (somme, palier) => somme + XP_AWARDS[couronneSource(palier)],
    0,
  )
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
  /** Victoire d'un défi — UNE FOIS PAR JOUR, toutes leçons confondues.
   *  La clé valait « leçon:jour » : la migration 348 la ramène au seul jour,
   *  et c'est le serveur qui la fixe — celle de l'appelant est ignorée. */
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
