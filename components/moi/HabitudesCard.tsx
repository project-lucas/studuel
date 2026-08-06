'use client'

import Link from 'next/link'
import { useOptimistic, useTransition } from 'react'
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  Droplet,
  Moon,
  Sprout,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toggleHabitudeAction } from '@/app/moi/actions'
import Sparkline from '@/components/moi/Sparkline'
import type { DriverKey } from '@/lib/capacite-drivers'
import { teinteDe } from '@/lib/moi/familles'
import { type BilanHabitude } from '@/lib/moi/habitudes'

// LES HABITUDES, SUR L'ÉCRAN PRINCIPAL — fin de l'onglet dans l'onglet.
//
// « Ma progression » / « Mes habitudes » étaient deux onglets internes : la
// moitié du contenu vivait derrière un clic que personne ne faisait. Tout tient
// maintenant dans un seul scroll, et ce bloc joue sur deux niveaux :
//   · ICI, ce qui se fait en un doigt — cocher ses leviers du jour — puis les
//     séries qui tiennent, chacune avec la vague de ses 28 jours ;
//   · sur /moi/habitudes, le catalogue complet, le « pourquoi » scientifique de
//     chaque habitude et la jauge de capacité.
//
// Le composant est client d'un bloc : cocher un levier doit répondre au doigt
// (mise à jour optimiste), pas après un aller-retour serveur.

const LEVER_ICONS: Record<DriverKey, LucideIcon> = {
  sommeil: Moon,
  hydratation: Droplet,
  regularite: BookOpen,
  concentration: Brain,
}

// Chips pastel : une teinte par driver (palette Tailwind, pas de hex en dur).
const LEVER_STYLES: Record<DriverKey, string> = {
  sommeil: 'bg-emerald-100 text-emerald-900',
  hydratation: 'bg-orange-100 text-orange-900',
  regularite: 'bg-purple-100 text-purple-900',
  concentration: 'bg-sky-100 text-sky-900',
}

export type LeverState = {
  catalogId: string
  label: string
  driverKey: DriverKey
  doneToday: boolean
}

// `points` (« +4 pts ») a quitté ce type avec la capacité. Ces points étaient le
// POIDS du driver dans le calcul de la capacité — un chiffre qui n'avait de sens
// qu'à côté de la jauge. La jauge vit maintenant sur /moi/habitudes ; laisser
// « +4 pts » ici aurait été une monnaie sans caisse.

export default function HabitudesCard({
  levers,
  today,
  bilans,
}: {
  levers: LeverState[]
  /** Clé de jour UTC 'YYYY-MM-DD'. */
  today: string
  bilans: BilanHabitude[]
}) {
  const [, startTransition] = useTransition()
  const [optimistic, setOptimistic] = useOptimistic(
    Object.fromEntries(levers.map((l) => [l.catalogId, l.doneToday])),
    (state, update: { catalogId: string; done: boolean }) => ({
      ...state,
      [update.catalogId]: update.done,
    }),
  )

  const toggle = (lever: LeverState) => {
    const next = !optimistic[lever.catalogId]
    sfx.tap()
    startTransition(async () => {
      setOptimistic({ catalogId: lever.catalogId, done: next })
      await toggleHabitudeAction(lever.catalogId, today, next)
    })
  }

  // Les habitudes qui ont quelque chose à dire d'abord : celle qui tient le
  // plus longtemps en tête. Trois suffisent ici — le reste est sur la page
  // dédiée, et une liste de dix lignes sur l'écran d'accueil n'est plus un
  // résumé.
  const enTete = [...bilans].sort((a, b) => b.serie - a.serie).slice(0, 3)

  return (
    <section
      aria-label="Mes habitudes"
      className="moi-card rounded-3xl bg-white p-4"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-heading text-xl leading-tight font-extrabold text-foreground">
          Mes habitudes
        </h2>
        {/* La porte vers le catalogue et ses « pourquoi ». Un lien qui se lit,
            pas une pastille d'icône muette dans l'angle. */}
        <Link
          href="/moi/habitudes"
          onClick={() => sfx.tap()}
          className="flex shrink-0 items-center gap-1 text-xs font-extrabold text-primary"
        >
          <Sprout className="size-3.5" aria-hidden="true" />
          Toutes
        </Link>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {levers.map((lever) => {
          const Icon = LEVER_ICONS[lever.driverKey]
          const done = optimistic[lever.catalogId]
          return (
            <button
              key={lever.catalogId}
              type="button"
              aria-pressed={done}
              aria-label={`${lever.label} aujourd'hui : ${done ? 'fait' : 'à faire'}`}
              onClick={() => toggle(lever)}
              className={cn(
                'relative flex cursor-pointer items-center justify-center gap-1.5 rounded-2xl px-2 py-2.5 transition-all active:scale-95',
                LEVER_STYLES[lever.driverKey],
                done ? 'ring-2 ring-current' : 'opacity-90 hover:opacity-100',
              )}
            >
              {done ? (
                <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-current">
                  <Check
                    className="size-3 text-white"
                    strokeWidth={3.5}
                    aria-hidden="true"
                  />
                </span>
              ) : null}
              <Icon className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="text-xs font-extrabold">{lever.label}</span>
            </button>
          )
        })}
      </div>

      {enTete.length > 0 ? (
        <ul className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
          {enTete.map((b) => {
            const teinte = teinteDe(b.catalogId)
            return (
              <li
                key={b.id}
                className="flex items-center gap-2.5 rounded-2xl px-1 py-1"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full text-base',
                    teinte.pastille,
                  )}
                >
                  {b.icone}
                </span>
                <div className="min-w-0 flex-[1.4]">
                  <p className="truncate text-[11px] leading-tight font-bold text-muted-foreground">
                    {b.titre}
                  </p>
                  <p className="font-heading flex items-baseline gap-1 leading-none font-extrabold text-foreground">
                    <span className="text-lg tabular-nums">{b.serie}</span>
                    <span className="text-[11px] font-bold text-muted-foreground">
                      {b.serie > 1 ? 'jours de suite' : 'jour de suite'}
                    </span>
                  </p>
                </div>
                {/* La vague : 28 jours. Sept jours ne diraient pas si la serie
                    vient de repartir ou si elle tient depuis un mois. */}
                <Sparkline
                  jours={b.historique}
                  className={cn('max-w-24 flex-1', teinte.trait)}
                  titre={`${b.titre} : ${b.regularite}% sur les 28 derniers jours`}
                />
              </li>
            )
          })}
        </ul>
      ) : null}

      <Link
        href="/moi/habitudes"
        onClick={() => sfx.tap()}
        className="mt-3 flex items-center justify-center gap-1.5 rounded-2xl bg-primary/10 px-4 py-2.5 text-sm font-extrabold text-primary transition-transform active:scale-[0.98]"
      >
        {bilans.length > enTete.length
          ? `Voir mes ${bilans.length} habitudes`
          : 'Choisir mes habitudes'}
        <ArrowRight className="size-4" strokeWidth={2.6} aria-hidden="true" />
      </Link>
    </section>
  )
}
