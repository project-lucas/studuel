import type { Subject } from '@/lib/types'
import { GRADE_LEVELS } from '@/lib/types'

// Parcours d'accueil « façon Duolingo » (page /bienvenue) — direction fidèle au
// design handoff Studuel : 14 écrans, on qualifie l'élève, on l'accroche avec
// le duel, puis on lui livre un plan perso. Le parcours vit AVANT la création de
// compte : on stocke les réponses en local, puis on les applique à l'inscription
// (metadata → trigger handle_new_user). Toute la logique testable vit ici ; les
// composants ne font qu'afficher et orchestrer.

export type ProfileType = 'eleve' | 'parent'

export type Source =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'ami'
  | 'app_store'
  | 'autre'

// Objectif n°1 de l'élève (écran 5) — sert à personnaliser le plan final.
export type Goal = 'controles' | 'moyenne' | 'examen' | 'avance' | 'defi'

// Objectif quotidien exprimé en minutes (écran 8), façon Duolingo.
export type DailyGoalMinutes = 3 | 10 | 15 | 30

export type PlacementLevel = 'debutant' | 'intermediaire' | 'avance'

// Résultat du test de placement (écran 10) — null tant qu'il n'a pas été fait
// ou s'il a été sauté (« Je débute, passer »).
export type PlacementResult = {
  correct: number
  total: number
  level: PlacementLevel
} | null

export type OnboardingAnswers = {
  profileType: ProfileType | null
  source: Source | null
  goal: Goal | null
  grade: string | null
  subjects: string[]
  dailyGoalMinutes: DailyGoalMinutes
  placement: PlacementResult
  friendsInvited: boolean
  notificationsEnabled: boolean
  // École = clan (choisie à l'écran « ton établissement »). Appliquée APRÈS la
  // création du compte (l'onboarding est pré-auth), d'où le stockage en brouillon.
  schoolName: string | null
  schoolCity: string | null
}

export const EMPTY_ANSWERS: OnboardingAnswers = {
  profileType: null,
  source: null,
  goal: null,
  grade: null,
  subjects: [],
  dailyGoalMinutes: 10,
  placement: null,
  friendsInvited: false,
  notificationsEnabled: false,
  schoolName: null,
  schoolCity: null,
}

// Ordre des 14 écrans (numérotation du design handoff en commentaire).
export const WELCOME_STEPS = [
  'intro', //           1. Bienvenue (splash + logo)
  'profil', //          2. Parent ou élève
  'motivation', //      3. Motivation (le crayon te parle)
  'source', //          4. Comment tu nous as connu ?
  'goal', //            5. Objectif n°1
  'grade', //           6. Ta classe
  'school', //          6bis. Ton établissement = ton clan
  'subjects', //        7. Matières (choix multiple)
  'dailyGoal', //       8. Objectif quotidien (minutes)
  'placementIntro', //  9. Placement — intro
  'placementQuiz', //  10. Mini-quiz de placement
  'friends', //        11. Défie tes amis
  'notifications', //  12. Notifications
  'signup', //         13. Créer un compte
  'plan', //           14. Plan personnalisé (récap)
] as const

export type WelcomeStep = (typeof WELCOME_STEPS)[number]

// Progression de la barre par écran (valeurs du design). La barre n'apparaît
// pas sur l'accueil, le profil, la motivation ni le plan final (null).
// Recalé sur le NOUVEL ordre (cf. FAST_PATH plus bas) : la barre doit refléter
// le chemin réellement parcouru, sinon elle ment. Elle avance vite jusqu'au jeu
// — c'est la promesse « on y est presque » qui fait franchir les trois écrans.
const STEP_PROGRESS: Partial<Record<WelcomeStep, number>> = {
  grade: 0.2,
  placementIntro: 0.3,
  placementQuiz: 0.4,
  signup: 0.55,
  goal: 0.7,
  dailyGoal: 0.8,
  school: 0.88,
  notifications: 0.94,
  // Écrans hors chemin par défaut : gardés pour qu'un brouillon repris affiche
  // toujours une barre cohérente.
  source: 0.6,
  subjects: 0.75,
  friends: 0.9,
}

export function stepProgress(step: WelcomeStep): number | null {
  return STEP_PROGRESS[step] ?? null
}

// --- Ordre du parcours : « jouer d'abord, questionner ensuite » --------------
//
// Les 14 écrans ci-dessus décrivent le design complet. L'ORDRE dans lequel on
// les enchaîne, lui, est une décision produit — et c'est elle qu'on a changée.
//
// Le parcours d'origine posait DOUZE écrans de questions avant que l'élève ne
// touche à une seule question de son programme. Or l'écran qui vend l'app n'est
// aucun de ces douze : c'est le mini-quiz. Chaque écran placé avant lui est un
// péage devant la démonstration.
//
// Nouvel ordre : le strict nécessaire (qui es-tu, quelle classe) puis LE JEU,
// et tout le reste APRÈS la création du compte — quand l'élève est investi et
// qu'un abandon ne coûte plus l'acquisition.
//
// Rien n'est supprimé : les écrans écartés du chemin par défaut existent
// toujours (composants et logique intacts). Les remettre = les rajouter ici.
// Ce qui n'est pas demandé prend une valeur par défaut saine — les matières
// découlent déjà de la classe (defaultSelectedForGrade), l'objectif quotidien a
// son défaut.

/** Les écrans posés AVANT le premier jeu. Toute addition ici se paie en
 *  abandons : n'y mettre que ce sans quoi le jeu ne peut pas démarrer. */
export const STEPS_BEFORE_PLAY: readonly WelcomeStep[] = [
  'intro', // le splash, un tap
  'profil', // parent ou élève : la seule vraie bifurcation du produit
  'grade', // sans la classe, impossible de servir le bon programme
]

/** Le chemin par défaut, dans l'ordre. */
export const FAST_PATH: readonly WelcomeStep[] = [
  ...STEPS_BEFORE_PLAY,
  'placementIntro', // → le jeu
  'placementQuiz', // ← LA démonstration
  'signup', // on demande le compte une fois la valeur montrée
  'goal', // à partir d'ici : du confort, plus de l'acquisition
  'dailyGoal',
  'school', // ton établissement = ton clan (cf. lib/clan-week)
  'notifications',
  'plan',
]

/** Écrans conservés dans le code mais retirés du chemin par défaut :
 *  `motivation` (pur habillage), `source` (attribution marketing),
 *  `subjects` (déduit de la classe), `friends` (le clan le remplace). */
export const OFF_PATH: readonly WelcomeStep[] = [
  'motivation',
  'source',
  'subjects',
  'friends',
]

/**
 * L'écran suivant, ou null à la fin du parcours.
 *
 * Le parcours PARENT court-circuite tout ce qui est élève : un parent n'a ni
 * classe, ni objectif quotidien, ni quiz de placement. Il va droit au compte.
 */
export function nextStep(
  step: WelcomeStep,
  answers: OnboardingAnswers,
): WelcomeStep | null {
  if (step === 'profil' && answers.profileType === 'parent') return 'signup'
  // Un parent qui arrive au compte a fini : la suite est l'espace parents.
  if (step === 'signup' && answers.profileType === 'parent') return null

  const i = FAST_PATH.indexOf(step)
  // Un écran hors chemin (remis à la main, ou repris d'un brouillon plus
  // ancien) ne bloque pas : on rejoint le chemin au compte.
  if (i === -1) return 'signup'
  return i + 1 < FAST_PATH.length ? FAST_PATH[i + 1] : null
}

/** Combien d'écrans séparent l'ouverture de l'app du premier jeu. Sert de
 *  garde-fou testé : cette valeur ne doit pas remonter sans décision explicite. */
export function screensBeforePlay(): number {
  return STEPS_BEFORE_PLAY.length
}

// --- Catalogues d'options ---------------------------------------------------

export const SOURCES: { value: Source; label: string }[] = [
  { value: 'tiktok', label: 'TikTok' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'ami', label: 'Un ami / la famille' },
  { value: 'app_store', label: 'App Store' },
  { value: 'autre', label: 'Autre' },
]

export const GOALS: { value: Goal; label: string }[] = [
  { value: 'controles', label: 'Réussir mes contrôles' },
  { value: 'moyenne', label: 'Remonter ma moyenne' },
  { value: 'examen', label: 'Préparer le brevet / le bac' },
  { value: 'avance', label: "Prendre de l'avance" },
  { value: 'defi', label: 'Défier mes amis' },
]

// Titre du plan final (écran 14), personnalisé selon l'objectif n°1.
export const GOAL_HEADLINE: Record<Goal, string> = {
  controles: 'Objectif : cartonner tes contrôles 🎯',
  moyenne: 'Objectif : remonter ta moyenne 🚀',
  examen: 'Objectif : décrocher ton examen 🏆',
  avance: "Objectif : prendre de l'avance ⚡",
  defi: 'Objectif : dominer tes duels 🔥',
}

export const DAILY_GOALS: {
  minutes: DailyGoalMinutes
  label: string
  hint: string
}[] = [
  { minutes: 3, label: 'Détente', hint: '3 min / jour' },
  { minutes: 10, label: 'Régulier', hint: '10 min / jour' },
  { minutes: 15, label: 'Sérieux', hint: '15 min / jour' },
  { minutes: 30, label: 'Intense', hint: '30 min / jour' },
]

const DAILY_GOAL_MINUTES: DailyGoalMinutes[] = [3, 10, 15, 30]

export function isDailyGoalMinutes(n: unknown): n is DailyGoalMinutes {
  return typeof n === 'number' && DAILY_GOAL_MINUTES.includes(n as DailyGoalMinutes)
}

// Étiquettes d'affichage des classes (exposants du design).
export const GRADE_LABELS: Record<string, string> = {
  '6e': '6ᵉ',
  '5e': '5ᵉ',
  '4e': '4ᵉ',
  '3e': '3ᵉ',
  '2de': '2ⁿᵈᵉ',
  '1re': '1ʳᵉ',
  Tle: 'Terminale',
}

// --- Conversions & scoring --------------------------------------------------

// La colonne legacy `profiles.daily_goal` est en sessions/jour (utilisée par la
// capacité, la série, etc.). On dérive les sessions depuis les minutes choisies
// pour ne rien casser : minutes = source de vérité de l'onboarding.
export function minutesToSessions(minutes: DailyGoalMinutes): number {
  if (minutes >= 30) return 3
  if (minutes >= 15) return 2
  return 1
}

// Niveau de placement à partir du score du mini-quiz. Sauté / vide → débutant.
export function placementLevel(correct: number, total: number): PlacementLevel {
  if (total <= 0) return 'debutant'
  const ratio = correct / total
  if (ratio >= 0.8) return 'avance'
  if (ratio >= 0.4) return 'intermediaire'
  return 'debutant'
}

export function makePlacement(correct: number, total: number): PlacementResult {
  const safeTotal = Math.max(0, total)
  const safeCorrect = Math.max(0, Math.min(correct, safeTotal))
  return {
    correct: safeCorrect,
    total: safeTotal,
    level: placementLevel(safeCorrect, safeTotal),
  }
}

// --- Matières ---------------------------------------------------------------

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

// --- Validation d'avancement ------------------------------------------------

// L'écran en cours autorise-t-il le bouton primaire « Continuer » ? Ne concerne
// que les écrans à bouton standard (profil, source, goal, grade, subjects,
// dailyGoal). Les autres écrans ont leurs propres boutons → true.
export function canAdvance(
  step: WelcomeStep,
  answers: OnboardingAnswers,
): boolean {
  switch (step) {
    case 'profil':
      return answers.profileType !== null
    case 'source':
      return answers.source !== null
    case 'goal':
      return answers.goal !== null
    case 'grade':
      return answers.grade !== null
    case 'subjects':
      return answers.subjects.length > 0
    case 'dailyGoal':
      return isDailyGoalMinutes(answers.dailyGoalMinutes)
    default:
      return true
  }
}

// --- Persistance locale (reprise du parcours après un rafraîchissement) -----

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

  const profileType =
    d.profileType === 'eleve' || d.profileType === 'parent'
      ? d.profileType
      : null
  const source = SOURCES.some((s) => s.value === d.source)
    ? (d.source as Source)
    : null
  const goal = GOALS.some((g) => g.value === d.goal) ? (d.goal as Goal) : null
  const grade =
    typeof d.grade === 'string' &&
    (GRADE_LEVELS as readonly string[]).includes(d.grade)
      ? d.grade
      : null
  const subjects = Array.isArray(d.subjects)
    ? d.subjects.filter(
        (s): s is string =>
          typeof s === 'string' && s.length > 0 && s.length < 64,
      )
    : []
  const dailyGoalMinutes = isDailyGoalMinutes(d.dailyGoalMinutes)
    ? d.dailyGoalMinutes
    : 10
  const placement = readPlacement(d.placement)
  const friendsInvited = d.friendsInvited === true
  const notificationsEnabled = d.notificationsEnabled === true
  const schoolName =
    typeof d.schoolName === 'string' && d.schoolName.trim().length > 0
      ? d.schoolName.trim().slice(0, 120)
      : null
  const schoolCity =
    typeof d.schoolCity === 'string' && d.schoolCity.trim().length > 0
      ? d.schoolCity.trim().slice(0, 80)
      : null

  return {
    profileType,
    source,
    goal,
    grade,
    subjects,
    dailyGoalMinutes,
    placement,
    friendsInvited,
    notificationsEnabled,
    schoolName,
    schoolCity,
  }
}

function readPlacement(value: unknown): PlacementResult {
  if (typeof value !== 'object' || value === null) return null
  const p = value as Record<string, unknown>
  if (typeof p.correct !== 'number' || typeof p.total !== 'number') return null
  return makePlacement(p.correct, p.total)
}
