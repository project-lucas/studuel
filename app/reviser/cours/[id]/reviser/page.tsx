import { notFound, redirect } from 'next/navigation'
import ReviewSession, {
  type PlayableQuestion,
} from '@/components/carnet/ReviewSession'
import WorkTimer from '@/components/WorkTimer'
import { createClient } from '@/lib/supabase/server'
import {
  isQuestionType,
  normalizeQuestionContent,
  sessionQuestions,
  type CourseChapter,
  type CourseQuestion,
} from '@/lib/carnet-cours'

export const metadata = { title: 'Réviser — Studuel' }
export const dynamic = 'force-dynamic'

// Session de révision d'un cours du carnet : tout le cours, ou un chapitre et
// ses sous-chapitres (?chapitre=…). La file est calculée par la logique pure
// (ordre visuel de la liste, brouillons exclus).
export default async function CourseReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ chapitre?: string }>
}) {
  const [{ id }, { chapitre }] = await Promise.all([params, searchParams])
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: course } = await supabase
    .from('carnet_courses')
    .select('id, title')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle()
  if (!course) notFound()

  const [{ data: chapterRows }, { data: questionRows }] = await Promise.all([
    supabase
      .from('carnet_chapters')
      .select('id, parent_chapter_id, title, position')
      .eq('course_id', id),
    supabase
      .from('carnet_questions')
      .select('id, chapter_id, type, position, content')
      .eq('course_id', id),
  ])

  const chapters: CourseChapter[] = (chapterRows ?? []).map((r) => ({
    id: String(r.id),
    parentChapterId: r.parent_chapter_id ? String(r.parent_chapter_id) : null,
    title: String(r.title ?? 'Nouveau chapitre'),
    position: Number(r.position ?? 0),
  }))

  const allQuestions: CourseQuestion[] = (questionRows ?? []).flatMap((r) => {
    if (!isQuestionType(r.type)) return []
    return [
      {
        id: String(r.id),
        chapterId: r.chapter_id ? String(r.chapter_id) : null,
        type: r.type,
        position: Number(r.position ?? 0),
        content: normalizeQuestionContent(r.type, r.content),
      },
    ]
  })

  const chapterId =
    typeof chapitre === 'string' && chapitre.length > 0 ? chapitre : null
  const queue: PlayableQuestion[] = sessionQuestions(
    chapters,
    allQuestions,
    chapterId,
  ).map((q) => ({ id: q.id, type: q.type, content: q.content }))

  const scopeLabel =
    chapterId === null
      ? 'Tout le cours'
      : (chapters.find((c) => c.id === chapterId)?.title ?? 'Chapitre')

  return (
    <>
      {/* Réviser son propre carnet est du travail : sans ce compteur, un élève
          qui s'appuie surtout sur ses notes n'existait pas dans le temps de
          travail affiché sur /moi ni chez ses parents. */}
      <WorkTimer />
      <ReviewSession
        courseId={id}
        chapterId={chapterId}
        courseTitle={String(course.title ?? 'Sans titre')}
        scopeLabel={scopeLabel}
        questions={queue}
      />
    </>
  )
}
