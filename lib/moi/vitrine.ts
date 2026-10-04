// -----------------------------------------------------------------------------
// LA BANNIÈRE DU JOUEUR (04/10/2026, Lucas : « une bannière avatar qui
// s'améliorerait au fur et à mesure que les badges ou couronnes
// s'accumulent » ; maquette « C » retenue, puis « avatar à gauche, inscrit
// dans une bannière rectangulaire »).
//
// La bannière qui porte l'avatar change de MÉTAL quand la collection grandit :
// bronze, argent, or, diamant, légende (public/images/moi/banniere/,
// scripts/profil-ecusson.mjs). Une couronne pèse deux badges : elle demande
// une matière maîtrisée, un badge se gagne souvent en chemin. Pur et testé.
// -----------------------------------------------------------------------------

export type RangBanniere = 1 | 2 | 3 | 4 | 5

export type PalierVitrine = {
  rang: RangBanniere
  /** « Bronze », « Argent »… */
  nom: string
  /** Points de collection qu'il faut pour l'atteindre. */
  seuil: number
}

export const PALIERS_VITRINE: readonly PalierVitrine[] = [
  { rang: 1, nom: 'Bronze', seuil: 0 },
  { rang: 2, nom: 'Argent', seuil: 8 },
  { rang: 3, nom: 'Or', seuil: 20 },
  { rang: 4, nom: 'Diamant', seuil: 40 },
  { rang: 5, nom: 'Légende', seuil: 70 },
]

/** Points de collection : un par badge, deux par couronne. */
export function pointsCollection(badges: number, couronnes: number): number {
  const b = Number.isFinite(badges) ? Math.max(0, Math.floor(badges)) : 0
  const c = Number.isFinite(couronnes) ? Math.max(0, Math.floor(couronnes)) : 0
  return b + 2 * c
}

export type EtatVitrine = {
  palier: PalierVitrine
  /** Le palier suivant, ou null au sommet. */
  suivant: PalierVitrine | null
  points: number
  /** Points qui manquent pour le suivant (0 au sommet). */
  manque: number
}

export function etatVitrine(badges: number, couronnes: number): EtatVitrine {
  const points = pointsCollection(badges, couronnes)
  let i = 0
  while (i + 1 < PALIERS_VITRINE.length && points >= PALIERS_VITRINE[i + 1].seuil) i++
  const palier = PALIERS_VITRINE[i]
  const suivant = PALIERS_VITRINE[i + 1] ?? null
  return { palier, suivant, points, manque: suivant ? suivant.seuil - points : 0 }
}

/** « Bannière d'argent · 4 pts pour l'or » — l'article selon le métal. */
export function libelleBanniere(nom: string): string {
  return /^[aeiouyéèêàâ]/i.test(nom) ? `d’${nom.toLowerCase()}` : `de ${nom.toLowerCase()}`
}
