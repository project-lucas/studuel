'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Croix de fermeture partagée des modales/bottom sheets : toujours en haut à
// droite du panneau (le parent doit être `relative`), même taille et même
// geste partout. La fermeture par tap sur l'overlay reste à la charge du
// parent (voile cliquable).
export default function DialogCloseButton({
  onClose,
  label = 'Fermer',
  className,
}: {
  onClose: () => void
  label?: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={label}
      className={cn(
        'absolute top-3 right-3 z-10 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90',
        className,
      )}
    >
      <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
    </button>
  )
}
