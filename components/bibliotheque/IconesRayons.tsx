import Image, { type StaticImageData } from 'next/image'
import carteIcone from '@/public/images/supports/carte.webp'
import dossiersIcone from '@/public/images/supports/dossiers.webp'
import capsulesIcone from '@/public/images/supports/capsules.webp'
import { cn } from '@/lib/utils'
import type { Rayon } from '@/lib/bibliotheque'

// -----------------------------------------------------------------------------
// LES ILLUSTRATIONS DES TROIS RAYONS de « Ma bibliothèque » (Lucas, 24/09/2026 :
// « trouve les icônes appropriées pour les illustrer »).
//
// Elles sortent du même atelier que les tuiles d'un chapitre
// (`public/images/supports/`, fabriquées et mises à la même taille perçue par
// `scripts/supports-icones.mjs`) : trait prune épais, crème, violet, or.
//   · DOSSIERS — un dossier à onglet entrouvert, deux feuilles qui dépassent ;
//   · CAPSULES — une capsule de distributeur, mi-violette mi-or, frappée d'une
//                étoile : le contenu qu'on débloque (pas une gélule, qui se
//                lisait « médicament ») ;
//   · FICHES   — `carte.webp`, LE dessin de la tuile « Fiche » du chapitre (celui
//                de la « Fiche de révision » du Marché) : la fiche achetée
//                s'ouvre sur cette page-là, elle garde son visage.
// Jusqu'à l'arrivée des deux premiers dessins, dossier et capsule étaient tracés
// en SVG ici même, à titre provisoire.
// -----------------------------------------------------------------------------

const ICONES: Record<Rayon, StaticImageData> = {
  dossiers: dossiersIcone,
  capsules: capsulesIcone,
  fiches: carteIcone,
}

/** L'illustration d'un rayon, à la taille que lui donne `className`. */
export default function IconeRayon({ rayon, className }: { rayon: Rayon; className?: string }) {
  return (
    <Image src={ICONES[rayon]} alt="" aria-hidden="true" sizes="40px" className={cn('h-auto', className)} />
  )
}
