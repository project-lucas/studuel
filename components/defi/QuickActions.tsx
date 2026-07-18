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
      className="olympe-gem olympe-press flex min-h-12 w-full items-center justify-center gap-1.5 rounded-2xl px-3 focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none"
    >
      <Zap className="size-4 text-highlight" aria-hidden="true" />
      <span className="font-heading text-sm font-extrabold text-white">
        Duel en direct <span className="font-bold text-white/70">· QR</span>
      </span>
    </Link>
  )
}
