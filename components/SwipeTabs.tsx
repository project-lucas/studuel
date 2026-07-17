'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { neighborTabPath, tabIndexForPath } from '@/lib/nav-tabs'
import { dragOffset, resolveSwipe } from '@/lib/swipe'
import { sfx } from '@/lib/sounds'

/**
 * Balayage horizontal façon Clash Royale : où qu'on pose le doigt, glisser
 * vers la gauche ou la droite change d'onglet. Le contenu suit le doigt
 * pendant le geste, puis revient en place.
 *
 * Les écouteurs sont sur `window` (le geste marche partout) mais le décalage
 * visuel s'applique au conteneur rendu ici.
 */
export default function SwipeTabs({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const surfaceRef = useRef<HTMLDivElement>(null)
  // Le pathname change sans relancer l'effet tactile : on le lit au moment du
  // geste via une ref, synchronisée hors rendu (règle react-hooks/refs).
  const pathRef = useRef(pathname)
  useEffect(() => {
    pathRef.current = pathname
  }, [pathname])

  // Les onglets voisins sont préchargés : le changement paraît instantané.
  useEffect(() => {
    if (tabIndexForPath(pathname) < 0) return
    for (const direction of ['left', 'right'] as const) {
      const target = neighborTabPath(pathname, direction)
      if (target) router.prefetch(target)
    }
  }, [pathname, router])

  useEffect(() => {
    const surface = surfaceRef.current
    if (!surface) return

    let startX = 0
    let startY = 0
    let startedAt = 0
    let tracking = false

    // will-change/transform uniquement PENDANT le geste : un transform (même
    // identité) fait du conteneur le containing block des descendants
    // `position: fixed` — les fonds plein écran (arène, crème) se retrouvent
    // calés sur la zone de contenu au lieu du viewport (bordures blanches).
    // Au repos, le conteneur redevient neutre.
    const setOffset = (px: number) => {
      if (px === 0) {
        surface.style.transform = ''
        surface.style.transition = 'transform 200ms ease-out'
        surface.style.willChange = ''
      } else {
        surface.style.transform = `translate3d(${px}px, 0, 0)`
        surface.style.transition = ''
        surface.style.willChange = 'transform'
      }
    }

    const onStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return
      if (tabIndexForPath(pathRef.current) < 0) return
      if (!isSwipeable(event.target)) return

      const touch = event.touches[0]
      startX = touch.clientX
      startY = touch.clientY
      startedAt = event.timeStamp
      tracking = true
    }

    const onMove = (event: TouchEvent) => {
      if (!tracking) return
      const touch = event.touches[0]
      const dx = touch.clientX - startX
      const dy = touch.clientY - startY

      // Geste vertical assumé : c'est un scroll, on rend la main.
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 12) {
        tracking = false
        setOffset(0)
        return
      }

      const direction = dx < 0 ? 'left' : 'right'
      const hasNeighbor = neighborTabPath(pathRef.current, direction) !== null
      setOffset(dragOffset(dx, hasNeighbor))
    }

    const onEnd = (event: TouchEvent) => {
      if (!tracking) return
      tracking = false
      setOffset(0)

      const touch = event.changedTouches[0]
      const direction = resolveSwipe({
        dx: touch.clientX - startX,
        dy: touch.clientY - startY,
        dt: event.timeStamp - startedAt,
      })
      if (!direction) return

      const target = neighborTabPath(pathRef.current, direction)
      if (!target) return

      sfx.tap()
      router.push(target)
    }

    const onCancel = () => {
      tracking = false
      setOffset(0)
    }

    // Passifs : on ne bloque jamais le scroll vertical natif.
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    window.addEventListener('touchcancel', onCancel, { passive: true })

    return () => {
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('touchcancel', onCancel)
    }
  }, [router])

  return <div ref={surfaceRef}>{children}</div>
}

/** Balises interactives ou carrousels : le geste leur appartient, pas à nous. */
const IGNORED_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

function isSwipeable(target: EventTarget | null): boolean {
  let node = target instanceof Element ? target : null

  while (node) {
    if (IGNORED_TAGS.has(node.tagName)) return false
    if (node.closest('[data-no-swipe]')) return false
    if (node instanceof HTMLElement && node.isContentEditable) return false

    // Un conteneur qui défile horizontalement (carrousel de matières,
    // tableau large…) absorbe le geste : on ne lui vole pas.
    if (node.scrollWidth > node.clientWidth + 4) {
      const overflowX = getComputedStyle(node).overflowX
      if (overflowX === 'auto' || overflowX === 'scroll') return false
    }

    node = node.parentElement
  }

  return true
}
