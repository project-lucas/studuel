'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useDialogFocus } from '@/lib/use-dialog'
import { useSortieAnimee } from '@/components/useSortieAnimee'

/**
 * La feuille modale de la Boutique : voile, panneau centré (plein écran sur
 * téléphone, bas arrondi), croix en haut à droite, Échap pour fermer. Même
 * mécanique que les autres modales maison (modale-voile / modale-panneau).
 */
export default function Feuille({
  open,
  onClose,
  label,
  format = 'feuille',
  children,
}: {
  open: boolean
  onClose: () => void
  /** Le nom de la feuille pour le lecteur d'écran. */
  label: string
  /**
   * `feuille` (défaut) : plein écran sur téléphone, collée en bas. `popup`
   * (26/10/2026, les quêtes — Lucas : « appuyer le côté pop-up, une page moins
   * grande, j'aimerais voir le bas ») : une carte centrée avec une marge tout
   * autour, dont on voit toujours le bas ; même pose, même croix.
   */
  format?: 'feuille' | 'popup'
  children: ReactNode
}) {
  const popup = format === 'popup'
  const panneau = useRef<HTMLDivElement>(null)
  useDialogFocus(panneau, open)
  const { monte, etat, onAnimationEnd } = useSortieAnimee(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (typeof document === 'undefined' || !monte) return null

  return createPortal(
    <div
      data-etat={etat}
      className={
        popup
          ? 'modale-voile fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4'
          : 'modale-voile fixed inset-0 z-[70] flex items-end justify-center bg-black/55 sm:items-center sm:p-4'
      }
      role="dialog"
      aria-modal="true"
      aria-label={label}
      onClick={onClose}
    >
      <div
        ref={panneau}
        data-etat={etat}
        onAnimationEnd={onAnimationEnd}
        onClick={(e) => e.stopPropagation()}
        // Feuille BLANCHE comme toutes les autres feuilles de l'app (audit du
        // 23/09/2026) : elle était la seule en crème.
        className={
          popup
            ? 'modale-panneau relative flex max-h-[86svh] w-full max-w-md flex-col overflow-y-auto overscroll-contain rounded-[28px] bg-card p-4 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-foreground/10 outline-none'
            : 'modale-panneau relative flex max-h-[92svh] w-full max-w-md flex-col overflow-y-auto overscroll-contain rounded-t-3xl bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] outline-none sm:rounded-3xl'
        }
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-3 right-3 z-10 grid size-10 cursor-pointer place-items-center rounded-full bg-card text-primary shadow-[0_3px_0_color-mix(in_oklch,var(--border),black_14%)] ring-1 ring-border transition active:translate-y-0.5"
        >
          <X className="size-5" strokeWidth={2.6} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
