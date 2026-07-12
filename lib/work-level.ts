// Niveau de travail — dérivé du temps cumulé (secondes) en paliers d'heures.
// Logique pure, testable. Voir [[temps-de-travail]].

type Tier = { hours: number; title: string }

// Paliers croissants : le niveau = index + 1, le titre est le rang affiché.
const TIERS: Tier[] = [
  { hours: 0, title: 'Recrue' },
  { hours: 1, title: 'Apprenti' },
  { hours: 3, title: 'Curieux' },
  { hours: 6, title: 'Régulier' },
  { hours: 12, title: 'Assidu' },
  { hours: 25, title: 'Endurant' },
  { hours: 50, title: 'Bosseur' },
  { hours: 100, title: 'Acharné' },
  { hours: 250, title: 'Virtuose' },
  { hours: 500, title: 'Maître' },
  { hours: 1000, title: 'Légende' },
]

export type WorkLevel = {
  level: number // 1..N
  title: string // rang affiché
  progress: number // 0..1 vers le niveau suivant
  nextHours: number | null // seuil du niveau suivant, ou null si max
}

export function workLevel(seconds: number): WorkLevel {
  const hours = Math.max(0, seconds) / 3600
  let idx = 0
  for (let i = 0; i < TIERS.length; i++) {
    if (hours >= TIERS[i].hours) idx = i
  }
  const current = TIERS[idx]
  const next = TIERS[idx + 1] ?? null
  const progress = next
    ? Math.min(1, (hours - current.hours) / (next.hours - current.hours))
    : 1
  return {
    level: idx + 1,
    title: current.title,
    progress,
    nextHours: next?.hours ?? null,
  }
}
