/**
 * Fond d'arène de l'onglet Défi. Le découpage de la journée en six plages
 * (aube → nuit, l'heure locale de l'appareil = la lumière que l'élève voit par
 * sa fenêtre) vit ici ; le composant client `components/ArenaBackdrop.tsx`
 * gère le timer, le fondu et le préchargement.
 *
 * ⚠️ Les six plages pointent aujourd'hui vers la MÊME image — voir ARENA_SRC
 * plus bas. Le découpage est conservé pour que les variantes horaires puissent
 * revenir sans retoucher une ligne de composant.
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
 * LE DÉCOR DU MOMENT. Depuis le 02/08/2026, les six plages montrent la MÊME
 * illustration : l'arène à la mascotte, dessinée par Lucas. Elle remplace les
 * six académies flottantes (`arena-dawn` … `arena-night`, toujours dans
 * `public/images/arene/`, plus servies).
 *
 * La mécanique horaire n'est PAS démontée pour autant — le timer, le fondu, le
 * préchargement et le découpage des plages restent en place. Le jour où les
 * variantes horaires de cette nouvelle arène seront dessinées, il n'y aura
 * qu'à remettre un `src` par ligne ci-dessous : rien d'autre ne bouge. En
 * attendant, le fondu enchaîné entre deux plages identiques ne se voit pas et
 * ne coûte rien (même URL, donc même image en cache).
 */
const ARENA_SRC = '/images/arene/arena-mascotte.webp'

/**
 * Les plages horaires, triées par heure de début — SEULE structure à modifier
 * pour changer les horaires ou les visuels. `night` couvre 21h → 4h59 :
 * les heures avant le premier début (0h-4h59) retombent sur la dernière plage.
 */
export const ARENA_SCHEDULE: readonly ArenaSlot[] = [
  { start: 5, period: 'dawn', src: ARENA_SRC },
  { start: 8, period: 'morning', src: ARENA_SRC },
  { start: 12, period: 'noon', src: ARENA_SRC },
  { start: 15, period: 'afternoon', src: ARENA_SRC },
  { start: 18, period: 'evening', src: ARENA_SRC },
  { start: 21, period: 'night', src: ARENA_SRC },
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
