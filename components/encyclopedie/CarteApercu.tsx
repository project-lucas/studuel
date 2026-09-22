import Link from 'next/link'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Apercu } from '@/lib/encyclopedie/apercu'
import { hrefFiche } from '@/lib/encyclopedie/matieres'
import { PERIODE_LABELS_COURTS, teinteDe } from '@/lib/encyclopedie/types'
import TexteRiche from './TexteRiche'
import styles from './Encyclopedie.module.css'

// LA CARTE D'UNE FICHE, dans la liste.
//
// Elle montre quatre choses et pas une de plus : le médaillon (on reconnaît la
// période à sa teinte), le nom et son surnom, les dates, et LA CITATION. Le
// modèle qu'on remplace mettait la phrase célèbre en dernier, après la date de
// naissance et le « statut » — or c'est la phrase qui donne envie d'ouvrir, et
// c'est elle qu'on retient. Elle est donc sur la carte, en italique, sur deux
// lignes au plus.
//
// Pas de résumé en plus : deux lignes de prose grise sous la citation feraient
// une carte de quatre-vingts mots qu'on ne lit plus. Le reste est dans la
// fiche, à un doigt de là.
export default function CarteApercu({
  apercu,
  slug,
  lue = false,
}: {
  apercu: Apercu
  slug: string
  /** Déjà ouverte au moins une fois (marque locale, cf. lib/encyclopedie/lues). */
  lue?: boolean
}) {
  return (
    <Link
      href={hrefFiche(slug, apercu.id)}
      data-teinte={teinteDe(apercu.periode)}
      className={cn(styles.carte, 'p-3.5 pl-4')}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={cn(
            styles.medaillon,
            'flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl',
          )}
        >
          {apercu.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="font-heading min-w-0 flex-1 truncate text-base leading-tight font-extrabold text-foreground">
              {apercu.nom}
            </h3>
            {lue ? (
              <span
                className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success"
                title="Déjà lue"
              >
                <Check className="size-3" strokeWidth={3.5} aria-hidden="true" />
                <span className="sr-only">Déjà lue</span>
              </span>
            ) : null}
          </div>
          {apercu.detail ? (
            <p className="truncate text-[0.8rem] leading-tight font-semibold text-primary/80">
              {apercu.detail}
            </p>
          ) : null}
          <p className="mt-0.5 text-xs font-medium text-muted-foreground">
            {apercu.dates} · {PERIODE_LABELS_COURTS[apercu.periode]}
          </p>
        </div>
      </div>
      {apercu.citation ? (
        <p className="mt-2.5 border-t border-border/60 pt-2.5 text-[0.82rem] leading-snug text-foreground/85 italic">
          «&nbsp;{apercu.citation}&nbsp;»
          {apercu.citationQui ? (
            <span className="ml-1 text-[0.72rem] font-semibold text-muted-foreground not-italic">
              — <TexteRiche texte={apercu.citationQui} />
            </span>
          ) : null}
        </p>
      ) : null}
    </Link>
  )
}
