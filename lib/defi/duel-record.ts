// Bilan Victoires / Défaites des duels 1v1 — logique pure, testable, sans React
// ni Supabase. C'est le pendant « décontracté » des trophées : TOUS les duels
// (salons de l'Espace Jeux, fantômes d'amis, entraînement, ET match classé)
// alimentent un simple compteur V/D — un flex personnel, qui NE touche NI aux
// trophées NI au classement. La seule récompense tangible d'une victoire est une
// petite « monnaie de victoire » (pièces), volontairement plafonnée par jour
// pour ne pas déséquilibrer l'économie (cf. le durcissement des migrations
// 165/171). Le barème ci-dessous est le MIROIR EXACT de la RPC record_duel_result
// (migration 174) — le serveur reste seul juge du montant crédité.

// Pièces gagnées à chaque victoire de duel. Faible par unité (une victoire
// dure quelques minutes) mais régulier — la récompense de l'assiduité au Défi.
export const WIN_COINS = 5

// Plafond de pièces de victoire par jour (UTC) : au-delà, les victoires
// comptent toujours au bilan V/D mais ne rapportent plus de pièces. 50 = dix
// victoires récompensées/jour — largement de quoi jouer sans farmer l'économie.
export const WIN_COINS_DAILY_CAP = 50

export type DuelRecord = {
  wins: number
  losses: number
}

// Applique l'issue d'un duel au bilan (immuable). Positif = victoire.
export function applyDuelResult(record: DuelRecord, won: boolean): DuelRecord {
  const wins = Math.max(0, Math.floor(record.wins))
  const losses = Math.max(0, Math.floor(record.losses))
  return won ? { wins: wins + 1, losses } : { wins, losses: losses + 1 }
}

// Pièces réellement créditées pour une victoire, connaissant les pièces de
// victoire DÉJÀ gagnées aujourd'hui : WIN_COINS tant qu'on est sous le plafond,
// puis 0. Jamais négatif, jamais au-delà du reliquat du plafond.
export function coinsForWin(coinsAlreadyToday: number): number {
  const already = Math.max(0, Math.floor(coinsAlreadyToday))
  const remaining = WIN_COINS_DAILY_CAP - already
  if (remaining <= 0) return 0
  return Math.min(WIN_COINS, remaining)
}

// Total de duels joués — pratique pour l'affichage (« sur N duels »).
export function totalDuels(record: DuelRecord): number {
  return Math.max(0, Math.floor(record.wins)) + Math.max(0, Math.floor(record.losses))
}

// Libellé d'accessibilité du bilan (« 42 victoires, 17 défaites »).
export function recordLabel(record: DuelRecord): string {
  const w = Math.max(0, Math.floor(record.wins))
  const l = Math.max(0, Math.floor(record.losses))
  const vic = `${w} victoire${w > 1 ? 's' : ''}`
  const def = `${l} défaite${l > 1 ? 's' : ''}`
  return `${vic}, ${def}`
}
