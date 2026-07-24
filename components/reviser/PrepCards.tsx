'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { Play, X, Trash2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { subjectTheme } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import { snoozeControleCard, deleteControle } from '@/app/reviser/prep-actions'
import {
  derivePlanView,
  isCardVisible,
  controleTitle,
  launchChapterId,
  countdownTag,
  type Controle,
} from '@/lib/prep-plan'
import type { ControleSubjectMeta } from '@/components/WeekPlannerStrip'

// -----------------------------------------------------------------------------
// Rangée « Préparer mes contrôles » : UNE carte par contrôle actif, en LECTURE
// des mêmes entités que la ligne de « Ta semaine » — même couleur (thème
// matière) et même intitulé (identité visuelle partagée, pour que l'élève
// comprenne que c'est le même objet). Le bouton lance la prochaine session du
// plan (le quiz du chapitre → la session passe « faite »). Le X ne supprime pas
// la carte : il la replie pour ce soir (snooze). La suppression est une action
// distincte et discrète (« je me suis trompé »).
// -----------------------------------------------------------------------------

function PrepCard({
  controle,
  today,
  meta,
}: {
  controle: Controle
  today: string
  meta: ControleSubjectMeta
}) {
  const [busy, start] = useTransition()
  const view = derivePlanView(controle, today)
  const theme = subjectTheme(meta.color)
  const title = controleTitle(controle, meta.name)
  const tag = countdownTag(controle.date, today)
  const href = `/reviser/${controle.subject}/${launchChapterId(view, controle)}`

  const handleSnooze = () => {
    if (busy) return
    sfx.tap()
    start(async () => {
      const res = await snoozeControleCard(controle.id)
      toast(res.ok ? 'On te le rappelle ce soir 🌙' : 'Réessaie dans un instant.')
    })
  }

  const handleDelete = () => {
    if (busy) return
    sfx.tap()
    start(async () => {
      const res = await deleteControle(controle.id)
      toast(res.ok ? 'Contrôle retiré ✓' : 'Impossible de retirer ce contrôle.')
    })
  }

  return (
    <li className={cn('relative w-60 shrink-0', busy && 'opacity-60')}>
      {/* Le X (repli « ce soir ») est SŒUR du lien, pas imbriqué dedans. */}
      <button
        type="button"
        onClick={handleSnooze}
        disabled={busy}
        aria-label="Replier — me le rappeler ce soir"
        className="absolute top-2.5 right-2.5 z-10 flex size-7 items-center justify-center rounded-full bg-black/5 text-muted-foreground transition-colors hover:bg-black/10 active:scale-90"
      >
        <X className="size-3.5" strokeWidth={2.8} aria-hidden="true" />
      </button>

      <div className="rev-card flex h-full flex-col rounded-3xl bg-white p-3.5 ring-1 ring-black/5">
        {/* Bandeau matière : chip coloré + intitulé partagé avec la semaine. */}
        <div className="flex items-center gap-2 pr-7">
          <span
            aria-hidden="true"
            className={cn('grid size-8 shrink-0 place-items-center rounded-full', theme.chip)}
          >
            <SubjectIcon
              slug={controle.subject}
              className="size-4 text-foreground"
              strokeWidth={2.4}
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[11px] font-bold text-muted-foreground">
              {meta.name}
            </span>
          </span>
        </div>

        <p className="font-heading mt-2 line-clamp-2 text-[0.95rem] leading-tight font-extrabold text-foreground">
          {title}
        </p>

        {/* Compte à rebours + progression du plan. */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {tag ? (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[11px] font-extrabold',
                theme.header,
              )}
            >
              {tag}
            </span>
          ) : null}
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
            Préparation : {view.progressLabel}
          </span>
        </div>

        <Link
          href={href}
          onClick={() => sfx.tap()}
          className="font-heading group mt-3 flex items-center justify-center gap-1.5 rounded-2xl bg-primary px-3 py-2 pt-2.5 text-[13px] font-extrabold text-primary-foreground transition-transform active:translate-y-px"
        >
          <Play className="size-4 fill-current" aria-hidden="true" />
          {view.done === 0 ? 'Commencer la prépa' : 'Session suivante'}
        </Link>

        {/* Action discrète et distincte : la vraie suppression. */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="mt-2 flex items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground/70 transition-colors hover:text-destructive"
        >
          <Trash2 className="size-3" aria-hidden="true" />
          Je me suis trompé
        </button>
      </div>
    </li>
  )
}

export default function PrepCards({
  controles,
  today,
  subjectMeta,
}: {
  controles: Controle[]
  today: string
  subjectMeta: Record<string, ControleSubjectMeta>
}) {
  // On n'affiche que les cartes visibles (plan non terminé, non repliées ce jour).
  const visible = controles.filter((c) =>
    isCardVisible(c, derivePlanView(c, today), today),
  )
  if (visible.length === 0) return null

  return (
    <section aria-label="Préparer mes contrôles">
      <div className="mb-2 px-1">
        <h2 className="font-heading flex items-center gap-1.5 text-sm font-bold tracking-wide text-muted-foreground uppercase">
          <CheckCircle2 className="size-3.5 text-primary" aria-hidden="true" />
          Préparer mes contrôles
        </h2>
      </div>
      <ul className="hide-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pt-1 pb-4 sm:mx-0 sm:px-1">
        {visible.map((c) => (
          <PrepCard
            key={c.id}
            controle={c}
            today={today}
            meta={subjectMeta[c.subject] ?? { name: c.subject, color: 'blue' }}
          />
        ))}
      </ul>
    </section>
  )
}
