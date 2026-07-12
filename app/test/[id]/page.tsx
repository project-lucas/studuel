import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Lock, ArrowLeft } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import QuizPlayer from '@/components/QuizPlayer'
import { createClient } from '@/lib/supabase/server'
import { getUserTier, canAccessPremiumTests } from '@/lib/subscription'
import type { Quiz, QuizQuestion } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Leçon → chapitre → matière embarqués dans la même requête (zéro cascade) :
  // le bouton « quitter » ramène au hub de la leçon d'origine.
  type QuizRow = Quiz & {
    lesson:
      | {
          id: string
          chapter: { id: string; subject: { slug: string } | null } | null
        }
      | null
  }
  const { data: quiz } = await supabase
    .from('quizzes')
    .select(
      'id, title, subject, grade_level, chapter, is_free, lesson:lessons(id, chapter:chapters(id, subject:subjects(slug)))',
    )
    .eq('id', id)
    .single<QuizRow>()

  if (!quiz) notFound()

  const backHref = quiz.lesson?.chapter?.subject
    ? `/reviser/${quiz.lesson.chapter.subject.slug}/${quiz.lesson.chapter.id}/${quiz.lesson.id}`
    : '/reviser'

  // Gating abonnement : les quiz premium requièrent l'Offre 1 (tier1+).
  // La RLS sur quiz_questions applique la même règle côté base.
  const tier = await getUserTier()
  if (!quiz.is_free && !canAccessPremiumTests(tier)) {
    return (
      <div>
        <PageHeader title={quiz.title} description={quiz.subject} />
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="size-4" /> Test réservé à l’Offre 1
            </CardTitle>
            <CardDescription>
              Ce quiz fait partie du contenu premium de Scolaria.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Abonne-toi à l’Offre 1 pour débloquer tous les tests, ou entraîne-toi
            d’abord avec les quiz gratuits.
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/test">
                <ArrowLeft className="size-4" /> Retour aux révisions
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const { data: questions, error } = await supabase
    .from('quiz_questions')
    .select('id, quiz_id, question, kind, options, correct_index, explanation, position')
    .eq('quiz_id', quiz.id)
    .order('position', { ascending: true })
    .returns<QuizQuestion[]>()

  const meta = [quiz.subject, quiz.grade_level, quiz.chapter].filter(Boolean).join(' · ')

  // Le player occupe tout l'écran (template) : pas de PageHeader autour.
  if (!error && questions && questions.length > 0) {
    return (
      <QuizPlayer
        quizId={quiz.id}
        title={quiz.title}
        questions={questions}
        subject={quiz.subject}
        backHref={backHref}
      />
    )
  }

  return (
    <div>
      <PageHeader title={quiz.title} description={meta} />

      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Quiz indisponible</CardTitle>
          <CardDescription>
            {error
              ? `Erreur de chargement des questions (${error.message}).`
              : 'Aucune question n’est associée à ce quiz pour le moment.'}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/test">
              <ArrowLeft className="size-4" /> Retour aux révisions
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
