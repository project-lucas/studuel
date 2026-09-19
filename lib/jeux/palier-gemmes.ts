// LES GEMMES DES PALIERS — ce que rapporte chaque étoile d'un jeu de salon.
//
// Lucas, 19/09/2026 : « il faut ajouter les gains en gemmes avec
// l'illustration pour chaque palier […] vrai pour tous les modes de jeu ».
// Chaque étoile décrochée sur un palier rapporte des gemmes UNE fois, au tarif
// de son palier : palier N → N gemmes par étoile (Éveil 1, Apprenti 2,
// Confirmé 3, Expert 4, Maître 5). Un jeu entier vaut 45 gemmes — un peu plus
// d'un Boost XP par palier de Maître, jamais de quoi remplacer les quêtes.
//
// Le VERSEMENT est au serveur (RPC `palier_gemmes_reclamer`, migration 373) :
// il ne paie une étoile qu'une fois, pour toujours. Ce module en est le miroir
// pur — le tarif affiché, la lecture de sa réponse et des lignes
// `palier_gemmes`. Aucune lecture de base ici (voir palier-gemmes-server.ts).

import type { Gain } from '@/lib/gains'
import {
  MAX_STARS,
  PALIER_LEVELS,
  starsAt,
  type PalierLevel,
  type PalierProgress,
} from '@/lib/jeux/paliers'

/** Les étoiles d'un jeu, palier par palier (Éveil → Maître), 0..3 chacune. */
export type EtoilesParPalier = readonly [number, number, number, number, number]

export const AUCUNE_ETOILE: EtoilesParPalier = [0, 0, 0, 0, 0]

/** Gemmes d'UNE étoile de ce palier (miroir de la 373 : le numéro du palier). */
export function gemmesParEtoile(level: PalierLevel): number {
  return level
}

/** Gemmes des trois étoiles d'un palier. */
export function gemmesDuPalier(level: PalierLevel): number {
  return gemmesParEtoile(level) * MAX_STARS
}

/** Tout ce qu'un jeu peut rapporter en étoiles (45). */
export const GEMMES_PAR_JEU = PALIER_LEVELS.reduce((s, l) => s + gemmesDuPalier(l), 0)

function borne(n: unknown): number {
  const v = Math.floor(Number(n))
  return Number.isFinite(v) ? Math.min(MAX_STARS, Math.max(0, v)) : 0
}

/** Les étoiles de la progression locale, rangées pour la RPC. */
export function etoilesDeProgression(progress: PalierProgress): EtoilesParPalier {
  const [a, b, c, d, e] = PALIER_LEVELS.map((l) => starsAt(progress, l))
  return [a, b, c, d, e]
}

/** Gemmes que valent ces étoiles (sans le bonus du week-end). */
export function gemmesDesEtoiles(etoiles: EtoilesParPalier): number {
  return PALIER_LEVELS.reduce((s, l, i) => s + borne(etoiles[i]) * gemmesParEtoile(l), 0)
}

/**
 * Vrai si la progression locale porte des étoiles que le serveur n'a pas
 * encore payées — une étoile gagnée avant la 373, ou dont la réclamation a
 * échoué (réseau). La carte du jeu les réclame alors en arrivant.
 */
export function resteAReclamer(locales: EtoilesParPalier, payees: EtoilesParPalier): boolean {
  return locales.some((n, i) => borne(n) > borne(payees[i]))
}

/**
 * Les lignes `palier_gemmes` d'un jeu → étoiles déjà payées par palier.
 * Ligne absente = rien de payé ; ligne illisible = ignorée.
 */
export function lirePalierGemmes(rows: unknown): EtoilesParPalier {
  const out = [0, 0, 0, 0, 0]
  if (!Array.isArray(rows)) return AUCUNE_ETOILE
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    const r = row as Record<string, unknown>
    const palier = Math.floor(Number(r.palier))
    if (palier < 1 || palier > 5) continue
    out[palier - 1] = Math.max(out[palier - 1], borne(r.etoiles))
  }
  const [a, b, c, d, e] = out
  return [a, b, c, d, e]
}

export type ReponseReclamation =
  | { ok: true; gemmes: number; solde: number; etoiles: EtoilesParPalier }
  | { ok: false; raison: string }

/** JSON de la RPC → réponse sûre. Illisible = refus « panne », jamais un gain. */
export function lireReclamation(data: unknown): ReponseReclamation {
  if (!data || typeof data !== 'object') return { ok: false, raison: 'panne' }
  const r = data as Record<string, unknown>
  if (r.ok !== true) {
    return { ok: false, raison: typeof r.raison === 'string' ? r.raison : 'panne' }
  }
  const gemmes = Math.floor(Number(r.gemmes))
  const solde = Math.floor(Number(r.solde))
  const liste = Array.isArray(r.etoiles) ? r.etoiles : []
  const [a, b, c, d, e] = [0, 1, 2, 3, 4].map((i) => borne(liste[i]))
  return {
    ok: true,
    gemmes: Number.isFinite(gemmes) ? Math.max(0, gemmes) : 0,
    solde: Number.isFinite(solde) ? Math.max(0, solde) : 0,
    etoiles: [a, b, c, d, e],
  }
}

/**
 * Les gains d'une fin de partie, plus les gemmes des étoiles qu'elle vient de
 * décrocher : UNE ligne de gemmes, jamais deux (le gain de série et celui du
 * palier s'additionnent), pour que le panneau et le vol vers le bandeau ne
 * comptent pas la même unité deux fois.
 */
export function avecGemmesPalier(gains: readonly Gain[], gemmes: number | null): Gain[] {
  if (gemmes === null || !(gemmes > 0)) return [...gains]
  const deja = gains.find((g) => g.unite === 'gemme')
  if (!deja) return [...gains, { unite: 'gemme', montant: gemmes }]
  return gains.map((g) => (g === deja ? { ...g, montant: g.montant + gemmes } : g))
}
