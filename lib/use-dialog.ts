'use client'

import { useEffect } from 'react'

// Comportement commun des modales maison (bilan de capacités, Ma discipline) :
// Échap ferme, et le fond ne défile plus tant que la modale est ouverte.
export function useDialog(onClose: () => void): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])
}
