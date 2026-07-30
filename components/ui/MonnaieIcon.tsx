import Image from 'next/image'
import { cn } from '@/lib/utils'

// LES DEUX MONNAIES, ILLUSTRÉES — l'écu (pièces) et le cristal (gemmes).
//
// Elles doublent `CoinIcon` / `GemIcon` (SVG monochromes) sans les remplacer,
// et le partage est net :
//   • ICI, l'illustration, partout où la monnaie est un OBJET qu'on regarde :
//     la bande de ressources du HUD, les soldes du Trésor. Elle porte ses
//     propres couleurs, donc elle réclame un fond neutre — sur une pastille
//     dorée, un écu doré ne se voit pas.
//   • LÀ-BAS, le SVG, partout où la monnaie est un SIGNE dans une ligne de
//     texte ou sur un bouton teinté : il hérite de `currentColor` et reste
//     lisible en encre sur or comme en or sur sombre. Une image ne sait pas
//     faire ça.
//
// Sources 4000 px détourées puis réduites à 256 (assets-sources/monnaie).

/** L'écu — la monnaie du COSMÉTIQUE (avatar, boutique du Trésor). */
export function EcuIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/images/monnaie/ecu.webp"
      alt=""
      width={64}
      height={64}
      className={cn('object-contain', className)}
      aria-hidden="true"
    />
  )
}

/** Le cristal — la monnaie du CONTENU (un cristal = un chapitre, à vie). */
export function CristalIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/images/monnaie/cristal.webp"
      alt=""
      width={64}
      height={64}
      className={cn('object-contain', className)}
      aria-hidden="true"
    />
  )
}
