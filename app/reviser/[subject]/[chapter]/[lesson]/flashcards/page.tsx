import Link from 'next/link'
import LessonFlashcards from '@/components/LessonFlashcards'
import LessonSupportLock from '@/components/LessonSupportLock'
import EnTetePage from '@/components/reviser/EnTetePage'
import { flashcardsFromQuestions } from '@/lib/flashcards'
import { quizSourceLabel } from '@/lib/lesson-quiz'
import { canAccessPremiumTests, getUserTierFor } from '@/lib/subscription'
import type { QuizQuestion } from '@/lib/types'
import { loadLessonContext, loadLessonQuiz } from '../data'

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
  const { supabase, user, subject, chapter, lesson } = await loadLessonContext(
    slug,
    chapterId,
    lessonId,
  )

  const backHref = `/reviser/${subject.slug}/${chapter.id}/${lesson.id}/cours`

  // Les cartes se dérivent d'un quiz. Celui de la leçon d'abord ; à défaut,
  // celui d'une leçon voisine DU MÊME CHAPITRE (cf. lib/lesson-quiz) — sinon
  // une leçon sur deux n'aurait aucune carte. On lit `is_free` pour gater le
  // premium comme /test et la carte mentale (sinon la RLS renvoie 0 question
  // et on afficherait un trompeur « bientôt » au lieu du paywall).
  const [quiz, tier] = await Promise.all([
    loadLessonQuiz(supabase, chapter.id, lesson.id),
    // Le user vient de loadLessonContext : pas de second aller-retour Auth.
    getUserTierFor(supabase, user.id),
  ])

  const locked = Boolean(quiz && !quiz.isFree && !canAccessPremiumTests(tier))
  const emprunt = quiz ? quizSourceLabel(quiz.source, chapter.title) : null

  let cards: ReturnType<typeof flashcardsFromQuestions> = []
  if (quiz && !locked) {
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select(
        'id, quiz_id, question, kind, options, correct_index, explanation, position',
      )
      .eq('quiz_id', quiz.quizId)
      .order('position', { ascending: true })
      .returns<QuizQuestion[]>()
    cards = flashcardsFromQuestions(questions ?? [])
  }

  return (
    <div className="mx-auto w-full max-w-2xl pb-16">
      {/* L'en-tête commun de Réviser (audit du 23/09/2026) : le titre à gauche,
          la matière, le chapitre et la leçon dessous. */}
      <EnTetePage
        retour={{ fallback: backHref }}
        titre="Flashcards"
        sousTitre={
          <>
            {subject.name} · {chapter.title}
            {lesson.title.trim() !== chapter.title.trim() ? ` · ${lesson.title}` : ''}
            {emprunt ? (
              // Honnêteté : ces cartes viennent du quiz d'une leçon voisine.
              // On le dit plutôt que de les faire passer pour celles de cette
              // leçon.
              <span className="block text-xs text-muted-foreground/80">{emprunt}</span>
            ) : null}
          </>
        }
      />

      <div className="mt-8">
        {locked ? (
          <LessonSupportLock support="Les flashcards" backHref={backHref} />
        ) : cards.length > 0 ? (
          <LessonFlashcards
            cards={cards}
            backHref={backHref}
            // La matière étiquette les items de la file « À revoir ».
            subject={subject.name}
            title={`${cards.length} carte${cards.length > 1 ? 's' : ''} · ${lesson.title}`}
          />
        ) : (
          <div className="mx-auto max-w-md rounded-3xl border border-dashed p-8 text-center">
            <p className="font-heading font-semibold">
              Aucune carte pour ce chapitre.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              Les cartes se construisent à partir des questions du chapitre — et
              aucun quiz n&apos;y est encore rattaché. Reviens par le cours&nbsp;:
              il est complet, lui.
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
    </div>
  )
}
