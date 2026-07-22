'use client'

import { cn } from '@/lib/utils'
import type { ArenaPeriod } from '@/lib/arena-background'

/**
 * Vie du ciel de l'Arène (onglet Défi) : nuages qui dérivent. Purement
 * décoratif — style et animations dans globals.css (`.arena-*`), qui respecte
 * prefers-reduced-motion. La nuit (période fournie par ArenaBackdrop), les
 * nuages s'effacent : le ciel étoilé et la lune de l'image prennent le relais.
 */
export default function ArenaSky({ period }: { period: ArenaPeriod | null }) {
  return (
    <div
      aria-hidden="true"
      className={cn('arena-sky', period === 'night' && 'arena-sky-night')}
    >
      <span className="arena-cloud arena-cloud-1" />
      <span className="arena-cloud arena-cloud-2" />
    </div>
  )
}
