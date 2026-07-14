import Link from 'next/link'
import { Layers } from 'lucide-react'
import BackButton from '@/components/BackButton'
import LessonFlashcards from '@/components/LessonFlashcards'
import SubjectIcon from '@/components/SubjectIcon'
import { flashcardsFromQuestions } from '@/lib/flashcards'
import type { QuizQuestion } from '@/lib/types'
import { loadLessonContext } from '../data'

export const dynamic = 'force-dynamic'

// Support « Flashcards » : révision active en cartes recto/verso. Les cartes
// sont dérivées du quiz de la leçon (cf. lib/flashcards) — pas de contenu
// dédié, donc disponibles dès qu'un quiz existe. Fond crème, carte centrée
// (modèle fourni), le monde coloré est porté par la carte elle-même.
export default async function FlashcardsPage({
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

  // Le quiz de la leçon fournit la matière des cartes.
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('id')
    .eq('lesson_id', lesson.id)
    .maybeSingle<{ id: string }>()

  let cards: ReturnType<typeof flashcardsFromQuestions> = []
  if (quiz) {
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select(
        'id, quiz_id, question, kind, options, correct_index, explanation, position',
      )
      .eq('quiz_id', quiz.id)
      .order('position', { ascending: true })
      .returns<QuizQuestion[]>()
    cards = flashcardsFromQuestions(questions ?? [])
  }

  return (
    <div className="mx-auto w-full max-w-2xl pb-16">
      <BackButton fallback={backHref} />

      <div className="mt-4 mb-8 text-center">
        <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm font-medium">
          <SubjectIcon
            slug={subject.slug}
            className="size-4 shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
          {subject.name} · {chapter.title}
        </span>
        <h1 className="font-heading mt-1 flex items-center justify-center gap-2 text-2xl font-bold text-balance md:text-3xl">
          <Layers className="text-primary size-6" aria-hidden="true" />
          Flashcards
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">{lesson.title}</p>
      </div>

      {cards.length > 0 ? (
        <LessonFlashcards
          cards={cards}
          backHref={backHref}
          title={`${cards.length} carte${cards.length > 1 ? 's' : ''} · ${lesson.title}`}
        />
      ) : (
        <div className="mx-auto max-w-md rounded-3xl border border-dashed p-8 text-center">
          <p className="font-heading font-semibold">
            Les flashcards de cette leçon arrivent bientôt.
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Elles se construiront automatiquement dès que la leçon aura son quiz.
          </p>
          <Link
            href={backHref}
            className="text-primary mt-4 inline-block text-sm font-medium underline underline-offset-4"
          >
            Retour à la leçon
          </Link>
        </div>
      )}
    </div>
  )
}
