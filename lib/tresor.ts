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

// Récompense minimale telle que renvoyée par le tirage SERVEUR (open_chest_v2,
// migration 168) : le serveur ne renvoie que le strict nécessaire (kind +
// amount OU item_id), le libellé et l'emoji d'affichage sont ré-résolus ici.
export type ServerReward = {
  kind?: string | null
  amount?: number | null
  item_id?: string | null
}

// Reconstitue un ChestReward affichable à partir de la récompense autoritaire
// du serveur. Renvoie null si le payload est incohérent (montant NaN/négatif,
// carte inconnue) — l'appelant traite alors l'ouverture comme indisponible
// plutôt que d'afficher une fausse récompense.
export function resolveServerReward(
  raw: ServerReward | null | undefined,
): ChestReward | null {
  if (!raw) return null

  if (raw.kind === 'coins') {
    const amount = Number(raw.amount)
    if (!Number.isFinite(amount) || amount <= 0) return null
    // Réutilise l'entrée du catalogue (emoji/label soignés) quand le montant
    // correspond à un palier connu ; sinon, libellé générique.
    const known = CHEST_REWARDS.find(
      (r) => r.kind === 'coins' && r.amount === amount,
    )
    if (known) return known
    return { kind: 'coins', amount, emoji: '🪙', label: `+${amount} pièces`, weight: 0 }
  }

  if (raw.kind === 'sticker' && raw.item_id) {
    const card = COLLECTION_CATALOG.find((c) => c.id === raw.item_id)
    if (!card) return null
    return {
      kind: 'sticker',
      emoji: card.emoji,
      label: `Carte « ${card.name} » débloquée !`,
      weight: 0,
      itemId: card.id,
    }
  }

  return null
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
    // « Thème Nuit étoilée » RETIRÉ de la boutique : le mode sombre est
    // neutralisé au niveau du document (`<html class="light">` dans
    // app/layout.tsx, choix assumé du design system crème & violet). L'article
    // était donc invendable — un élève pouvait dépenser 150 pièces pour un fond
    // sombre que l'app est structurellement incapable d'afficher. À réintroduire
    // le jour où le mode sombre existera vraiment.
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
    // ─────────────────────────────────────── les consommables qui SERVENT
    // La boutique ne vendait que du décor, sauf le gel de série et le double XP.
    // Une monnaie dont tous les articles s'achètent une fois pour toutes finit
    // par n'avoir plus rien à acheter — et cesse d'être une monnaie. Ces trois-là
    // se rachètent, et ils aident à APPRENDRE plutôt qu'à se montrer.
    //
    // ⚠️ AUCUN NE DONNE DE CONTENU. Ils achètent du temps et du confort : c'est
    // la ligne qui sépare l'écu de la gemme, et elle ne se franchit pas.
    {
      id: 'indice',
      name: 'Indice',
      desc: 'Élimine une mauvaise réponse sur une question difficile.',
      price: 40,
      emoji: '💡',
      kind: 'boost',
    },
    {
      id: 'seconde-chance',
      name: 'Seconde chance',
      desc: 'Refais une question ratée à la fin du quiz.',
      price: 60,
      emoji: '↩️',
      kind: 'boost',
    },
    {
      id: 'relance-coffre',
      name: 'Relance de coffre',
      desc: 'Retire au sort une seconde fois sur le même coffre.',
      price: 90,
      emoji: '🎲',
      kind: 'boost',
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

// ---------------------------------------------------------- la boutique du jour
//
// POURQUOI FAIRE TOURNER. Le catalogue tenait sur un écran et ne bougeait
// jamais : une fois les articles achetés, l'onglet Trésor n'avait plus rien à
// montrer, et l'écu plus rien à acheter. C'est le geste de Clash Royale — la
// raison d'ouvrir la boutique chaque jour n'est pas l'article, c'est de VOIR
// LEQUEL.
//
// TIRAGE DÉTERMINISTE, jamais aléatoire : la même journée montre la même
// boutique à la même personne, quel que soit le nombre de rechargements. Un
// tirage au hasard donnerait une vitrine qui change à chaque F5 — c'est-à-dire
// une vitrine à laquelle on ne peut pas se fier.

/** Remise de l'article en promotion. */
export const PROMO_REMISE = 0.3

/** Nombre d'articles présentés chaque jour. */
export const TAILLE_VITRINE = 4

export type ArticleDuJour = ShopItem & {
  /** L'article du jour en promotion — il y en a exactement un. */
  promo: boolean
  /** Prix réellement demandé, remise comprise. */
  prixAffiche: number
}

/** Entier stable tiré d'une chaîne (djb2). Même clé, même nombre, partout. */
function graine(cle: string): number {
  let h = 5381
  for (let i = 0; i < cle.length; i += 1) h = ((h * 33) ^ cle.charCodeAt(i)) >>> 0
  return h >>> 0
}

/**
 * La vitrine d'un jour : `TAILLE_VITRINE` articles, dont un en promotion.
 *
 * L'OFFSET TOURNE D'UN CRAN PAR JOUR plutôt que de tirer au sort : sur un
 * catalogue de N articles, chacun revient tous les N/4 jours environ, et aucun
 * ne peut disparaître des semaines par malchance. Un vrai tirage laisserait des
 * trous — et c'est justement l'article qu'on attend qui ne sortirait jamais.
 *
 * `jour` est une clé UTC 'YYYY-MM-DD' (lib/time), la même que partout ailleurs.
 */
export function boutiqueDuJour(
  jour: string,
  catalogue: readonly ShopItem[] = SHOP_CATALOG,
  taille: number = TAILLE_VITRINE,
): ArticleDuJour[] {
  const n = catalogue.length
  if (n === 0 || taille <= 0) return []
  const combien = Math.min(taille, n)

  // Le jour donne un point de départ ; on avance ensuite d'un cran, si bien que
  // la vitrine de demain chevauche celle d'aujourd'hui — la rotation se voit
  // sans que tout change d'un coup.
  const depart = graine(jour) % n
  const choisis: ShopItem[] = []
  for (let i = 0; i < combien; i += 1) choisis.push(catalogue[(depart + i) % n])

  // La promo tombe sur un rang de la vitrine, pas sur un article : un même
  // article n'est donc pas soldé deux jours de suite parce qu'il est « le bon ».
  const rangPromo = graine(`${jour}:promo`) % combien

  return choisis.map((article, rang) => {
    const promo = rang === rangPromo
    return {
      ...article,
      promo,
      prixAffiche: promo
        ? Math.max(1, Math.round(article.price * (1 - PROMO_REMISE)))
        : article.price,
    }
  })
}
