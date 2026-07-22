'use client'

import { useEffect, useState } from 'react'
import {
  arenaPeriodAt,
  arenaSrcOf,
  isArenaPeriod,
  msUntilNextArenaChange,
  nextArenaSlot,
  type ArenaPeriod,
} from '@/lib/arena-background'
import ArenaSky from '@/components/ArenaSky'
import AnimatedBackground from '@/components/background/AnimatedBackground'

/**
 * Fond dynamique de l'Arène (onglet Défi) : l'image du colisée suit l'heure
 * locale de l'appareil (6 variantes, voir lib/arena-background.ts).
 *
 * - Bascule SANS redémarrage : un timer est programmé exactement sur la
 *   prochaine frontière de plage (pas de polling), et l'heure est revérifiée
 *   quand l'app revient au premier plan (l'onglet a pu dormir des heures).
 * - Fondu enchaîné ~500 ms : la nouvelle image se monte PAR-DESSUS l'ancienne
 *   et apparaît via l'animation CSS `arena-fade-in` ; l'ancienne couche est
 *   retirée au changement suivant.
 * - Zéro flash : l'image de la plage suivante est préchargée dès qu'une plage
 *   s'installe.
 * - SSR : le serveur ne connaît pas l'heure de l'élève → il rend le violet de
 *   secours du conteneur, l'image du moment apparaît en fondu à l'hydratation.
 *
 * Test en dev : suffixer l'URL de
 * `?arena=dawn|morning|noon|afternoon|evening|night` pour forcer une plage
 * (ignoré en production).
 */
export default function ArenaBackdrop() {
  const [period, setPeriod] = useState<ArenaPeriod | null>(null)

  useEffect(() => {
    // Override de test (dev uniquement) : fige la plage demandée, sans timer.
    const forced =
      process.env.NODE_ENV !== 'production'
        ? new URLSearchParams(window.location.search).get('arena')
        : null

    let timer: number | undefined

    const sync = () => {
      if (isArenaPeriod(forced)) {
        setPeriod(forced)
        return
      }
      const now = new Date()
      setPeriod(arenaPeriodAt(now.getHours()))
      // Précharge la variante suivante pour que le fondu parte d'un cache chaud.
      new window.Image().src = nextArenaSlot(now.getHours()).src
      // Réveil pile sur la frontière (+1 s de marge d'horloge).
      timer = window.setTimeout(sync, msUntilNextArenaChange(now) + 1_000)
    }
    sync()

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        window.clearTimeout(timer)
        sync()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  // Mémorise la couche précédente pour le fondu — état ajusté pendant le
  // rendu (comparaison avec la valeur précédente), pas d'effet.
  const [stack, setStack] = useState<{
    current: ArenaPeriod | null
    previous: ArenaPeriod | null
  }>({ current: period, previous: null })
  if (stack.current !== period) {
    setStack({ current: period, previous: stack.current })
  }

  const layers = [stack.previous, stack.current].filter(
    (p): p is ArenaPeriod => p !== null,
  )

  return (
    <>
      {layers.map((p) => (
        <div
          key={p}
          className="arena-img"
          style={{ backgroundImage: `url(${arenaSrcOf(p)})` }}
        />
      ))}
      {/* Voiles violets haut/bas : gardent HUD et barre d'onglets lisibles. */}
      <div className="arena-veils" />
      {/* Le ciel vit (nuages) puis la scène s'anime en continu
          (bannières, feuilles sur canvas, torches, poussière dorée) — montée
          après les voiles pour rester bien lisible. Sans imageUrl : le décor
          horaire est déjà peint par les couches .arena-img ci-dessus. */}
      <ArenaSky period={period} />
      <AnimatedBackground />
    </>
  )
}
