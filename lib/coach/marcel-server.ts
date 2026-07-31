import type { SupabaseClient } from '@supabase/supabase-js'
import { getChapterMastery, chapterState } from '@/lib/mastery'
import {
  getSubjectsCached,
  getGradeChaptersCached,
  getGradeQuizzesCached,
  getQuizQuestionCountsCached,
} from '@/lib/catalog'
import { HORS_NIVEAU } from '@/lib/types'
import { readRowTolerant } from '@/lib/profile-read'
import { toDayKey, computeStreak, activityCutoff } from '@/lib/streak'
import { rowsToControles, type ControleRow, type SessionRow } from '@/lib/prep-plan'
import { pickMission, type ChapterCandidate } from '@/lib/mission'
import type { Subject } from '@/lib/types'
import type { Tier } from '@/lib/subscription'
import { pointDuJour, type PointDuJour } from './point-du-jour'
import { hasRegime, regimeOf, type Regime } from './regimes'
import { couvertureFor, type CouvertureMatiere } from './couverture'

// Résolution SERVEUR du point du jour de Marcel. La décision est PURE et testée
// (./point-du-jour, ./regimes) ; ce module ne fait que rassembler les données.
//
// Il reprend EXACTEMENT la source de Réviser : mêmes chapitres, même maîtrise,
// mêmes contrôles, même `pickMission`. C'est la condition du partage décidé
// avec Lucas — deux résolutions concurrentes annonceraient deux missions
// différentes, et l'élève aurait deux patrons.

type ProfileRow = {
  grade_level: string | null
  selected_subjects: unknown
  daily_goal_minutes: number | null
  subscription_tier: string | null
  gems: number | null
}

/** Une matière suivie, prête pour le sélecteur de l'onglet Méthode. */
export type MatiereSuivie = {
  slug: string
  name: string
  color: string
  regime: Regime | null
}

export type MarcelSnapshot = {
  point: PointDuJour
  matieres: MatiereSuivie[]
  streak: number
  grade: string | null
  /** Aucune matière suivie n'a de chapitre : l'onglet Méthode n'a rien à dire. */
  catalogueVide: boolean
  /**
   * slug de matière → questions disponibles AU NIVEAU de l'élève. Sert à ne
   * proposer un contrôle que là où il y a de quoi le remplir (cf.
   * ./entrainement) — le catalogue est inégal, l'annoncer vaut mieux que de
   * servir un sujet creux.
   */
  disponiblesBySlug: Record<string, number>
  /**
   * Ce que Marcel sait VRAIMENT lire aujourd'hui : la couverture du programme.
   * Pas la typologie d'erreur — elle n'existe sur aucune question du catalogue,
   * et un écran qui prétendrait dire « pourquoi » tu te trompes mentirait.
   */
  couverture: CouvertureMatiere[]
  /** De quoi afficher la porte de « Demander à Marcel » sans aller-retour. */
  demande: {
    tier: Tier
    utilisesAujourdhui: number
    jetons: number
    gemmes: number
  }
}

const DEFAULT_GOAL = 15

/**
 * Rassemble tout ce dont l'onglet Marcel a besoin, en une passe.
 *
 * Les requêtes indépendantes partent ENSEMBLE : cet écran est le premier que
 * l'élève ouvre après la barre de nav, il n'a pas les moyens d'une cascade.
 */
export async function getMarcelSnapshot(
  supabase: SupabaseClient,
  userId: string,
): Promise<MarcelSnapshot> {
  const profile = await readRowTolerant<ProfileRow>(
    supabase,
    'profiles',
    'id',
    userId,
    [
      'grade_level',
      'selected_subjects',
      'daily_goal_minutes',
      'subscription_tier',
      'gems',
    ],
  )

  const grade = profile?.grade_level ?? null
  const goalMinutes = profile?.daily_goal_minutes ?? DEFAULT_GOAL

  const [
    allSubjects,
    levelChapters,
    gradeQuizzes,
    questionCounts,
    mastery,
    { data: testDays },
    { data: studyDays },
    { data: challengeDays },
    { data: controleRows },
    { data: sessionRows },
    { data: coachCalls },
    { data: coachTokens },
  ] = await Promise.all([
    getSubjectsCached(),
    grade ? getGradeChaptersCached(grade) : Promise.resolve([]),
    // Catalogue mis en cache serveur : identique pour tous les élèves de la
    // classe, donc jamais rechargé par utilisateur.
    grade
      ? getGradeQuizzesCached(grade, HORS_NIVEAU)
      : Promise.resolve([] as { id: string; subject: string; lesson_id: string | null }[]),
    getQuizQuestionCountsCached(),
    getChapterMastery(supabase, userId),
    supabase
      .from('test_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', activityCutoff()),
    supabase
      .from('study_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', activityCutoff()),
    supabase
      .from('challenge_sessions')
      .select('created_at')
      .eq('user_id', userId)
      .gte('created_at', activityCutoff()),
    supabase
      .from('controles')
      .select('*')
      .eq('user_id', userId)
      .returns<ControleRow[]>(),
    supabase
      .from('controle_sessions')
      .select('*')
      .eq('user_id', userId)
      .returns<SessionRow[]>(),
    // Compteur et solde du Prof (migration 215). Absents tant qu'elle n'est pas
    // exécutée : l'écran affiche alors le quota plein, et c'est la RPC — donc le
    // serveur — qui refusera. Aucune décision ne se prend ici.
    supabase
      .from('coach_calls')
      .select('attempts')
      .eq('user_id', userId)
      .eq('day_bucket', toDayKey(new Date()))
      .maybeSingle(),
    supabase
      .from('coach_tokens')
      .select('balance')
      .eq('user_id', userId)
      .maybeSingle(),
  ])

  // --- Matières suivies (choix d'onboarding, repli sur tout le catalogue) ------
  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : []
  const followed: Subject[] =
    selected.length > 0
      ? allSubjects.filter((s) => selected.includes(s.id) || selected.includes(s.slug))
      : allSubjects

  const followedIds = new Set(followed.map((s) => s.id))
  const subjectById = new Map(followed.map((s) => [s.id, s]))

  // --- Candidats à la mission : mêmes règles que Réviser, à la lettre ---------
  const candidates: ChapterCandidate[] = []
  for (const chapter of levelChapters) {
    if (!followedIds.has(chapter.subject_id)) continue
    const subject = subjectById.get(chapter.subject_id)
    if (!subject) continue
    const progress = mastery.get(chapter.id)
    candidates.push({
      subjectSlug: subject.slug,
      subjectName: subject.name,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      state: chapterState(progress),
      value: progress?.value ?? 0,
    })
  }

  // --- Série et historique ----------------------------------------------------
  const activityDays = new Set(
    [...(testDays ?? []), ...(studyDays ?? []), ...(challengeDays ?? [])].map(
      (row) => String(row.created_at).slice(0, 10),
    ),
  )
  const streak = computeStreak(activityDays)

  // « Jour 1 » ne se déduit pas de la série (elle tombe à zéro après une pause)
  // mais de l'absence TOTALE d'activité et de maîtrise : c'est la seule lecture
  // qui distingue un nouvel élève d'un élève qui revient.
  const hasHistory = activityDays.size > 0 || mastery.size > 0

  // --- Questions disponibles par matière, au niveau de l'élève ---------------
  // `quizzes.subject` porte le NOM d'affichage de la matière, pas son slug :
  // on repasse par le catalogue pour retomber sur des slugs, seule clé stable.
  const questionsByQuiz = new Map(questionCounts)
  const slugByName = new Map(allSubjects.map((s) => [s.name, s.slug]))
  const disponiblesBySlug: Record<string, number> = {}
  for (const quiz of gradeQuizzes) {
    const slug = slugByName.get(quiz.subject)
    if (!slug) continue
    disponiblesBySlug[slug] =
      (disponiblesBySlug[slug] ?? 0) + (questionsByQuiz.get(quiz.id) ?? 0)
  }

  const today = toDayKey(new Date())
  const controles = rowsToControles(controleRows ?? [], sessionRows ?? [])

  const plan = pickMission({
    today,
    controles,
    subjectNameBySlug: Object.fromEntries(allSubjects.map((s) => [s.slug, s.name])),
    chapters: candidates,
    goalMinutes,
  })

  // --- Matières du sélecteur : celles que Marcel sait coacher, en tête --------
  const avecChapitres = new Set(candidates.map((c) => c.subjectSlug))
  const matieres: MatiereSuivie[] = followed
    .filter((s) => avecChapitres.has(s.slug) || hasRegime(s.slug))
    .map((s) => ({
      slug: s.slug,
      name: s.name,
      color: s.color,
      regime: regimeOf(s.slug),
    }))
    // Les matières hors doctrine passent en queue : Marcel n'a rien à en dire,
    // elles ne doivent pas occuper la première case du sélecteur.
    .sort((a, b) => Number(b.regime !== null) - Number(a.regime !== null))

  return {
    point: pointDuJour({
      plan,
      // La file « À revoir » du carnet demande à elle seule une demi-douzaine de
      // requêtes ; elle n'entre pas dans la décision, seulement dans une
      // étiquette. Elle sera branchée quand l'écran « S'entraîner » la chargera
      // déjà — d'ici là Marcel n'affiche pas un chiffre qu'il n'a pas lu.
      srsDue: 0,
      streak,
      hasHistory,
      goalMinutes,
    }),
    matieres,
    streak,
    grade,
    catalogueVide: candidates.length === 0,
    disponiblesBySlug,
    // Mêmes candidats que la mission : une seule lecture du programme.
    couverture: couvertureFor(candidates),
    demande: {
      tier: (profile?.subscription_tier as Tier) ?? 'free',
      utilisesAujourdhui: Number(coachCalls?.attempts ?? 0),
      jetons: Number(coachTokens?.balance ?? 0),
      gemmes: Number(profile?.gems ?? 0),
    },
  }
}
