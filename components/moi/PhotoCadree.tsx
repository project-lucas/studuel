import type { ReactNode } from 'react'
import { FENETRES_CADRES } from '@/lib/moi/cadres-geometrie'
import { cadreDuNiveau, imageCadre, libelleCadre, type Cadre } from '@/lib/moi/cadre-profil'
import { cn } from '@/lib/utils'

/**
 * LA PHOTO DE PROFIL DANS SON CADRE (05/10/2026).
 *
 * Le cadre se gagne au niveau (lib/moi/cadre-profil) : bronze dès les premiers
 * quiz, puis argent, or, platine, diamant, émeraude, rubis, légende. La photo
 * se pose DERRIÈRE le cadre, dans sa fenêtre (lib/moi/cadres-geometrie, écrite
 * par scripts/cadres-profil.mjs) ; le cadre est un dessin détouré posé dessus.
 *
 * Au niveau 1, pas de cadre : `children` est rendu tel quel — le polaroid
 * scotché du carnet, « la photo d'un joueur pas encore classé ».
 *
 * La taille vient de `className` (un carré).
 */
export default function PhotoCadree({
  niveau,
  photo,
  className,
  sansCadre,
}: {
  niveau: number
  /** L'image de la photo (déjà rendue : <img>, AvatarRender…). */
  photo: ReactNode
  className?: string
  /** Ce qui s'affiche au niveau 1 (le polaroid) ; par défaut la photo nue. */
  sansCadre?: ReactNode
}) {
  const cadre: Cadre = cadreDuNiveau(niveau)
  const src = imageCadre(cadre)
  const fenetre = FENETRES_CADRES[cadre.id]
  if (!src || !fenetre) return <>{sansCadre ?? photo}</>

  return (
    <span
      role="img"
      aria-label={libelleCadre(cadre)}
      data-cadre={cadre.id}
      className={cn('relative block aspect-square', className)}
    >
      <span
        className="absolute overflow-hidden rounded-[6%] [&_img]:size-full [&_img]:object-cover"
        style={{
          left: `${fenetre.left}%`,
          top: `${fenetre.top}%`,
          width: `${fenetre.width}%`,
          height: `${fenetre.height}%`,
        }}
      >
        {photo}
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element -- dessin détouré, servi tel quel */}
      <img src={src} alt="" aria-hidden="true" draggable={false} className="pointer-events-none absolute inset-0 size-full select-none" />
    </span>
  )
}
