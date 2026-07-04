import Link from 'next/link'
import { CircleUser, Flame, FlaskConical, Layers } from 'lucide-react'
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
import WeekRing from '@/components/WeekRing'
import { createClient } from '@/lib/supabase/server'
import { computeStreak, weekProgress, toDayKey } from '@/lib/streak'
import { cn } from '@/lib/utils'
import type { TestSession, StudySession } from '@/lib/types'

export const metadata = { title: 'Habitude — Scolaria' }
export const dynamic = 'force-dynamic'

const WEEKS = 26
const DAYS_SHOWN = WEEKS * 7

const levelClasses = [
  'bg-muted',
  'bg-highlight/30',
  'bg-highlight/55',
  'bg-highlight/80',
  'bg-highlight',
]

const toLevel = (count: number) => Math.min(count, 4)

// Historique façon "contribution graph" GitHub : 26 semaines jusqu'à aujourd'hui.
function HabitHeatmap({ countsByDay }: { countsByDay: Map<string, number> }) {
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  start.setUTCDate(start.getUTCDate() - (DAYS_SHOWN - 1))

  const weeks = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(start)
      date.setUTCDate(start.getUTCDate() + w * 7 + d)
      return { key: toDayKey(date), count: countsByDay.get(toDayKey(date)) ?? 0 }
    }),
  )

  return (
    <div className="overflow-x-auto">
      <div className="flex w-max gap-1">
        {weeks.map((days, w) => (
          <div key={w} className="flex flex-col gap-1">
            {days.map(({ key, count }) => (
              <div
                key={key}
                title={`${key} — ${count} session${count > 1 ? 's' : ''}`}
                className={cn('size-3 rounded-[2px]', levelClasses[toLevel(count)])}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

type Activity = {
  id: string
  kind: 'quiz' | 'flashcards'
  label: string
  detail: string
  created_at: string
}

export default async function HabitudePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Habitude"
          description="Ta série, ta semaine, ton historique — la régularité fait la différence."
        />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser className="size-4" /> Connecte-toi pour lancer ta série
            </CardTitle>
            <CardDescription>
              Chaque quiz ou session de flashcards remplit ta semaine et fait
              grandir ta série 🔥.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const since = new Date()
  since.setUTCDate(since.getUTCDate() - DAYS_SHOWN)

  const [{ data: tests }, { data: studies }, { data: profile }] =
    await Promise.all([
      supabase
        .from('test_sessions')
        .select('id, quiz_id, score, total, created_at, quizzes(title)')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false })
        .returns<TestSession[]>(),
      supabase
        .from('study_sessions')
        .select('id, deck_id, cards_count, created_at, flashcard_decks(title)')
        .gte('created_at', since.toISOString())
        .order('created_at', { ascending: false })
        .returns<StudySession[]>(),
      supabase
        .from('profiles')
        .select('daily_goal')
        .eq('id', user.id)
        .maybeSingle(),
    ])

  // Fusion quiz + flashcards : une seule notion d'« activité ».
  const activities: Activity[] = [
    ...(tests ?? []).map((s) => ({
      id: s.id,
      kind: 'quiz' as const,
      label: s.quizzes?.title ?? 'Quiz supprimé',
      detail: `${s.score}/${s.total}`,
      created_at: s.created_at,
    })),
    ...(studies ?? []).map((s) => ({
      id: s.id,
      kind: 'flashcards' as const,
      label: s.flashcard_decks?.title ?? 'Deck supprimé',
      detail: `${s.cards_count} cartes`,
      created_at: s.created_at,
    })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at))

  const countsByDay = new Map<string, number>()
  for (const a of activities) {
    const key = a.created_at.slice(0, 10)
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1)
  }

  const activeDays = new Set(countsByDay.keys())
  const streak = computeStreak(activeDays)
  const week = weekProgress(activeDays)
  const doneThisWeek = week.filter((d) => d.done).length
  const todayKey = toDayKey(new Date())
  const todayCount = countsByDay.get(todayKey) ?? 0
  const dailyGoal = profile?.daily_goal ?? 1
  const recent = activities.slice(0, 5)

  return (
    <div>
      <PageHeader
        title="Habitude"
        description="Ta série, ta semaine, ton historique — la régularité fait la différence."
      />

      <div className="grid gap-4">
        {/* Mode série : l'anneau de la semaine */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="size-4 text-highlight" />
              Ta semaine
            </CardTitle>
            <CardDescription>
              {todayCount >= dailyGoal
                ? `Objectif du jour atteint (${todayCount}/${dailyGoal}) — reviens demain pour prolonger la série !`
                : `Objectif du jour : ${todayCount}/${dailyGoal} session${dailyGoal > 1 ? 's' : ''} — ${doneThisWeek}/7 jours cette semaine.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeekRing week={week} streak={streak} />
            {todayCount < dailyGoal ? (
              <div className="mt-2 flex justify-center gap-2">
                <Button asChild size="sm">
                  <Link href="/studio">Session flashcards</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/reviser">Lancer un quiz</Link>
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Historique des sessions</CardTitle>
            <CardDescription>
              {activities.length} session{activities.length > 1 ? 's' : ''} sur
              les 6 derniers mois — quiz et flashcards confondus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HabitHeatmap countsByDay={countsByDay} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières sessions</CardTitle>
            <CardDescription>Tes 5 dernières activités.</CardDescription>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune session pour l&apos;instant —{' '}
                <Link href="/studio" className="underline underline-offset-4">
                  lance tes premières flashcards
                </Link>{' '}
                !
              </p>
            ) : (
              <ul className="divide-y">
                {recent.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-2 py-2 text-sm"
                  >
                    {a.kind === 'quiz' ? (
                      <FlaskConical className="size-3.5 shrink-0 text-muted-foreground" />
                    ) : (
                      <Layers className="size-3.5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 flex-1 truncate">{a.label}</span>
                    <span className="ml-2 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {a.detail} ·{' '}
                      {new Date(a.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
