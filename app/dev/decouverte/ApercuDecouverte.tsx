'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Lock, LockOpen, Eye } from 'lucide-react'
import { DECOUVERTES, type OngletVerrouillable } from '@/lib/decouverte/catalogue'
import { estFermee, xpManquante } from '@/lib/decouverte/etat'
import { ouvrirVerrou, semerEtatDecouverte } from '@/components/decouverte/store'
import { Button } from '@/components/ui/button'

const DEPUIS_EXEMPLE = '2026-10-25T08:00:00.000Z'

/** Sème le magasin de la découverte, puis décrit l'état joué. */
export default function ApercuDecouverte({
  niveau,
  xp,
  vues,
  ancien,
  feuille,
}: {
  niveau: number
  xp: number
  vues: string[]
  ancien: boolean
  feuille: OngletVerrouillable | null
}) {
  const depuis = ancien ? null : DEPUIS_EXEMPLE
  const vuesCle = vues.join(',')
  useEffect(() => {
    semerEtatDecouverte({ niveau, xp, vues: vuesCle ? vuesCle.split(',') : [], depuis }, feuille)
  }, [niveau, xp, vuesCle, depuis, feuille])

  const requete = (n: number) => `/dev/decouverte?niveau=${n}`

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-5 px-4 pt-6 pb-32">
      <header>
        <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">Aperçu · développement</p>
        <h1 className="font-heading text-2xl font-extrabold text-foreground">Découverte progressive</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ancien
            ? 'Compte d’avant la 601 : rien n’est fermé, quel que soit le niveau.'
            : `Nouveau compte au niveau ${niveau}, ${xp} XP. Regarde la barre d’onglets.`}
        </p>
      </header>

      <nav aria-label="Niveaux" className="flex flex-wrap gap-2">
        {[1, 2, 3, 4].map((n) => (
          <Link
            key={n}
            href={requete(n)}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ring-1 ring-foreground/10 ${
              n === niveau && !ancien ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
            }`}
          >
            Niveau {n}
          </Link>
        ))}
        <Link
          href="/dev/decouverte?ancien=1"
          className={`rounded-full px-3 py-1.5 text-sm font-bold ring-1 ring-foreground/10 ${
            ancien ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground'
          }`}
        >
          Ancien compte
        </Link>
      </nav>

      <section className="carte p-3.5">
        <h2 className="titre-section font-heading font-extrabold">Le catalogue</h2>
        <ul className="mt-2 flex flex-col gap-2">
          {DECOUVERTES.map((d) => {
            const vue = vues.includes(d.cle)
            const fermee = estFermee(d, niveau, vues, depuis)
            return (
              <li key={d.cle} className="flex items-center gap-3 text-sm">
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
                    fermee ? 'bg-muted text-muted-foreground' : vue ? 'bg-success/15 text-success' : 'bg-primary/10 text-primary'
                  }`}
                  aria-hidden="true"
                >
                  {fermee ? <Lock className="size-3.5" /> : vue ? <Eye className="size-3.5" /> : <LockOpen className="size-3.5" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-bold text-foreground">{d.nom}</span>
                  <span className="text-muted-foreground">
                    {' '}
                    · niveau {d.niveau}
                    {d.onglet ? ` · onglet ${d.onglet}` : ''}
                    {fermee ? ` · encore ${xpManquante(xp, d.niveau)} XP` : vue ? ' · vue' : ' · ouverte'}
                  </span>
                </span>
                {!fermee ? (
                  <Link
                    href={`/dev/decouverte?niveau=${niveau}${ancien ? '&ancien=1' : ''}&decouvrir=${d.cle}`}
                    className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary"
                  >
                    Mini-tour
                  </Link>
                ) : null}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="carte p-3.5">
        <h2 className="titre-section font-heading font-extrabold">La feuille d’un onglet fermé</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Touche un onglet gris dans la barre, ou :
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(['defi', 'amis', 'tresor'] as const).map((o) => {
            const d = DECOUVERTES.find((x) => x.onglet === o)
            const fermee = d ? estFermee(d, niveau, vues, depuis) : false
            return (
              <Button key={o} type="button" variant="outline" disabled={!fermee} onClick={() => ouvrirVerrou(o)}>
                {d?.nom ?? o}
              </Button>
            )
          })}
        </div>
        {!DECOUVERTES.some((d) => d.onglet && estFermee(d, niveau, vues, depuis)) ? (
          <p className="mt-2 text-xs text-muted-foreground">Rien n’est fermé à ce niveau.</p>
        ) : null}
      </section>
    </main>
  )
}
