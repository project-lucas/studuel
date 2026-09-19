'use client'

import { useEffect, useState } from 'react'
import { EVENEMENT_BOUTIQUE_VUE } from '@/lib/boutique/vue'

/**
 * Pastille rouge « du neuf cette semaine » sur l'onglet Boutique, façon Clash
 * Royale : les offres du moment ont changé (lib/boutique/vue). Purement
 * décorative pour les lecteurs d'écran — l'onglet reste nommé avec ou sans.
 *
 * Elle disparaît DÈS que la Boutique est vue, sans attendre un rechargement :
 * le layout racine n'est pas re-rendu en navigation client, donc on écoute un
 * événement de fenêtre émis par la page (MarqueurBoutiqueVue).
 */
export default function NavBoutiqueBadge() {
  const [vue, setVue] = useState(false)

  useEffect(() => {
    const onVue = () => setVue(true)
    window.addEventListener(EVENEMENT_BOUTIQUE_VUE, onVue)
    return () => window.removeEventListener(EVENEMENT_BOUTIQUE_VUE, onVue)
  }, [])

  if (vue) return null

  return (
    <span aria-hidden="true" className="absolute -top-1 -right-1.5 flex size-2.5">
      {/* Onde qui bat : ce qui transforme un point rouge en APPEL. Neutralisée
          par `motion-reduce` pour qui demande moins d'animation. */}
      <span className="bg-destructive/70 absolute inline-flex size-full animate-ping rounded-full motion-reduce:hidden" />
      {/* Contour BLANC, comme les compteurs de Clash Royale : sur le socle
          crème, un contour crème fondait la pastille dans la barre. */}
      <span className="bg-destructive relative inline-flex size-2.5 rounded-full ring-2 ring-white" />
    </span>
  )
}
