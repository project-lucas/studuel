'use client'

import Link from 'next/link'
import { ChevronRight, Clock, FileText, GraduationCap, Scale } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import type { ExamYear } from '@/lib/annales'
import {
  formatCoefficient,
  formatDuration,
  groupPapersBySession,
  totalPoints,
  type ExamPaper,
} from '@/lib/exam-papers'

/**
 * Onglet « Annales » : réservé aux années qui finissent sur une épreuve
 * nationale (3e, 1re, Tle). Pour ces élèves, le programme n'est pas une fin en
 * soi — c'est une préparation, et l'écran doit le dire.
 *
 * DEUX BLOCS, DANS CET ORDRE. D'abord l'épreuve blanche, qui se joue tout de
 * suite ; ensuite l'épreuve réelle, partie par partie. L'inverse mettrait en
 * tête une fiche à lire là où l'élève est venu s'entraîner.
 *
 * CE QUE LE SECOND BLOC MONTRE. Pas un énoncé de sujet tombé, mais la STRUCTURE
 * OFFICIELLE de l'épreuve : durée, coefficient, parties, barème, et les
 * chapitres que chaque partie mobilise. C'est ce qu'un élève ignore le plus
 * longtemps et ce qui lui coûte le plus cher le jour J. Les énoncés viendront
 * s'y ranger session par session (`session` et `center` les distinguent déjà en
 * base) sans que cet écran change de forme.
 *
 * `papers` VIDE EST UN ÉTAT NORMAL, pas une erreur : les migrations 236/237
 * peuvent n'être pas jouées, ou la matière n'être évaluée à aucune épreuve
 * (l'anglais du bac est en contrôle continu). On le dit, sans promettre de date.
 */
export default function AnnalesPanel({
  subject,
  exam,
  papers,
}: {
  subject: { slug: string; name: string }
  exam: ExamYear
  papers: ExamPaper[]
}) {
  const sessions = groupPapersBySession(papers)

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <section aria-labelledby="epreuve-blanche">
        <h2 id="epreuve-blanche" className="font-heading text-lg font-bold">
          T’entraîner dans les conditions
        </h2>
        <p className="mt-0.5 mb-3 text-sm text-muted-foreground">
          Cette année se termine par {exam.label}. L’épreuve blanche de{' '}
          {subject.name} te met dans le temps et le format réels, et te rend un
          bilan chapitre par chapitre.
        </p>
        <Link
          href={`/reviser/examen-blanc?subject=${subject.slug}`}
          onClick={() => sfx.tap()}
          className="group flex items-center gap-3 rounded-2xl border-b-4 border-b-black/25 bg-gradient-to-r from-primary to-[color-mix(in_oklch,var(--primary),black_18%)] p-3.5 text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-[2px] active:border-b-2"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <GraduationCap
              className="size-5.5"
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-heading block text-sm leading-tight font-bold">
              Épreuve blanche de {subject.name}
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold text-white/75">
              Conditions réelles · bilan chapitre par chapitre
            </span>
          </span>
          <ChevronRight
            className="size-5 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </section>

      <section aria-labelledby="sujets-officiels">
        <h2 id="sujets-officiels" className="font-heading text-lg font-bold">
          L’épreuve {exam.short === 'Bac' ? 'du bac' : `du ${exam.short.toLowerCase()}`}, partie
          par partie
        </h2>

        {sessions.length === 0 ? (
          <div className="mt-3 flex flex-col items-center gap-2 rounded-2xl border border-dashed bg-card/50 px-4 py-8 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="size-6" aria-hidden="true" />
            </span>
            <p className="font-heading font-bold">Pas encore d’épreuve ici</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              {subject.name} n’a pas encore sa fiche d’épreuve dans l’app. En
              attendant, l’épreuve blanche ci-dessus se joue sur tout le
              programme de l’année.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-0.5 mb-3 text-sm text-muted-foreground">
              La durée, le barème et ce qu’on attend de toi à chaque partie —
              d’après les textes officiels de la session.
            </p>
            <div className="flex flex-col gap-5">
              {sessions.map((group) => (
                <div key={group.session} className="flex flex-col gap-3">
                  {sessions.length > 1 && (
                    <h3 className="font-heading text-sm font-bold text-muted-foreground">
                      Session {group.session}
                    </h3>
                  )}
                  {group.papers.map((paper) => (
                    <PaperCard key={paper.id} paper={paper} />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

function PaperCard({ paper }: { paper: ExamPaper }) {
  const coefficient = formatCoefficient(paper.coefficient)
  const total = totalPoints(paper)

  return (
    <article className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <header className="border-b bg-primary/5 px-4 py-3">
        <h4 className="font-heading text-sm leading-tight font-bold">
          {paper.title}
          {paper.center && (
            <span className="ml-1.5 font-sans text-[11px] font-semibold text-muted-foreground">
              · {paper.center}
            </span>
          )}
        </h4>
        <ul className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-muted-foreground">
          <li className="flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {formatDuration(paper.durationMin)}
          </li>
          {coefficient && (
            <li className="flex items-center gap-1">
              <Scale className="size-3.5" aria-hidden="true" />
              {coefficient}
            </li>
          )}
          {total !== null && <li>{total} points</li>}
        </ul>
      </header>

      <ol className="divide-y">
        {paper.parts.map((part, i) => (
          <li key={`${paper.id}-${i}`} className="px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-heading text-sm font-bold">
                <span className="text-muted-foreground">{i + 1}.</span> {part.title}
              </p>
              <p className="shrink-0 text-[11px] font-semibold text-muted-foreground">
                {[
                  part.minutes !== null ? formatDuration(part.minutes) : null,
                  part.points !== null ? `${part.points} pts` : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
              {part.expected}
            </p>
            {/* Les chapitres sont des ÉTIQUETTES, pas des liens. La page
                matière n'a pas de paramètre d'URL qui ouvre un chapitre donné
                (`?onglet=` ne désigne qu'un onglet) : un lien par chapitre
                mènerait donc à la même page, sans rien y ouvrir — le pire des
                liens, celui qui a l'air de marcher. L'onglet Programme est à
                un geste, et le titre suffit à l'y retrouver. */}
            {part.chapters.length > 0 && (
              <p className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  À réviser :
                </span>
                {part.chapters.map((chapter) => (
                  <span
                    key={chapter}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary"
                  >
                    {chapter}
                  </span>
                ))}
              </p>
            )}
          </li>
        ))}
      </ol>
    </article>
  )
}
