'use client'

import { useCallback, useRef } from 'react'

const CLASSE = 'champ-marcel'
const VARIABLE = '--champ-marcel'
/** L'air entre le haut du champ et le bouton flottant posé au-dessus. */
const MARGE = 10

/**
 * Le bouton des quêtes flotte en bas à droite de tous les onglets. Sur le
 * bureau de Marcel, le champ occupe ce coin (Lucas, 16/10/2026 : « ça se
 * superpose, peut-être que Quêtes doit être rehaussé ») : ce crochet publie,
 * tant que le champ est à l'écran, la distance entre le HAUT du champ et le bas
 * de la fenêtre (`--champ-marcel` sur <html>, avec la classe `champ-marcel`).
 * Le bouton s'y pose (components/quetes/BoutonQuetesFlottant) et suit le champ
 * quand il grandit (on écrit, une pièce jointe, l'état endormi).
 *
 * Une référence-callback : le champ ouvert et le champ verrouillé du gratuit
 * sont deux éléments différents, le même crochet sert les deux.
 */
export function useHauteurChamp() {
  const nettoyer = useRef<(() => void) | null>(null)

  return useCallback((el: HTMLElement | null) => {
    nettoyer.current?.()
    nettoyer.current = null
    if (!el) return

    const racine = document.documentElement
    const mesurer = () => {
      const haut = el.getBoundingClientRect().top
      racine.style.setProperty(VARIABLE, `${Math.max(0, Math.round(window.innerHeight - haut + MARGE))}px`)
    }
    racine.classList.add(CLASSE)
    mesurer()
    const observateur = new ResizeObserver(mesurer)
    observateur.observe(el)
    window.addEventListener('resize', mesurer)

    nettoyer.current = () => {
      observateur.disconnect()
      window.removeEventListener('resize', mesurer)
      racine.classList.remove(CLASSE)
      racine.style.removeProperty(VARIABLE)
    }
  }, [])
}
