import { notFound, redirect } from 'next/navigation'
import CourseScreen from '@/components/carnet/CourseScreen'
import { createClient } from '@/lib/supabase/server'
import {
  computeCourseStats,
  isQuestionReady,
  isQuestionType,
  normalizeQuestionContent,
  questionSummary,
  type CourseChapter,
} from '@/lib/carnet-cours'
import type { CourseQuestionRow } from '@/components/carnet/types'

export const metadata = { title: 'Mon carnet — Studuel' }
export const dynamic = 'force-dynamic'

// Page d'un cours du carnet : header éditable, onglets Contenu / Résultats /
// Paramètres, arbre des chapitres & questions. Charge tout le cours (RLS
// owner-only) et calcule les statistiques côté serveur.
export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: course } = await supabase
    .from('carnet_courses')
    .select('id, title, description, icon, color')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (!course) notFound()

  const [{ data: chapterRows }, { data: questionRows }, { data: attemptRows }] =
    await Promise.all([
      supabase
        .from('carnet_chapters')
        .select('id, parent_chapter_id, title, position')
        .eq('course_id', id),
      supabase
        .from('carnet_questions')
        .select('id, chapter_id, type, position, content')
        .eq('course_id', id),
      // Les tentatives sont bornées AU COURS affiché. Sans la jointure, on
      // ramenait les 2 000 dernières tentatives TOUS COURS CONFONDUS puis on
      // filtrait en mémoire : passé ce seuil (≈ 200 sessions de 10 questions,
      // atteignable sur une année), les tentatives d'un cours peu récent
      // sortaient de la fenêtre et il rebasculait en « Jamais vues » / « 0 % »
      // sans le moindre signal. La borne reste, mais elle protège maintenant
      // sans mentir.
      supabase
        .from('carnet_review_attempts')
        .select('question_id, is_correct, answered_at, carnet_questions!inner(course_id)')
        .eq('user_id', user.id)
        .eq('carnet_questions.course_id', id)
        .order('answered_at', { ascending: false })
        .limit(2_000),
    ])

  const chapters: CourseChapter[] = (chapterRows ?? []).map((r) => ({
    id: String(r.id),
    parentChapterId: r.parent_chapter_id ? String(r.parent_chapter_id) : null,
    title: String(r.title ?? 'Nouveau chapitre'),
    position: Number(r.position ?? 0),
  }))

  // On ne transfère au client que le nécessaire à la liste : type, résumé,
  // complétude — jamais le contenu complet de chaque question.
  const questions: CourseQuestionRow[] = (questionRows ?? []).flatMap((r) => {
    if (!isQuestionType(r.type)) return []
    const content = normalizeQuestionContent(r.type, r.content)
    return [
      {
        id: String(r.id),
        chapterId: r.chapter_id ? String(r.chapter_id) : null,
        type: r.type,
        position: Number(r.position ?? 0),
        summary: questionSummary(r.type, content),
        ready: isQuestionReady(r.type, content),
      },
    ]
  })

  const questionIds = new Set(questions.map((q) => q.id))
  const stats = computeCourseStats(
    [...questionIds],
    (attemptRows ?? [])
      .filter((a) => questionIds.has(String(a.question_id)))
      .map((a) => ({
        questionId: String(a.question_id),
        isCorrect: a.is_correct === true,
        answeredAt: String(a.answered_at ?? ''),
      })),
  )

  return (
    <CourseScreen
      course={{
        id: String(course.id),
        title: String(course.title ?? 'Sans titre'),
        description: course.description ? String(course.description) : null,
        icon: course.icon ? String(course.icon) : null,
        color: course.color ? String(course.color) : null,
      }}
      chapters={chapters}
      questions={questions}
      stats={stats}
    />
  )
}
