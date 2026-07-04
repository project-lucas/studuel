import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import LessonCompleteButton from '@/components/LessonCompleteButton'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import { subjectTheme, GRID_PATTERN, MASCOT } from '@/lib/subject-style'
import type { Subject, Chapter, Lesson } from '@/lib/types'

export const dynamic = 'force-dynamic'

// Rendu minimaliste du contenu markdown des leçons (titres + paragraphes).
function LessonContent({ content }: { content: string }) {
  return (
    <div className="space-y-4">
      {content.split('\n').map((line, i) => {
        const trimmed = line.trim()
        if (!trimmed) return null
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={i} className="font-heading text-2xl font-bold">
              {trimmed.slice(2)}
            </h2>
          )
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={i} className="font-heading text-xl font-semibold">
              {trimmed.slice(3)}
            </h3>
          )
        }
        return (
          <p key={i} className="leading-relaxed text-foreground/85">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string; lesson: string }>
}) {
  const { subject: slug, chapter: chapterId, lesson: lessonId } = await params
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

  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, chapter_id, title, thumbnail_url, content, position')
    .eq('id', lessonId)
    .eq('chapter_id', chapter.id)
    .maybeSingle<Lesson>()
  if (!lesson) notFound()

  const [{ data: quiz }, { data: completion }] = await Promise.all([
    supabase
      .from('quizzes')
      .select('id')
      .eq('lesson_id', lesson.id)
      .maybeSingle<{ id: string }>(),
    supabase
      .from('lesson_completions')
      .select('id')
      .eq('lesson_id', lesson.id)
      .maybeSingle<{ id: string }>(),
  ])

  const theme = subjectTheme(subject.color)

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
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
            href={`/reviser/${subject.slug}/${chapter.id}`}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold opacity-80 transition-opacity hover:opacity-100"
          >
            <ArrowLeft className="size-4" /> {chapter.title}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-4xl leading-none">{MASCOT}</span>
            <h1 className="font-heading text-2xl font-bold text-balance md:text-3xl">
              {lesson.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8">
        <LessonContent content={lesson.content ?? 'Contenu à venir.'} />

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
  )
}
