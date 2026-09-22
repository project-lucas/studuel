'use client'

import { useEffect } from 'react'

/**
 * L'ARÈNE NE DÉFILE PAS (Lucas, 22/09/2026 : « je peux faire bouger de haut en
 * bas [la rangée de combat] »).
 *
 * La coquille de l'app fait `min-h-screen` (100vh) et l'arène `h-dvh` : sur un
 * téléphone dont la barre d'adresse est visible, 100vh dépasse la hauteur
 * réellement affichée, le document est plus haut que l'écran de quelques
 * dizaines de pixels, et la page — donc la rangée de combat, posée en bas de
 * l'arène — bouge sous le pouce. Ne rend rien : pose une classe sur <html> le
 * temps de l'arène (`html.arene-figee`, globals.css), qui fige le document et
 * coupe le rebond. Les feuilles de l'arène défilent dans leur propre boîte,
 * elles ne dépendent pas du défilement de la page.
 *
 * Posé par la PAGE de l'arène, pas par son layout : les cartes de jeux et les
 * courses (/defi/jeux/*, /defi/programme/*) partagent le layout et, elles,
 * défilent.
 */
export default function FigerArene() {
  useEffect(() => {
    const html = document.documentElement
    html.classList.add('arene-figee')
    return () => {
      html.classList.remove('arene-figee')
    }
  }, [])
  return null
}
