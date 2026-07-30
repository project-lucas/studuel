'use client'

import { cn } from '@/lib/utils'
import type { ArenaPeriod } from '@/lib/arena-background'

/**
 * Vie du ciel de l'Arène (onglet Défi) : nuages qui dérivent, rayon de
 * lumière qui respire sous l'arche, et étalonnage couleur de la plage
 * horaire (voile `arena-grade` piloté par la classe `arena-sky-<période>`).
 * Purement décoratif — style et animations dans globals.css (`.arena-*`),
 * qui respecte prefers-reduced-motion. La nuit, les nuages s'effacent et le
 * rayon s'éteint : le ciel étoilé et la lune de l'image prennent le relais.
 */
export default function ArenaSky({ period }: { period: ArenaPeriod | null }) {
  return (
    <div
      aria-hidden="true"
      className={cn('arena-sky', period && `arena-sky-${period}`)}
    >
      <span className="arena-cloud arena-cloud-1" />
      <span className="arena-cloud arena-cloud-2" />
      <span className="arena-ray" />
      <span className="arena-grade" />
    </div>
  )
}
