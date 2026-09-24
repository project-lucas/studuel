'use client'

import { useEffect } from 'react'

/** Classe posée sur <html> quand le bandeau du haut doit s'effacer. */
export const CLASSE_HUD_REPLIE = 'hud-replie'

/**
 * Au-delà de ce défilement (px), l'élève est « dans » la page : le bandeau du
 * haut (niveau, série, gemmes) s'efface. En deçà, il est « en haut » et le
 * retrouve.
 */
export const SEUIL_REPLI_HUD = 24

/** Le bandeau doit-il être replié à ce défilement ? */
export function hudReplie(scrollY: number): boolean {
  return scrollY > SEUIL_REPLI_HUD
}

/**
 * LE BANDEAU DU HAUT S'EFFACE AU DÉFILEMENT (Lucas, 24/09/2026 : « cache la
 * barre de niveau, série et gemmes durant le scrolling ; si l'élève est en
 * haut du mode de jeu, il verra de nouveau ces infos »).
 *
 * Tant que l'écran qui l'appelle est monté, ce crochet pose ou retire
 * `html.hud-replie` selon le défilement ; le bandeau (`TopHud`) et l'en-tête
 * du mode (`ModeStage`) y réagissent en CSS, par `transform` et `opacity`
 * seulement — rien ne se repeint pendant le défilement. Un seul écouteur,
 * passif, lu une fois par image. La classe part avec l'écran.
 */
export function useHudAuDefilement(): void {
  useEffect(() => {
    const racine = document.documentElement
    let image = 0
    const lire = () => {
      image = 0
      racine.classList.toggle(CLASSE_HUD_REPLIE, hudReplie(window.scrollY))
    }
    const surDefilement = () => {
      if (image === 0) image = requestAnimationFrame(lire)
    }
    lire()
    window.addEventListener('scroll', surDefilement, { passive: true })
    return () => {
      window.removeEventListener('scroll', surDefilement)
      cancelAnimationFrame(image)
      racine.classList.remove(CLASSE_HUD_REPLIE)
    }
  }, [])
}
