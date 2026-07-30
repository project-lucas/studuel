'use client'

import Link from 'next/link'
import { Play } from 'lucide-react'
import { sfx } from '@/lib/sounds'

/**
 * Le héros de Mon carnet : « À revoir aujourd'hui — n questions · m min », un
 * seul CTA. La mécanique du héros mission de Réviser appliquée au carnet :
 * l'app additionne les questions dues de tous les cours (lib/carnet-revoir)
 * et propose UNE session, au lieu de laisser l'élève choisir dans une liste.
 *
 * Rien à revoir → on félicite au lieu d'afficher un bouton mort ; carnet sans
 * aucune question jouable → le composant est rendu null par le parent.
 */
export default function CarnetHero({
  dueCount,
  minutes,
  courseLine,
}: {
  dueCount: number
  minutes: number
  /** « Anglais — irréguliers · SVT chap. 2 · +1 cours » (calculé serveur). */
  courseLine: string
}) {
  if (dueCount === 0) {
    return (
      <section className="rounded-3xl bg-gradient-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_22%)] p-4 text-primary-foreground shadow-sm">
        <p className="text-[11px] font-extrabold tracking-widest text-primary-foreground/70 uppercase">
          À revoir aujourd&apos;hui
        </p>
        <p className="font-heading mt-1 text-xl leading-tight font-extrabold">
          Tout est frais ✨
        </p>
        <p className="mt-0.5 text-xs text-primary-foreground/75">
          Aucune question due — reviens demain, ou ajoute des questions à tes
          cours.
        </p>
      </section>
    )
  }

  return (
    <section
      aria-label="À revoir aujourd'hui"
      className="rounded-3xl bg-gradient-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_22%)] p-4 text-primary-foreground shadow-sm"
    >
      <p className="text-[11px] font-extrabold tracking-widest text-primary-foreground/70 uppercase">
        À revoir aujourd&apos;hui
      </p>
      <p className="font-heading mt-1 text-2xl leading-tight font-extrabold">
        {dueCount} question{dueCount > 1 ? 's' : ''} · {minutes} min
      </p>
      {courseLine.length > 0 ? (
        <p className="mt-0.5 truncate text-xs text-primary-foreground/75">
          {courseLine}
        </p>
      ) : null}
      <Link
        href="/reviser/cours/revoir"
        onClick={() => sfx.tap()}
        className="font-heading mt-3 flex items-center justify-center gap-2 rounded-full bg-highlight px-4 py-3 text-base font-extrabold text-foreground shadow-[0_4px_0_color-mix(in_oklch,var(--highlight),black_25%)] transition active:translate-y-px active:shadow-none"
      >
        <Play className="size-4 fill-current" aria-hidden="true" />
        Tout réviser
      </Link>
    </section>
  )
}
