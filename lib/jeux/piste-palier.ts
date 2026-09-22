// LA PISTE D'UN PALIER — une seule ligne horizontale qui réunit ce que la carte
// disait en deux : les trois jetons de gemmes (« Gains +3 +3 +3 ») et le
// record (« Record 6000 »).
//
// POURQUOI UNE LIGNE (Lucas, 22/09/2026 : « à la place de faire gain gain gain
// +3 +3 +3, fais plutôt une ligne continue à l'horizontale avec les différents
// paliers qui donnent des récompenses en gemmes ; le record se verra donc sur
// cette ligne »). Trois jetons alignés ne disent pas OÙ l'on en est ; une
// piste avec trois jalons et un curseur le dit d'un coup d'œil, et dit aussi
// ce qu'il reste à faire pour le prochain.
//
// L'AXE EST LA PRÉCISION, pas le score : les étoiles se gagnent à 60, 80 et
// 95 % de bonnes réponses (lib/jeux/paliers, STAR_ACCURACY), et chaque étoile
// paie ses gemmes. Le curseur se place donc au meilleur taux de réussite du
// palier ; le score, lui, s'écrit sur l'étiquette du curseur (« Record 6000 »).
// Les trois segments de la piste ont la même longueur à l'écran quelle que
// soit leur largeur en pourcentage (0 → 60, 60 → 80, 80 → 95) : ce qui se lit,
// c'est « à mi-chemin du prochain jalon », pas une échelle de pourcentages.
//
// Pur, testé.

import { STAR_ACCURACY, type PalierLevel, type StarCount } from './paliers'
import { gemmesParEtoile } from './palier-gemmes'

export type Jalon = {
  rang: 1 | 2 | 3
  /** Position sur la piste, 0..1 (un tiers, deux tiers, un). */
  at: number
  /** Le taux de réussite qui l'ouvre. */
  seuil: number
  gemmes: number
  /** L'étoile est décrochée (localement ou déjà payée) : jeton gagné. */
  gagne: boolean
}

export type PistePalier = {
  /** Où en est le curseur, 0..1 le long de la piste. */
  fill: number
  jalons: [Jalon, Jalon, Jalon]
  /** Le taux de réussite qui place le curseur (0..1), ou null sans partie jouée. */
  accuracy: number | null
  /** Le prochain seuil à atteindre (0..1), ou null quand tout est décroché. */
  prochainSeuil: number | null
}

const SEUILS = [STAR_ACCURACY.one, STAR_ACCURACY.two, STAR_ACCURACY.three] as const

/** Le taux de réussite qu'implique un nombre d'étoiles, pour une progression
 *  écrite avant que la précision ne soit mémorisée. */
function plancherDesEtoiles(stars: StarCount): number | null {
  if (stars <= 0) return null
  return SEUILS[stars - 1]
}

/**
 * Projette un taux de réussite sur la piste : chaque segment entre deux
 * jalons occupe un tiers, quelle que soit sa largeur en pourcentage.
 */
export function positionSurPiste(accuracy: number): number {
  const a = Math.min(1, Math.max(0, accuracy))
  if (a >= SEUILS[2]) return 1
  if (a >= SEUILS[1]) return 2 / 3 + ((a - SEUILS[1]) / (SEUILS[2] - SEUILS[1])) / 3
  if (a >= SEUILS[0]) return 1 / 3 + ((a - SEUILS[0]) / (SEUILS[1] - SEUILS[0])) / 3
  return (a / SEUILS[0]) / 3
}

export function pistePalier(input: {
  level: PalierLevel
  /** Étoiles du palier (locales). */
  stars: StarCount
  /** Étoiles à créditer comme gagnées sur les jetons (locales ou payées). */
  acquises: number
  /** Meilleur taux de réussite mémorisé, ou null. */
  accuracy: number | null
}): PistePalier {
  const gemmes = gemmesParEtoile(input.level)
  // Le curseur ne recule jamais sous ce que les étoiles prouvent.
  const plancher = plancherDesEtoiles(input.stars)
  const accuracy =
    input.accuracy === null && plancher === null
      ? null
      : Math.max(input.accuracy ?? 0, plancher ?? 0)
  const fill = accuracy === null ? 0 : positionSurPiste(accuracy)
  const jalons = SEUILS.map((seuil, i) => ({
    rang: (i + 1) as 1 | 2 | 3,
    at: (i + 1) / 3,
    seuil,
    gemmes,
    gagne: input.acquises >= i + 1,
  })) as [Jalon, Jalon, Jalon]
  const prochain = jalons.find((j) => !j.gagne)
  return {
    fill,
    jalons,
    accuracy,
    prochainSeuil: prochain ? prochain.seuil : null,
  }
}

/** « 92 % » — le taux de réussite tel qu'il s'écrit sur l'étiquette. */
export function formatAccuracy(accuracy: number): string {
  return `${Math.round(accuracy * 100)} %`
}
