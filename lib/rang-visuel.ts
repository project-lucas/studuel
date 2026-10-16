// -----------------------------------------------------------------------------
// LE RANG SE VOIT : le cadre de l'avatar et le blason de la ligue, PAR DIVISION.
//
// 15/10/2026, Lucas : « des cadres fins propres autour de l'avatar, comme
// League of Legends », « le rang en chiffres romains », « chaque bannière par
// rang (argent 1, 2, 3) différente du rang d'avant, un léger changement mais un
// changement quand même ». Le rang est la division de ligue (lib/ligue :
// Bronze IV → Maître) ; chaque division a son anneau (scripts/cadres-rang.mjs)
// et son blason assorti (scripts/blasons-ligue.mjs) : IV l'anneau seul, III des
// rivets, II des lauriers, I des ailes et une gemme. Maître, sans division,
// garde un dessin unique.
//
// Pur : les chemins d'images et le chiffre romain, rien d'autre.
// -----------------------------------------------------------------------------

import type { RankTierId } from '@/lib/rank'

const ROMAINS: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV' }

/** 4 → « IV » ; une division hors échelle s'écrit en chiffres arabes. */
export function divisionRomaine(division: number): string {
  return ROMAINS[division] ?? String(division)
}

/** Le dessin d'un rang à une division (null : Maître, sans division). */
function cle(rang: RankTierId, division: number | null): string {
  return division === null ? rang : `${rang}-${division}`
}

/** L'anneau autour de l'avatar : `public/images/rangs/cadres/<rang>-<division>.webp`. */
export function cadreDeRang(rang: RankTierId, division: number | null): string {
  return `/images/rangs/cadres/${cle(rang, division)}.webp`
}

/**
 * Le blason de la ligue : `public/images/rangs/blasons/<rang>-<division>.webp`.
 * Maître garde le blason couronné d'origine (`defi/ranks/maitre.webp`).
 */
export function blasonDeRang(rang: RankTierId, division: number | null): string {
  if (division === null) return '/images/defi/ranks/maitre.webp'
  return `/images/rangs/blasons/${cle(rang, division)}.webp`
}

/**
 * Le trou de l'anneau, en part du carré de l'image : la photo se pose là,
 * DERRIÈRE l'anneau (scripts/cadres-rang.mjs, `MARGE` = 1,9 trou par côté).
 * Un peu plus large que le trou, pour que la photo passe sous le métal.
 */
export const TROU_CADRE = 1 / 1.9 + 0.03

/** La plaque du bas de l'anneau (son centre), où s'écrit la division. */
export const PLAQUE_CADRE_Y = 0.816

/** « IV » → 4 ; `null` sans division (Maître) ou chiffre inconnu. */
export function divisionDepuisRomain(roman: string | null | undefined): number | null {
  if (!roman) return null
  const trouve = Object.entries(ROMAINS).find(([, r]) => r === roman)
  return trouve ? Number(trouve[0]) : null
}
