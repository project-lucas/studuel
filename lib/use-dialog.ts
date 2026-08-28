'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { nextDialogFocus } from '@/lib/dialog-focus'
import { verrouillerDefilement } from '@/lib/scroll-lock'

// Comportement commun des modales maison. Deux hooks composables :
//
// - `useDialogFocus(ref)` : le piège de focus seul, à brancher sur n'importe
//   quel `role="dialog"` sans rien changer d'autre à son comportement.
// - `useDialog(onClose)` : le paquet complet des modales maison (Échap ferme,
//   le fond ne défile plus, focus piégé) — il RENVOIE le ref à poser sur le
//   panneau.

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/**
 * Piège de focus d'un dialogue : le focus entre dans le panneau à l'ouverture,
 * ne peut plus en sortir à la tabulation, et revient à son point de départ à la
 * fermeture.
 *
 * Nos dialogues portent `role="dialog"` + `aria-modal="true"`, ce qui promet au
 * lecteur d'écran que le reste de la page ne compte plus. Aucun ne tenait cette
 * promesse : le focus restait sur le bouton d'ouverture, Tab continuait de
 * parcourir la page masquée derrière, et à la fermeture le focus repartait au
 * début du document. Au clavier, on pouvait « répondre » à une confirmation
 * d'achat sans jamais atteindre le dialogue.
 *
 * Le ref vise le PANNEAU (la carte), pas le voile : le voile porte souvent un
 * `onClick` de fermeture et n'est pas la zone à parcourir.
 *
 * `active` sert aux dialogues qui restent MONTÉS et basculent sur une prop
 * `open` (feuilles montantes) : sans lui, l'effet ne tournerait qu'au montage
 * du composant, alors que le panneau n'existe pas encore. Le laisser à `true`
 * convient aux dialogues montés seulement à l'ouverture.
 *
 * La touche Échap reste à la charge de l'appelant (ou de `useDialog`) : chaque
 * dialogue a sa propre façon d'annuler.
 */
export function useDialogFocus(
  panelRef: RefObject<HTMLElement | null>,
  active = true,
): void {
  useEffect(() => {
    if (!active) return
    const panel = panelRef.current
    if (!panel) return

    const before =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null
    // Si le focus est DÉJÀ dans le panneau, c'est que le dialogue l'a placé
    // lui-même (`autoFocus` sur un champ de recherche, par exemple) : on ne le
    // lui vole pas, et on n'a alors rien à restituer à la fermeture.
    const alreadyInside = before ? panel.contains(before) : false
    const previous = alreadyInside ? null : before

    if (!alreadyInside) {
      // Le panneau reçoit le focus, pas son premier bouton : le lecteur
      // d'écran repart du titre du dialogue plutôt que du milieu du contenu.
      if (!panel.hasAttribute('tabindex')) panel.setAttribute('tabindex', '-1')
      panel.focus({ preventScroll: true })
    }

    // getClientRects() plutôt qu'offsetParent : offsetParent vaut null sur tout
    // élément `position: fixed`, ce qui viderait la liste sur la moitié des
    // dialogues de l'app.
    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getClientRects().length > 0,
      )

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = focusables()
      const active =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null
      const target = nextDialogFocus(
        items.length,
        active ? items.indexOf(active) : -1,
        event.shiftKey,
      )
      if (target === null) {
        // Aucun élément focalisable : garder le focus sur le panneau plutôt
        // que de le laisser filer derrière le voile.
        if (items.length === 0) event.preventDefault()
        return
      }
      event.preventDefault()
      items[target].focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      // Rendre le focus à ce qui l'avait : sans ça il repart au début du
      // document et l'utilisateur doit re-tabuler toute la page.
      if (previous && document.contains(previous)) {
        previous.focus({ preventScroll: true })
      }
    }
  }, [panelRef, active])
}

/**
 * Modale maison complète : Échap ferme, le fond ne défile plus, focus piégé.
 * Renvoie le ref à poser sur le panneau du dialogue.
 */
export function useDialog(
  onClose: () => void,
): RefObject<HTMLDivElement | null> {
  const panelRef = useRef<HTMLDivElement>(null)
  useDialogFocus(panelRef)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const libererDefilement = verrouillerDefilement()
    return () => {
      window.removeEventListener('keydown', onKey)
      libererDefilement()
    }
  }, [onClose])

  return panelRef
}
