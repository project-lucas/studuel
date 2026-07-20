'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Rank, RankTierId } from '@/lib/rank'

interface RankBadgeProps {
  rank: Rank
  /** Côté du blason en pixels. */
  size?: number
  /** Masque la pastille de division (utile pour un rendu compact). */
  hideDivision?: boolean
  className?: string
}

/**
 * Le blason de rang « façon League of Legends » : l'illustration du palier
 * (bouclier + crayons croisés + lauriers) surmontée de la division en chiffres
 * romains. Tant que les webp de blasons ne sont pas déposés dans
 * `public/images/defi/ranks/`, on retombe proprement sur l'emoji de repli du
 * palier (`onError`) — jamais d'image cassée. Purement présentationnel.
 */
export default function RankBadge({
  rank,
  size = 72,
  hideDivision = false,
  className = '',
}: RankBadgeProps) {
  // On mémorise le palier DONT le blason a échoué, pas un simple booléen : un
  // échec ponctuel (blip réseau) ne doit pas figer l'emoji de repli pour tous
  // les paliers suivants de la session. Changer de palier repart d'un état sain.
  const [brokenTier, setBrokenTier] = useState<RankTierId | null>(null)
  const { tier, roman } = rank
  const broken = brokenTier === tier.id

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {broken ? (
        <span
          aria-hidden="true"
          className="leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
          style={{ fontSize: Math.round(size * 0.62) }}
        >
          {tier.emoji}
        </span>
      ) : (
        <Image
          src={tier.image}
          alt={rank.label}
          width={size}
          height={size}
          className="size-full object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]"
          onError={() => setBrokenTier(tier.id)}
        />
      )}

      {roman && !hideDivision && (
        <span
          aria-hidden="true"
          className="font-heading absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full border border-[color:var(--foreground)]/20 bg-[color:var(--background)] px-2 py-0.5 text-[11px] font-extrabold leading-none tracking-wide text-[color:var(--foreground)] shadow-sm"
        >
          {roman}
        </span>
      )}
    </div>
  )
}
