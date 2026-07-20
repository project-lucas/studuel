import Link from 'next/link'
import {
  BookOpen,
  Brain,
  Check,
  Image as ImageIcon,
  Layers,
  ListChecks,
  Minus,
  NotebookPen,
  Swords,
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
import { chapterHasMindMap } from '@/lib/mind-map-access'
import { loadLessonContext } from './data'

export const dynamic = 'force-dynamic'

// Hub de leçon (template « structure des cours ») : l'anneau d'avancement en
// haut, puis les supports en tuiles. Quatre supports « suivis » comptent dans
// l'anneau (Cours, Révision, Studygram, Quiz) ; trois ressources complètent la
// structure sans peser sur la progression (Carte mentale, Flashcards, Défis).
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
  const [
    { data: quiz },
    { data: completion },
    { data: activities },
    { data: sessions },
    hasMindMap,
  ] = await Promise.all([
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
      // Existence de la carte mentale du chapitre : lue à part, le contenu
      // (`mind_map`) étant révoqué pour tout le monde (migration 182).
      chapterHasMindMap(supabase, chapter.id),
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
    // Existence lue sur la colonne générée (migration 184), jamais sur le
    // texte : la fiche est payante et n'est plus transportée jusqu'ici.
    hasRevision: Boolean(lesson.has_revision_sheet),
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

  // Une tuile « suivie » affiche fait/à faire (et compte dans l'anneau) ; une
  // tuile non suivie affiche une légende neutre (ressource complémentaire).
  type Tile = {
    key: string
    label: string
    icon: LucideIcon
    href: string | null
    tracked: boolean
    done?: boolean
    detail?: string
    caption?: string
  }

  const tiles: Tile[] = [
    {
      key: 'cours',
      label: 'Cours',
      icon: BookOpen,
      href: `${base}/cours`,
      tracked: true,
      done: activity.coursDone,
    },
    {
      key: 'revision',
      label: 'Fiche de révision',
      icon: NotebookPen,
      href: supports.hasRevision ? `${base}/revision` : null,
      tracked: true,
      done: activity.revisionDone,
    },
    {
      key: 'studygram',
      label: 'Studygram',
      icon: ImageIcon,
      href: supports.hasStudygram ? `${base}/studygram` : null,
      tracked: true,
      done: activity.studygramDone,
    },
    {
      key: 'quiz',
      label: 'Quiz',
      icon: ListChecks,
      href: quiz ? `/test/${quiz.id}` : null,
      tracked: true,
      done: activity.bestQuizRatio !== null,
      detail: quiz
        ? `${bestScore === null ? '--' : bestScore}/${questionCount || '--'}`
        : undefined,
    },
    {
      key: 'carte',
      label: 'Carte mentale',
      icon: Brain,
      href: hasMindMap ? `/reviser/${subject.slug}/${chapter.id}/carte` : null,
      tracked: false,
      caption: 'Chapitre',
    },
    {
      key: 'flashcards',
      label: 'Flashcards',
      icon: Layers,
      href: quiz ? `${base}/flashcards` : null,
      tracked: false,
      caption: quiz ? 'Recto / verso' : undefined,
    },
    {
      key: 'defis',
      label: 'Défis',
      icon: Swords,
      href: quiz ? `${base}/defi` : '/defi',
      tracked: false,
      caption: quiz ? 'Par niveaux' : 'Arène',
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

          {/* Les supports de la leçon */}
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
                  ) : tile.tracked ? (
                    tile.done ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 dark:text-green-400">
                        <Check className="size-3.5" strokeWidth={3} /> Fait
                      </span>
                    ) : (
                      <span className="text-muted-foreground" aria-hidden="true">
                        <Minus className="size-3.5" />
                      </span>
                    )
                  ) : tile.caption ? (
                    <span className="text-xs font-semibold text-muted-foreground">
                      {tile.caption}
                    </span>
                  ) : null}
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
