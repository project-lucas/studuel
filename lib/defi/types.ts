// Types de l'onglet Défi (route /defi). Données mockées pour cette itération
// UI, mais typées strictement pour se brancher sur Supabase plus tard.

// --- Arènes (échelle de progression par trophées) ---------------------------

export type ArenaId =
  | 'recre'
  | 'etude'
  | 'profs'
  | 'cdi'
  | 'amphi'
  | 'oral'

export interface Arena {
  id: ArenaId
  /** Nom affiché, ex. « Cour de récré ». */
  name: string
  /** Emoji de l'arène. */
  icon: string
  /** Trophées requis pour entrer dans cette arène. */
  minTrophies: number
}

// --- Coffres ----------------------------------------------------------------

export type ChestState = 'empty' | 'locked' | 'ready' | 'opening'

export type ChestRarity = 'commun' | 'rare' | 'epique'

export type ChestRewardKind = 'xp' | 'cosmetic' | 'boost'

export interface ChestReward {
  kind: ChestRewardKind
  /** Libellé de la récompense, ex. « +120 XP ». */
  label: string
  /** Emoji de la récompense. */
  icon: string
  /** Détail optionnel, ex. « Cadre doré ». */
  detail?: string
}

export interface Chest {
  id: string
  state: ChestState
  rarity: ChestRarity
  /** Secondes restantes avant déverrouillage (état `locked` uniquement). */
  unlocksInSeconds?: number
  /** Récompenses révélées à l'ouverture. */
  rewards: ChestReward[]
}

// --- Ligue hebdomadaire -----------------------------------------------------

export type LeagueZone = 'promotion' | 'safe' | 'relegation'

export interface LeaguePlayer {
  id: string
  /** Rang dans la ligue (1 = premier). */
  rank: number
  name: string
  /** Emoji d'avatar. */
  avatar: string
  /** XP gagnés cette semaine. */
  weeklyXp: number
  /** Vrai pour le joueur courant (surligné). */
  isMe: boolean
}

export interface League {
  /** Nom de la ligue, ex. « Ligue Bronze ». */
  name: string
  /** Emoji de palier. */
  tierIcon: string
  /** Libellé du reset, ex. « Reset lundi ». */
  resetLabel: string
  /** Les 30 joueurs, triés par rang croissant. */
  players: LeaguePlayer[]
  /** Nombre de places de promotion (zone verte, en tête). */
  promotionCount: number
  /** Nombre de places de relégation (zone corail, en fin). */
  relegationCount: number
}

// --- Classements (Collège / National / Amis) --------------------------------

export type RankingScope = 'college' | 'national' | 'amis'

export interface RankingEntry {
  id: string
  rank: number
  name: string
  avatar: string
  /** Valeur brute (XP ou trophées) pour un éventuel tri. */
  score: number
  /** Valeur formatée pour l'affichage, ex. « 1 240 XP ». */
  scoreLabel: string
  isMe: boolean
}

export interface RankingBoard {
  scope: RankingScope
  /** Libellé principal de contexte, ex. « 12e sur 87 élèves de 5e ». */
  headline: string
  /** Sous-libellé optionnel, ex. « Top 8 % des 5e de France ». */
  subline?: string
  entries: RankingEntry[]
  /** CTA optionnel, ex. « Voir le top 100 ». */
  ctaLabel?: string
}

// --- Saison -----------------------------------------------------------------

export interface Season {
  /** Nom de saison, ex. « Saison 1 · Rentrée des classes ». */
  name: string
  /** Temps restant, ex. « Se termine dans 12j ». */
  endsInLabel: string
  /** Emoji de la récompense de fin de saison. */
  rewardIcon: string
  /** Libellé de la récompense, ex. « Cadre légendaire ». */
  rewardLabel: string
}
