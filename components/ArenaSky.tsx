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
 * Sur une plage VIVANTE (components/defi/ArenaVivante.tsx), les nuages flous
 * ne sont pas rendus du tout : la scène a ses propres nuages, peints et
 * détourés, et deux masses floutées de plus coûteraient des images par
 * seconde pour rien.
 */
export default function ArenaSky({
  period,
  vivant = false,
}: {
  period: ArenaPeriod | null
  /** La plage a sa scène vivante : ses nuages peints remplacent ceux-ci. */
  vivant?: boolean
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('arena-sky', period && `arena-sky-${period}`)}
    >
      {vivant ? null : (
        <>
          <span className="arena-cloud arena-cloud-1" />
          <span className="arena-cloud arena-cloud-2" />
        </>
      )}
      <span className="arena-ray" />
      <span className="arena-grade" />
    </div>
  )
}
