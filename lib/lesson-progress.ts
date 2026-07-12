// Avancement d'une leçon (template « structure des cours ») :
// chaque leçon est un hub à 4 supports — Cours, Révision (fiche), Studygram
// (visuel) et Quiz. L'anneau de la leçon se remplit à parts égales entre les
// supports RÉELLEMENT disponibles ; le quiz compte pour son meilleur score
// (0..1), les autres comptent 1 quand ils ont été consultés.

export type LessonSupports = {
  hasRevision: boolean
  hasStudygram: boolean
  hasQuiz: boolean
}

export type LessonActivity = {
  coursDone: boolean
  revisionDone: boolean
  studygramDone: boolean
  bestQuizRatio: number | null // null = quiz jamais tenté
}

export const EMPTY_LESSON_ACTIVITY: LessonActivity = {
  coursDone: false,
  revisionDone: false,
  studygramDone: false,
  bestQuizRatio: null,
}

// Nombre de supports disponibles sur la leçon (le Cours existe toujours).
export function lessonSupportCount(s: LessonSupports): number {
  return 1 + (s.hasRevision ? 1 : 0) + (s.hasStudygram ? 1 : 0) + (s.hasQuiz ? 1 : 0)
}

// Nombre de supports « faits » (le quiz compte fait dès qu'il a été tenté).
export function lessonSupportsDone(
  s: LessonSupports,
  a: LessonActivity,
): number {
  let done = a.coursDone ? 1 : 0
  if (s.hasRevision && a.revisionDone) done += 1
  if (s.hasStudygram && a.studygramDone) done += 1
  if (s.hasQuiz && a.bestQuizRatio !== null) done += 1
  return done
}

// Valeur 0..1 qui remplit l'anneau : moyenne des supports disponibles,
// le quiz pesant son meilleur score plutôt qu'un tout-ou-rien.
export function lessonProgress(s: LessonSupports, a: LessonActivity): number {
  const total = lessonSupportCount(s)
  let sum = a.coursDone ? 1 : 0
  if (s.hasRevision && a.revisionDone) sum += 1
  if (s.hasStudygram && a.studygramDone) sum += 1
  if (s.hasQuiz && a.bestQuizRatio !== null) {
    sum += Math.max(0, Math.min(a.bestQuizRatio, 1))
  }
  return Math.max(0, Math.min(sum / total, 1))
}
