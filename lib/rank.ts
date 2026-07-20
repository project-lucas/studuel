// Rangs compétitifs « façon League of Legends » — logique pure, sans React ni
// Supabase. Remplace l'échelle des arènes scolaires (cf. lib/trophies.ts) par
// 6 PALIERS (Bronze → Maître) subdivisés en DIVISIONS en chiffres romains
// (IV → I). Le moteur reste le compteur de trophées de trophies.ts (barème
// Elo-lite inchangé) ; ce module ne fait que traduire un total de trophées en
// « Or III », avec la progression dans la division (barre de « LP »). Les
// classements géographiques (département / région / national) restent
// purement informatifs et vivent ailleurs (lib/geo.ts) — ici on ne parle que
// du rang de saison. Tout est testable ; l'UI et le serveur n'orchestrent.

// -------------------------------------------------------------------- paliers
// L'ordre est croissant. Chaque palier hors sommet porte 4 divisions ; le
// sommet (« Maître ») n'a pas de division — c'est le rang ouvert du haut, où
// l'on continue d'empiler des trophées sans redescendre d'échelon.

export type RankTierId =
  | 'bronze'
  | 'argent'
  | 'or'
  | 'platine'
  | 'diamant'
  | 'maitre'

export type RankTier = {
  id: RankTierId
  /** Nom affiché, ex. « Or ». */
  name: string
  /** Blason illustré (chemin `/images/...`). */
  image: string
  /** Emoji de repli, tant que le blason webp n'est pas en place. */
  emoji: string
  /** Le sommet (Maître) n'a pas de divisions. */
  hasDivisions: boolean
}

// Dossier des blasons (planche LoL découpée en 6 webp transparents).
const RANK_IMG = '/images/defi/ranks'

export const RANK_TIERS: readonly RankTier[] = [
  { id: 'bronze', name: 'Bronze', image: `${RANK_IMG}/bronze.webp`, emoji: '🥉', hasDivisions: true },
  { id: 'argent', name: 'Argent', image: `${RANK_IMG}/argent.webp`, emoji: '🥈', hasDivisions: true },
  { id: 'or', name: 'Or', image: `${RANK_IMG}/or.webp`, emoji: '🥇', hasDivisions: true },
  { id: 'platine', name: 'Platine', image: `${RANK_IMG}/platine.webp`, emoji: '💠', hasDivisions: true },
  { id: 'diamant', name: 'Diamant', image: `${RANK_IMG}/diamant.webp`, emoji: '🔷', hasDivisions: true },
  { id: 'maitre', name: 'Maître', image: `${RANK_IMG}/maitre.webp`, emoji: '👑', hasDivisions: false },
]

// -------------------------------------------------------------------- barème
// Une division vaut DIVISION_SPAN trophées ; chaque palier hors sommet en
// compte DIVISIONS_PER_TIER. Le sommet commence donc à
// (nb paliers à divisions) × DIVISIONS_PER_TIER × DIVISION_SPAN trophées.
// Gardé simple et rond (100 trophées/division) : ~3 à 8 victoires classées par
// division avec le barème Elo-lite (gain 12→40), ce qui donne une montée
// lisible sans être interminable.

export const DIVISION_SPAN = 100
export const DIVISIONS_PER_TIER = 4

// Les paliers qui portent des divisions, dans l'ordre (tout sauf le sommet).
const DIVISIONED_TIERS = RANK_TIERS.filter((t) => t.hasDivisions)

// Seuil d'entrée du sommet (Maître).
export const APEX_FLOOR =
  DIVISIONED_TIERS.length * DIVISIONS_PER_TIER * DIVISION_SPAN

// Chiffres romains d'une division, de la plus basse (index 0 = IV) à la plus
// haute (index 3 = I) — on gravit de IV vers I, convention LoL.
const DIVISION_ROMAN = ['IV', 'III', 'II', 'I'] as const

/** Le chiffre romain d'un index de division 0..3 (IV, III, II, I). */
export function divisionRoman(divisionIndex: number): string {
  const i = Math.max(0, Math.min(DIVISIONS_PER_TIER - 1, Math.floor(divisionIndex)))
  return DIVISION_ROMAN[i]
}

// ---------------------------------------------------------------------- rang
// Le rang complet pour un total de trophées : palier, division (null au
// sommet), progression 0..1 dans la division/le sommet, et les bornes utiles à
// l'affichage de la barre de LP.

export type Rank = {
  tier: RankTier
  /** Index de division 0..3 (0 = IV … 3 = I), ou null au sommet (Maître). */
  divisionIndex: number | null
  /** Chiffre romain de la division, ou null au sommet. */
  roman: string | null
  /** Palier + division en un mot, ex. « Or III » ou « Maître ». */
  label: string
  /** Progression 0..1 dans la division courante (1 au sommet). */
  progress: number
  /** Trophées jusqu'à la division/au palier suivant (0 au sommet). */
  toNext: number
  /** Trophées dans la division courante (0..DIVISION_SPAN au sommet : total au-dessus du seuil). */
  inDivision: number
  /** Borne basse de la division courante (seuil d'entrée). */
  floor: number
  /** Borne haute (null au sommet, ouvert). */
  ceiling: number | null
}

/** Traduit un total de trophées en rang (palier + division + progression). */
export function rankFor(trophies: number): Rank {
  const t = Math.max(0, Math.floor(trophies))

  // Sommet : Maître, pas de division, échelle ouverte vers le haut.
  if (t >= APEX_FLOOR) {
    const apex = RANK_TIERS[RANK_TIERS.length - 1]
    return {
      tier: apex,
      divisionIndex: null,
      roman: null,
      label: apex.name,
      progress: 1,
      toNext: 0,
      inDivision: t - APEX_FLOOR,
      floor: APEX_FLOOR,
      ceiling: null,
    }
  }

  // Divisions : on découpe en tranches de DIVISION_SPAN trophées.
  const globalDivision = Math.floor(t / DIVISION_SPAN) // 0..(N-1)
  const tierIndex = Math.floor(globalDivision / DIVISIONS_PER_TIER)
  const divisionIndex = globalDivision % DIVISIONS_PER_TIER
  const tier = DIVISIONED_TIERS[tierIndex]

  const floor = globalDivision * DIVISION_SPAN
  const ceiling = floor + DIVISION_SPAN
  const inDivision = t - floor
  const roman = divisionRoman(divisionIndex)

  return {
    tier,
    divisionIndex,
    roman,
    label: `${tier.name} ${roman}`,
    progress: inDivision / DIVISION_SPAN,
    toNext: ceiling - t,
    inDivision,
    floor,
    ceiling,
  }
}

// --------------------------------------------------------- palier <-> seuil
// Utilitaires d'affichage : le seuil d'entrée d'un palier (première division,
// IV) et le rang le plus bas d'un palier — pratiques pour dessiner l'échelle
// complète (aperçu « prochain palier ») sans recalculer à la main.

/** Seuil de trophées d'entrée d'un palier (sa division IV, ou APEX_FLOOR au sommet). */
export function tierFloor(tierId: RankTierId): number {
  const idx = DIVISIONED_TIERS.findIndex((t) => t.id === tierId)
  if (idx === -1) return APEX_FLOOR // le sommet
  return idx * DIVISIONS_PER_TIER * DIVISION_SPAN
}

/** Le palier suivant (null si déjà au sommet), pour un rang donné. */
export function nextTier(tierId: RankTierId): RankTier | null {
  const idx = RANK_TIERS.findIndex((t) => t.id === tierId)
  if (idx === -1 || idx >= RANK_TIERS.length - 1) return null
  return RANK_TIERS[idx + 1]
}
