// -----------------------------------------------------------------------------
// LES RÉCOMPENSES DE NIVEAU (03/10/2026 ; revues le 04/10/2026, migration 557 :
// « le gain de gemmes doit être très rare »).
//
// Un niveau franchi est une FÊTE, plus un versement : la fête de niveau
// (components/niveau/FeteNiveau) le dit en grand, sans gemme — les 15 gemmes
// d'office de chaque niveau (192 → 368) ont disparu avec la 557.
// Reste un étage rare : TOUS LES 5 NIVEAUX, un COFFRE DE PALIER que l'élève
// ouvre lui-même (`niveau_palier_reclamer`, 556) — 10 gemmes, 25 tous les 25
// niveaux. Le prochain palier se voit à l'avance (la bulle du niveau).
//
// MIROIR de `niveau_palier_gemmes` (557). Pur et testé.
// -----------------------------------------------------------------------------

/** Ce que verse chaque niveau franchi : plus rien depuis la 557 (c'était 15). */
export const GEMMES_PAR_NIVEAU = 0

/** Un palier tous les N niveaux. */
export const PAS_PALIER = 5

/** Gemmes d'un coffre de palier : 10, et 25 tous les 25 niveaux. */
export const GEMMES_PALIER = 10
export const GEMMES_GRAND_PALIER = 25
export const PAS_GRAND_PALIER = 25

export function estPalier(niveau: number): boolean {
  return Number.isInteger(niveau) && niveau >= PAS_PALIER && niveau % PAS_PALIER === 0
}

/** Gemmes du coffre de palier d'un niveau (0 si ce n'est pas un palier). */
export function gemmesPalier(niveau: number): number {
  if (!estPalier(niveau)) return 0
  return niveau % PAS_GRAND_PALIER === 0 ? GEMMES_GRAND_PALIER : GEMMES_PALIER
}

/** Le premier palier strictement après `niveau`. */
export function prochainPalier(niveau: number): number {
  const n = Math.max(1, Math.floor(Number.isFinite(niveau) ? niveau : 1))
  return (Math.floor(n / PAS_PALIER) + 1) * PAS_PALIER
}

/** Les paliers atteints (≤ niveau) dont le coffre n'a pas été ouvert. */
export function paliersAOuvrir(niveau: number, ouverts: readonly number[]): number[] {
  const deja = new Set(ouverts)
  const out: number[] = []
  for (let p = PAS_PALIER; p <= niveau; p += PAS_PALIER) if (!deja.has(p)) out.push(p)
  return out
}

export type RecompenseNiveau = {
  niveau: number
  /** Le coffre de palier, à ouvrir (null hors palier). */
  coffre: { gemmes: number } | null
}

/** Ce que rapporte l'arrivée à un niveau. */
export function recompenseNiveau(niveau: number): RecompenseNiveau {
  const coffre = gemmesPalier(niveau)
  return { niveau, coffre: coffre > 0 ? { gemmes: coffre } : null }
}

/**
 * La fête de niveau : les niveaux franchis depuis le dernier vu par le
 * navigateur (`vu`), du plus ancien au plus récent. Rien la première fois
 * (`vu` inconnu) : un élève qui ouvre l'app ne doit pas fêter dix niveaux d'un
 * coup qu'il a gagnés avant cette version.
 */
export function niveauxAFeter(vu: number | null, niveau: number): number[] {
  if (vu === null || !Number.isFinite(vu) || niveau <= vu) return []
  const out: number[] = []
  for (let n = Math.floor(vu) + 1; n <= niveau; n++) out.push(n)
  return out
}
