'use client'

import { useEffect } from 'react'
import { sfx } from '@/lib/sounds'
import { overscrollDirection } from '@/lib/scroll-edge'

/**
 * Rebond SONORE aux extrémités, façon Clash Royale : quand on tire une liste
 * au-delà de son haut ou de son bas, un petit « bwomp » grave. AUCUN son pendant
 * le défilement normal — seulement au rebond, et une seule fois par geste.
 *
 * Monté une fois dans le layout ; écouteurs passifs sur `window` (le geste peut
 * partir de n'importe où). La DÉCISION vit dans lib/scroll-edge (pure, testée) ;
 * ici on ne fait que mesurer le DOM et remonter à la bonne zone défilante.
 */
export default function ScrollEdgeSound() {
  useEffect(() => {
    // Remonte au plus proche ancêtre qui défile VERTICALEMENT ; à défaut, la
    // page entière. Même esprit que le isSwipeable() de SwipeTabs, en vertical :
    // on ne veut pas mesurer le scroll du document quand le doigt est en fait
    // dans une feuille qui défile toute seule.
    const scrollerOf = (target: EventTarget | null): Element | null => {
      let node = target instanceof Element ? target : null
      while (node) {
        if (node.scrollHeight > node.clientHeight + 2) {
          const oy = getComputedStyle(node).overflowY
          if (oy === 'auto' || oy === 'scroll') return node
        }
        node = node.parentElement
      }
      return document.scrollingElement
    }

    const metrics = (el: Element | null) => {
      const node = el ?? document.scrollingElement
      if (!node) return { atTop: true, atBottom: true, scrollable: false }
      const { scrollTop, scrollHeight, clientHeight } = node
      return {
        atTop: scrollTop <= 0,
        atBottom: scrollTop + clientHeight >= scrollHeight - 2,
        scrollable: scrollHeight > clientHeight + 2,
      }
    }

    let startY = 0
    let scroller: Element | null = null
    let bumped = false

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      startY = e.touches[0].clientY
      scroller = scrollerOf(e.target)
      bumped = false
    }

    const onMove = (e: TouchEvent) => {
      if (bumped || e.touches.length !== 1) return
      const dy = e.touches[0].clientY - startY
      if (overscrollDirection({ ...metrics(scroller), dy })) {
        sfx.edgeBump()
        bumped = true
      }
    }

    const onEnd = () => {
      bumped = false
    }

    // Souris / trackpad : rebond au bord, avec un temps de repos entre deux pour
    // ne pas mitrailler le « bwomp » sur une molette qui insiste au bout.
    let lastWheelAt = -Infinity
    const onWheel = (e: WheelEvent) => {
      const m = metrics(scrollerOf(e.target))
      if (!m.scrollable) return
      if (e.timeStamp - lastWheelAt < 500) return
      if ((m.atTop && e.deltaY < 0) || (m.atBottom && e.deltaY > 0)) {
        sfx.edgeBump()
        lastWheelAt = e.timeStamp
      }
    }

    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    window.addEventListener('touchcancel', onEnd, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onEnd)
      window.removeEventListener('wheel', onWheel)
    }
  }, [])

  return null
}
