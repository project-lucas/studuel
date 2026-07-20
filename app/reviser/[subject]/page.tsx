import { notFound, redirect } from 'next/navigation'
import SubjectProgramme, {
  type ProgrammeChapter,
} from '@/components/SubjectProgramme'
import SubjectMasteryCelebration from '@/components/SubjectMasteryCelebration'
import { createClient } from '@/lib/supabase/server'
import {
  getSubjectsCached,
  getProgrammeCached,
  type CatalogChapter,
} from '@/lib/catalog'
import { LESSON_FLOOR } from '@/lib/mastery'
import {
  lessonProgress,
  lessonSupportCount,
  lessonSupportsDone,
} from '@/lib/lesson-progress'
import { canAccessPremiumTests, type Tier } from '@/lib/subscription'
import { CHAPTER_COLUMNS, type Subject } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject: slug } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Profil (classe + offre, une seule requête) et catalogue des matières en
  // parallèle — le catalogue sort du cache serveur, pas de Supabase.
  const [{ data: profile }, cachedSubjects] = await Promise.all([
    supabase
      .from('profiles')
      .select('grade_level, subscription_tier')
      .eq('id', user.id)
      .maybeSingle<{ grade_level: string | null; subscription_tier: string | null }>(),
    getSubjectsCached(),
  ])

  let subject = cachedSubjects.find((s) => s.slug === slug) ?? null
  if (!subject) {
    // Repli authentifié : cache froid ou migration 026 pas encore exécutée.
    const { data } = await supabase
      .from('subjects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle<Subject>()
    subject = data
  }
  if (!subject) notFound()
  const grade = profile?.grade_level
  if (!grade) redirect('/onboarding')

  // Niveau de lecture des chapitres : la classe de l'élève, SAUF pour une
  // matière hors-niveau (ex. Culture générale) dont les thèmes vivent à un
  // niveau fixe (subject.fixed_level = « tous »), identique pour toutes les
  // classes.
  const level = subject.fixed_level ?? grade

  // Programme de la matière (chapitres → leçons → quiz), servi par le cache
  // serveur, avec le même repli authentifié.
  let catalog = await getProgrammeCached(subject.id, level)
  if (catalog.length === 0) {
    const { data } = await supabase
      .from('chapters')
      .select(`${CHAPTER_COLUMNS}, lessons(*, quizzes(id))`)
      .eq('subject_id', subject.id)
      .eq('level', level)
      .order('position', { ascending: true })
      .order('position', { ascending: true, referencedTable: 'lessons' })
      .returns<CatalogChapter[]>()
    catalog = data ?? []
  }

  const quizIds = catalog.flatMap((c) =>
    c.lessons.flatMap((l) => l.quizzes.map((q) => q.id)),
  )

  // Données personnelles (ce qui remplit les anneaux), en un seul tour.
  const [{ data: completions }, { data: activities }, { data: sessions }] =
    await Promise.all([
      supabase
        .from('lesson_completions')
        .select('lesson_id')
        .eq('user_id', user.id)
        .returns<{ lesson_id: string }[]>(),
      supabase
        .from('lesson_activities')
        .select('lesson_id, activity')
        .eq('user_id', user.id)
        .returns<{ lesson_id: string; activity: string }[]>(),
      quizIds.length
        ? supabase
            .from('test_sessions')
            .select('quiz_id, score, total')
            .eq('user_id', user.id)
            .in('quiz_id', quizIds)
            .returns<{ quiz_id: string | null; score: number; total: number }[]>()
        : Promise.resolve({
            data: [] as { quiz_id: string | null; score: number; total: number }[],
          }),
    ])

  // Meilleur ratio par quiz.
  const bestByQuiz = new Map<string, number>()
  for (const s of sessions ?? []) {
    if (!s.quiz_id || s.total <= 0) continue
    const ratio = Math.min(s.score / s.total, 1)
    bestByQuiz.set(s.quiz_id, Math.max(bestByQuiz.get(s.quiz_id) ?? 0, ratio))
  }
  const completed = new Set((completions ?? []).map((c) => c.lesson_id))
  const seen = new Set(
    (activities ?? []).map((a) => `${a.lesson_id}:${a.activity}`),
  )

  const programme: ProgrammeChapter[] = catalog.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    position: chapter.position,
    lessons: chapter.lessons.map((l) => {
      const quizId = l.quizzes[0]?.id
      const supports = {
        hasRevision: Boolean(l.revision_sheet),
        hasStudygram: Boolean(l.studygram_url),
        hasQuiz: Boolean(quizId),
      }
      const activity = {
        coursDone: completed.has(l.id),
        revisionDone: seen.has(`${l.id}:revision`),
        studygramDone: seen.has(`${l.id}:studygram`),
        bestQuizRatio: quizId ? (bestByQuiz.get(quizId) ?? null) : null,
      }
      return {
        id: l.id,
        chapterId: l.chapter_id,
        title: l.title,
        progress: lessonProgress(supports, activity),
        done: lessonSupportsDone(supports, activity),
        total: lessonSupportCount(supports),
      }
    }),
  }))

  // Avancement global de la matière — même règle que lib/mastery (meilleur
  // score de quiz par chapitre, plancher 30 % si une leçon est terminée),
  // calculé localement avec les données déjà chargées : zéro requête en plus.
  const chapterValues = catalog.map((chapter) => {
    let value = 0
    for (const l of chapter.lessons) {
      const quizId = l.quizzes[0]?.id
      if (quizId) value = Math.max(value, bestByQuiz.get(quizId) ?? 0)
      if (completed.has(l.id)) value = Math.max(value, LESSON_FLOOR)
    }
    return value
  })
  const pct =
    chapterValues.length > 0
      ? Math.round(
          (chapterValues.reduce((s, v) => s + v, 0) / chapterValues.length) * 100,
        )
      : 0

  const premium = canAccessPremiumTests(
    (profile?.subscription_tier as Tier) ?? 'free',
  )

  return (
    <>
      <SubjectMasteryCelebration
        entries={[{ slug: subject.slug, name: subject.name, pct }]}
      />
      <SubjectProgramme
        subject={subject}
        grade={grade}
        chapters={programme}
        globalPct={pct}
        premium={premium}
      />
    </>
  )
}
