// -----------------------------------------------------------------------------
// LA PLANCHE D'ANATOMIE PEINTE (14/10/2026, Lucas, devant l'écorché de Muscles
// express : « le rendu est super ; pour Anatomie (SVT) le rendu doit être aussi
// propre, adapté au mode de jeu en question »).
//
// La planche dessinée en traits (`anatomie-planche.ts`, gardée pour son type
// `ZonePlanche`) cède la place à une planche PEINTE par Nano Banana 2.1 dans la
// même famille que l'écorché : le mannequin crème, le torse et le crâne ouverts
// comme dans un manuel, les treize organes du jeu chacun dans sa couleur de
// manuel (le foie brun, le pancréas jaune, les reins rouge sombre). Sources
// `assets-sources/organes/face.png` → `node scripts/ecorche-muscles.mjs
// --planche=organes` → `public/images/jeux/organes/face.webp` (toile 1000 × 1300).
//
// Les ZONES sont LUES dans la peinture (`node scripts/ecorche-zones.mjs
// --planche=organes --controle` → `organes-planche-zones.ts`, généré) : une
// graine par organe, un remplissage qui suit SA couleur jusqu'au cerne. Seule la
// trachée, crème comme le corps, a un contour posé à la main.
//
// Chaque repère dit OÙ est la zone, vue de face par l'élève, sans jamais dire
// CE qu'elle est (test « ne laisse jamais fuiter » d'anatomie.test.ts).
// -----------------------------------------------------------------------------
import type { ZonePlanche } from '@/lib/jeux/anatomie-planche'
import { PLANCHE_PEINTE_ORGANES } from '@/lib/jeux/organes-planche-zones'

export const IMAGE_ORGANES = '/images/jeux/organes/face.webp'

type Fiche = { nom: string; repere: string; halo?: number }

/** Ce que chaque zone est. Le halo (unités du viewBox, 100 × 130) aide les organes fins. */
const FICHES: Record<string, Fiche> = {
  cerveau: { nom: 'le cerveau', repere: 'dans la tête' },
  trachee: { nom: 'la trachée', repere: 'au centre du cou', halo: 1 },
  poumons: { nom: 'un poumon', repere: 'de chaque côté de la poitrine' },
  coeur: { nom: 'le cœur', repere: 'au milieu de la poitrine' },
  diaphragme: { nom: 'le diaphragme', repere: 'en travers du tronc, sous la poitrine', halo: 1.5 },
  foie: { nom: 'le foie', repere: 'en haut du ventre, à gauche' },
  estomac: { nom: 'l’estomac', repere: 'en haut du ventre, à droite' },
  rate: { nom: 'la rate', repere: 'tout à droite, sous la poitrine', halo: 1.2 },
  pancreas: { nom: 'le pancréas', repere: 'en travers, au milieu du ventre', halo: 1 },
  reins: { nom: 'un rein', repere: 'de chaque côté du milieu du ventre' },
  'intestin-grele': { nom: 'l’intestin grêle', repere: 'au centre du bas du ventre' },
  'gros-intestin': { nom: 'le gros intestin', repere: 'tout autour du bas du ventre', halo: 0.8 },
  vessie: { nom: 'la vessie', repere: 'tout en bas du ventre', halo: 1 },
}

/** Les zones peintes, dans l'ORDRE DU DESSIN (celui du fichier généré). */
export const ZONES_PEINTES: readonly ZonePlanche[] = PLANCHE_PEINTE_ORGANES.face.zones.map((z) => {
  const fiche = FICHES[z.id]
  if (!fiche) throw new Error(`Zone sans fiche : ${z.id}`)
  return {
    id: z.id,
    nom: fiche.nom,
    forme: { type: 'plein', d: z.d },
    halo: fiche.halo ?? 0,
    ancre: z.ancre,
    repere: fiche.repere,
  }
})

export const ORGANES_LARGEUR = PLANCHE_PEINTE_ORGANES.face.largeur
export const ORGANES_HAUTEUR = PLANCHE_PEINTE_ORGANES.face.hauteur
