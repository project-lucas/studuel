// -----------------------------------------------------------------------------
// LES SCÈNES DES CAPSULES — les images qui défilent dans le bloc d'une capsule,
// façon offres du magasin de Clash Royale (Lucas, 24/09/2026 : « des blocs
// rectangulaires avec bordure et un défilement d'images successives »).
//
// Quatre temps par capsule, toujours le même récit : le problème, le
// super-pouvoir, la méthode, le résultat. Fabriquées par
// `node scripts/scenes-capsules.mjs` dans public/images/capsules/<id>/n.webp.
//
// On ne déclare ici que le NOMBRE de scènes d'une capsule : les chemins s'en
// déduisent, et lib/assets.test.ts vérifie que chacun existe sur le disque.
// Une capsule absente de la liste s'affiche sur sa couleur et son emoji — le
// bloc est le même, il attend ses images.
//
// Pur, sans dépendance : importable par un composant client.
// -----------------------------------------------------------------------------

/** id de la capsule → nombre de scènes livrées. */
export const SCENES_CAPSULES: Readonly<Record<string, number>> = {
  // 1 sur 4 le 24/09/2026 : Lucas voit le rendu avant de commander la suite.
  sommeil: 1,
}

/** Les scènes d'une capsule, dans l'ordre du défilement ; vide si elle n'en a pas. */
export function scenesCapsule(id: string): string[] {
  const nombre = SCENES_CAPSULES[id] ?? 0
  return Array.from({ length: nombre }, (_, i) => `/images/capsules/${id}/${i + 1}.webp`)
}

/** Durée d'affichage d'une scène avant la suivante (ms). */
export const DUREE_SCENE_MS = 4000
