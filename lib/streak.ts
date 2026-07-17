// Série (streak) et anneau hebdomadaire — logique pure, testable.
// Les jours sont identifiés par leur clé UTC 'YYYY-MM-DD'.

export const toDayKey = (d: Date) => d.toISOString().slice(0, 10)

function shiftDays(d: Date, days: number): Date {
  const copy = new Date(d)
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

// Fenêtre glissante des requêtes d'« activité » (série + semaine) : borne les
// selects sur les tables d'événements qui grossissent sans fin. 400 jours
// couvrent toute série affichable — au-delà, l'historique n'apporte rien à
// computeStreak/weekProgress.
export const ACTIVITY_WINDOW_DAYS = 400

export function activityCutoff(now: Date = new Date()): string {
  return new Date(
    now.getTime() - ACTIVITY_WINDOW_DAYS * 86_400_000,
  ).toISOString()
}

// Série de jours consécutifs avec activité, en remontant depuis aujourd'hui.
// Clémence façon Duolingo : si rien aujourd'hui mais activité hier,
// la série d'hier est toujours vivante.
export function computeStreak(activeDays: Set<string>, now = new Date()): number {
  let cursor = new Date(now)
  if (!activeDays.has(toDayKey(cursor))) {
    cursor = shiftDays(cursor, -1)
    if (!activeDays.has(toDayKey(cursor))) return 0
  }
  let streak = 0
  while (activeDays.has(toDayKey(cursor))) {
    streak += 1
    cursor = shiftDays(cursor, -1)
  }
  return streak
}

// Semaine courante (lundi → dimanche) : [fait ?, est aujourd'hui ?] par jour.
export function weekProgress(
  activeDays: Set<string>,
  now = new Date(),
): { done: boolean; isToday: boolean; isFuture: boolean }[] {
  const todayKey = toDayKey(now)
  // getUTCDay() : 0 = dimanche → on ramène lundi = 0.
  const mondayOffset = (now.getUTCDay() + 6) % 7
  const monday = shiftDays(now, -mondayOffset)

  return Array.from({ length: 7 }, (_, i) => {
    const day = shiftDays(monday, i)
    const key = toDayKey(day)
    return {
      done: activeDays.has(key),
      isToday: key === todayKey,
      isFuture: key > todayKey,
    }
  })
}
