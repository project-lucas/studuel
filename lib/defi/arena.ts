// Échelle des arènes + calcul de progression vers la suivante. Logique pure et
// testable : les composants ne font qu'afficher le résultat.

import type { Arena } from './types'

/** L'échelle, du plus bas au plus haut. `minTrophies` = seuil d'entrée. */
export const ARENAS: readonly Arena[] = [
  { id: 'recre', name: 'Cour de récré', icon: '🛝', minTrophies: 0 },
  { id: 'etude', name: "Salle d'étude", icon: '📚', minTrophies: 300 },
  { id: 'profs', name: 'Salle des profs', icon: '☕', minTrophies: 700 },
  { id: 'cdi', name: 'CDI', icon: '📖', minTrophies: 1200 },
  { id: 'amphi', name: 'Amphithéâtre', icon: '🏛️', minTrophies: 2000 },
  { id: 'oral', name: 'Grand Oral', icon: '🎓', minTrophies: 3000 },
] as const

export interface ArenaProgress {
  /** Arène actuelle. */
  current: Arena
  /** Arène suivante, ou `null` si l'on est déjà au sommet. */
  next: Arena | null
  /** Trophées acquis au sein de l'arène actuelle. */
  trophiesIntoArena: number
  /** Trophées séparant l'arène actuelle de la suivante (`null` au sommet). */
  span: number | null
  /** Trophées restants pour atteindre l'arène suivante (`null` au sommet). */
  remaining: number | null
  /** Avancement vers l'arène suivante, borné 0 → 1 (1 au sommet). */
  ratio: number
}

/**
 * Détermine l'arène courante pour un total de trophées et calcule la
 * progression vers la suivante. Les trophées négatifs sont traités comme 0.
 */
export function arenaProgress(
  trophies: number,
  arenas: readonly Arena[] = ARENAS,
): ArenaProgress {
  const safe = Math.max(0, Math.floor(trophies))

  // Dernière arène dont le seuil est atteint.
  let index = 0
  for (let i = 0; i < arenas.length; i++) {
    if (safe >= arenas[i].minTrophies) index = i
  }

  const current = arenas[index]
  const next = index < arenas.length - 1 ? arenas[index + 1] : null

  if (!next) {
    return {
      current,
      next: null,
      trophiesIntoArena: safe - current.minTrophies,
      span: null,
      remaining: null,
      ratio: 1,
    }
  }

  const span = next.minTrophies - current.minTrophies
  const trophiesIntoArena = safe - current.minTrophies
  const remaining = Math.max(0, next.minTrophies - safe)
  const ratio = span > 0 ? Math.min(1, Math.max(0, trophiesIntoArena / span)) : 0

  return { current, next, trophiesIntoArena, span, remaining, ratio }
}
