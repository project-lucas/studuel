'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { THEMES_CAPSULES, type Capsule } from '@/lib/capsules'
import { DUREE_SCENE_MS, scenesCapsule } from '@/lib/capsules-scenes'
import { cn } from '@/lib/utils'
import styles from './BlocCapsule.module.css'

/**
 * LE BLOC D'UNE CAPSULE — une offre du magasin de Clash Royale (Lucas,
 * 24/09/2026 : « des blocs rectangulaires avec bordure aux extrémités et un
 * défilement d'images successives ; toutes les capsules seront placées de la
 * sorte, en pleine largeur, les unes sous les autres »).
 *
 * Un cadre épais dans la teinte de la capsule, ses SCÈNES qui défilent en
 * fondu (le problème, le super-pouvoir, la méthode, le résultat —
 * lib/capsules-scenes), et le panneau de droite : thème, titre, durée, puis le
 * `pied` que la page choisit (le prix dans la Boutique, « Ouvrir » dans la
 * bibliothèque). Une capsule qui n'a pas encore ses scènes garde le même bloc,
 * sur sa couleur et son emoji.
 *
 * Le défilement ne tourne qu'avec deux scènes ou plus, et jamais quand
 * l'élève a demandé moins d'animations ; seule l'opacité s'anime.
 */
export default function BlocCapsule({
  capsule,
  href,
  onClick,
  ariaLabel,
  ouvreUneFeuille = false,
  badge,
  pied,
  premiereImagePrioritaire = false,
}: {
  capsule: Capsule
  /** Un lien (la bibliothèque) … */
  href?: string
  /** … ou un bouton (la Boutique ouvre la fiche produit). */
  onClick?: () => void
  ariaLabel: string
  /** Le bouton ouvre une feuille (aria-haspopup). */
  ouvreUneFeuille?: boolean
  /** Le ruban en haut à gauche de la scène (« Nouveau », « À toi »…). */
  badge?: ReactNode
  /** Le bas du panneau : le prix, ou l'action. */
  pied: ReactNode
  /** La première capsule de l'écran : sa première scène part d'emblée. */
  premiereImagePrioritaire?: boolean
}) {
  const scenes = scenesCapsule(capsule.id)
  const active = useDiaporama(scenes.length)
  const theme = THEMES_CAPSULES.find((t) => t.id === capsule.theme)?.label ?? null

  const contenu = (
    <span className={styles.vitre}>
      {scenes.length > 0 ? (
        scenes.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 36rem"
            // Un long catalogue défile sans blanc (règle de la Boutique) : la
            // première scène de chaque bloc est chargée d'emblée.
            {...(premiereImagePrioritaire && index === 0
              ? { priority: true }
              : { loading: index === 0 ? ('eager' as const) : ('lazy' as const) })}
            data-active={index === active}
            className={cn(styles.scene, 'object-cover object-left')}
          />
        ))
      ) : (
        <span className={styles.repli} aria-hidden="true">
          {capsule.emoji}
        </span>
      )}
      <span className={styles.voile} aria-hidden="true" />

      {badge ? <span className="absolute top-2 left-2.5 z-10">{badge}</span> : null}

      {scenes.length > 1 ? (
        <span className={styles.points} aria-hidden="true">
          {scenes.map((src, index) => (
            <span key={src} className={styles.point} data-active={index === active} />
          ))}
        </span>
      ) : null}

      <span className={styles.panneau}>
        {theme ? (
          <span className={cn(styles.cerne, 'text-[10px] font-extrabold tracking-wide text-white/80 uppercase')}>
            {theme}
          </span>
        ) : null}
        <span className={cn(styles.cerne, 'font-heading line-clamp-3 text-[15px] leading-tight font-extrabold text-balance')}>
          {capsule.titre}
        </span>
        <span className={cn(styles.cerne, 'flex items-center gap-1 text-[11px] font-bold text-white/85')}>
          <Clock className="size-3" aria-hidden="true" /> {capsule.dureeMin} min
        </span>
        <span className="mt-auto">{pied}</span>
      </span>
    </span>
  )

  const classe = cn(styles.bloc, `capsule-teinte-${capsule.teinte}`, 'cursor-pointer')
  if (href) {
    return (
      <Link href={href} onClick={onClick} aria-label={ariaLabel} className={classe}>
        {contenu}
      </Link>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-haspopup={ouvreUneFeuille ? 'dialog' : undefined}
      className={classe}
    >
      {contenu}
    </button>
  )
}

/**
 * L'index de la scène à l'écran, qui avance toutes les `DUREE_SCENE_MS`.
 * Immobile avec une seule scène, ou quand l'élève a demandé moins d'animations.
 * L'effet s'arrête avec l'onglet caché (onglets gardés vivants, <Activity>).
 */
function useDiaporama(nombre: number): number {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (nombre < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const minuteur = window.setInterval(() => setIndex((i) => (i + 1) % nombre), DUREE_SCENE_MS)
    return () => window.clearInterval(minuteur)
  }, [nombre])
  return nombre > 0 ? index % nombre : 0
}
