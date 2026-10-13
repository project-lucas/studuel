'use client'

import { useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useDialogFocus } from '@/lib/use-dialog'
import { cn } from '@/lib/utils'

/**
 * Présentation d'une feuille de l'arène :
 *   · `feuille` — ancrée en bas, violet profond (`.defi3-sheet`) : Modes,
 *     Quêtes, historique, tournoi, clan ;
 *   · `popup` — une GRANDE carte crème centrée, qui se fond et grandit d'un
 *     cran (13/10/2026, Lucas pour la Traque : « je ne voudrais pas que ce
 *     soit une page entière qui s'ouvre, plus un pop-up mais grand »).
 */
export type SheetFormat = 'feuille' | 'popup'

/**
 * L'enveloppe commune des feuilles de l'arène (fond assombri + panneau,
 * en-tête avec bouton Fermer). Le contenu et l'en-tête sont fournis par
 * l'appelant ; le format ne change que la place, la robe et l'entrée du
 * panneau — même voile, même focus, même croix.
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
  format = 'feuille',
}: {
  /** Nom de la feuille — porté par `aria-label` du dialogue. */
  label: string
  /** Préférence « moins de mouvement » : la feuille se contente d'un fondu. */
  reduce: boolean | null
  onClose: () => void
  header: ReactNode
  children: ReactNode
  format?: SheetFormat
}) {
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(panel)
  const popup = format === 'popup'

  // Transform et opacité seulement : la feuille monte, le pop-up se fond en
  // grandissant d'un cran ; sous « moins de mouvement », un fondu pour les deux.
  const entree = reduce ? { opacity: 0 } : popup ? { opacity: 0, scale: 0.94 } : { y: '100%' }
  const posee = reduce ? { opacity: 1 } : popup ? { opacity: 1, scale: 1 } : { y: 0 }

  return (
    <motion.div
      className={cn(
        'fixed inset-0 z-50 flex justify-center bg-black/55',
        popup ? 'items-center p-3' : 'items-end sm:items-center sm:p-4',
      )}
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
        className={cn(
          'w-full max-w-md outline-none',
          popup
            ? // La carte crème : grande (88 % de la hauteur), ses coins de carte,
              // un liseré blanc qui la détache du voile, le contenu qui défile
              // DEDANS — la tête reste.
              'rounded-carte bg-background flex max-h-[88dvh] flex-col overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-4 ring-white/70'
            : 'defi3-sheet',
        )}
        initial={entree}
        animate={posee}
        exit={entree}
        transition={{ type: 'tween', duration: popup ? 0.2 : 0.26, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            'flex items-center gap-3 border-b px-5 py-4',
            popup ? 'border-foreground/10' : 'border-white/10',
          )}
        >
          {header}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className={cn(
              'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors active:scale-90',
              popup
                ? 'bg-card text-primary shadow-carte ring-2 ring-primary/20 hover:bg-secondary'
                : 'text-white/70 hover:bg-white/10',
            )}
          >
            <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
        <div
          className={cn(
            'overflow-y-auto overscroll-contain',
            popup ? 'min-h-0 flex-1' : 'max-h-[72dvh]',
          )}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
