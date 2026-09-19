'use client'

import { useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

const sAbonner = () => () => {}

/**
 * UN ÉLÉMENT `fixed` RENDU DANS <body>.
 *
 * Un `transform` sur un ancêtre fait de lui le repère des descendants
 * `position: fixed`. Le balayage entre onglets (retiré le 18/09/2026) en
 * posait un pendant le geste : la puce de classe et la tête de Marcel
 * partaient alors avec le contenu. Rendus directement dans <body>, ils restent
 * collés à l'écran quoi qu'il arrive à un ancêtre.
 *
 * Au premier rendu (serveur et hydratation), l'élément reste EN PLACE — sans
 * transform au-dessus, la position est identique et rien ne clignote. Le
 * portail prend le relais juste après.
 */
export default function PortailFixe({ children }: { children: ReactNode }) {
  const monte = useSyncExternalStore(
    sAbonner,
    () => true,
    () => false,
  )
  return monte ? createPortal(children, document.body) : children
}
