'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Dumbbell, Sparkles, BookOpen, FileText } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getCoachAdvice, type CoachState } from '@/app/planning/actions'
import type { PlanEntry } from '@/lib/coach'

const STATUS_LABELS: Record<string, string> = {
  a_faire: 'À faire',
  en_cours: 'En cours',
  a_revoir: 'À revoir',
}

const initialState: CoachState = { message: null, ai: false }

// La session du jour : les 3 révisions les plus urgentes du tableau,
// avec lien direct vers les quiz de la matière et conseil du coach.
export default function SessionCoach({ plan }: { plan: PlanEntry[] }) {
  const [state, adviceAction, pending] = useActionState(
    getCoachAdvice,
    initialState,
  )

  if (plan.length === 0) return null

  return (
    <Card className="border-primary/25 bg-primary/[0.03]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="size-4 text-primary" />
          Ta session du jour
        </CardTitle>
        <CardDescription>
          Les révisions les plus urgentes de ton tableau, dans l&apos;ordre.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <ol className="flex flex-col gap-1.5">
          {plan.map((entry, i) => {
            const Icon = entry.itemKind === 'texte' ? BookOpen : FileText
            return (
              <li
                key={`${entry.subjectName}-${entry.itemTitle}`}
                className="flex items-center gap-2 text-sm"
              >
                <span className="font-mono w-5 shrink-0 text-center font-semibold text-primary tabular-nums">
                  {i + 1}
                </span>
                <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">
                  <span className="font-medium">{entry.subjectName}</span>
                  {' — '}
                  {entry.itemTitle}
                </span>
                <span
                  className={cn(
                    'hidden shrink-0 text-xs sm:inline',
                    entry.daysLeft !== null && entry.daysLeft <= 14
                      ? 'font-medium text-destructive'
                      : 'text-muted-foreground',
                  )}
                >
                  {entry.daysLeft !== null
                    ? `J-${entry.daysLeft}`
                    : STATUS_LABELS[entry.status]}
                </span>
                <Button asChild size="xs" variant="secondary" className="shrink-0">
                  <Link href={`/test?matiere=${encodeURIComponent(entry.subjectName)}`}>
                    M&apos;entraîner
                  </Link>
                </Button>
              </li>
            )
          })}
        </ol>

        {state.message ? (
          <p
            className={cn(
              'mt-1 rounded-lg p-3 text-sm',
              state.ai
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {state.message}
          </p>
        ) : (
          <form action={adviceAction}>
            <Button type="submit" size="sm" variant="outline" disabled={pending}>
              <Sparkles className="size-4" />
              {pending ? 'Le coach réfléchit…' : 'Conseil du coach'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
