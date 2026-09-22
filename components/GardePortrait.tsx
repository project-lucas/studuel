'use client'

import { useEffect } from 'react'
import { Smartphone } from 'lucide-react'

/**
 * LA GARDE DU PORTRAIT — l'app se joue à la verticale, et à la verticale
 * seulement (Lucas, 22/09/2026 : « je ne veux pas que l'écran puisse passer à
 * l'horizontale sur portable »).
 *
 * Trois verrous, du plus ferme au plus doux :
 *   1. le manifeste demande `orientation: portrait` — l'app installée ne tourne
 *      jamais ;
 *   2. dans un navigateur qui le permet (Android en plein écran), on verrouille
 *      l'orientation par l'API ; ailleurs l'appel échoue en silence ;
 *   3. partout où rien de tout ça ne tient (Safari iOS), un RIDEAU se pose en
 *      paysage sur un téléphone et demande de le tourner — un écran de jeu
 *      dessiné pour 390 px de large n'a rien à montrer sur 844 × 390.
 *
 * Le rideau est en CSS pur (`.garde-portrait`, globals.css) : il n'apparaît
 * que sur un écran tactile, en paysage, et bas (un téléphone couché) — jamais
 * sur une tablette ni sur un ordinateur.
 */
export default function GardePortrait() {
  useEffect(() => {
    const orientation = window.screen?.orientation as
      | (ScreenOrientation & { lock?: (o: string) => Promise<void> })
      | undefined
    if (!orientation?.lock) return
    orientation.lock('portrait').catch(() => {
      // Navigateur ou contexte qui ne verrouille pas : le rideau prend le relais.
    })
  }, [])

  return (
    <div className="garde-portrait" role="status" aria-live="polite">
      <Smartphone className="garde-portrait-icone" strokeWidth={2.2} aria-hidden="true" />
      <p className="font-heading text-xl font-extrabold">Tourne ton téléphone</p>
      <p className="max-w-[22rem] text-sm font-semibold text-muted-foreground">
        Studuel se joue à la verticale.
      </p>
    </div>
  )
}
