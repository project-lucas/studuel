// L'XP DES PALIERS — ce que rapporte chaque étoile d'un jeu de salon.
//
// Lucas, 19/09/2026 : « il faut ajouter les gains […] pour chaque palier ». Ce
// furent des gemmes (palier N → N gemmes) jusqu'au 04/10/2026 ; la 557 les a
// changées en XP (« le gain de gemmes doit être très rare ») : palier N →
// 5 × N XP par étoile (Éveil 5, Apprenti 10, Confirmé 15, Expert 20, Maître
// 25), soit 225 XP pour un jeu entier. Chaque étoile ne paie qu'UNE fois ; les
// étoiles déjà payées en gemmes ne repaient rien.
//
// Le VERSEMENT est au serveur (RPC `palier_gemmes_reclamer`, 373 → 557 — le nom
// est resté) : ce module en est le miroir pur — le tarif affiché, la lecture de
// sa réponse et des lignes `palier_gemmes`. Aucune lecture de base ici.

import { xpEtoilePalier } from '@/lib/economie'
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

/** XP d'UNE étoile de ce palier (miroir de la 557 : 5 × le numéro du palier). */
export function xpParEtoile(level: PalierLevel): number {
  return xpEtoilePalier(level)
}

/** XP des trois étoiles d'un palier. */
export function xpDuPalier(level: PalierLevel): number {
  return xpParEtoile(level) * MAX_STARS
}

/** Tout ce qu'un jeu peut rapporter en étoiles (225 XP). */
export const XP_PAR_JEU = PALIER_LEVELS.reduce((s, l) => s + xpDuPalier(l), 0)

function borne(n: unknown): number {
  const v = Math.floor(Number(n))
  return Number.isFinite(v) ? Math.min(MAX_STARS, Math.max(0, v)) : 0
}

/** Les étoiles de la progression locale, rangées pour la RPC. */
export function etoilesDeProgression(progress: PalierProgress): EtoilesParPalier {
  const [a, b, c, d, e] = PALIER_LEVELS.map((l) => starsAt(progress, l))
  return [a, b, c, d, e]
}

/** XP de base que valent ces étoiles (avant le multiplicateur). */
export function xpDesEtoiles(etoiles: EtoilesParPalier): number {
  return PALIER_LEVELS.reduce((s, l, i) => s + borne(etoiles[i]) * xpParEtoile(l), 0)
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
  | { ok: true; xp: number; etoiles: EtoilesParPalier }
  | { ok: false; raison: string }

/** JSON de la RPC → réponse sûre. Illisible = refus « panne », jamais un gain. */
export function lireReclamation(data: unknown): ReponseReclamation {
  if (!data || typeof data !== 'object') return { ok: false, raison: 'panne' }
  const r = data as Record<string, unknown>
  if (r.ok !== true) {
    return { ok: false, raison: typeof r.raison === 'string' ? r.raison : 'panne' }
  }
  const xp = Math.floor(Number(r.xp))
  const liste = Array.isArray(r.etoiles) ? r.etoiles : []
  const [a, b, c, d, e] = [0, 1, 2, 3, 4].map((i) => borne(liste[i]))
  return {
    ok: true,
    xp: Number.isFinite(xp) ? Math.max(0, xp) : 0,
    etoiles: [a, b, c, d, e],
  }
}

/**
 * Les gains d'une fin de partie, plus l'XP des étoiles qu'elle vient de
 * décrocher : UNE ligne d'XP, jamais deux, pour que le panneau et le vol vers
 * le bandeau ne comptent pas la même unité deux fois.
 */
export function avecXpPalier(gains: readonly Gain[], xp: number | null): Gain[] {
  if (xp === null || !(xp > 0)) return [...gains]
  const deja = gains.find((g) => g.unite === 'xp')
  if (!deja) return [...gains, { unite: 'xp', montant: xp }]
  return gains.map((g) => (g === deja ? { ...g, montant: g.montant + xp } : g))
}
