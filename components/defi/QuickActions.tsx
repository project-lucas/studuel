'use client'

import Link from 'next/link'
import { Zap } from 'lucide-react'
import { sfx } from '@/lib/sounds'

/**
 * La rangée sociale de l'écran d'arène, façon Clash Royale :
 * « Duel en direct » (bleu) → /defi/duel-rapide : un QR à faire scanner,
 * le match démarre instantanément. Même famille de vocabulaire que le
 * « Duel en direct · par code » de la salle de jeu — un seul concept, deux
 * façons d'inviter (QR côte à côte, code à distance).
 * (« Ajouter un ami » vit désormais dans l'onglet Amis : FriendQrButton.)
 */
export default function QuickActions() {
  return (
    <Link
      href="/defi/duel-rapide"
      onClick={() => sfx.tap()}
      className="defi2-press flex w-full items-center justify-center gap-1.5 rounded-2xl border border-[oklch(0.7_0.12_255)] bg-gradient-to-b from-[oklch(0.62_0.15_255)] to-[oklch(0.5_0.16_262)] px-3 py-2.5 shadow-[0_10px_22px_-10px_oklch(0.45_0.16_260)] focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none"
    >
      <Zap className="size-4 text-highlight" aria-hidden="true" />
      <span className="font-heading text-sm font-extrabold text-white">
        Duel en direct <span className="font-bold text-white/70">· QR</span>
      </span>
    </Link>
  )
}
