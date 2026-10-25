'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { motCafes } from '@/lib/coach/credits'
import dosette from '@/public/images/marcel/cafe/dosette.webp'
import styles from './CompteurCafes.module.css'

/**
 * LE COMPTEUR VIVANT DES CAFÉS (25/10/2026, Lucas : « un compteur animé et
 * vivant des cafés restants ») — la DOSETTE, icône du café partout dans l'app,
 * qui bascule doucement, et le NOMBRE qui s'égrène quand il change (~600 ms,
 * `requestAnimationFrame`, compte local : la base a déjà décidé).
 *
 * Deux tailles : `pilule` (une pilule blanche, coin droit du bureau, ligne du
 * champ) et `inline` (dans une phrase : « Il te reste [☕ 174 cafés] »).
 * Toujours lisible d'une traite par un lecteur d'écran (« 174 cafés »).
 */
export default function CompteurCafes({
  cafes,
  taille = 'pilule',
  className,
}: {
  cafes: number
  taille?: 'pilule' | 'inline'
  className?: string
}) {
  const affiche = useNombreQuiSEgrene(cafes)
  const pilule = taille === 'pilule'
  return (
    <span
      role="img"
      aria-label={motCafes(cafes)}
      className={cn(
        'inline-flex items-center align-middle whitespace-nowrap',
        pilule
          ? 'bg-card h-9 gap-1 rounded-full pr-3 pl-1.5 shadow-[0_3px_10px_-4px_rgba(36,48,79,.45)]'
          : 'gap-1',
        className,
      )}
    >
      <Dosette taille={pilule ? 26 : 22} />
      <span
        className={cn(
          'font-heading text-foreground leading-none font-extrabold tabular-nums',
          pilule ? 'text-[15px]' : 'text-[1.05em]',
        )}
      >
        {/* La clé change avec la cible : le nombre rebondit à chaque nouvelle valeur. */}
        <span key={cafes} className={styles.nombre}>
          {affiche}
        </span>
        {!pilule ? <span className="font-sans ml-1 text-[1em] font-extrabold">{cafes === 1 ? 'café' : 'cafés'}</span> : null}
      </span>
    </span>
  )
}

/** La dosette, l'icône du café (public/images/marcel/cafe/dosette.webp, 160 px). */
export function Dosette({ taille = 22, className, immobile = false }: { taille?: number; className?: string; immobile?: boolean }) {
  return (
    <Image
      src={dosette}
      alt=""
      aria-hidden="true"
      width={taille}
      height={taille}
      draggable={false}
      // Un WebP de 10 Ko fait pour ces tailles : l'optimiseur n'ajouterait
      // qu'un aller-retour à une icône présente sur tout le bureau.
      unoptimized
      style={{ width: taille, height: taille }}
      className={cn('inline-block shrink-0 object-contain', !immobile && styles.dosette, className)}
    />
  )
}

/**
 * Le nombre affiché court vers la cible en ~600 ms (sortie en cube : vite au
 * début, doux à la fin). Sous mouvement réduit, il y va d'un coup. Tout passe
 * par `requestAnimationFrame` : rien n'écrit d'état pendant l'effet lui-même.
 */
function useNombreQuiSEgrene(cible: number, duree = 600): number {
  const [affiche, setAffiche] = useState(cible)
  const depart = useRef(cible)
  useEffect(() => {
    const de = depart.current
    depart.current = cible
    if (de === cible) return
    const reduit = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    let raf = 0
    const t0 = performance.now()
    const pas = (t: number) => {
      const p = reduit ? 1 : Math.min(1, (t - t0) / duree)
      const e = 1 - Math.pow(1 - p, 3)
      setAffiche(Math.round(de + (cible - de) * e))
      if (p < 1) raf = requestAnimationFrame(pas)
    }
    raf = requestAnimationFrame(pas)
    return () => cancelAnimationFrame(raf)
  }, [cible, duree])
  return affiche
}
