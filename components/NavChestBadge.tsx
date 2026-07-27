'use client'

import { useEffect, useState } from 'react'

/** Événement émis par l'écran du coffre juste après une ouverture réussie. */
export const CHEST_OPENED_EVENT = 'studuel:chest-opened'

/**
 * Pastille rouge « il y a quelque chose à récupérer » sur l'onglet Coffre,
 * façon Clash Royale : elle appelle le pouce avant même que l'élève ait ouvert
 * l'onglet. Purement décorative pour les lecteurs d'écran — l'onglet reste
 * atteignable et nommé (« Coffre ») avec ou sans elle.
 *
 * Elle disparaît DÈS l'ouverture du coffre, sans attendre un rechargement : le
 * layout racine n'est pas re-rendu en navigation client, donc on écoute un
 * événement de fenêtre émis par l'écran du coffre. Le rendu serveur suivant
 * (rechargement, nouvel onglet) confirme la disparition côté données.
 */
export default function NavChestBadge() {
  const [collected, setCollected] = useState(false)

  useEffect(() => {
    const onOpened = () => setCollected(true)
    window.addEventListener(CHEST_OPENED_EVENT, onOpened)
    return () => window.removeEventListener(CHEST_OPENED_EVENT, onOpened)
  }, [])

  if (collected) return null

  return (
    <span aria-hidden="true" className="absolute -top-1 -right-1.5 flex size-2.5">
      {/* Onde qui bat : ce qui transforme un point rouge en APPEL. Neutralisée
          par `motion-reduce` pour qui demande moins d'animation. */}
      <span className="bg-destructive/70 absolute inline-flex size-full animate-ping rounded-full motion-reduce:hidden" />
      {/* Le liseré crème détache la pastille du dessin de l'icône. */}
      <span className="bg-destructive ring-background relative inline-flex size-2.5 rounded-full ring-2" />
    </span>
  )
}
