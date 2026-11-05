'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { usePathname, useRouter } from 'next/navigation'
import {
  cheminDe,
  finirEntreeCombat,
  lignesDeVitesse,
  lireEntreeCombat,
  lireEntreeCombatServeur,
  pointsLigne,
  subscribeEntreeCombat,
  TEMPS_ENTREE,
  type EntreeEnCours,
} from '@/lib/entree-combat'
import { couperMusique, reprendreMusique } from '@/lib/musique'
import { prechargerSons } from '@/lib/sons-studuel'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import s from './EntreeCombat.module.css'

/**
 * LA SCÈNE DE L'ENTRÉE EN COMBAT (05/11/2026) — montée UNE fois dans le layout,
 * pour survivre au changement de page qu'elle cache. N'importe quel bouton la
 * lance par `lancerEntreeCombat(href)` (lib/entree-combat) : DUEL après la
 * recherche d'adversaire, « Affronter » un gardien.
 *
 * Elle ne rend rien tant qu'aucune entrée n'est en cours. Au tout premier
 * geste de l'élève dans l'app, elle décode d'avance les bruitages courts
 * (l'entrée, le tic, le coffre) : le stinger doit partir AU tap, pas après un
 * aller-retour réseau — et rien n'est chargé avant ce geste.
 */
export default function EntreeCombat() {
  const entree = useSyncExternalStore(subscribeEntreeCombat, lireEntreeCombat, lireEntreeCombatServeur)

  useEffect(() => {
    const prechauffer = () => {
      window.removeEventListener('pointerdown', prechauffer, true)
      prechargerSons(['rencontre', 'vitesse', 'flash', 'tic', 'scintillement', 'coffre-tremble', 'coffre-ouvre'])
    }
    window.addEventListener('pointerdown', prechauffer, true)
    return () => window.removeEventListener('pointerdown', prechauffer, true)
  }, [])

  if (!entree) return null
  return <Scene key={entree.id} entree={entree} />
}

type Phase = 'montee' | 'blanc' | 'fondu'

function Scene({ entree }: { entree: EntreeEnCours }) {
  const router = useRouter()
  const pathname = usePathname()
  const [phase, setPhase] = useState<Phase>('montee')
  const [saute, setSaute] = useState(false)
  const parti = useRef(false)
  const [lignes] = useState(() => lignesDeVitesse())

  const partir = () => {
    if (parti.current) return
    parti.current = true
    setPhase('blanc')
    router.push(entree.href)
  }

  // La montée : les sons calés sur l'image, puis la navigation en plein blanc.
  useEffect(() => {
    router.prefetch(entree.href)
    sfx.rencontre()
    const minuteries = [
      window.setTimeout(() => sfx.vitesse(), TEMPS_ENTREE.vitesse),
      window.setTimeout(() => couperMusique(), TEMPS_ENTREE.blanc),
      window.setTimeout(() => sfx.flash(), TEMPS_ENTREE.eclat),
      window.setTimeout(partir, TEMPS_ENTREE.plein),
    ]
    return () => minuteries.forEach((m) => window.clearTimeout(m))
    // `partir` lit des refs : l'effet ne doit courir qu'une fois par entrée.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entree.href])

  // L'arrivée : la nouvelle page est là, on tient le blanc un instant et il se
  // dissout. Le filet rend la main si la page n'arrive jamais.
  const arrivee = phase === 'blanc' && pathname !== null && cheminDe(pathname) === cheminDe(entree.href)
  useEffect(() => {
    if (phase !== 'blanc') return
    const m = window.setTimeout(
      () => {
        if (!arrivee) reprendreMusique()
        setPhase('fondu')
      },
      arrivee ? TEMPS_ENTREE.tenu : TEMPS_ENTREE.secours,
    )
    return () => window.clearTimeout(m)
  }, [phase, arrivee])

  useEffect(() => {
    if (phase !== 'fondu') return
    const m = window.setTimeout(() => finirEntreeCombat(entree.id), TEMPS_ENTREE.fondu)
    return () => window.clearTimeout(m)
  }, [phase, entree.id])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className={cn(s.scene, saute && s.saute, phase === 'fondu' && s.fondu)}
      role="presentation"
      aria-hidden="true"
      onPointerDown={() => {
        if (phase !== 'montee') return
        setSaute(true)
        couperMusique()
        partir()
      }}
    >
      <div className={s.voile} />
      <div className={s.onde} />
      <svg className={s.lignes} viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid slice">
        {lignes.map((l, i) => (
          <polygon key={i} points={pointsLigne(l)} />
        ))}
      </svg>
      <div className={s.blanc} />
    </div>,
    document.body,
  )
}
