import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { BookOpen, Lock, Play, Waypoints } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BackButton from '@/components/BackButton'
import { createClient } from '@/lib/supabase/server'
import { getUserTier, canAccessMindMaps } from '@/lib/subscription'
import { cn } from '@/lib/utils'
import { subjectTheme, GRID_PATTERN, MASCOT } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import type { Subject, Chapter, Lesson } from '@/lib/types'

export const dynamic = 'force-dynamic'

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

  // Matière + leçons + quiz embarqués dans la requête du chapitre (zéro
  // cascade), slug vérifié via la jointure.
  type Row = Chapter & {
    subject: Subject
    lessons: (Lesson & { quizzes: { id: string }[] })[]
  }
  // select('*') sur le chapitre : tolère une base sans la migration 029
  // (colonne mind_map absente).
  const [{ data: row }, tier] = await Promise.all([
    supabase
      .from('chapters')
      .select('*, subject:subjects!inner(*), lessons(*, quizzes(id))')
      .eq('id', chapterId)
      .eq('subjects.slug', slug)
      .order('position', { ascending: true, referencedTable: 'lessons' })
      .maybeSingle<Row>(),
    getUserTier(),
  ])
  if (!row) notFound()

  const { subject, lessons, ...chapter } = row
  const quizByLesson = new Map(
    lessons.flatMap((l) => (l.quizzes[0] ? [[l.id, l.quizzes[0].id] as const] : [])),
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
          <BackButton
            fallback={`/reviser/${subject.slug}`}
            label={`Retour — ${subject.name}`}
            className="mb-4"
          />
          <h1 className="font-heading text-2xl font-bold text-balance md:text-3xl">
            {chapter.title}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium opacity-70">
            <SubjectIcon slug={subject.slug} className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            {subject.name} · {chapter.level}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-8">
        {/* Carte mentale du chapitre — visible par tous, ouvrable par les
            abonnés (Offre 1+) ; cadenas non cliquable pour les gratuits. */}
        {chapter.mind_map ? (
          canAccessMindMaps(tier) ? (
            <Link
              href={`/reviser/${subject.slug}/${chapter.id}/carte`}
              className="mb-6 flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-colors hover:bg-accent/40"
            >
              <span
                className={cn(
                  'flex size-12 shrink-0 items-center justify-center rounded-xl',
                  theme.chip,
                )}
              >
                <Waypoints className="size-6" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">Carte mentale</span>
                <span className="block text-sm text-muted-foreground">
                  Toutes les notions du chapitre en un coup d&apos;œil
                </span>
              </span>
            </Link>
          ) : (
            <div
              className="mb-6 flex items-center gap-4 rounded-2xl border bg-card p-4 opacity-80 shadow-sm"
              aria-label="Carte mentale réservée à l'Offre 1"
            >
              <span
                className={cn(
                  'flex size-12 shrink-0 items-center justify-center rounded-xl',
                  theme.chip,
                )}
              >
                <Waypoints className="size-6" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">Carte mentale</span>
                <span className="block text-sm text-muted-foreground">
                  Réservée à l&apos;Offre 1
                </span>
              </span>
              <Lock className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            </div>
          )
        ) : null}

        {/* Leçons */}
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
