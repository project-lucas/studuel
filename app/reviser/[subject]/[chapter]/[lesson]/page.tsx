import Link from 'next/link'
import {
  BookOpen,
  Check,
  Image as ImageIcon,
  ListChecks,
  Minus,
  NotebookPen,
  type LucideIcon,
} from 'lucide-react'
import BackButton from '@/components/BackButton'
import ProgressRing from '@/components/ProgressRing'
import { cn } from '@/lib/utils'
import { subjectTheme, GRID_PATTERN } from '@/lib/subject-style'
import {
  lessonProgress,
  lessonSupportCount,
  lessonSupportsDone,
} from '@/lib/lesson-progress'
import { loadLessonContext } from './data'

export const dynamic = 'force-dynamic'

// Hub de leçon (template « structure des cours ») : l'anneau d'avancement en
// haut, puis les 4 supports en tuiles — Cours, Révision, Studygram, Quiz.
export default async function LessonHubPage({
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

  // Un seul tour de requêtes : le nombre de questions est embarqué dans le
  // quiz, et les sessions sont filtrées par la jointure quiz → leçon.
  const [{ data: quiz }, { data: completion }, { data: activities }, { data: sessions }] =
    await Promise.all([
      supabase
        .from('quizzes')
        .select('id, quiz_questions(count)')
        .eq('lesson_id', lesson.id)
        .maybeSingle<{ id: string; quiz_questions: { count: number }[] }>(),
      supabase
        .from('lesson_completions')
        .select('id')
        .eq('user_id', user.id)
        .eq('lesson_id', lesson.id)
        .maybeSingle<{ id: string }>(),
      supabase
        .from('lesson_activities')
        .select('activity')
        .eq('user_id', user.id)
        .eq('lesson_id', lesson.id)
        .returns<{ activity: string }[]>(),
      supabase
        .from('test_sessions')
        .select('score, total, quizzes!inner(lesson_id)')
        .eq('user_id', user.id)
        .eq('quizzes.lesson_id', lesson.id)
        .returns<{ score: number; total: number }[]>(),
    ])

  // Quiz : nombre de questions + meilleur score de l'élève (« 7/10 » ou « --/10 »).
  const questionCount = quiz?.quiz_questions[0]?.count ?? 0
  let bestScore: number | null = null
  if (quiz) {
    for (const s of sessions ?? []) {
      if (s.total <= 0) continue
      const scaled = Math.round((s.score / s.total) * (questionCount || s.total))
      bestScore = Math.max(bestScore ?? 0, scaled)
    }
  }

  const seen = new Set((activities ?? []).map((a) => a.activity))
  const supports = {
    hasRevision: Boolean(lesson.revision_sheet),
    hasStudygram: Boolean(lesson.studygram_url),
    hasQuiz: Boolean(quiz),
  }
  const activity = {
    coursDone: Boolean(completion),
    revisionDone: seen.has('revision'),
    studygramDone: seen.has('studygram'),
    bestQuizRatio:
      bestScore !== null && questionCount > 0 ? bestScore / questionCount : null,
  }
  const progress = lessonProgress(supports, activity)
  const done = lessonSupportsDone(supports, activity)
  const total = lessonSupportCount(supports)

  const theme = subjectTheme(subject.color)
  const base = `/reviser/${subject.slug}/${chapter.id}/${lesson.id}`

  const tiles: {
    key: string
    label: string
    icon: LucideIcon
    href: string | null
    done: boolean
    detail?: string
  }[] = [
    {
      key: 'cours',
      label: 'Cours',
      icon: BookOpen,
      href: `${base}/cours`,
      done: activity.coursDone,
    },
    {
      key: 'revision',
      label: 'Révision',
      icon: NotebookPen,
      href: supports.hasRevision ? `${base}/revision` : null,
      done: activity.revisionDone,
    },
    {
      key: 'studygram',
      label: 'Studygram',
      icon: ImageIcon,
      href: supports.hasStudygram ? `${base}/studygram` : null,
      done: activity.studygramDone,
    },
    {
      key: 'quiz',
      label: 'Quiz',
      icon: ListChecks,
      href: quiz ? `/test/${quiz.id}` : null,
      done: activity.bestQuizRatio !== null,
      detail: quiz
        ? `${bestScore === null ? '--' : bestScore}/${questionCount || '--'}`
        : undefined,
    },
  ]

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      {/* Bandeau coloré : retour + place pour l'anneau qui chevauche */}
      <header
        className={cn('relative overflow-hidden px-4 pt-20 pb-14 md:px-8 md:pt-12', theme.header)}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={GRID_PATTERN}
          aria-hidden="true"
        />
        <div className="relative mx-auto w-full max-w-2xl">
          <BackButton
            fallback={`/reviser/${subject.slug}`}
            label={`Retour — ${subject.name}`}
          />
        </div>
      </header>

      {/* Panneau : l'anneau global de la leçon à cheval sur le bandeau */}
      <div className="relative -mt-6 rounded-t-3xl bg-background">
        <div className="mx-auto w-full max-w-2xl px-4 pb-24 md:px-8">
          <div className="-mt-9 flex justify-center">
            <span className="rounded-full bg-background p-1.5 shadow-sm">
              <ProgressRing
                value={progress}
                size={64}
                strokeWidth={5}
                label={`${lesson.title} — ${Math.round(progress * 100)} % d'avancement`}
                fillClassName={theme.stroke}
              >
                <span className="font-mono text-xs font-bold tabular-nums">
                  {done}/{total}
                </span>
              </ProgressRing>
            </span>
          </div>

          <p className="mt-3 text-center text-sm font-semibold text-muted-foreground">
            Chapitre {chapter.position} · {chapter.title}
          </p>
          <h1 className="font-heading mt-1 text-center text-2xl font-bold text-balance md:text-3xl">
            {lesson.title}
          </h1>

          {/* Les 4 supports du template */}
          <ul className="mt-6 grid grid-cols-2 gap-3">
            {tiles.map((tile) => {
              const Icon = tile.icon
              const inner = (
                <>
                  <span
                    className={cn(
                      'flex size-12 items-center justify-center rounded-xl',
                      theme.chip,
                    )}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <span className="font-heading font-bold">{tile.label}</span>
                  {tile.href === null ? (
                    <span className="text-xs font-semibold text-muted-foreground">
                      Bientôt
                    </span>
                  ) : tile.detail ? (
                    <span
                      className={cn(
                        'font-mono text-xs font-bold tabular-nums',
                        tile.done ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {tile.detail}
                    </span>
                  ) : tile.done ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 dark:text-green-400">
                      <Check className="size-3.5" strokeWidth={3} /> Fait
                    </span>
                  ) : (
                    <span className="text-muted-foreground" aria-hidden="true">
                      <Minus className="size-3.5" />
                    </span>
                  )}
                </>
              )
              return (
                <li key={tile.key}>
                  {tile.href ? (
                    <Link
                      href={tile.href}
                      className="flex min-h-32 flex-col items-center justify-center gap-1.5 rounded-2xl border bg-card p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div
                      aria-disabled="true"
                      className="flex min-h-32 flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed bg-card/60 p-4 text-center opacity-70"
                    >
                      {inner}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}
