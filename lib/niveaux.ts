// -----------------------------------------------------------------------------
// LES RÉCOMPENSES DE NIVEAU (03/10/2026, Lucas : « établis le système de
// récompense des paliers d'XP pour monter de niveau »).
//
// Deux étages, comme la route des trophées de Brawl Stars :
//   · CHAQUE niveau franchi verse 15 gemmes, tout seul (migrations 192 → 368,
//     `wallet_grant_xp` / `wallet_award_xp`) — ce montant n'est pas réécrit ici ;
//   · TOUS LES 5 NIVEAUX, un COFFRE DE PALIER, que l'élève ouvre lui-même
//     (`niveau_palier_reclamer`, migration 556) : 10 gemmes par niveau du
//     palier, plafonné à 250 — 50 au niveau 5, 100 au 10, 250 dès le 25.
// Le passage d'un niveau devient un moment (la fête de niveau, le bandeau), et
// le prochain palier se voit à l'avance (la bulle du niveau).
//
// MIROIR de `niveau_palier_gemmes` (556). Pur et testé.
// -----------------------------------------------------------------------------

/** Ce que verse chaque niveau franchi, sans rien demander (192 → 368). */
export const GEMMES_PAR_NIVEAU = 15

/** Un palier tous les N niveaux. */
export const PAS_PALIER = 5

/** Gemmes d'un coffre de palier : 10 par niveau, au plus 250. */
export const GEMMES_PALIER_PAR_NIVEAU = 10
export const GEMMES_PALIER_MAX = 250

export function estPalier(niveau: number): boolean {
  return Number.isInteger(niveau) && niveau >= PAS_PALIER && niveau % PAS_PALIER === 0
}

/** Gemmes du coffre de palier d'un niveau (0 si ce n'est pas un palier). */
export function gemmesPalier(niveau: number): number {
  return estPalier(niveau) ? Math.min(GEMMES_PALIER_MAX, GEMMES_PALIER_PAR_NIVEAU * niveau) : 0
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
  /** Les 15 gemmes du passage, versées d'office. */
  gemmes: number
  /** Le coffre de palier, à ouvrir (null hors palier). */
  coffre: { gemmes: number } | null
}

/** Ce que rapporte l'arrivée à un niveau. */
export function recompenseNiveau(niveau: number): RecompenseNiveau {
  const coffre = gemmesPalier(niveau)
  return { niveau, gemmes: GEMMES_PAR_NIVEAU, coffre: coffre > 0 ? { gemmes: coffre } : null }
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
