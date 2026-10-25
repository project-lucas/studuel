// -----------------------------------------------------------------------------
// L'ÉTAT DE LA DÉCOUVERTE PROGRESSIVE (25/10/2026, cadrage « le jeu vivant »,
// docs/CADRAGE-JEU-VIVANT.md § E) — logique pure, testée.
//
// Trois choses viennent du serveur, dans la même vague que le bandeau :
//   · le NIVEAU (et l'XP) du porte-monnaie ;
//   · les clés DÉJÀ VUES (`mes_decouvertes()`, migration 601) ;
//   · `profiles.decouverte_depuis` — NULL pour les comptes créés avant la 601
//     (ils voient tout, quel que soit leur niveau), une date pour les autres.
// Tout ce qui en découle (quel onglet est verrouillé, ce qu'il reste à
// annoncer, combien d'XP manque) se calcule ici, nulle part ailleurs.
//
// RÈGLE : jamais un verrou par accident. Un état incertain (colonne absente,
// RPC absente, lecture en échec) se traduit par `depuis: null` → tout ouvert.
// -----------------------------------------------------------------------------

import { DECOUVERTES, type Decouverte, type OngletVerrouillable } from '@/lib/decouverte/catalogue'
import { xpForLevel } from '@/lib/wallet'

export type EtatDecouverte = {
  /** Niveau du porte-monnaie (≥ 1). */
  niveau: number
  /** XP cumulée (pour la barre « encore N XP »). */
  xp: number
  /** Les clés dont le mini-tour a déjà été joué (`mes_decouvertes`). */
  vues: readonly string[]
  /** `profiles.decouverte_depuis` : null = compte d'avant la 601, tout ouvert. */
  depuis: string | null
}

/** L'état qui n'enferme rien : celui d'un ancien compte, ou d'une lecture en échec. */
export const ETAT_TOUT_OUVERT: EtatDecouverte = Object.freeze({
  niveau: 1,
  xp: 0,
  vues: Object.freeze([]) as readonly string[],
  depuis: null,
})

/** La découverte progressive s'applique-t-elle à ce compte ? */
export function decouverteProgressiveActive(depuis: string | null): boolean {
  return depuis !== null
}

/** Une découverte est fermée si le compte est concerné, n'a pas le niveau, et ne l'a jamais vue. */
export function estFermee(
  d: Decouverte,
  niveau: number,
  vues: readonly string[],
  depuis: string | null,
): boolean {
  if (!decouverteProgressiveActive(depuis)) return false
  if (niveau >= d.niveau) return false
  return !vues.includes(d.cle)
}

/** Les découvertes qui verrouillent un onglet de la barre, et qui sont fermées. */
export function ongletsVerrouilles(
  niveau: number,
  vues: readonly string[],
  depuis: string | null,
): readonly Decouverte[] {
  return DECOUVERTES.filter((d) => d.onglet !== null && estFermee(d, niveau, vues, depuis))
}

/** Le verrou qui pèse sur un onglet (`defi` · `amis` · `tresor`), ou null s'il est ouvert. */
export function verrouDeLOnglet(
  onglet: string,
  etat: EtatDecouverte,
): Decouverte | null {
  return ongletsVerrouilles(etat.niveau, etat.vues, etat.depuis).find((d) => d.onglet === onglet) ?? null
}

/**
 * Ce qui est OUVERT mais pas encore annoncé (mini-tour jamais joué), dans
 * l'ordre du catalogue. Vide pour un ancien compte : il voit tout, rien ne lui
 * est « nouveau ».
 */
export function nouveautesAAnnoncer(
  niveau: number,
  vues: readonly string[],
  depuis: string | null,
): readonly Decouverte[] {
  if (!decouverteProgressiveActive(depuis)) return []
  return DECOUVERTES.filter((d) => d.niveau <= niveau && !vues.includes(d.cle))
}

/**
 * La découverte dont le mini-tour EST le tour « premiers pas » (TourGuide,
 * monté dans Réviser) : il la marque lui-même en finissant, et l'annonce
 * automatique ne la relance jamais par-dessus lui.
 */
export const CLE_PREMIERS_PAS = 'reviser'

/** La première nouveauté dont la page est celle qu'on affiche, à lancer toute seule. */
export function nouveauteSurLaPage(pathname: string, etat: EtatDecouverte): Decouverte | null {
  const page = normaliserChemin(pathname)
  return (
    nouveautesAAnnoncer(etat.niveau, etat.vues, etat.depuis).find(
      (d) => d.href === page && d.cle !== CLE_PREMIERS_PAS,
    ) ?? null
  )
}

/** L'onglet verrouillé sur lequel on se trouve (pour renvoyer vers Réviser), ou null. */
export function verrouDuChemin(pathname: string, etat: EtatDecouverte): Decouverte | null {
  const onglet = ongletDuChemin(pathname)
  return onglet ? verrouDeLOnglet(onglet, etat) : null
}

/** La prochaine découverte encore fermée (le « bientôt » du bandeau), ou null. */
export function prochaineDecouverte(etat: EtatDecouverte): Decouverte | null {
  if (!decouverteProgressiveActive(etat.depuis)) return null
  return DECOUVERTES.find((d) => estFermee(d, etat.niveau, etat.vues, etat.depuis)) ?? null
}

/** L'XP qu'il manque pour atteindre un niveau (0 s'il est atteint). */
export function xpManquante(xp: number, niveauCible: number): number {
  return Math.max(0, xpForLevel(niveauCible) - Math.max(0, Math.floor(xp)))
}

/** La part du chemin déjà faite vers un niveau, 0..1. */
export function progressionVersNiveau(xp: number, niveauCible: number): number {
  const total = xpForLevel(niveauCible)
  if (total <= 0) return 1
  return Math.min(1, Math.max(0, Math.floor(xp)) / total)
}

/** L'onglet verrouillable que désigne un chemin (`/defi/…` → `defi`), ou null. */
export function ongletDuChemin(pathname: string): OngletVerrouillable | null {
  const premier = normaliserChemin(pathname).split('/')[1] ?? ''
  if (premier === 'defi' || premier === 'amis' || premier === 'tresor') return premier
  return null
}

/** `?decouvrir=` lu dans l'adresse : la clé du catalogue, ou null. */
export function cleDemandee(valeur: string | null | undefined): string | null {
  if (!valeur) return null
  return DECOUVERTES.some((d) => d.cle === valeur) ? valeur : null
}

function normaliserChemin(pathname: string): string {
  const sansQuery = pathname.split('?')[0] ?? ''
  const nettoye = sansQuery.replace(/\/+$/, '')
  return nettoye === '' ? '/' : nettoye
}
