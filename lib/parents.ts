// Logique pure du tableau de bord parents.
// Les données brutes viennent de la fonction SQL child_dashboard (migration 044) ;
// ici on ne fait que dériver des libellés et des classements — testable sans DB.
// Les seuils de maîtrise sont alignés sur lib/mastery.ts (0.5 fragile, 0.8 maîtrisé).

import { MASTERY_THRESHOLDS } from './mastery'

export type SubjectScore = {
  subject: string
  ratio: number // 0..1 : score moyen sur la matière
  attempts: number
}

// Miroir exact du JSON renvoyé par la fonction SQL child_dashboard.
export type ChildDashboard = {
  full_name: string | null
  work_seconds: number
  week_seconds: number // temps travaillé sur les 7 derniers jours (glissant)
  week_active_days: number // nb de jours travaillés sur ces 7 jours
  active_days: string[] // clés UTC 'YYYY-MM-DD'
  sessions_total: number
  sessions_7: number
  avg_ratio: number | null
  per_subject: SubjectScore[]
}

// Une matière n'est jugée « faible » qu'avec assez de tentatives, pour éviter
// de pointer un seul quiz raté comme une difficulté durable.
export const MIN_ATTEMPTS_FOR_SIGNAL = 2

export type SubjectState = 'fragile' | 'en_cours' | 'maitrise'

export function subjectState(ratio: number): SubjectState {
  if (ratio >= MASTERY_THRESHOLDS.mastered) return 'maitrise'
  if (ratio >= MASTERY_THRESHOLDS.fragile) return 'en_cours'
  return 'fragile'
}

const SUBJECT_STATE_LABEL: Record<SubjectState, string> = {
  fragile: 'À renforcer',
  en_cours: 'En progrès',
  maitrise: 'Maîtrisé',
}

export function subjectStateLabel(ratio: number): string {
  return SUBJECT_STATE_LABEL[subjectState(ratio)]
}

// Pourcentage lisible d'un ratio 0..1.
export function scorePercent(ratio: number | null): number {
  if (ratio == null || !Number.isFinite(ratio)) return 0
  return Math.round(ratio * 100)
}

// Les matières à renforcer : celles sous le seuil de maîtrise, avec assez de
// tentatives, de la plus faible à la moins faible.
export function weakestSubjects(
  perSubject: SubjectScore[],
  limit = 3,
  minAttempts = MIN_ATTEMPTS_FOR_SIGNAL,
): SubjectScore[] {
  return perSubject
    .filter(
      (s) =>
        s.attempts >= minAttempts && s.ratio < MASTERY_THRESHOLDS.mastered,
    )
    .slice()
    .sort((a, b) => a.ratio - b.ratio || b.attempts - a.attempts)
    .slice(0, limit)
}

// La matière la mieux réussie (pour valoriser un point fort auprès du parent).
export function strongestSubject(
  perSubject: SubjectScore[],
  minAttempts = MIN_ATTEMPTS_FOR_SIGNAL,
): SubjectScore | null {
  const eligible = perSubject.filter((s) => s.attempts >= minAttempts)
  if (eligible.length === 0) return null
  return eligible.reduce((best, s) => (s.ratio > best.ratio ? s : best))
}

export type ActivityLevel = 'inactif' | 'faible' | 'regulier' | 'intense'

// Rythme de la semaine, à partir du nombre de quiz passés sur 7 jours.
export function activityLevel(sessions7: number): ActivityLevel {
  if (sessions7 <= 0) return 'inactif'
  if (sessions7 < 3) return 'faible'
  if (sessions7 < 7) return 'regulier'
  return 'intense'
}

const ACTIVITY_HEADLINE: Record<ActivityLevel, string> = {
  inactif: "Aucune activité cette semaine — un petit encouragement l'aiderait à s'y remettre.",
  faible: 'Un début cette semaine — encouragez une session de plus pour ancrer la régularité.',
  regulier: 'Un rythme régulier cette semaine — la régularité est ce qui fait progresser.',
  intense: 'Une semaine très active — belle implication à féliciter !',
}

// Le message d'accroche affiché au parent, fonction du rythme et de la série.
// `sessions7` ne compte que les quiz, mais `streak` agrège 4 sources (quiz,
// révision, leçon, défi) : une série ≥ 3 PROUVE donc une activité même sans
// aucun quiz. On évite alors le libellé « inactif » (« aucune activité cette
// semaine ») qui contredirait la série affichée juste avant.
export function parentHeadline(sessions7: number, streak: number): string {
  const level = activityLevel(sessions7)
  if (streak >= 3) {
    const tail =
      level === 'inactif'
        ? "la régularité est là ; quelques quiz l'aideraient à mesurer ses progrès."
        : `${ACTIVITY_HEADLINE[level].charAt(0).toLowerCase()}${ACTIVITY_HEADLINE[level].slice(1)}`
    return `${streak} jours d'affilée — ${tail}`
  }
  return ACTIVITY_HEADLINE[level]
}

// Temps de travail en format lisible « 12 h 30 » / « 45 min ».
export function formatWorkDuration(seconds: number): string {
  const safe = Math.max(0, Math.round(seconds))
  const totalMinutes = Math.floor(safe / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours <= 0) return `${minutes} min`
  if (minutes === 0) return `${hours} h`
  return `${hours} h ${String(minutes).padStart(2, '0')}`
}

// Temps de révision moyen par jour travaillé de la semaine, en secondes.
// Moyenné sur les jours réellement travaillés (plus parlant que sur 7) ;
// 0 si aucun jour travaillé cette semaine.
export function averageDailySeconds(
  weekSeconds: number,
  weekActiveDays: number,
): number {
  if (weekActiveDays <= 0) return 0
  return Math.round(Math.max(0, weekSeconds) / weekActiveDays)
}
