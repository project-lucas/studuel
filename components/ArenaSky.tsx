'use client'

import { cn } from '@/lib/utils'
import type { ArenaPeriod } from '@/lib/arena-background'

/**
 * Vie du ciel de l'Arène (onglet Défi) : nuages qui dérivent et oiseaux qui
 * traversent. Purement décoratif — style et animations dans globals.css
 * (`.arena-*`), qui respecte prefers-reduced-motion. La nuit (période fournie
 * par ArenaBackdrop), oiseaux et nuages s'effacent : le ciel étoilé et la
 * lune de l'image prennent le relais.
 */
function Bird({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 8"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M1 6.2 Q5.5 1.4 10 5.4 Q14.5 1.4 19 6.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function ArenaSky({ period }: { period: ArenaPeriod | null }) {
  return (
    <div
      aria-hidden="true"
      className={cn('arena-sky', period === 'night' && 'arena-sky-night')}
    >
      <span className="arena-cloud arena-cloud-1" />
      <span className="arena-cloud arena-cloud-2" />
      <Bird className="arena-bird arena-bird-1" />
      <Bird className="arena-bird arena-bird-2" />
    </div>
  )
}
