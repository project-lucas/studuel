'use client'

import { useEffect } from 'react'

/**
 * Ouvre la fiche de conseil visée par l'ancre de l'URL (`#conseil-<id>`) et
 * la fait défiler à l'écran.
 *
 * Les fiches sont des `<details>` natifs, repliés par défaut ; un lien vers
 * l'ancre d'une fiche repliée amène le navigateur sur un titre fermé — le
 * parent qui vient de taper « Pourquoi » sous un geste arriverait devant une
 * ligne à déplier. On l'ouvre pour lui. Écoute aussi `hashchange` : les liens
 * du bilan mènent au même écran, seul le hash change.
 */
export default function OuvrirFicheDepuisHash() {
  useEffect(() => {
    const ouvrir = () => {
      const id = window.location.hash.replace(/^#/, '')
      if (!id.startsWith('conseil-')) return
      const el = document.getElementById(id)
      if (!(el instanceof HTMLDetailsElement)) return
      el.open = true
      // Après le rendu du contenu déplié, sinon on défile vers une hauteur
      // qui n'existe pas encore.
      window.requestAnimationFrame(() => {
        el.scrollIntoView({ block: 'start', behavior: 'smooth' })
      })
    }
    ouvrir()
    window.addEventListener('hashchange', ouvrir)
    return () => window.removeEventListener('hashchange', ouvrir)
  }, [])
  return null
}
