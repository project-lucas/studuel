// -----------------------------------------------------------------------------
// « Capacité » de la hero card Moi — logique pure, testable.
//
// La capacité mesure la CONSTANCE des habitudes qui font vraiment monter les
// notes, sur les 14 derniers jours. Quatre drivers, chacun adossé à des
// habitudes du catalogue (habit_logs reste la source unique de vérité — aucune
// donnée dupliquée) :
//   Sommeil       — sommeil régulier, pas d'écran le soir, téléphone hors chambre
//   Hydratation   — hydratation au réveil
//   Concentration — se tester en questions, lecture profonde, respiration
//   Régularité    — révision quotidienne, tests sur trajets, relire ses notes,
//                   planifier sa semaine
//
// Formule transparente (affichée telle quelle dans la modale « Comment c'est
// calculé ? ») :
//   driver   = jours validés / jours planifiés sur 14 jours, en %
//   capacité = moyenne pondérée des drivers renseignés
//   plafond  = la même moyenne si chaque driver montait à 95 %
// Repli : sans aucune habitude suivie, la capacité reprend le score du bilan
// de capacités (quiz post-onboarding, lib/capacity.ts).
// -----------------------------------------------------------------------------

import { habitDays, dayIndexOf, REVISION_CATALOG_ID } from '@/lib/habits'
import { toDayKey } from '@/lib/streak'
import type { Habit, HabitLog } from '@/lib/types'

export type DriverKey = 'sommeil' | 'hydratation' | 'concentration' | 'regularite'

export type DriverDef = {
  key: DriverKey
  label: string
  weight: number // les poids somment à 1
  catalogIds: readonly string[] // habitudes du catalogue qui nourrissent ce driver
}

// Identifiants du catalogue (supabase/010, 012, 187) réutilisés par les leviers.
export const SLEEP_CATALOG_ID = '55555555-5555-4555-8555-555555555501'
export const HYDRATION_CATALOG_ID = '55555555-5555-4555-8555-555555555510'
export const QUESTIONS_CATALOG_ID = '55555555-5555-4555-8555-555555555515'

export const DRIVERS: readonly DriverDef[] = [
  {
    key: 'sommeil',
    label: 'Sommeil',
    weight: 0.3,
    catalogIds: [
      SLEEP_CATALOG_ID,
      '55555555-5555-4555-8555-555555555506', // pas d'écran avant de dormir
      '55555555-5555-4555-8555-555555555508', // téléphone hors de la chambre
    ],
  },
  {
    key: 'hydratation',
    label: 'Hydratation',
    weight: 0.2,
    catalogIds: [HYDRATION_CATALOG_ID],
  },
  {
    key: 'concentration',
    label: 'Concentration',
    weight: 0.25,
    catalogIds: [
      QUESTIONS_CATALOG_ID,
      '55555555-5555-4555-8555-555555555505', // lecture profonde
      '55555555-5555-4555-8555-555555555514', // respiration 2 minutes
    ],
  },
  {
    key: 'regularite',
    label: 'Régularité',
    weight: 0.25,
    catalogIds: [
      REVISION_CATALOG_ID,
      '55555555-5555-4555-8555-555555555503', // test sur trajets
      '55555555-5555-4555-8555-555555555512', // relire mes notes du jour
      '55555555-5555-4555-8555-555555555509', // planifier ma semaine
    ],
  },
]

// Fenêtre d'observation et cible du plafond (« si tu tenais tes leviers »).
export const DRIVER_WINDOW_DAYS = 14
export const PLAFOND_TARGET = 95

export type DriverScore = {
  key: DriverKey
  label: string
  score: number | null // 0..100, null si aucune habitude du driver n'est suivie
}

// Constance de chaque driver sur les 14 derniers jours : jours validés / jours
// planifiés (mêmes règles de planification que l'onglet Moi historique —
// habitDays + date de création de l'habitude).
export function computeDriverScores(
  habits: readonly Habit[],
  logs: readonly HabitLog[],
  todayKey: string,
): DriverScore[] {
  // Les 14 clés de jour de la fenêtre, du plus ancien à aujourd'hui.
  const windowKeys: string[] = []
  const cursor = new Date(`${todayKey}T12:00:00Z`)
  cursor.setUTCDate(cursor.getUTCDate() - (DRIVER_WINDOW_DAYS - 1))
  for (let i = 0; i < DRIVER_WINDOW_DAYS; i++) {
    windowKeys.push(toDayKey(cursor))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }

  const completed = new Set(
    logs.filter((l) => l.completed).map((l) => `${l.habit_id}|${l.date}`),
  )

  return DRIVERS.map((driver) => {
    const tracked = habits.filter((h) => driver.catalogIds.includes(h.catalog_id))
    let planned = 0
    let done = 0
    for (const h of tracked) {
      const days = habitDays(h)
      const createdKey = String(h.created_at).slice(0, 10)
      for (const key of windowKeys) {
        if (key < createdKey) continue
        if (!days.includes(dayIndexOf(key))) continue
        planned++
        if (completed.has(`${h.id}|${key}`)) done++
      }
    }
    return {
      key: driver.key,
      label: driver.label,
      score: planned > 0 ? Math.round((done / planned) * 100) : null,
    }
  })
}

// Moyenne pondérée des drivers renseignés (poids renormalisés) ; sans aucun
// driver, repli sur le score du quiz de capacités (ou null).
export function computeCapacite(
  scores: readonly DriverScore[],
  quizFallback: number | null,
): number | null {
  let sum = 0
  let weight = 0
  for (const s of scores) {
    if (s.score === null) continue
    const def = DRIVERS.find((d) => d.key === s.key)
    if (!def) continue
    sum += s.score * def.weight
    weight += def.weight
  }
  if (weight === 0) return quizFallback
  return Math.round(sum / weight)
}

// Le plafond possible : la même moyenne pondérée, chaque driver porté à la
// cible (sans jamais rabaisser un driver déjà au-dessus). Capacité issue du
// quiz seul → cible brute ; capacité inconnue → null.
export function computePlafond(
  scores: readonly DriverScore[],
  capacite: number | null,
): number | null {
  if (capacite === null) return null
  let sum = 0
  let weight = 0
  for (const s of scores) {
    if (s.score === null) continue
    const def = DRIVERS.find((d) => d.key === s.key)
    if (!def) continue
    sum += Math.max(s.score, PLAFOND_TARGET) * def.weight
    weight += def.weight
  }
  // `Math.max` des DEUX côtés : un plafond « possible » ne doit jamais passer
  // sous la capacité actuelle. Sans lui, un élève dont la capacité vient du
  // seul quiz et dépasse la cible (96+) et qui n'a coché aucune habitude lisait
  // « 100 actuel · 95 possible » — un objectif plus bas que son niveau.
  if (weight === 0) return Math.max(capacite, PLAFOND_TARGET)
  return Math.max(capacite, Math.round(sum / weight))
}

// --- Leviers de la semaine ----------------------------------------------------
// Les 4 chips « Tes leviers cette semaine » : chacune bascule le log du jour de
// SON habitude (source unique : habit_logs). Les points affichés reflètent le
// poids du driver dans la capacité (communication, pas une monnaie).

export type Lever = {
  catalogId: string
  label: string
  points: number // « +N pts » affiché sur la chip
  driverKey: DriverKey
}

export const LEVERS: readonly Lever[] = [
  { catalogId: SLEEP_CATALOG_ID, label: 'Sommeil', points: 4, driverKey: 'sommeil' },
  { catalogId: HYDRATION_CATALOG_ID, label: 'Hydratation', points: 4, driverKey: 'hydratation' },
  { catalogId: REVISION_CATALOG_ID, label: 'Révision', points: 3, driverKey: 'regularite' },
  { catalogId: QUESTIONS_CATALOG_ID, label: 'Questions', points: 5, driverKey: 'concentration' },
]
