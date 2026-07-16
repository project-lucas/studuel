import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { subjectIcon } from '@/lib/subject-style'
import {
  rankForValue,
  MASTERY_RANK_LABEL,
  MASTERY_RANK_EMOJI,
  LESSON_FLOOR,
} from '@/lib/mastery'

export interface MasteryEntry {
  slug: string
  name: string
  icon: string
  /** Maîtrise moyenne de la matière, 0 → 100. */
  pct: number
}

export interface FragileChapter {
  subjectSlug: string
  subjectIcon: string
  chapterId: string
  chapterTitle: string
  /** Maîtrise du chapitre, 0 → 100. */
  pct: number
}

/**
 * « Ma maîtrise » (espace Mon carnet) — la photographie scolaire de l'élève,
 * dite en langage de jeu : chaque matière porte un RANG (bronze → légendaire,
 * cf. lib/mastery) plutôt qu'un « % » nu, et chaque ligne est cliquable vers
 * la matière. Les chapitres fragiles suivent, en ton « à faire progresser »
 * (pas de rouge sanction). Purement présentationnel.
 */
export default function CarnetMastery({
  entries,
  fragiles,
}: {
  entries: MasteryEntry[]
  fragiles: FragileChapter[]
}) {
  const started = entries.some((e) => e.pct > 0)
  // Le palier « leçon lue » mérite un mot : un 30 % sorti de nulle part serait
  // incompréhensible pour l'élève.
  const floorPct = Math.round(LESSON_FLOOR * 100)

  return (
    <section
      aria-label="Ma maîtrise"
      className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <TrendingUp className="size-5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2 className="font-heading text-base font-bold text-foreground">
          Ma maîtrise
        </h2>
      </div>

      {!started ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Lance ta première session : ta progression par matière s&apos;affichera
          ici.
        </p>
      ) : (
        <>
          <ul className="mt-4 flex flex-col gap-3">
            {entries.map((e) => {
              const Icon = subjectIcon(e.slug)
              const rank = rankForValue(e.pct / 100)
              return (
                <li key={e.slug}>
                  <Link
                    href={`/reviser/${e.slug}`}
                    className="group block rounded-xl transition-colors hover:bg-accent/40"
                  >
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="flex min-w-0 items-center gap-1.5 font-semibold text-foreground">
                        <Icon
                          className="size-4 shrink-0 text-muted-foreground"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        <span className="truncate group-hover:underline">
                          {e.name}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-baseline gap-1.5">
                        {rank ? (
                          <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                            <span aria-hidden>{MASTERY_RANK_EMOJI[rank]}</span>{' '}
                            {MASTERY_RANK_LABEL[rank]}
                          </span>
                        ) : null}
                        <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                          {e.pct} %
                        </span>
                      </span>
                    </div>
                    <div
                      className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-accent"
                      role="progressbar"
                      aria-valuenow={e.pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${e.name} : ${e.pct} % de maîtrise${rank ? ` (rang ${MASTERY_RANK_LABEL[rank]})` : ''}`}
                    >
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                        style={{ width: `${e.pct}%` }}
                      />
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Lire une leçon te donne {floorPct} % — fais le quiz du chapitre pour
            monter de rang, jusqu&apos;à 🏆 Légendaire.
          </p>
        </>
      )}

      {fragiles.length > 0 ? (
        <div className="mt-5">
          <h3 className="font-heading text-sm font-bold tracking-wide text-muted-foreground uppercase">
            À faire progresser
          </h3>
          <ul className="mt-2 flex flex-col gap-2">
            {fragiles.map((f) => {
              const Icon = subjectIcon(f.subjectSlug)
              return (
                <li key={f.chapterId}>
                  <Link
                    href={`/reviser/${f.subjectSlug}/${f.chapterId}`}
                    className="flex items-center gap-3 rounded-2xl bg-accent/60 px-3 py-2.5 transition-colors hover:bg-accent"
                  >
                    <Icon
                      className="size-4.5 shrink-0 text-muted-foreground"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                      {f.chapterTitle}
                    </span>
                    <span className="shrink-0 rounded-full bg-highlight/30 px-2 py-0.5 text-xs font-bold text-foreground tabular-nums">
                      {f.pct} %
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
