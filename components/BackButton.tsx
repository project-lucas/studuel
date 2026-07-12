'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'

// Bouton retour du template (pastille ronde, chevron) : fait un VRAI retour
// dans l'historique quand il existe — le bouton retour du téléphone reste
// alors cohérent (pas d'aller-retour en boucle) — et remonte au parent
// logique quand l'élève est arrivé directement sur la page (lien partagé).
export default function BackButton({
  fallback,
  label = 'Retour',
  className,
  children,
}: {
  fallback: string
  label?: string
  className?: string
  children?: React.ReactNode
}) {
  const router = useRouter()

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        sfx.tap()
        // > 2 : l'entrée d'origine + le tampon du BackGuard comptent déjà
        // pour 2 — au-delà, il y a un historique interne à dépiler.
        if (window.history.length > 2) router.back()
        else router.push(fallback)
      }}
      className={cn(
        'inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-foreground shadow-sm transition-transform active:scale-95',
        className,
      )}
    >
      {children ?? <ChevronLeft className="size-5" aria-hidden="true" />}
    </button>
  )
}
