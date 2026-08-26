'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
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

  // Le son des toasts est joué ICI, et non dans `toast()`.
  //
  // POURQUOI PAS DANS `toast()` : `lib/toast.ts` est un store pur, importé par
  // ses tests en environnement Node. Lui faire appeler WebAudio y traînerait
  // tout `lib/sounds` — et surtout, `toast()` peut être appelé par du code qui
  // ne s'affichera jamais (file pleine, TOAST_MAX). Le son doit suivre ce que
  // l'élève VOIT, pas ce que le code a demandé.
  //
  // On ne sonne que pour les toasts NOUVEAUX (`id` jamais vu). Sans ce garde,
  // le moindre re-rendu du Toaster rejouerait toute la file — trois pilules à
  // l'écran feraient trois bips à chaque frappe de touche ailleurs dans l'app.
  const dejaSonnes = useRef(new Set<number>())
  useEffect(() => {
    for (const t of toasts) {
      if (dejaSonnes.current.has(t.id)) continue
      dejaSonnes.current.add(t.id)
      sfx.notice(t.kind)
    }
    // La file est bornée à TOAST_MAX : on oublie les ids sortis, sinon
    // l'ensemble grossit pendant toute la session pour rien.
    const vivants = new Set(toasts.map((t) => t.id))
    for (const id of dejaSonnes.current) {
      if (!vivants.has(id)) dejaSonnes.current.delete(id)
    }
  }, [toasts])

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
