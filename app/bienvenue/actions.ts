'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { GRADE_LEVELS } from '@/lib/types'
import { schoolLevelForGrade } from '@/lib/clan'
import {
  ensurePlacement,
  PLACEMENT_SIZE,
  type PlacementQuestion,
} from '@/lib/placement'
import {
  GOALS,
  SOURCES,
  isDailyGoalMinutes,
  minutesToSessions,
  type OnboardingAnswers,
} from '@/lib/welcome'

// URL publique de l'app (dev et prod), pour le redirectTo OAuth.
async function siteOrigin(): Promise<string> {
  const h = await headers()
  const explicit = h.get('origin')
  if (explicit) return explicit
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  return `${proto}://${host}`
}

// -----------------------------------------------------------------------------
// Mini-quiz de placement (écran 10) — puise dans les quiz GRATUITS de la classe
// (lisibles par un visiteur grâce à la RLS), complété par la banque de repli
// pour toujours proposer 5 questions.
// -----------------------------------------------------------------------------
export async function fetchPlacementQuestions(
  grade: string | null,
): Promise<PlacementQuestion[]> {
  const safeGrade =
    grade && (GRADE_LEVELS as readonly string[]).includes(grade) ? grade : null

  let fromDb: PlacementQuestion[] = []
  if (safeGrade) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('quizzes')
      .select(
        'subject, is_free, grade_level, quiz_questions(question, options, correct_index, position)',
      )
      .eq('is_free', true)
      .eq('grade_level', safeGrade)
      .limit(8)

    fromDb = (data ?? [])
      .flatMap((quiz) =>
        (quiz.quiz_questions ?? []).map((q, i) => ({
          id: `db-${quiz.subject}-${q.position ?? i}`,
          subject: quiz.subject as string,
          question: q.question as string,
          options: Array.isArray(q.options) ? (q.options as string[]) : [],
          correctIndex: Number(q.correct_index ?? 0),
        })),
      )
      .filter((q) => q.options.length >= 2)
      .slice(0, PLACEMENT_SIZE)
  }

  return ensurePlacement(fromDb, safeGrade)
}

// -----------------------------------------------------------------------------
// Inscription par e-mail (écran 13). Contrairement à login/actions signUp, on ne
// redirige PAS : on renvoie un statut pour que le parcours enchaîne sur l'écran
// « plan » (14) quand une session est ouverte. Les réponses voyagent dans le
// metadata → le trigger handle_new_user (migration 048) les écrit au profil.
// -----------------------------------------------------------------------------
type SignUpWelcomeResult =
  | { status: 'session' }
  | { status: 'confirm'; message: string }
  | { status: 'error'; error: string }

function toFrench(message: string): string {
  const map: Record<string, string> = {
    'User already registered': 'Un compte existe déjà avec cet email.',
    'Password should be at least 6 characters.':
      'Le mot de passe doit contenir au moins 6 caractères.',
  }
  return map[message] ?? message
}

export async function signUpWelcome(input: {
  fullName: string
  email: string
  password: string
  answers: OnboardingAnswers
}): Promise<SignUpWelcomeResult> {
  const email = input.email.trim()
  const password = input.password
  if (!email || !password) {
    return { status: 'error', error: 'Email et mot de passe requis.' }
  }

  const a = input.answers
  const grade =
    a.grade && (GRADE_LEVELS as readonly string[]).includes(a.grade)
      ? a.grade
      : null
  const minutes = isDailyGoalMinutes(a.dailyGoalMinutes) ? a.dailyGoalMinutes : 10
  const source = SOURCES.some((s) => s.value === a.source) ? a.source : null
  const goal = GOALS.some((g) => g.value === a.goal) ? a.goal : null
  const subjects = Array.isArray(a.subjects)
    ? a.subjects.filter((s) => typeof s === 'string' && s.length > 0 && s.length < 64)
    : []

  const meta: Record<string, unknown> = {
    full_name: input.fullName.trim(),
    grade_level: grade,
    daily_goal: minutesToSessions(minutes),
    daily_goal_minutes: minutes,
    selected_subjects: subjects,
    profile_type: a.profileType ?? 'eleve',
    acquisition_source: source,
    main_goal: goal,
    placement_level: a.placement?.level ?? null,
    notify_opt_in: a.notificationsEnabled === true,
    onboarded: true,
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: meta },
  })
  if (error) return { status: 'error', error: toFrench(error.message) }

  if (!data.session) {
    return {
      status: 'confirm',
      message:
        'Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.',
    }
  }

  // Compte créé avec session : on rattache l'école-clan tout de suite (le cycle
  // découle de la classe). Best-effort — sans incidence si 159 n'est pas passée.
  const schoolName = typeof a.schoolName === 'string' ? a.schoolName.trim() : ''
  if (grade && schoolName.length > 0) {
    const level = schoolLevelForGrade(grade)
    const city =
      typeof a.schoolCity === 'string' && a.schoolCity.trim().length > 0
        ? a.schoolCity.trim()
        : null
    const { data: schoolId } = await supabase.rpc('find_or_create_school', {
      p_name: schoolName,
      p_city: city,
      p_level: level,
    })
    if (schoolId) {
      await supabase.rpc('set_my_school', {
        p_school_id: String(schoolId),
        p_level: level,
      })
    }
  }

  revalidatePath('/', 'layout')
  return { status: 'session' }
}

// -----------------------------------------------------------------------------
// OAuth (écran 13) — démarre la connexion Apple / Google. Au retour, le callback
// ramène sur /bienvenue?finish=1 : le parcours applique alors les réponses du
// brouillon local au profil (applyOnboarding).
// NOTE CONFIG : les fournisseurs Apple & Google doivent être activés dans
// Supabase (Dashboard → Authentication → Providers) avec leurs identifiants
// OAuth respectifs — sinon Supabase renvoie une erreur « provider is not enabled ».
// -----------------------------------------------------------------------------
export async function startOAuth(provider: 'google' | 'apple'): Promise<void> {
  const supabase = await createClient()
  const origin = await siteOrigin()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent('/bienvenue?finish=1')}`,
    },
  })
  if (error || !data.url) {
    redirect('/bienvenue?erreur=oauth')
  }
  redirect(data.url)
}

// -----------------------------------------------------------------------------
// Application des réponses au profil pour les inscriptions OAuth (qui ne passent
// pas par le metadata de signUp / le trigger). Appelée post-connexion depuis
// l'écran « plan » quand une session existe. Écrit uniquement les colonnes
// autorisées (GRANT UPDATE, migration 048).
// -----------------------------------------------------------------------------
export async function applyOnboarding(
  answers: OnboardingAnswers,
): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  const grade =
    answers.grade && (GRADE_LEVELS as readonly string[]).includes(answers.grade)
      ? answers.grade
      : null
  const minutes = isDailyGoalMinutes(answers.dailyGoalMinutes)
    ? answers.dailyGoalMinutes
    : 10
  const source = SOURCES.some((s) => s.value === answers.source)
    ? answers.source
    : null
  const goal = GOALS.some((g) => g.value === answers.goal) ? answers.goal : null
  const subjects = Array.isArray(answers.subjects)
    ? answers.subjects.filter(
        (s) => typeof s === 'string' && s.length > 0 && s.length < 64,
      )
    : []
  const placementLevel = answers.placement?.level ?? null

  // Garde anti-perte de données : les boutons OAuth de /bienvenue servent aussi
  // de CONNEXION à un compte existant. Au retour ?finish=1, on applique le
  // brouillon localStorage — vide sur un navigateur neuf. Un brouillon sans
  // classe ET non-parent = personne n'a rempli l'onboarding ici : on ne réécrit
  // rien, sinon une reconnexion Google effacerait le niveau/les matières d'un
  // compte déjà onboardé. (Élève → classe requise ; parent → profileType suffit.)
  const isParentOnboarding = answers.profileType === 'parent'
  if (!grade && !isParentOnboarding) return { ok: false }

  const { error } = await supabase
    .from('profiles')
    .update({
      grade_level: grade,
      daily_goal: minutesToSessions(minutes),
      daily_goal_minutes: minutes,
      selected_subjects: subjects,
      profile_type: answers.profileType ?? 'eleve',
      acquisition_source: source,
      main_goal: goal,
      placement_level: placementLevel,
      notify_opt_in: answers.notificationsEnabled === true,
      onboarded: true,
    })
    .eq('id', user.id)

  if (error) return { ok: false }

  // École = clan : si l'élève a renseigné son établissement, on le crée/retrouve
  // et on l'y rattache (le cycle découle de sa classe). Best-effort : un échec
  // (migration 159 absente) ne compromet pas l'onboarding.
  const schoolName =
    typeof answers.schoolName === 'string' ? answers.schoolName.trim() : ''
  if (grade && schoolName.length > 0) {
    const level = schoolLevelForGrade(grade)
    const city =
      typeof answers.schoolCity === 'string' && answers.schoolCity.trim().length > 0
        ? answers.schoolCity.trim()
        : null
    const { data: schoolId } = await supabase.rpc('find_or_create_school', {
      p_name: schoolName,
      p_city: city,
      p_level: level,
    })
    if (schoolId) {
      await supabase.rpc('set_my_school', {
        p_school_id: String(schoolId),
        p_level: level,
      })
    }
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}

