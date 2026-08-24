'use client'

import Link from 'next/link'
import { NotebookPen, Play } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { normalizeCourseColor, normalizeCourseIcon } from '@/lib/carnet-cours'
import { COURSE_ICON, COURSE_TINT } from '@/components/carnet/style'

export type CoursDeLaMatiere = {
  id: string
  title: string
  icon: string | null
  color: string | null
  questionCount: number
  dueCount: number
}

/**
 * « Tes cours » — les cours du CARNET rattachés à cette matière, posés dans le
 * dossier de la matière, au-dessus du programme officiel.
 *
 * C'est le pont que l'audit appelait le constat le plus rentable : le carnet
 * était une île. Ses cours n'apparaissaient nulle part ailleurs dans l'app, et
 * un élève qui avait pris ses propres notes sur un chapitre devait aller les
 * chercher dans un autre onglet pour les réviser.
 *
 * Ni Anki ni Wooflash ne peuvent faire ça : ils n'ont pas de programme à côté
 * duquel poser les notes de l'élève.
 *
 * Le bloc DISPARAÎT quand aucun cours n'est rattaché — un dossier de matière ne
 * montre que son programme, c'est la règle du projet.
 */
export default function CarnetDeLaMatiere({
  cours,
  matiere,
}: {
  cours: CoursDeLaMatiere[]
  matiere: string
}) {
  if (cours.length === 0) return null

  return (
    <section
      aria-label={`Tes cours de ${matiere}`}
      className="rev-card mb-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5"
    >
      <div className="mb-2.5 flex items-center gap-3 px-1">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <NotebookPen className="size-4" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <h2 className="font-heading min-w-0 flex-1 truncate text-base font-extrabold text-foreground">
          Tes cours
        </h2>
        <Link
          href="/reviser?espace=carnet"
          onClick={() => sfx.tap()}
          className="shrink-0 text-[11px] font-extrabold text-primary"
        >
          Mon carnet
        </Link>
      </div>

      <ul className="flex flex-col gap-1.5">
        {cours.map((c) => {
          const Icon = COURSE_ICON[normalizeCourseIcon(c.icon)]
          const tint = COURSE_TINT[normalizeCourseColor(c.color)]
          return (
            <li
              key={c.id}
              className="flex items-center gap-2 rounded-2xl ring-1 ring-black/5"
            >
              <Link
                href={`/reviser/cours/${c.id}`}
                onClick={() => sfx.tap()}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl py-2.5 pl-2.5"
              >
                <span
                  className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tint}`}
                >
                  <Icon className="size-4" strokeWidth={2.2} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-heading block truncate text-sm font-extrabold text-foreground">
                    {c.title}
                  </span>
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    {c.questionCount} question{c.questionCount > 1 ? 's' : ''}
                  </span>
                </span>
              </Link>
              {c.dueCount > 0 ? (
                <span className="shrink-0 rounded-full bg-accent/60 px-2 py-0.5 text-[10px] font-extrabold text-foreground/80 tabular-nums">
                  {c.dueCount}
                </span>
              ) : null}
              <Link
                href={`/reviser/cours/${c.id}/reviser`}
                onClick={() => sfx.tap()}
                aria-label={`Réviser ${c.title}`}
                className="mr-2.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
              >
                <Play className="size-3.5 fill-current" aria-hidden="true" />
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
