/**
 * Fond d'arène dynamique de l'onglet Défi : six variantes du colisée selon
 * l'heure locale de l'appareil (la lumière que l'élève voit par sa fenêtre).
 * Logique pure et testable ici ; le composant client
 * `components/ArenaBackdrop.tsx` gère le timer, le fondu et le préchargement.
 */

export type ArenaPeriod =
  | 'dawn'
  | 'morning'
  | 'noon'
  | 'afternoon'
  | 'evening'
  | 'night'

export interface ArenaSlot {
  /** Heure de début incluse (0-23). La plage court jusqu'au début suivant. */
  start: number
  period: ArenaPeriod
  src: string
}

/**
 * Les plages horaires, triées par heure de début — SEULE structure à modifier
 * pour changer les horaires ou les visuels. `night` couvre 21h → 4h59 :
 * les heures avant le premier début (0h-4h59) retombent sur la dernière plage.
 */
export const ARENA_SCHEDULE: readonly ArenaSlot[] = [
  { start: 5, period: 'dawn', src: '/images/arene/arena-dawn.webp' },
  { start: 8, period: 'morning', src: '/images/arene/arena-morning.webp' },
  { start: 12, period: 'noon', src: '/images/arene/arena-noon.webp' },
  { start: 15, period: 'afternoon', src: '/images/arene/arena-afternoon.webp' },
  { start: 18, period: 'evening', src: '/images/arene/arena-evening.webp' },
  { start: 21, period: 'night', src: '/images/arene/arena-night.webp' },
]

/** La plage active pour une heure donnée (0-23). */
export function arenaSlotAt(hour: number): ArenaSlot {
  let active = ARENA_SCHEDULE[ARENA_SCHEDULE.length - 1]
  for (const slot of ARENA_SCHEDULE) {
    if (hour >= slot.start) active = slot
  }
  return active
}

export function arenaPeriodAt(hour: number): ArenaPeriod {
  return arenaSlotAt(hour).period
}

export function arenaSrcOf(period: ArenaPeriod): string {
  const slot = ARENA_SCHEDULE.find((s) => s.period === period)
  return (slot ?? ARENA_SCHEDULE[0]).src
}

/** La plage qui suivra celle de l'heure donnée (à précharger). */
export function nextArenaSlot(hour: number): ArenaSlot {
  const index = ARENA_SCHEDULE.indexOf(arenaSlotAt(hour))
  return ARENA_SCHEDULE[(index + 1) % ARENA_SCHEDULE.length]
}

/** Millisecondes entre `now` et le prochain changement de plage. */
export function msUntilNextArenaChange(now: Date): number {
  const hour = now.getHours()
  // Prochain début strictement après l'heure courante ; sinon le premier
  // début de demain (setHours accepte les valeurs > 23 et déborde sur le
  // lendemain).
  const nextStart =
    ARENA_SCHEDULE.map((s) => s.start).find((start) => start > hour) ??
    ARENA_SCHEDULE[0].start + 24
  const boundary = new Date(now)
  boundary.setHours(nextStart, 0, 0, 0)
  return boundary.getTime() - now.getTime()
}

/** Garde de type pour l'override de test (`?arena=…`). */
export function isArenaPeriod(
  value: string | null | undefined,
): value is ArenaPeriod {
  return ARENA_SCHEDULE.some((s) => s.period === value)
}
