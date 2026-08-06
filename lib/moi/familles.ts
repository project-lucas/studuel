// -----------------------------------------------------------------------------
// LA COULEUR D'UNE HABITUDE — sa famille, pas son humeur.
//
// Les maquettes de référence donnent à chaque ligne sa teinte : le sommeil vert,
// la tension orange, l'humeur violette. Ce n'est pas de la décoration — c'est ce
// qui permet de retrouver SA ligne dans une liste de dix sans lire les titres.
//
// La teinte ne peut donc pas être tirée au sort ni suivre l'ordre d'affichage :
// elle vient de la FAMILLE de l'habitude, c'est-à-dire du driver de capacité
// qu'elle nourrit (lib/capacite-drivers). Deux habitudes de sommeil partagent
// forcément la couleur du sommeil, et une habitude qui change de rang dans la
// liste garde la sienne.
//
// Les habitudes hors driver (sport, petit-déjeuner, cartable la veille…) prennent
// le violet de la marque : elles ne nourrissent aucun cadran, on ne va pas leur
// inventer une famille pour les besoins d'une palette.
//
// Logique pure. Les classes sont écrites EN TOUTES LETTRES : Tailwind ne compile
// que les noms de classes qu'il voit littéralement dans le source.
// -----------------------------------------------------------------------------

import { DRIVERS, type DriverKey } from '@/lib/capacite-drivers'

export type Famille = DriverKey | 'autre'

/** La famille d'une habitude du catalogue, ou 'autre' si elle n'en a pas. */
export function familleDe(catalogId: string): Famille {
  const driver = DRIVERS.find((d) => d.catalogIds.includes(catalogId))
  return driver?.key ?? 'autre'
}

export type TeinteFamille = {
  /** Encre du tracé et de la pastille — le SVG s'en sert via `currentColor`. */
  trait: string
  /** Fond de la pastille d'icône. */
  pastille: string
  /** Fond très doux derrière la courbe. */
  halo: string
}

// Mêmes familles de teintes que les chips de leviers (menthe, orange, lavande,
// bleu) : l'élève retrouve d'un écran à l'autre la couleur de son sommeil.
export const TEINTES: Record<Famille, TeinteFamille> = {
  sommeil: {
    trait: 'text-emerald-500',
    pastille: 'bg-emerald-100 text-emerald-700',
    halo: 'bg-emerald-50',
  },
  hydratation: {
    trait: 'text-orange-500',
    pastille: 'bg-orange-100 text-orange-700',
    halo: 'bg-orange-50',
  },
  concentration: {
    trait: 'text-sky-500',
    pastille: 'bg-sky-100 text-sky-700',
    halo: 'bg-sky-50',
  },
  regularite: {
    trait: 'text-purple-500',
    pastille: 'bg-purple-100 text-purple-700',
    halo: 'bg-purple-50',
  },
  autre: {
    trait: 'text-primary',
    pastille: 'bg-primary/10 text-primary',
    halo: 'bg-primary/5',
  },
}

export function teinteDe(catalogId: string): TeinteFamille {
  return TEINTES[familleDe(catalogId)]
}
