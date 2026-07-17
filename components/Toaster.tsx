'use client'

import { useSyncExternalStore } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  dismissToast,
  getServerToasts,
  getToasts,
  subscribeToasts,
  type ToastKind,
} from '@/lib/toast'

const KIND_STYLE: Record<ToastKind, string> = {
  success: 'bg-foreground text-background',
  error: 'bg-destructive text-white',
}

/**
 * Affiche la file de toasts globale (lib/toast) : pilules empilées au-dessus
 * de la barre d'onglets, annoncées au lecteur d'écran, tap pour fermer.
 * Monté une fois dans le layout racine — aucun provider, les composants
 * appellent simplement `toast('…')`.
 */
export default function Toaster() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, getServerToasts)

  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex flex-col items-center gap-2 px-4"
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => dismissToast(t.id)}
          aria-label={`${t.message} — fermer`}
          className={cn(
            'pop-in pointer-events-auto flex max-w-sm items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold shadow-lg',
            KIND_STYLE[t.kind],
          )}
        >
          {t.kind === 'success' ? (
            <CheckCircle2 className="size-4 shrink-0 text-highlight" aria-hidden="true" />
          ) : (
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          )}
          <span className="min-w-0 truncate">{t.message}</span>
          <X className="size-3.5 shrink-0 opacity-60" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
