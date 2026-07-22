'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { AvatarItem } from '@/lib/avatar-studio'
import CoinIcon from '@/components/ui/CoinIcon'

// -----------------------------------------------------------------------------
// Modale d'achat du vestiaire : « Acheter [nom] pour [prix] ? ». Le débit réel
// se fait CÔTÉ SERVEUR (RPC purchase_avatar_item, prix lu en base) — ici on ne
// fait que confirmer l'intention et afficher le solde. Si les pièces manquent,
// le bouton se désactive et dit combien il en manque.
// -----------------------------------------------------------------------------

export default function PurchaseModal({
  item,
  coins,
  pending,
  onConfirm,
  onClose,
}: {
  item: AvatarItem
  coins: number
  pending: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  const price = item.price ?? 0
  const missing = Math.max(0, price - coins)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Acheter ${item.name}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-heading text-lg font-extrabold text-foreground">
            Acheter {item.name} ?
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Annuler l'achat"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
          >
            <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          Prix :
          <span className="inline-flex items-center gap-1 rounded-full bg-highlight px-2 py-0.5 font-extrabold text-foreground">
            <CoinIcon className="size-3.5" />
            {price}
          </span>
          — il te reste {coins} pièces.
        </p>

        {missing > 0 ? (
          <p className="mt-2 text-sm font-bold text-destructive">
            Il te manque {missing} pièce{missing > 1 ? 's' : ''} : gagne-les en
            révisant ou en relevant des défis !
          </p>
        ) : null}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border-2 border-border px-4 py-2.5 text-sm font-bold text-foreground transition active:translate-y-px"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending || missing > 0}
            className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition active:translate-y-px disabled:opacity-60"
          >
            {pending ? '…' : 'Acheter'}
          </button>
        </div>
      </div>
    </div>
  )
}
