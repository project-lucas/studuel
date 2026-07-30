'use client'

import { useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useDialogFocus } from '@/lib/use-dialog'

/**
 * L'enveloppe commune des feuilles ancrées en bas de l'arène (fond assombri +
 * panneau `.defi3-sheet` qui monte, en-tête avec bouton Fermer). Le contenu et
 * l'en-tête sont fournis par l'appelant.
 *
 * Extraite d'ArenaHud : depuis que le bandeau de saison ouvre lui aussi sa
 * feuille (le Pass n'a plus de tuile — voir SeasonBanner), deux composants en
 * ont besoin. Une seule enveloppe = un seul comportement d'ouverture, de focus
 * et de fermeture pour TOUTES les feuilles de l'arène.
 *
 * À monter sous `<AnimatePresence>` dans un portail : c'est l'appelant qui
 * décide où la feuille est rendue.
 */
export default function SheetShell({
  label,
  reduce,
  onClose,
  header,
  children,
}: {
  /** Nom de la feuille — porté par `aria-label` du dialogue. */
  label: string
  /** Préférence « moins de mouvement » : la feuille se contente d'un fondu. */
  reduce: boolean | null
  onClose: () => void
  header: ReactNode
  children: ReactNode
}) {
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(panel)

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        ref={panel}
        data-no-swipe
        className="defi3-sheet w-full max-w-md outline-none"
        initial={reduce ? { opacity: 0 } : { y: '100%' }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        exit={reduce ? { opacity: 0 } : { y: '100%' }}
        transition={{ type: 'tween', duration: 0.26, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          {header}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 active:scale-90"
          >
            <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[72dvh] overflow-y-auto overscroll-contain">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
