import type { ReactNode } from 'react'
import Link from 'next/link'
import EnTetePage from '@/components/reviser/EnTetePage'
import { aCompleter, MISE_A_JOUR_LEGALE } from '@/lib/legal/editeur'

/**
 * LA RECETTE DES PAGES LÉGALES (25/10/2026) : CGU, confidentialité, mentions
 * légales, suppression du compte. Publiques (lisibles sans compte, exigées par
 * les stores), en `.carte` sur le mur de l'app, une section = un titre.
 */
export default function PageLegale({
  titre,
  intro,
  children,
}: {
  titre: string
  intro?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="mx-auto w-full max-w-2xl pb-10">
      <EnTetePage retour={{ fallback: '/compte' }} titre={titre} sousTitre={`Mise à jour : ${MISE_A_JOUR_LEGALE}`} />
      <article className="carte mt-2 space-y-6 p-5 text-[15px] leading-relaxed">
        {intro ? <div className="font-semibold">{intro}</div> : null}
        {children}
      </article>
      <nav
        aria-label="Informations légales"
        className="mt-4 flex flex-wrap justify-center gap-x-4 text-xs font-bold text-muted-foreground"
      >
        <Link href="/cgu" className="py-2 underline underline-offset-4">CGU</Link>
        <Link href="/confidentialite" className="py-2 underline underline-offset-4">Confidentialité</Link>
        <Link href="/mentions-legales" className="py-2 underline underline-offset-4">Mentions légales</Link>
        <Link href="/supprimer-mon-compte" className="py-2 underline underline-offset-4">Supprimer mon compte</Link>
      </nav>
    </div>
  )
}

export function Section({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="font-heading text-lg font-extrabold">{titre}</h2>
      {children}
    </section>
  )
}

/** Une valeur de `lib/legal/editeur` : surlignée tant qu'elle attend Lucas. */
export function Valeur({ v }: { v: string }) {
  if (!aCompleter(v)) return <>{v}</>
  return <mark className="rounded bg-highlight/60 px-1 font-bold">[{v}]</mark>
}
