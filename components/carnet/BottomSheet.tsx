'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { useDialogFocus } from '@/lib/use-dialog'
import { verrouillerDefilement } from '@/lib/scroll-lock'
import { useSortieAnimee } from '@/components/useSortieAnimee'

/**
 * Feuille montante (bottom sheet) du carnet : voile sombre + panneau blanc
 * arrondi qui monte du bas, au-dessus de la barre d'onglets. Fermeture par le
 * voile, la croix ou Échap ; le défilement de la page est verrouillé tant
 * qu'elle est ouverte.
 *
 * SANS framer-motion (05/09/2026). Cette feuille est LA primitive des volets
 * de Réviser, Moi et Marcel, et elle embarquait framer-motion (~67 Ko gz)
 * sur chacun de ces onglets pour deux animations qu'on peut écrire en CSS :
 * le voile qui apparaît, le panneau qui monte (docs/latence.md, « ce qui
 * reste »). L'entrée et la sortie sont des `@keyframes` (`.feuille-*`,
 * globals.css) ; la sortie garde le panneau monté le temps de l'animation
 * (`data-etat="ferme"`), puis `animationend` le retire. Les préférences de
 * mouvement réduit sont respectées par la feuille de style, pas par un hook.
 */
export default function BottomSheet({
  open,
  onClose,
  title,
  action,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  /** Un bouton posé sur la ligne du titre, à gauche de la croix (ex. l'appareil
   *  photo de « Ton cours → questions »). */
  action?: ReactNode
  children: ReactNode
}) {
  // Montée tant qu'elle est ouverte OU en train de se fermer (useSortieAnimee).
  const { monte, etat, onAnimationEnd } = useSortieAnimee(open)

  // La feuille reste MONTÉE et bascule sur `open` : le piège de focus doit
  // suivre cet état, pas le montage du composant.
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(panel, open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const libererDefilement = verrouillerDefilement()
    return () => {
      window.removeEventListener('keydown', onKey)
      libererDefilement()
    }
  }, [open, onClose])

  if (typeof document === 'undefined' || !monte) return null

  const fermer = () => {
    sfx.back()
    onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-[70] flex flex-col justify-end">
      {/* Voile : tap → fermer. */}
      <button
        type="button"
        aria-label="Fermer"
        onClick={fermer}
        data-etat={etat}
        className="feuille-voile absolute inset-0 cursor-pointer bg-foreground/40"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        data-etat={etat}
        onAnimationEnd={onAnimationEnd}
        className="feuille-panneau relative max-h-[85dvh] overflow-y-auto overscroll-contain rounded-t-3xl bg-white px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] shadow-2xl outline-none"
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
          {action}
          <button
            type="button"
            onClick={fermer}
            aria-label="Fermer"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
