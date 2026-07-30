import { cn } from '@/lib/utils'

interface PersonnageAnimeProps {
  /** Image de base du personnage (détourée, fond transparent). */
  src: string
  /**
   * Patch de la zone des yeux fermés, superposé pour le clignement.
   * Position/taille réglables par personnage via les variables CSS
   * `--eyes-top`, `--eyes-left`, `--eyes-width` sur le conteneur.
   */
  srcYeuxFermes?: string
  alt: string
  className?: string
}

/**
 * Donne vie à un personnage statique de l'app : une timeline idle de ~20 s
 * (respiration continue + étirement + inclinaison curieuse) sur le conteneur,
 * et un clignement d'yeux désynchronisé si un patch `srcYeuxFermes` est
 * fourni. Transform/opacity uniquement, le tout neutralisé par
 * `prefers-reduced-motion` (styles `.perso-anime-*` dans globals.css).
 */
export default function PersonnageAnime({
  src,
  srcYeuxFermes,
  alt,
  className,
}: PersonnageAnimeProps) {
  return (
    <span className={cn('perso-anime block', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="block w-full" draggable={false} />
      {srcYeuxFermes ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={srcYeuxFermes}
          alt=""
          aria-hidden="true"
          className="perso-anime-yeux"
          draggable={false}
        />
      ) : null}
    </span>
  )
}
