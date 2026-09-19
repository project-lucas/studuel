'use client'

import { useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

// « Suis-je hydraté ? » sans setState-dans-effet : le snapshot serveur vaut
// false, le snapshot client vaut true — React bascule tout seul au montage.
const noopSubscribe = () => () => {}
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}

/**
 * Fond de « monde » plein écran (arène violette du Défi, crème de Réviser…).
 *
 * Pourquoi un portal : un `transform` sur un ancêtre fait de lui le containing
 * block des descendants `position: fixed` — un fond fixé DANS la page se
 * retrouverait calé sur la zone de contenu (marges de <main> visibles en
 * bordures blanches) au lieu du viewport. Le piège est né du balayage entre
 * onglets (retiré le 18/09/2026) ; porté sur <body>, le fond couvre tout
 * l'écran quoi que fasse un ancêtre, squelettes de chargement compris.
 *
 * Avant hydratation, la version inline (rendue côté serveur) assure le premier
 * affichage sans flash ; au montage, elle est remplacée par le portal — les
 * deux étant identiques et plein écran, la bascule est invisible.
 */
export default function WorldBackdrop({
  className,
  teinte,
  children,
}: {
  className: string
  /**
   * La teinte d'identité du monde (`data-teinte`, la palette de globals.css) :
   * la course classée s'éclaire dans la couleur de sa matière.
   */
  teinte?: string
  /** Couches décoratives vivant DANS le fond (ex. ciel animé de l'Arène). */
  children?: React.ReactNode
}) {
  const mounted = useHydrated()

  const backdrop = (
    <div aria-hidden="true" data-teinte={teinte} className={cn('fixed inset-0 -z-10', className)}>
      {children}
    </div>
  )

  if (!mounted) return backdrop
  return createPortal(backdrop, document.body)
}
