import { notFound, redirect } from 'next/navigation'
import CourseScreen from '@/components/carnet/CourseScreen'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
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
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const { data: course } = await supabase
    .from('carnet_courses')
    .select(
      'id, title, description, icon, color, new_per_day, reviews_per_day, spell_tolerance, exam_on, subject_id',
    )
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

  // Les étiquettes de l'élève (migration 316) : proposées comme portée de
  // session. Lecture ISOLÉE — si la 316 n'est pas passée, la liste est vide et
  // la feuille se contente des chapitres.
  const { data: tagRows } = await supabase
    .from('carnet_tags')
    .select('id, label')
    .eq('owner_id', user.id)
    .order('label')
    .limit(50)
  const etiquettes = (tagRows ?? []).map((t) => ({
    id: String(t.id),
    label: String(t.label),
  }))

  // Les matières du catalogue : rattacher un cours à l'une d'elles est ce qui
  // le fait sortir de l'île du carnet.
  const { data: subjectRows } = await supabase
    .from('subjects')
    .select('id, name')
    .order('name')
    .limit(60)

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
      etiquettes={etiquettes}
      matieres={(subjectRows ?? []).map((m) => ({
        id: String(m.id),
        name: String(m.name),
      }))}
      reglages={{
        id: String(course.id),
        // Les colonnes des 315/316 peuvent manquer : on retombe sur les mêmes
        // défauts que le SQL plutôt que sur NaN.
        newPerDay: Number(course.new_per_day ?? 15),
        reviewsPerDay: Number(course.reviews_per_day ?? 80),
        tolerance: course.spell_tolerance ? String(course.spell_tolerance) : null,
        examOn: course.exam_on ? String(course.exam_on) : null,
        subjectId: course.subject_id ? String(course.subject_id) : null,
      }}
    />
  )
}
