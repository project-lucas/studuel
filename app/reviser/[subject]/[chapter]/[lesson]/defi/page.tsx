import Link from 'next/link'
import BackButton from '@/components/BackButton'
import DefiSoloPlayer from '@/components/DefiSoloPlayer'
import { permuteQuizOptions } from '@/lib/quiz-shuffle'
import type { QuizQuestion } from '@/lib/types'
import { loadLessonContext } from '../data'

export const dynamic = 'force-dynamic'

// Support « Défis » de la leçon : un défi solo par niveaux (Phase 1), joué sur
// les questions du quiz de la leçon. Fond crème, l'univers coloré est porté par
// le player. Pas d'enregistrement en base (partie d'entraînement).
export default async function LessonDefiPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string; lesson: string }>
}) {
  const { subject: slug, chapter: chapterId, lesson: lessonId } = await params
  const { supabase, subject, chapter, lesson } = await loadLessonContext(
    slug,
    chapterId,
    lessonId,
  )

  const backHref = `/reviser/${subject.slug}/${chapter.id}/${lesson.id}`

  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id')
    .eq('lesson_id', lesson.id)
    .maybeSingle<{ id: string }>()

  let questions: QuizQuestion[] = []
  if (quiz) {
    const { data } = await supabase
      .from('quiz_questions')
      .select(
        'id, quiz_id, question, kind, options, correct_index, explanation, position',
      )
      .eq('quiz_id', quiz.id)
      .order('position', { ascending: true })
      .returns<QuizQuestion[]>()

    // Mélange les options à la source (bonne réponse déplacée avec son index),
    // comme le quiz — « toujours cliquer la 1re » ne marche pas.
    questions = (data ?? []).map((q) => {
      const p = permuteQuizOptions(q.kind, q.options, q.correct_index, q.id)
      return { ...q, options: p.options, correct_index: p.correctIndex }
    })
  }

  if (questions.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <BackButton fallback={backHref} />
        <div className="mx-auto mt-8 max-w-md rounded-3xl border border-dashed p-8 text-center">
          <p className="font-heading font-semibold">
            Le défi de cette leçon arrive bientôt.
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Il se construira automatiquement dès que la leçon aura son quiz.
          </p>
          <Link
            href={backHref}
            className="text-primary mt-4 inline-block text-sm font-medium underline underline-offset-4"
          >
            Retour à la leçon
          </Link>
        </div>
      </div>
    )
  }

  return (
    <DefiSoloPlayer
      questions={questions}
      title={lesson.title}
      subject={subject.name}
      backHref={backHref}
    />
  )
}
