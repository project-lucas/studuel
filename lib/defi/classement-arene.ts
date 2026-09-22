// -----------------------------------------------------------------------------
// LE CLASSEMENT DE L'ARÈNE — le pourcentage parmi tous les élèves, et ce que
// le compte de trophées doit ANIMER quand on revient sur l'arène.
//
// « Dans quel pourcentage se situe l'élève sur l'ensemble des utilisateurs ;
// il le verrait baisser : top 90, 85… » (Lucas, 22/09/2026). Le rang vient de
// `national_ranking()` (migration 159) : mon rang parmi TOUS les profils,
// classés par trophées. Ce module le traduit en bande de 5 (« Top 90 % »),
// arrondie CONTRE l'élève — top 91,3 % s'affiche « Top 95 % » — et compare
// l'état d'aujourd'hui à celui de la dernière visite pour dire ce qui a bougé.
//
// C'est volontairement une bande à toute taille de cohorte, à la différence de
// lib/percentile (qui refuse un pourcentage sous 100 élèves) : ici le chiffre
// est fait pour BOUGER à chaque victoire, pas pour être cité à un parent — et
// il est arrondi contre l'élève, jamais pour lui.
//
// Pur : aucune lecture, aucun React. Le rendu est dans
// components/defi/CompteTropheesArene.tsx et ClassementSheet.tsx.
// -----------------------------------------------------------------------------

/** Le pas des bandes : « Top 90 % », « Top 85 % »… */
export const PAS_POURCENT = 5

/**
 * La bande de pourcentage d'un rang dans une cohorte, arrondie vers le haut au
 * pas de 5 (contre l'élève), entre 5 et 100. Null quand il n'y a rien à dire :
 * pas de rang, cohorte d'un seul, rang hors cohorte.
 */
export function topPourcent(
  rank: number | null | undefined,
  total: number | null | undefined,
): number | null {
  if (rank === null || rank === undefined || total === null || total === undefined) return null
  if (!Number.isFinite(rank) || !Number.isFinite(total)) return null
  if (total < 2 || rank < 1 || rank > total) return null
  const brut = (rank / total) * 100
  const bande = Math.ceil(brut / PAS_POURCENT) * PAS_POURCENT
  return Math.min(100, Math.max(PAS_POURCENT, bande))
}

/** « Top 90 % ». */
export function libelleTop(top: number): string {
  return `Top ${top} %`
}

/** Ce que l'arène a montré la dernière fois — mémorisé dans le navigateur. */
export type EtatCompte = {
  trophees: number
  /** La bande de pourcentage, ou null quand la base ne la donnait pas. */
  top: number | null
}

/** Ce qu'il y a à animer entre la dernière visite et maintenant. */
export type MouvementCompte = {
  /** Le compte qui défile de `de` à `a`, ou null s'il n'a pas bougé. */
  trophees: { de: number; a: number } | null
  /** La bande qui change (« Top 90 % » → « Top 85 % »), ou null. */
  top: { de: number | null; a: number | null } | null
}

/**
 * Compare l'état mémorisé à l'état d'aujourd'hui. Null quand rien n'a bougé —
 * ou à la première visite : sans « avant », il n'y a rien à fêter, on pose.
 */
export function mouvementCompte(
  avant: EtatCompte | null,
  maintenant: EtatCompte,
): MouvementCompte | null {
  if (!avant) return null
  const trophees = avant.trophees !== maintenant.trophees
    ? { de: avant.trophees, a: maintenant.trophees }
    : null
  const top = avant.top !== maintenant.top ? { de: avant.top, a: maintenant.top } : null
  if (!trophees && !top) return null
  return { trophees, top }
}

/** La clé de mémoire du compte, par élève : un autre compte sur le même téléphone ne fête pas les trophées du premier. */
export function cleEtatCompte(userId: string): string {
  return `studuel:arene:trophees:${userId}`
}

/** Relit un état mémorisé (JSON) ; null si absent ou abîmé. */
export function lireEtatCompte(raw: unknown): EtatCompte | null {
  if (typeof raw !== 'string' || raw.length === 0) return null
  try {
    const o = JSON.parse(raw) as Record<string, unknown>
    if (!o || typeof o !== 'object') return null
    const trophees = Number(o.trophees)
    if (!Number.isFinite(trophees)) return null
    const top = o.top === null || o.top === undefined ? null : Number(o.top)
    return { trophees, top: top !== null && Number.isFinite(top) ? top : null }
  } catch {
    return null
  }
}
