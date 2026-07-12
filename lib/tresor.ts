// Économie de récompense (onglet « Trésor ») — logique pure + catalogues.
// Branché sur Supabase (018_tresor.sql) : profiles.coins, chest_opens,
// shop_purchases, collection_unlocks. Les catalogues (articles, prix, cartes)
// vivent ici ; la base ne stocke que les ids. Un visiteur non connecté voit
// la version démo (getMock*).

import { ALL_BOSSES, weeklyTrophyId } from '@/lib/bosses'

export type Rarity = 'commune' | 'rare' | 'épique' | 'légendaire'

export type ShopKind = 'boost' | 'flamme' | 'theme' | 'avatar' | 'compagnon'

export type ShopItem = {
  id: string
  name: string
  desc: string
  price: number
  emoji: string
  kind: ShopKind
  owned?: boolean
}

export type CollectItem = {
  id: string
  name: string
  emoji: string
  rarity: Rarity
  unlocked: boolean
  // Exclusif : ne sort jamais d'un coffre — se gagne par un événement
  // (ex. trophée du boss de la semaine).
  exclusive?: boolean
}

// Récompense possible d'un coffre. Poids = fréquence relative (récompense
// variable : c'est le ressort de dopamine le plus fort). Un « sticker »
// débloque une carte de collection (item_id résolu au tirage, côté serveur).
export type ChestReward =
  | { kind: 'coins'; amount: number; emoji: string; label: string; weight: number }
  | { kind: 'sticker'; emoji: string; label: string; weight: number; itemId?: string }

export const CHEST_REWARDS: ChestReward[] = [
  { kind: 'coins', amount: 10, emoji: '🪙', label: '+10 pièces', weight: 40 },
  { kind: 'coins', amount: 25, emoji: '🪙', label: '+25 pièces', weight: 30 },
  { kind: 'coins', amount: 60, emoji: '💰', label: '+60 pièces', weight: 12 },
  { kind: 'sticker', emoji: '🔥', label: 'Skin de flamme « Braise »', weight: 10 },
  { kind: 'coins', amount: 150, emoji: '💎', label: 'Jackpot : +150 pièces', weight: 5 },
  { kind: 'sticker', emoji: '⭐', label: 'Carte rare débloquée', weight: 3 },
]

// Tirage pondéré d'une récompense de coffre.
export function drawChestReward(rand: number = Math.random()): ChestReward {
  const total = CHEST_REWARDS.reduce((s, r) => s + r.weight, 0)
  let x = rand * total
  for (const r of CHEST_REWARDS) {
    x -= r.weight
    if (x <= 0) return r
  }
  return CHEST_REWARDS[0]
}

export const RARITY_LABEL: Record<Rarity, string> = {
  commune: 'Commune',
  rare: 'Rare',
  épique: 'Épique',
  légendaire: 'Légendaire',
}

// ------------------------------------------------------------------ catalogues

// Articles de la boutique (l'état « obtenu » vient de shop_purchases).
export const SHOP_CATALOG: ShopItem[] = [
    {
      id: 'freeze',
      name: 'Gel de série',
      desc: 'Sauve ta série un jour où tu ne peux pas jouer.',
      price: 120,
      emoji: '🧊',
      kind: 'boost',
    },
    {
      id: 'double',
      name: 'Double XP · 24 h',
      desc: 'Toutes tes sessions rapportent deux fois plus.',
      price: 200,
      emoji: '⚡',
      kind: 'boost',
    },
    {
      id: 'flame-blue',
      name: 'Flamme azur',
      desc: 'Une flamme de série bleu électrique.',
      price: 90,
      emoji: '🔵',
      kind: 'flamme',
    },
    {
      id: 'theme-nuit',
      name: 'Thème Nuit étoilée',
      desc: 'Un fond sombre et profond pour toute l’app.',
      price: 150,
      emoji: '🌌',
      kind: 'theme',
    },
    {
      id: 'avatar-astro',
      name: 'Avatar Astronaute',
      desc: 'Prends de la hauteur sur ton profil.',
      price: 110,
      emoji: '🚀',
      kind: 'avatar',
    },
    {
      id: 'flame-rainbow',
      name: 'Flamme arc-en-ciel',
      desc: 'Réservée aux séries de 30 jours.',
      price: 300,
      emoji: '🌈',
      kind: 'flamme',
    },
    // Accessoires du compagnon d'étude (affichés sur sa carte, onglet Moi).
    {
      id: 'compagnon-chapeau',
      name: 'Chapeau de diplômé',
      desc: 'Ton compagnon a réussi ses examens avant toi.',
      price: 130,
      emoji: '🎓',
      kind: 'compagnon',
    },
    {
      id: 'compagnon-lunettes',
      name: 'Lunettes de savant',
      desc: 'Pour un compagnon qui lit tes leçons la nuit.',
      price: 100,
      emoji: '🤓',
      kind: 'compagnon',
    },
    {
      id: 'compagnon-echarpe',
      name: 'Écharpe d’hiver',
      desc: 'Il t’accompagne même en trajet, au chaud.',
      price: 80,
      emoji: '🧣',
      kind: 'compagnon',
    },
  ]

// Cartes de collection (l'état « débloqué » vient de collection_unlocks).
// Les trophées de boss (exclusive) ne sortent jamais d'un coffre : ils se
// gagnent en battant le boss de la semaine (lib/bosses.ts).
export const COLLECTION_CATALOG: Omit<CollectItem, 'unlocked'>[] = [
  { id: 'c1', name: 'Newton', emoji: '🍎', rarity: 'commune' },
  { id: 'c2', name: 'Curie', emoji: '⚗️', rarity: 'rare' },
  { id: 'c3', name: 'Pythagore', emoji: '📐', rarity: 'commune' },
  { id: 'c4', name: 'Ada Lovelace', emoji: '💻', rarity: 'épique' },
  { id: 'c5', name: 'Einstein', emoji: '🧠', rarity: 'épique' },
  { id: 'c6', name: 'Champollion', emoji: '📜', rarity: 'rare' },
  { id: 'c7', name: 'Darwin', emoji: '🐢', rarity: 'rare' },
  { id: 'c8', name: 'Hypatie', emoji: '🔭', rarity: 'légendaire' },
  ...ALL_BOSSES.map((b) => ({
    id: weeklyTrophyId(b.id),
    name: `Trophée ${b.name}`,
    emoji: b.emoji,
    rarity: 'légendaire' as Rarity,
    exclusive: true,
  })),
]

// Fusionne catalogue + ids possédés/débloqués (lignes Supabase).
export function shopWithOwnership(ownedIds: Set<string>): ShopItem[] {
  return SHOP_CATALOG.map((i) => ({ ...i, owned: ownedIds.has(i.id) }))
}

export function collectionWithUnlocks(unlockedIds: Set<string>): CollectItem[] {
  return COLLECTION_CATALOG.map((c) => ({
    ...c,
    unlocked: unlockedIds.has(c.id),
  }))
}

// --------------------------------------------------------------- démonstration
// Version visiteur (non connecté) : un aperçu vivant de l'onglet.

export const MOCK_COINS = 340

export function getMockShop(): ShopItem[] {
  return shopWithOwnership(new Set(['theme-nuit']))
}

export function getMockCollection(): CollectItem[] {
  return collectionWithUnlocks(new Set(['c1', 'c2', 'c3', 'c4']))
}
