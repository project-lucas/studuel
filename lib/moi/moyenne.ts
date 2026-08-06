// -----------------------------------------------------------------------------
// LA MOYENNE GÉNÉRALE — le seul chiffre du monde réel sur l'onglet Moi.
//
// Sans elle, l'app ne parle que d'elle-même : des XP, des trophées, un « niveau
// de travail » qu'aucun bulletin ne connaît. La moyenne est la mesure que
// l'élève (et ses parents) regardent vraiment ; elle avait pourtant disparu de
// l'écran alors que `school_grades` (167) et `term_grades` (187) la donnent.
//
// CE MODULE NE RECALCULE RIEN. Il choisit, parmi les trois trimestres déjà
// fusionnés par `mergeTermAverages` (notes réelles d'abord, saisie manuelle en
// repli), LE trimestre à afficher et l'écart avec le précédent renseigné. La
// pondération par coefficients vit dans lib/notes.ts, et elle y reste : deux
// définitions de « la moyenne » à deux fichiers d'écart, c'est la garantie que
// l'app finira par se contredire.
//
// Logique pure, aucun accès base.
// -----------------------------------------------------------------------------

import { formatNote, type Trimestre } from '@/lib/notes'
import type { TermPoint } from '@/lib/trajectoire-bac'

export type BilanMoyenne = {
  /** Moyenne /20 du trimestre le plus récent renseigné, ou null. */
  moyenne: number | null
  /** Le trimestre d'où elle vient. */
  trimestre: Trimestre | null
  /** Le trimestre renseigné juste avant, s'il existe. */
  precedent: Trimestre | null
  /** Écart avec ce trimestre précédent (positif = ça monte). */
  delta: number | null
  /** Notes détaillées ou moyenne saisie à la main — l'app le dit. */
  source: 'notes' | 'manuel' | null
}

const VIDE: BilanMoyenne = {
  moyenne: null,
  trimestre: null,
  precedent: null,
  delta: null,
  source: null,
}

/**
 * Le dernier trimestre renseigné, et l'écart avec celui d'avant.
 *
 * On prend le PLUS RÉCENT et non la moyenne de l'année : un élève qui remonte
 * de 11 à 14 au T2 mérite de lire 14, pas 12,5. La moyenne annuelle lisserait
 * exactement ce que l'écran doit célébrer.
 */
export function bilanMoyenne(terms: readonly TermPoint[]): BilanMoyenne {
  const renseignes = terms.filter(
    (t): t is TermPoint & { avg: number } =>
      typeof t.avg === 'number' && Number.isFinite(t.avg),
  )
  if (renseignes.length === 0) return VIDE

  const dernier = renseignes[renseignes.length - 1]
  const avant = renseignes[renseignes.length - 2] ?? null

  return {
    moyenne: dernier.avg,
    trimestre: dernier.t,
    precedent: avant?.t ?? null,
    // Arrondi au dixième AVANT affichage : sans lui, 13,45 − 13,4 sortait en
    // « +0,04999999999999893 » dès que les deux moyennes venaient des notes.
    delta:
      avant === null ? null : Math.round((dernier.avg - avant.avg) * 10) / 10,
    source: dernier.source,
  }
}

/** « 13,4 » — la moyenne prête à afficher, sans le « /20 ». */
export function formatMoyenne(bilan: BilanMoyenne): string | null {
  return bilan.moyenne === null ? null : formatNote(bilan.moyenne)
}

/**
 * « +0,4 vs T1 » — la micro-tendance sous le chiffre.
 *
 * `null` quand il n'y a rien d'honnête à dire : un seul trimestre renseigné ne
 * permet aucune comparaison, et inventer « en progression » serait un mensonge.
 */
export function phraseDelta(bilan: BilanMoyenne): string | null {
  if (bilan.delta === null || bilan.precedent === null) return null
  // « T1 » et non `trimestreLabel` (« Trimestre 1 ») : cette phrase vit sous un
  // chiffre, dans une tuile d'un tiers d'écran. La forme longue y passe à la
  // ligne et pousse la tendance hors de vue.
  const repere = `T${bilan.precedent}`
  if (bilan.delta === 0) return `stable vs ${repere}`
  const signe = bilan.delta > 0 ? '+' : '-'
  return `${signe}${formatNote(Math.abs(bilan.delta))} vs ${repere}`
}
