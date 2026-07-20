'use client'

import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { sfx } from '@/lib/sounds'

/**
 * Feuille montante (bottom sheet) du carnet : voile sombre + panneau blanc
 * arrondi qui monte du bas, au-dessus de la barre d'onglets. Fermeture par le
 * voile, la croix ou Échap ; le défilement de la page est verrouillé tant
 * qu'elle est ouverte.
 */
export default function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] flex flex-col justify-end">
          {/* Voile : tap → fermer. */}
          <motion.button
            type="button"
            aria-label="Fermer"
            onClick={() => {
              sfx.tap()
              onClose()
            }}
            className="absolute inset-0 cursor-pointer bg-foreground/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative max-h-[85dvh] overflow-y-auto overscroll-contain rounded-t-3xl bg-white px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] shadow-2xl"
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
          >
            {/* Poignée + titre + croix. */}
            <div
              aria-hidden="true"
              className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-muted"
            />
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-extrabold text-foreground">
                {title}
              </h2>
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  onClose()
                }}
                aria-label="Fermer"
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
