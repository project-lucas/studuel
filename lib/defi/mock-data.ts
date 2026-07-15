// Données mockées de l'onglet Défi. Tout est typé et centralisé ici : quand la
// couche Supabase arrivera, on remplacera ces constantes par des lectures RLS
// sans toucher aux composants.

import type {
  Chest,
  FreeMode,
  League,
  LeaguePlayer,
  RankingBoard,
  RankingEntry,
  Season,
} from './types'

/** Total de trophées du joueur (mock) — dans « Salle d'étude », 180 avant CDI… */
export const MOCK_TROPHIES = 520

export const MOCK_SEASON: Season = {
  name: 'Saison 1 · Rentrée des classes',
  endsInLabel: 'Se termine dans 12j',
  rewardIcon: '👑',
  rewardLabel: 'Cadre légendaire « Major »',
}

// --- Coffres : 1 prêt, 1 verrouillé (2h14), 2 vides ------------------------

export const MOCK_CHESTS: Chest[] = [
  {
    id: 'chest-1',
    state: 'ready',
    rarity: 'rare',
    rewards: [
      { kind: 'xp', label: '+120 XP', icon: '⭐' },
      { kind: 'cosmetic', label: 'Cadre doré', icon: '🖼️', detail: 'Rare' },
      { kind: 'boost', label: 'Boost ×2 XP', icon: '⚡', detail: '30 min' },
    ],
  },
  {
    id: 'chest-2',
    state: 'locked',
    rarity: 'commun',
    // 2h 14min = 8040 s
    unlocksInSeconds: 2 * 3600 + 14 * 60,
    rewards: [
      { kind: 'xp', label: '+60 XP', icon: '⭐' },
      { kind: 'cosmetic', label: 'Sticker « Éclair »', icon: '⚡', detail: 'Commun' },
      { kind: 'boost', label: 'Indice gratuit', icon: '💡', detail: '×3' },
    ],
  },
  { id: 'chest-3', state: 'empty', rarity: 'commun', rewards: [] },
  { id: 'chest-4', state: 'empty', rarity: 'commun', rewards: [] },
]

// --- Ligue hebdomadaire : 30 joueurs, toi 12e avec 240 XP ------------------

const LEAGUE_NAMES: readonly string[] = [
  'Nina', 'Sofia', 'Léo', 'Marius', 'Jade', 'Gabin', 'Lou', 'Ambre',
  'Rayan', 'Camille', 'Noé', 'Toi', 'Inès', 'Malo', 'Anaïs', 'Tom',
  'Lina', 'Ethan', 'Zoé', 'Sacha', 'Manon', 'Nathan', 'Chloé', 'Ilan',
  'Eva', 'Adam', 'Romy', 'Naël', 'Louna', 'Kaïs',
]

const LEAGUE_AVATARS: readonly string[] = [
  '🦊', '🐼', '🐨', '🦁', '🐸', '🦉', '🐧', '🦄',
  '🐯', '🐰', '🐺', '🚀', '🐙', '🦖', '🐝', '🐳',
  '🦩', '🐲', '🦔', '🐢', '🦌', '🐮', '🦋', '🐬',
  '🦚', '🐊', '🦥', '🐹', '🦭', '🦦',
]

// XP décroissants et réalistes, avec toi bloqué à 240 en 12e position.
const LEAGUE_XP: readonly number[] = [
  620, 585, 540, 498, 455, 410, 372, 340, 305, 288, 262, 240, 224, 205, 188,
  170, 152, 138, 120, 104, 92, 80, 68, 55, 44, 33, 24, 16, 9, 3,
]

export const MOCK_LEAGUE: League = {
  name: 'Ligue Bronze',
  tierIcon: '🥉',
  resetLabel: 'Reset lundi',
  promotionCount: 5,
  relegationCount: 5,
  players: LEAGUE_NAMES.map<LeaguePlayer>((name, i) => ({
    id: `lg-${i + 1}`,
    rank: i + 1,
    name,
    avatar: LEAGUE_AVATARS[i],
    weeklyXp: LEAGUE_XP[i],
    isMe: i === 11, // 12e
  })),
}

// --- Classements (Collège / National / Amis) --------------------------------

function fr(n: number): string {
  // Séparateur de milliers en espace fine insécable (convention française).
  return n.toLocaleString('fr-FR')
}

function xpEntry(
  id: string,
  rank: number,
  name: string,
  avatar: string,
  xp: number,
  isMe = false,
): RankingEntry {
  return { id, rank, name, avatar, score: xp, scoreLabel: `${fr(xp)} XP`, isMe }
}

export const MOCK_RANKINGS: Record<RankingBoard['scope'], RankingBoard> = {
  college: {
    scope: 'college',
    headline: '12e sur 87 élèves de 5e',
    subline: 'Collège Jean Moulin',
    entries: [
      xpEntry('col-1', 1, 'Sofia', '🐼', 4820),
      xpEntry('col-2', 2, 'Marius', '🦁', 4515),
      xpEntry('col-3', 3, 'Jade', '🦄', 4230),
      xpEntry('col-11', 11, 'Camille', '🐰', 2510),
      xpEntry('col-12', 12, 'Toi', '🚀', 2440, true),
      xpEntry('col-13', 13, 'Malo', '🐺', 2388),
    ],
    ctaLabel: 'Voir le classement complet',
  },
  national: {
    scope: 'national',
    headline: 'Top 8 % des 5e de France',
    subline: '3 214e sur 41 900 élèves',
    entries: [
      xpEntry('nat-1', 1, 'Elyas_92', '👑', 18240),
      xpEntry('nat-2', 2, 'matheuse', '🦊', 17110),
      xpEntry('nat-3', 3, 'zoé.exe', '🐲', 16480),
    ],
    ctaLabel: 'Voir le top 100',
  },
  amis: {
    scope: 'amis',
    headline: '2e sur 5 amis',
    subline: 'Ta bande cette saison',
    entries: [
      xpEntry('ami-1', 1, 'Rayan', '🐯', 3120),
      xpEntry('ami-2', 2, 'Toi', '🚀', 2440, true),
      xpEntry('ami-3', 3, 'Lou', '🐨', 2015),
      xpEntry('ami-4', 4, 'Ambre', '🦩', 1780),
      xpEntry('ami-5', 5, 'Noé', '🐧', 1204),
    ],
  },
}

// --- Modes libres (échauffement) --------------------------------------------

export const MOCK_FREE_MODES: FreeMode[] = [
  { id: 'blitz', name: 'Blitz 60s', icon: '⚡', xpLabel: '+40 XP', accent: 'jaune' },
  { id: 'chrono', name: 'Contre-la-montre', icon: '⏱️', xpLabel: '+30 XP', accent: 'teal' },
  { id: 'survie', name: 'Survie', icon: '🛡️', xpLabel: '+50 XP', accent: 'violet' },
]
