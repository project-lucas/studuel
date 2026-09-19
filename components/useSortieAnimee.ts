'use client'

import { useEffect, useState, type AnimationEvent } from 'react'

/**
 * Monter/démonter un panneau AVEC une animation de sortie, sans framer-motion.
 *
 * Le composant reste monté tant que `open` est vrai OU qu'il se ferme ; il
 * porte `data-etat="ouvert" | "ferme"` et une feuille de style CSS joue
 * l'entrée puis la sortie (`@keyframes`, globals.css). À la fin de l'animation
 * de sortie (`animationend` sur l'élément lui-même — pas sur un enfant), le
 * panneau se démonte. Un filet de `dureeMs` le démonte quand même si
 * l'événement ne vient pas (animation coupée, onglet caché, jsdom).
 *
 * Quand `open` repasse à vrai, le remontage se fait PENDANT le rendu : c'est
 * l'état dérivé d'une prop, le motif recommandé par React, et non un effet.
 */
export function useSortieAnimee(open: boolean, dureeMs = 400) {
  const [monte, setMonte] = useState(open)
  if (open && !monte) setMonte(true)

  useEffect(() => {
    if (open || !monte) return
    const id = window.setTimeout(() => setMonte(false), dureeMs)
    return () => window.clearTimeout(id)
  }, [open, monte, dureeMs])

  const onAnimationEnd = (e: AnimationEvent<HTMLElement>) => {
    if (e.target === e.currentTarget && !open) setMonte(false)
  }

  return { monte, etat: open ? 'ouvert' : 'ferme', onAnimationEnd } as const
}
