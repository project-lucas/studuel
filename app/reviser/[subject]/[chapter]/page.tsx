import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, BookOpen, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import { subjectTheme, GRID_PATTERN, MASCOT } from '@/lib/subject-style'
import type { Subject, Chapter, Lesson } from '@/lib/types'

export const dynamic = 'force-dynamic'

type LinkedQuiz = { id: string; lesson_id: string | null }

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>
}) {
  const { subject: slug, chapter: chapterId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: subject } = await supabase
    .from('subjects')
    .select('*')
    .eq('slug', slug)
    .maybeSingle<Subject>()
  if (!subject) notFound()

  const { data: chapter } = await supabase
    .from('chapters')
    .select('id, subject_id, level, title, position')
    .eq('id', chapterId)
    .eq('subject_id', subject.id)
    .maybeSingle<Chapter>()
  if (!chapter) notFound()

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, chapter_id, title, thumbnail_url, content, position')
    .eq('chapter_id', chapter.id)
    .order('position', { ascending: true })
    .returns<Lesson[]>()

  // Quiz rattachés aux leçons de ce chapitre (bouton play).
  const lessonIds = (lessons ?? []).map((l) => l.id)
  const { data: quizzes } = lessonIds.length
    ? await supabase
        .from('quizzes')
        .select('id, lesson_id')
        .in('lesson_id', lessonIds)
        .returns<LinkedQuiz[]>()
    : { data: [] as LinkedQuiz[] }

  const quizByLesson = new Map(
    (quizzes ?? []).map((q) => [q.lesson_id ?? '', q.id]),
  )

  const theme = subjectTheme(subject.color)

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      {/* Header coloré du chapitre */}
      <header
        className={cn('relative overflow-hidden px-4 pt-20 pb-6 md:px-8 md:pt-12', theme.header)}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={GRID_PATTERN}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-4xl">
          <Link
            href={`/reviser/${subject.slug}`}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold opacity-80 transition-opacity hover:opacity-100"
          >
            <ArrowLeft className="size-4" /> {subject.name}
          </Link>
          <h1 className="font-heading text-2xl font-bold text-balance md:text-3xl">
            {chapter.title}
          </h1>
          <p className="mt-1 text-sm font-medium opacity-70">
            {subject.icon} {subject.name} · {chapter.level}
          </p>
        </div>
      </header>

      {/* Leçons */}
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8">
        <h2 className="font-heading mb-4 text-lg font-semibold text-muted-foreground">
          Leçons
        </h2>

        {(lessons ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Les leçons de ce chapitre arrivent bientôt.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {(lessons ?? []).map((lesson) => {
              const quizId = quizByLesson.get(lesson.id)
              return (
                <li
                  key={lesson.id}
                  className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm"
                >
                  <span
                    className={cn(
                      'flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl',
                      theme.chip,
                    )}
                  >
                    {MASCOT}
                  </span>
                  <span className="min-w-0 flex-1 font-semibold">
                    {lesson.title}
                  </span>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button asChild size="sm" variant="secondary" className="rounded-full">
                      <Link
                        href={`/reviser/${subject.slug}/${chapter.id}/${lesson.id}`}
                      >
                        <BookOpen className="size-3.5" /> Leçon
                      </Link>
                    </Button>
                    {quizId ? (
                      <Button
                        asChild
                        size="icon-sm"
                        className="rounded-full"
                        aria-label="Lancer le quiz"
                      >
                        <Link href={`/test/${quizId}`}>
                          <Play className="size-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button
                        size="icon-sm"
                        variant="outline"
                        className="rounded-full"
                        disabled
                        aria-label="Quiz bientôt disponible"
                        title="Quiz bientôt disponible"
                      >
                        <Play className="size-4" />
                      </Button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
