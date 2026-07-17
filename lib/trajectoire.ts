// -----------------------------------------------------------------------------
// « Ma trajectoire » — la carte macro de l'onglet Moi : où en est l'élève sur
// l'année (préparation globale), à quel rythme il valide des chapitres, et une
// projection honnête (« à ce rythme, prêt vers avril ») face à son échéance
// (brevet, bac, ou fin d'année). Logique pure et testable (convention projet).
//
// Le rythme est le rythme MOYEN observé depuis la première activité — pas une
// promesse : la carte dit « à ton rythme actuel », jamais « tu seras prêt ».
// Dates : clés UTC 'YYYY-MM-DD'.
// -----------------------------------------------------------------------------

import { MASTERY_THRESHOLDS } from '@/lib/mastery'

export type TrajectoireTarget = {
  /** « le brevet », « le bac de français », « le bac », « la fin d'année ». */
  label: string
  /** Échéance (clé jour UTC) — mi-juin de l'année scolaire en cours. */
  dateKey: string
  /** Vrai pour les classes à examen (3e, 1re, Tle). */
  isExam: boolean
}

export type Trajectoire = {
  /** Préparation globale 0..1 : moyenne de maîtrise des chapitres suivis. */
  readiness: number
  /** Chapitres validés (maîtrise ≥ seuil « or »). */
  chaptersDone: number
  chaptersTotal: number
  /** Rythme moyen (chapitres/semaine) depuis la première activité, null sans historique. */
  perWeek: number | null
  /** Date projetée de préparation complète (clé jour), null si aucun rythme. */
  projectedKey: string | null
  /** Projeté avant l'échéance ? null si pas de projection. */
  onTrack: boolean | null
  target: TrajectoireTarget
}

const EXAM_LABELS: Record<string, string> = {
  '3e': 'le brevet',
  '1re': 'le bac de français',
  Tle: 'le bac',
}

// Mi-juin comme échéance : assez proche des épreuves réelles sans prétendre
// connaître le calendrier officiel — le libellé reste « vers ».
const TARGET_MONTH_DAY = '06-15'

function parseKey(key: string): number {
  return Date.parse(`${key}T00:00:00Z`)
}

function shiftKey(key: string, days: number): string {
  return new Date(parseKey(key) + days * 86_400_000).toISOString().slice(0, 10)
}

/**
 * L'échéance de l'année scolaire vue d'un jour donné : le 15 juin à venir
 * (après le 30 juin, on vise le mois de juin de l'année suivante — l'été
 * appartient à l'année scolaire qui démarre).
 */
export function trajectoireTarget(
  grade: string,
  todayKey: string,
): TrajectoireTarget {
  const year = Number(todayKey.slice(0, 4))
  const thisJune = `${year}-${TARGET_MONTH_DAY}`
  const dateKey =
    todayKey <= `${year}-06-30` ? thisJune : `${year + 1}-${TARGET_MONTH_DAY}`
  const label = EXAM_LABELS[grade]
  return {
    label: label ?? "la fin d'année",
    dateKey,
    isExam: Boolean(label),
  }
}

export function computeTrajectoire(input: {
  /** Maîtrise 0..1 de CHAQUE chapitre suivi (0 si jamais travaillé). */
  masteryValues: readonly number[]
  grade: string
  todayKey: string
  /** Première activité connue (plus ancienne session), pour le rythme moyen. */
  firstActivityKey: string | null
}): Trajectoire {
  const { masteryValues, grade, todayKey, firstActivityKey } = input
  const target = trajectoireTarget(grade, todayKey)

  const chaptersTotal = masteryValues.length
  const chaptersDone = masteryValues.filter(
    (v) => v >= MASTERY_THRESHOLDS.mastered,
  ).length
  const readiness =
    chaptersTotal > 0
      ? masteryValues.reduce((s, v) => s + Math.max(0, Math.min(v, 1)), 0) /
        chaptersTotal
      : 0

  // Rythme moyen depuis le début (≥ 1 semaine pour ne pas diviser par ~0).
  let perWeek: number | null = null
  if (firstActivityKey !== null && chaptersDone > 0) {
    const elapsedDays = Math.max(
      0,
      (parseKey(todayKey) - parseKey(firstActivityKey)) / 86_400_000,
    )
    perWeek = chaptersDone / Math.max(1, elapsedDays / 7)
  }

  // Projection : le reste au rythme moyen. Déjà tout validé → prêt aujourd'hui.
  let projectedKey: string | null = null
  const remaining = chaptersTotal - chaptersDone
  if (chaptersTotal > 0 && remaining === 0) {
    projectedKey = todayKey
  } else if (perWeek !== null && perWeek > 0) {
    projectedKey = shiftKey(todayKey, Math.ceil((remaining / perWeek) * 7))
  }

  return {
    readiness,
    chaptersDone,
    chaptersTotal,
    perWeek,
    projectedKey,
    onTrack: projectedKey === null ? null : projectedKey <= target.dateKey,
    target,
  }
}

/** « vers avril 2027 » — mois français d'une clé jour, pour la carte. */
export function monthLabelFr(dateKey: string): string {
  const d = new Date(`${dateKey}T12:00:00Z`)
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d)
}
