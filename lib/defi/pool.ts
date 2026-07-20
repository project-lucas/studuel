// Composition du vivier de questions du Défi — logique pure.

import { HORS_NIVEAU } from '@/lib/types'

/** Un quiz candidat, réduit à ce dont la sélection a besoin. */
export type PoolQuiz = { grade_level?: string | null }

// Combien de quiz HORS-PROGRAMME (Culture générale) peuvent au maximum entrer
// dans le vivier des modes de jeu. C'est un BONUS, pas un concurrent.
//
// Sans plafond, ils évincent le programme : le classement met en tête les
// chapitres « jamais travaillés » (maîtrise absente = priorité maximale), or
// les 17 quiz de culture générale sont, par construction, jamais travaillés eux
// non plus. En 6e — 25 quiz au catalogue — ils doubleraient presque le vivier
// prioritaire, et l'élève se verrait servir Keynes ou Marx à la place de son
// programme, en boucle, jusqu'à les avoir tous épuisés.
export const MAX_HORS_NIVEAU_IN_POOL = 1

export function isHorsNiveau(q: PoolQuiz): boolean {
  return q.grade_level === HORS_NIVEAU
}

/**
 * Compose le vivier final : le programme de la classe d'abord, puis AU PLUS
 * `maxBonus` quiz hors-programme pour la variété. Les deux listes sont
 * supposées déjà classées par priorité.
 */
export function composePool<T extends PoolQuiz>(
  ranked: T[],
  size: number,
  maxBonus: number = MAX_HORS_NIVEAU_IN_POOL,
): T[] {
  const programme = ranked.filter((q) => !isHorsNiveau(q))
  const bonus = ranked.filter(isHorsNiveau).slice(0, Math.max(0, maxBonus))
  // Le programme garde la main : le bonus ne prend que les places restantes.
  const gardees = Math.max(0, size - bonus.length)
  return [...programme.slice(0, gardees), ...bonus].slice(0, size)
}
