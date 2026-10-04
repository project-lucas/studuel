import { cn } from '@/lib/utils'
import { FICHIER_FLAMME, palierFlamme } from '@/lib/flamme-serie'
import s from './FlammeAnimee.module.css'

/**
 * LA FLAMME DE LA SÉRIE — une seule, animée, partout où la série s'affiche
 * (bandeau du haut, carte de série de Réviser, onglet Moi).
 *
 * C'est la flamme des jours faits de la semaine (la famille de l'éclair d'XP,
 * cerne prune et volumes brillants) ANIMÉE : un modèle vidéo Higgsfield l'a
 * fait danser en partant de son dessin et en y revenant (boucle sans saut),
 * puis `node scripts/flamme-animee.mjs` détoure chaque image et assemble un
 * WebP animé transparent. Elle remplace l'icône « Fire » de Flaticon.
 *
 * ELLE GRANDIT AVEC LA SÉRIE (lib/flamme-serie, 04/10/2026) : orange, puis
 * BLEUE dès 5 jours d'affilée ; à zéro, ÉTEINTE. `serie` choisit le palier.
 *
 * Par-dessus la vidéo, le module CSS ajoute le souffle : un halo qui respire,
 * et — en `vive`, aux grandes tailles — des braises qui montent. Transform et
 * opacité seulement ; sous mouvement réduit, l'image FIXE et plus rien ne
 * bouge.
 *
 * Série à zéro (`eteinte`) : la flamme reste à sa place, désaturée et en
 * retrait — c'est la même place, à rallumer — et ne respire plus.
 *
 * Décorative (`aria-hidden`) : le nombre à côté porte l'information.
 */
export default function FlammeAnimee({
  className,
  eteinte = false,
  vive = false,
  serie = 0,
}: {
  className?: string
  eteinte?: boolean
  /** Les braises qui montent : pour une flamme d'au moins ~40 px. */
  vive?: boolean
  /** Les jours d'affilée : la flamme change de palier à 5, puis à 7. */
  serie?: number
}) {
  const palier = palierFlamme(serie)
  const nom = FICHIER_FLAMME[palier]
  return (
    <span
      aria-hidden="true"
      data-palier={palier}
      className={cn('relative inline-block shrink-0', eteinte ? 'opacity-40 grayscale' : s.flamme, className)}
    >
      {!eteinte ? <span className={s.halo} /> : null}
      {vive && !eteinte ? (
        <>
          <span className={cn(s.braise, s.b1)} />
          <span className={cn(s.braise, s.b2)} />
          <span className={cn(s.braise, s.b3)} />
          <span className={cn(s.braise, s.b4)} />
        </>
      ) : null}
      <picture className={cn('relative block size-full', !eteinte && s.corps)}>
        <source srcSet={`/images/serie/${nom}-fixe.webp`} media="(prefers-reduced-motion: reduce)" />
        {/* Un <img> nu, pas next/image : un WebP animé passé par l'optimiseur
            ressortirait figé sur sa première image. */}
        <img
          src={eteinte ? `/images/serie/${nom}-fixe.webp` : `/images/serie/${nom}.webp`}
          alt=""
          width={96}
          height={96}
          draggable={false}
          className="size-full select-none object-contain"
        />
      </picture>
    </span>
  )
}
