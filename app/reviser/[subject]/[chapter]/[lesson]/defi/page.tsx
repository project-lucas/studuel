import Link from 'next/link'
import BackButton from '@/components/BackButton'
import DefiSoloPlayer from '@/components/DefiSoloPlayer'
import LessonSupportLock from '@/components/LessonSupportLock'
import { quizSourceLabel } from '@/lib/lesson-quiz'
import { permuteQuizOptions } from '@/lib/quiz-shuffle'
import { canAccessPremiumTests, getUserTierFor } from '@/lib/subscription'
import type { QuizQuestion } from '@/lib/types'
import { loadLessonContext, loadLessonQuiz } from '../data'

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
  const { supabase, user, subject, chapter, lesson } = await loadLessonContext(
    slug,
    chapterId,
    lessonId,
  )

  const backHref = `/reviser/${subject.slug}/${chapter.id}/${lesson.id}/cours`

  // Le quiz de la leçon d'abord ; à défaut celui d'une leçon voisine du même
  // chapitre (cf. lib/lesson-quiz) — sinon une leçon sur deux n'aurait aucun
  // défi. On lit `is_free` pour gater le premium (sinon la RLS renvoie
  // 0 question et on afficherait un trompeur « bientôt » au lieu du paywall).
  const [quiz, tier] = await Promise.all([
    loadLessonQuiz(supabase, chapter.id, lesson.id),
    // Le user vient de loadLessonContext : pas de second aller-retour Auth.
    getUserTierFor(supabase, user.id),
  ])

  if (quiz && !quiz.isFree && !canAccessPremiumTests(tier)) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <BackButton fallback={backHref} />
        <div className="mt-8">
          <LessonSupportLock support="Le défi" backHref={backHref} />
        </div>
      </div>
    )
  }

  let questions: QuizQuestion[] = []
  if (quiz) {
    const { data } = await supabase
      .from('quiz_questions')
      .select(
        'id, quiz_id, question, kind, options, correct_index, explanation, position',
      )
      .eq('quiz_id', quiz.quizId)
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
            Aucun défi pour ce chapitre.
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            Le défi se joue sur les questions du chapitre — et aucun quiz n&apos;y
            est encore rattaché. Le cours, lui, est complet.
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
      // Honnêteté : quand les questions viennent d'une leçon voisine, on le dit
      // dans le titre plutôt que de les faire passer pour celles de la leçon.
      title={
        quiz && quizSourceLabel(quiz.source, chapter.title)
          ? `${lesson.title} · questions du chapitre`
          : lesson.title
      }
      subject={subject.name}
      backHref={backHref}
      lessonId={lesson.id}
    />
  )
}
