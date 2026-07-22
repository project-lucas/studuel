import Link from 'next/link'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BackButton from '@/components/BackButton'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import LessonRichContent from '@/components/LessonRichContent'
import { cn } from '@/lib/utils'
import { subjectTheme, GRID_PATTERN } from '@/lib/subject-style'
import { loadLessonContext } from '../data'

export const dynamic = 'force-dynamic'

// Support « Cours » : la leçon rédigée, mise en page cahier (parties
// numérotées, puces ✱, idées clés fléchées). Terminer le cours pose le
// plancher de 30 % du chapitre et remplit l'anneau de la leçon.
export default async function CoursPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string; lesson: string }>
}) {
  const { subject: slug, chapter: chapterId, lesson: lessonId } = await params
  const { supabase, user, subject, lesson } = await loadLessonContext(
    slug,
    chapterId,
    lessonId,
  )

  const [{ data: quiz }, { data: completion }] = await Promise.all([
    supabase
      .from('quizzes')
      .select('id')
      .eq('lesson_id', lesson.id)
      .maybeSingle<{ id: string }>(),
    supabase
      .from('lesson_completions')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .maybeSingle<{ id: string }>(),
  ])

  const theme = subjectTheme(subject.color)

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      {/* Header quadrillé façon feuille de cahier, aux couleurs de la matière */}
      <header
        className={cn('relative overflow-hidden px-4 pt-20 pb-10 md:px-8 md:pt-12', theme.header)}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={GRID_PATTERN}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-2xl">
          <BackButton fallback={`/reviser/${subject.slug}`} />
          <h1 className="font-heading mt-4 text-center text-2xl font-bold text-balance md:text-3xl">
            {lesson.title}
          </h1>
        </div>
      </header>

      {/* La feuille de cours qui chevauche le header */}
      <div className="relative -mt-6 rounded-t-3xl bg-background">
        <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-24 md:px-8">
          <LessonRichContent content={lesson.content ?? 'Contenu à venir.'} />

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t pt-6">
            <LessonCompleteButton
              lessonId={lesson.id}
              initialDone={Boolean(completion)}
            />
            {quiz ? (
              <Button asChild className="rounded-full">
                <Link href={`/test/${quiz.id}`}>
                  <Play className="size-4" /> Tester mes connaissances
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
