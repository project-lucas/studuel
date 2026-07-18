import Link from 'next/link'
import { ArrowRight, Brain, Swords } from 'lucide-react'
import { Button } from '@/components/ui/button'

// L'appel du jour : la file de révision espacée (SRS) + la Revanche.
// Rendue côté serveur sur l'accueil Réviser ; absente si la file est vide —
// pas de culpabilisation, la carte n'existe que quand il y a un geste utile.
export default function ReviewQueueCard({
  total,
  revanche,
  subjects,
}: {
  total: number
  revanche: number
  subjects: [string, number][]
}) {
  if (total === 0) return null

  return (
    <section
      className="rev-card rounded-2xl border border-black/[0.06] border-b-[6px] border-b-primary/35 bg-card p-4"
      aria-label="À revoir aujourd'hui"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Brain className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-base font-bold">
              À revoir aujourd&apos;hui
            </h2>
            <p className="text-xs text-muted-foreground">
              {total} item{total > 1 ? 's' : ''} au bon moment pour ta mémoire
              {revanche > 0 ? (
                <>
                  {' '}
                  · dont{' '}
                  <span className="inline-flex items-center gap-0.5 font-semibold text-foreground">
                    <Swords className="size-3" aria-hidden="true" />
                    {revanche} à venger
                  </span>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      {subjects.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {subjects.slice(0, 4).map(([name, count]) => (
            <li
              key={name}
              className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"
            >
              {name} · {count}
            </li>
          ))}
        </ul>
      ) : null}

      <Button asChild className="mt-3 w-full rounded-full">
        <Link href="/reviser/revoir">
          {revanche > 0 ? 'Prendre ma revanche' : 'Lancer la révision'}
          <ArrowRight className="size-4" />
        </Link>
      </Button>
    </section>
  )
}
