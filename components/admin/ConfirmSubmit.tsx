'use client'

import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Bouton de suppression pour les formulaires admin : demande confirmation
// avant de soumettre le <form action> serveur qui l'entoure.
export default function ConfirmSubmit({
  message,
  label = 'Supprimer',
  className,
}: {
  message: string
  label?: string
  className?: string
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault()
      }}
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive',
        className,
      )}
      aria-label={label}
      title={label}
    >
      <Trash2 className="size-4" aria-hidden="true" />
    </button>
  )
}
