'use client'

import { Activity, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { NAV_TABS, ongletVivant } from '@/lib/nav-tabs'

/**
 * LES CINQ ONGLETS RESTENT MONTÉS, COMME CHEZ CLASH ROYALE.
 *
 * Chaque onglet a son emplacement dans la mise en page racine (`app/@defi`,
 * `app/@reviser`, `app/@amis`, `app/@moi`, `app/@tresor` — des routes
 * parallèles). Lors d'une navigation dans l'app, Next GARDE l'état d'un
 * emplacement que l'URL ne vise plus : l'onglet qu'on quitte n'est pas démonté.
 * Ce composant montre celui que l'URL désigne et CACHE les autres avec
 * `<Activity>` de React : le DOM reste en place, l'état aussi (volets ouverts,
 * saisie), et les effets sont suspendus — un onglet caché ne joue ni son ni
 * animation, ne s'abonne à rien. Les écrans transitoires, eux, se referment
 * (components/useFermeAuMasquage).
 *
 * Pourquoi : un changement d'onglet RECONSTRUISAIT tout l'écran — 170 à 680 ms
 * au processeur ×4, même préchargé, le fil principal occupé à rendre et
 * insérer la page (mesuré le 23/09/2026). Ré-afficher un onglet déjà construit
 * coûte une fraction de ce temps. Seule la PREMIÈRE visite d'un onglet le
 * construit encore (le préchargeur a déjà ses données).
 *
 * CHAQUE ONGLET GARDE SON DÉFILEMENT. La page n'a qu'une barre de défilement,
 * celle de la fenêtre : on note la position de l'onglet à l'écran pendant qu'on
 * défile, et on la lui rend quand il revient — avant la première image.
 *
 * `children` porte tout le reste de l'app (sous-pages des onglets, quiz,
 * Marcel, compte…) : il est à l'écran quand l'URL n'est la racine d'aucun
 * onglet (`ongletVivant`, lib/nav-tabs).
 */
export default function OngletsVivants({
  onglets,
  children,
}: {
  /** L'emplacement de chaque onglet, par chemin (`/defi` → `@defi`). */
  onglets: Record<string, ReactNode>
  children: ReactNode
}) {
  const actif = ongletVivant(usePathname())

  // La position de défilement de chaque onglet, et l'onglet auquel attribuer
  // le prochain défilement. L'attribution change AVANT que la position ne soit
  // rendue (effet de mise en page) : un défilement causé par le changement
  // d'onglet lui-même est donc compté pour le nouvel onglet, jamais l'ancien.
  const positions = useRef(new Map<string, number>())
  const auPremierPlan = useRef<string | null>(actif)

  useEffect(() => {
    const noter = () => {
      if (auPremierPlan.current !== null) {
        positions.current.set(auPremierPlan.current, window.scrollY)
      }
    }
    window.addEventListener('scroll', noter, { passive: true })
    return () => window.removeEventListener('scroll', noter)
  }, [])

  useLayoutEffect(() => {
    auPremierPlan.current = actif
    if (actif === null) return
    window.scrollTo({ top: positions.current.get(actif) ?? 0, behavior: 'instant' })
  }, [actif])

  return (
    <>
      {NAV_TABS.map((tab) => (
        <Activity key={tab.path} mode={actif === tab.path ? 'visible' : 'hidden'}>
          {onglets[tab.path]}
        </Activity>
      ))}
      <Activity mode={actif === null ? 'visible' : 'hidden'}>{children}</Activity>
    </>
  )
}
