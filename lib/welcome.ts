import type { Subject } from '@/lib/types'
import { GRADE_LEVELS } from '@/lib/types'

// Parcours d'accueil « façon Duolingo » : entièrement AVANT la création de
// compte. L'élève vit le parcours, on stocke ses réponses en local, puis on
// les applique à l'inscription (metadata → trigger handle_new_user). Toute la
// logique testable vit ici ; les composants ne font qu'afficher.

export type Motivation =
  | 'controles'
  | 'examen'
  | 'confiance'
  | 'avance'
  | 'parents'

export type Source =
  | 'tiktok'
  | 'instagram'
  | 'ami'
  | 'prof'
  | 'recherche'
  | 'autre'

export type OnboardingAnswers = {
  motivation: Motivation | null
  source: Source | null
  grade: string | null
  subjects: string[]
  goal: number
}

export const EMPTY_ANSWERS: OnboardingAnswers = {
  motivation: null,
  source: null,
  grade: null,
  subjects: [],
  goal: 1,
}

// Ordre des écrans. `intro` accueille, `preparing` est l'écran « on prépare
// ton espace… », `signup` est le mur d'inscription final.
export const WELCOME_STEPS = [
  'intro',
  'motivation',
  'source',
  'grade',
  'subjects',
  'goal',
  'preparing',
  'signup',
] as const

export type WelcomeStep = (typeof WELCOME_STEPS)[number]

// Étapes qui comptent dans la barre de progression (les questions).
export const QUESTION_STEPS: WelcomeStep[] = [
  'motivation',
  'source',
  'grade',
  'subjects',
  'goal',
]

export const MOTIVATIONS: { value: Motivation; label: string; emoji: string }[] =
  [
    { value: 'controles', label: 'Réussir mes contrôles', emoji: '🎯' },
    { value: 'examen', label: 'Préparer le brevet ou le bac', emoji: '🏆' },
    { value: 'confiance', label: 'Reprendre confiance', emoji: '💪' },
    { value: 'avance', label: "Prendre de l'avance", emoji: '🚀' },
    { value: 'parents', label: 'Faire plaisir à mes parents', emoji: '💛' },
  ]

export const SOURCES: { value: Source; label: string; emoji: string }[] = [
  { value: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { value: 'instagram', label: 'Instagram', emoji: '📸' },
  { value: 'ami', label: 'Un ami', emoji: '🧑‍🤝‍🧑' },
  { value: 'prof', label: 'Un professeur', emoji: '🧑‍🏫' },
  { value: 'recherche', label: 'Une recherche Google', emoji: '🔎' },
  { value: 'autre', label: 'Autrement', emoji: '✨' },
]

export const GOALS: { value: number; label: string; hint: string }[] = [
  { value: 1, label: '1 session / jour', hint: 'Tranquille et régulier' },
  { value: 2, label: '2 sessions / jour', hint: 'Motivé·e' },
  { value: 3, label: '3 sessions / jour', hint: 'Mode examen 🔥' },
]

export const GRADE_HINTS: Record<string, string> = {
  '3e': 'Année du brevet',
  '1re': 'Bac de français',
  Tle: 'Année du bac',
}

// Matières proposées pour un niveau donné.
export function subjectsForGrade(
  subjects: Subject[],
  grade: string | null,
): Subject[] {
  if (!grade) return []
  return subjects.filter((s) => s.levels.includes(grade))
}

// Nouvelle classe → tout coché par défaut (l'élève décoche ses options).
export function defaultSelectedForGrade(
  subjects: Subject[],
  grade: string,
): string[] {
  return subjectsForGrade(subjects, grade).map((s) => s.slug)
}

// L'étape en cours est-elle validée (peut-on continuer) ?
export function canAdvance(
  step: WelcomeStep,
  answers: OnboardingAnswers,
): boolean {
  switch (step) {
    case 'motivation':
      return answers.motivation !== null
    case 'source':
      return answers.source !== null
    case 'grade':
      return answers.grade !== null
    case 'subjects':
      return answers.subjects.length > 0
    case 'goal':
      return [1, 2, 3].includes(answers.goal)
    default:
      // intro / preparing / signup n'ont pas de bouton « Continuer » standard.
      return true
  }
}

// Progression 0→1 pour la barre, ou null quand la barre est masquée
// (accueil et écran de préparation, où l'on ne veut pas de distraction).
export function stepProgress(step: WelcomeStep): number | null {
  const index = QUESTION_STEPS.indexOf(step)
  if (index >= 0) return (index + 1) / QUESTION_STEPS.length
  if (step === 'signup') return 1
  return null
}

// --- Persistance locale (reprise du parcours après un rafraîchissement) ---

export const STORAGE_KEY = 'studuel:onboarding'

export function serializeAnswers(answers: OnboardingAnswers): string {
  return JSON.stringify(answers)
}

// Relit prudemment le brouillon : toute valeur douteuse retombe sur le défaut.
export function parseAnswers(raw: string | null): OnboardingAnswers {
  if (!raw) return { ...EMPTY_ANSWERS }
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return { ...EMPTY_ANSWERS }
  }
  if (typeof data !== 'object' || data === null) return { ...EMPTY_ANSWERS }
  const d = data as Record<string, unknown>

  const motivation = MOTIVATIONS.some((m) => m.value === d.motivation)
    ? (d.motivation as Motivation)
    : null
  const source = SOURCES.some((s) => s.value === d.source)
    ? (d.source as Source)
    : null
  const grade =
    typeof d.grade === 'string' &&
    (GRADE_LEVELS as readonly string[]).includes(d.grade)
      ? d.grade
      : null
  const subjects = Array.isArray(d.subjects)
    ? d.subjects.filter(
        (s): s is string => typeof s === 'string' && s.length > 0 && s.length < 64,
      )
    : []
  const goal = [1, 2, 3].includes(d.goal as number) ? (d.goal as number) : 1

  return { motivation, source, grade, subjects, goal }
}
