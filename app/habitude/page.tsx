import Link from 'next/link'
import { CircleUser, Flame } from 'lucide-react'
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
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import type { TestSession } from '@/lib/types'

export const metadata = { title: 'Habitude — Scolaria' }
export const dynamic = 'force-dynamic'

const WEEKS = 26
const DAYS_SHOWN = WEEKS * 7

// Jours « surlignés » : plus tu travailles, plus le trait de surligneur est net.
const levelClasses = [
  'bg-muted',
  'bg-highlight/30',
  'bg-highlight/55',
  'bg-highlight/80',
  'bg-highlight',
]

// Nombre de sessions/jour → intensité (0 à 4).
const toLevel = (count: number) => Math.min(count, 4)

const dayKey = (d: Date) => d.toISOString().slice(0, 10)

// Historique façon "contribution graph" GitHub : 26 semaines jusqu'à aujourd'hui.
function HabitHeatmap({ countsByDay }: { countsByDay: Map<string, number> }) {
  const start = new Date()
  start.setUTCHours(0, 0, 0, 0)
  start.setUTCDate(start.getUTCDate() - (DAYS_SHOWN - 1))

  const weeks = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const date = new Date(start)
      date.setUTCDate(start.getUTCDate() + w * 7 + d)
      return { key: dayKey(date), count: countsByDay.get(dayKey(date)) ?? 0 }
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
          description="Suis tes sessions de test au quotidien et construis ta régularité."
        />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser className="size-4" /> Connecte-toi pour suivre tes habitudes
            </CardTitle>
            <CardDescription>
              Chaque quiz terminé remplit ta grille d&apos;activité, jour après jour.
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

  const { data: sessions, error } = await supabase
    .from('test_sessions')
    .select('id, quiz_id, score, total, created_at, quizzes(title)')
    .gte('created_at', since.toISOString())
    .order('created_at', { ascending: false })
    .returns<TestSession[]>()

  const countsByDay = new Map<string, number>()
  for (const s of sessions ?? []) {
    const key = s.created_at.slice(0, 10)
    countsByDay.set(key, (countsByDay.get(key) ?? 0) + 1)
  }

  const recent = (sessions ?? []).slice(0, 5)

  return (
    <div>
      <PageHeader
        title="Habitude"
        description="Suis tes sessions de test au quotidien et construis ta régularité."
      />

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="size-4 text-primary" />
              Historique des sessions
            </CardTitle>
            <CardDescription>
              {error
                ? `Impossible de charger l'historique (${error.message}) — la table test_sessions existe-t-elle ? Voir supabase/003_test_sessions.sql.`
                : `${sessions?.length ?? 0} session${(sessions?.length ?? 0) > 1 ? 's' : ''} sur les 6 derniers mois.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HabitHeatmap countsByDay={countsByDay} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières sessions</CardTitle>
            <CardDescription>Tes 5 derniers quiz terminés.</CardDescription>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune session pour l&apos;instant —{' '}
                <Link href="/test" className="underline underline-offset-4">
                  lance ton premier quiz
                </Link>{' '}
                !
              </p>
            ) : (
              <ul className="divide-y">
                {recent.map((s) => (
                  <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="truncate">{s.quizzes?.title ?? 'Quiz supprimé'}</span>
                    <span className="ml-4 shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {s.score}/{s.total} ·{' '}
                      {new Date(s.created_at).toLocaleDateString('fr-FR', {
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

        <Card>
          <CardHeader>
            <CardTitle>Mes habitudes</CardTitle>
            <CardDescription>
              Personnalise ton expérience en ajoutant tes propres habitudes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted-foreground">
              À venir : création d&apos;habitudes personnalisées et suivi de séries.
            </p>
            <Button disabled>+ Ajouter une habitude</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
