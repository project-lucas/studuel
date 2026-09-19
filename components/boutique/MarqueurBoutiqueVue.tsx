'use client'

import { useEffect } from 'react'
import { COOKIE_BOUTIQUE_VUE, EVENEMENT_BOUTIQUE_VUE } from '@/lib/boutique/vue'

/**
 * Posé sur la Boutique : retient que la vitrine de la semaine a été vue
 * (cookie lu par la barre d'onglets) et éteint tout de suite la pastille de
 * l'onglet. Ne rend rien.
 */
export default function MarqueurBoutiqueVue({ semaine }: { semaine: string }) {
  useEffect(() => {
    if (!semaine) return
    document.cookie = `${COOKIE_BOUTIQUE_VUE}=${semaine}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
    window.dispatchEvent(new Event(EVENEMENT_BOUTIQUE_VUE))
  }, [semaine])
  return null
}
