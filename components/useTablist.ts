'use client'

import { useRef, type KeyboardEvent } from 'react'
import { nextTabIndex } from '@/lib/tablist'

// Clavier d'un groupe d'onglets (`role="tablist"`), à brancher sans toucher au
// style existant : flèches pour changer d'onglet, Origine/Fin aux extrémités,
// et « tabindex baladeur » (un seul onglet dans l'ordre de tabulation — c'est
// le motif ARIA : Tab entre DANS le groupe, les flèches naviguent DEDANS).
//
// Usage :
//   const tabs = useTablist(items.length, setActive)
//   <button role="tab" {...tabs.props(i, i === active)} …>
export function useTablist(count: number, select: (index: number) => void) {
  const refs = useRef<(HTMLElement | null)[]>([])

  function props(index: number, active: boolean) {
    return {
      ref: (el: HTMLElement | null) => {
        refs.current[index] = el
      },
      tabIndex: active ? 0 : -1,
      onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
        const target = nextTabIndex(event.key, index, count)
        if (target === null) return
        event.preventDefault()
        select(target)
        refs.current[target]?.focus()
      },
    }
  }

  return { props }
}
