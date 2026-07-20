import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminLessonEditor from '@/components/admin/AdminLessonEditor'
import { createClient } from '@/lib/supabase/server'
import { fetchRevisionSheet } from '@/lib/revision-access'
import type { QuizQuestion } from '@/lib/types'

export const dynamic = 'force-dynamic'

type LessonRow = {
  id: string
  title: string
  position: number
  content: string | null
  studygram_url: string | null
  chapters: {
    id: string
    title: string
    level: string
    subjects: { id: string; name: string; icon: string }
  }
}

// Éditeur d'une leçon : les 4 supports du template (Cours, Révision,
// Studygram, Quiz) modifiables au même endroit, avec aperçu du rendu élève.
export default async function AdminLessonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // `revision_sheet` n'est PLUS lisible en direct (migration 185 : contenu
  // payant, droit retiré même à `authenticated`). L'éditeur la relit par la
  // RPC `lesson_revision_sheet`, qui ouvre explicitement une porte à
  // l'administrateur — sinon le Studio ne pourrait plus rouvrir les fiches
  // qu'il vient lui-même d'écrire.
  const { data: lesson } = await supabase
    .from('lessons')
    .select(
      'id, title, position, content, studygram_url, chapters!inner(id, title, level, subjects!inner(id, name, icon))',
    )
    .eq('id', id)
    .maybeSingle<LessonRow>()
  if (!lesson) notFound()

  const revisionSheet = await fetchRevisionSheet(supabase, lesson.id)

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id, title, is_free')
    .eq('lesson_id', lesson.id)
    .maybeSingle<{ id: string; title: string; is_free: boolean }>()

  const { data: questions } = quiz
    ? await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quiz.id)
        .order('position', { ascending: true })
        .returns<QuizQuestion[]>()
    : { data: [] as QuizQuestion[] }

  const subject = lesson.chapters.subjects

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted-foreground">
        <Link href="/admin" className="hover:underline">
          Contenu
        </Link>{' '}
        ›{' '}
        <Link href={`/admin/matiere/${subject.id}`} className="hover:underline">
          {subject.icon} {subject.name}
        </Link>{' '}
        › {lesson.chapters.level} · {lesson.chapters.title}
      </nav>

      <AdminLessonEditor
        lesson={{
          id: lesson.id,
          title: lesson.title,
          content: lesson.content ?? '',
          revision_sheet: revisionSheet ?? '',
          studygram_url: lesson.studygram_url ?? '',
        }}
        quiz={quiz ?? null}
        questions={questions ?? []}
      />
    </div>
  )
}
