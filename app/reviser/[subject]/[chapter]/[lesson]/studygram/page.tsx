import { notFound } from 'next/navigation'
import BackButton from '@/components/BackButton'
import MarkLessonActivity from '@/components/MarkLessonActivity'
import { cn } from '@/lib/utils'
import { subjectTheme, GRID_PATTERN } from '@/lib/subject-style'
import { loadLessonContext } from '../data'

export const dynamic = 'force-dynamic'

// Support « Studygram » : le visuel mémorisable de la leçon (une image type
// fiche décorée). Sa consultation compte dans l'anneau d'avancement.
export default async function StudygramPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string; lesson: string }>
}) {
  const { subject: slug, chapter: chapterId, lesson: lessonId } = await params
  const { subject, chapter, lesson } = await loadLessonContext(
    slug,
    chapterId,
    lessonId,
  )
  if (!lesson.studygram_url) notFound()

  const theme = subjectTheme(subject.color)

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      <MarkLessonActivity lessonId={lesson.id} activity="studygram" />
      <header
        className={cn('relative overflow-hidden px-4 pt-20 pb-10 md:px-8 md:pt-12', theme.header)}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={GRID_PATTERN}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-2xl">
          <BackButton
            fallback={`/reviser/${subject.slug}/${chapter.id}/${lesson.id}`}
          />
          <p className="mt-4 text-center text-sm font-semibold opacity-70">
            Studygram
          </p>
          <h1 className="font-heading mt-1 text-center text-2xl font-bold text-balance md:text-3xl">
            {lesson.title}
          </h1>
        </div>
      </header>

      <div className="relative -mt-6 rounded-t-3xl bg-background">
        <div className="mx-auto w-full max-w-2xl px-4 pt-6 pb-24 md:px-8">
          {/* Image libre (URL en base) : next/image exigerait de connaître le
              domaine à l'avance — on reste sur <img> volontairement. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lesson.studygram_url}
            alt={`Studygram — ${lesson.title}`}
            className="w-full rounded-3xl border shadow-sm"
          />
        </div>
      </div>
    </div>
  )
}
