import { cn } from '@/lib/utils'

/**
 * LA FLAMME DE LA SÉRIE — une seule, animée, partout où la série s'affiche
 * (HUD du haut, barre de série de Réviser, et tout écran qui en aura besoin).
 *
 * Icône animée « Fire » de Freepik (Flaticon, licence gratuite AVEC
 * attribution — la ligne est en bas de la page Compte), déposée par Lucas le
 * 15/09/2026 en remplacement du cristal doré immobile. L'original GIF vit
 * dans `assets-sources/serie/flamme.gif` (765 Ko, hors dépôt) ; ce qui est
 * servi est un WebP animé de 64 px (72 images, ~98 Ko) et une image FIXE de
 * la première image pour qui a demandé moins de mouvement : une flamme qui
 * danse dans le HUD toute la journée est exactement ce que
 * `prefers-reduced-motion` demande d'éteindre.
 *
 * Série à zéro (`eteinte`) : la flamme reste à sa place, désaturée et en
 * retrait — c'est la même place, à rallumer — et ne respire plus.
 *
 * Décorative (`aria-hidden`) : le nombre à côté porte l'information.
 */
export default function FlammeAnimee({
  className,
  eteinte = false,
}: {
  className?: string
  eteinte?: boolean
}) {
  return (
    <picture
      className={cn(
        'inline-block shrink-0',
        eteinte ? 'opacity-40 grayscale' : 'flame-breathe',
        className,
      )}
    >
      <source
        srcSet="/images/serie/flamme-fixe.webp"
        media="(prefers-reduced-motion: reduce)"
      />
      {/* Un <img> nu, pas next/image : un WebP animé passé par l'optimiseur
          ressortirait figé sur sa première image. */}
      <img
        src="/images/serie/flamme.webp"
        alt=""
        aria-hidden="true"
        width={64}
        height={64}
        draggable={false}
        className="size-full select-none object-contain"
      />
    </picture>
  )
}
