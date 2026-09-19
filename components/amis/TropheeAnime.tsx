import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// LE TROPHÉE ANIMÉ — l'icône du compte de trophées des amis (16/09/2026).
//
// Une coupe d'or à l'étoile qui se balance en boucle (Flaticon, choisie par
// Lucas), servie en WebP animé à fond transparent par scripts/trophee-amis.mjs.
// Elle remplace le pictogramme Lucide `Trophy` dans les lignes du classement
// des amis : là, le trophée est un OBJET qu'on regarde et qu'on veut gagner,
// pas un signe dans une ligne de texte — la même règle que pour l'écu et le
// cristal des monnaies (components/ui/MonnaieIcon.tsx).
//
// Balise <img> nue : next/image ne réencode pas les images animées, et il n'a
// rien à optimiser ici — 72 Ko, une fois, mis en cache.
// -----------------------------------------------------------------------------

export default function TropheeAnime({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/amis/trophee.webp"
      alt=""
      aria-hidden="true"
      width={96}
      height={96}
      className={cn('inline-block size-5 shrink-0 object-contain', className)}
    />
  )
}
