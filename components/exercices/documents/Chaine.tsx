import { Fragment } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'
import type { DocChaine } from '@/lib/exercices/types'
import { cn } from '@/lib/utils'
import { couleur, etatCible, Inline, propsCible, type ZonesDoc } from '../commun'
import s from '../manuel.module.css'

/**
 * UNE CHAÎNE — alimentaire, d'énergie, d'information, un cycle de vie : des
 * étiquettes reliées par des flèches, dans l'ordre. Les liens relient des
 * nœuds VOISINS (le validateur y veille) : une toile plus compliquée se
 * dessine en schéma.
 *
 * En ligne, la chaîne passe à la ligne sur un téléphone plutôt que de rétrécir
 * ses étiquettes jusqu'à l'illisible ; en cycle, les nœuds tournent en rond.
 */
export function Chaine({ doc, zones }: { doc: DocChaine; zones?: ZonesDoc }) {
  const lien = (a: string, b: string) =>
    doc.liens.find((l) => (l.de === a && l.a === b) || (l.de === b && l.a === a))

  const noeud = (n: DocChaine['noeuds'][number]) => {
    const etat = etatCible(n.id, zones)
    return (
      <div
        key={n.id}
        className={cn(
          s.noeud,
          zones?.actif && s.noeudTouchable,
          etat === 'choisie' && s.noeudChoisi,
          etat === 'juste' && s.noeudJuste,
          etat === 'fausse' && s.noeudFaux,
        )}
        style={{ ['--teinte' as string]: n.teinte ? couleur(n.teinte) : undefined }}
        {...propsCible(n.id, zones, n.texte)}
      >
        {n.emoji ? (
          <span className="text-2xl leading-none" aria-hidden="true">
            {n.emoji}
          </span>
        ) : null}
        <span className={cn(n.texte === '?' && 'font-heading text-lg text-[var(--t-violet)]')}>
          <Inline texte={n.texte} />
        </span>
      </div>
    )
  }

  const fleche = (de: string, a: string, sens: 'h' | 'v') => {
    const l = lien(de, a)
    if (!l) return <span className="w-3" aria-hidden="true" />
    const avant = l.de === de
    const Icone = sens === 'h' ? (avant ? ArrowRight : ArrowLeft) : avant ? ArrowDown : ArrowUp
    return (
      <span
        className={cn('flex shrink-0 items-center gap-0.5 text-[var(--encre-douce)]', sens === 'h' ? 'flex-col px-0.5' : 'flex-row py-0.5')}
      >
        {l.texte ? <span className="max-w-[5.5rem] text-center text-[0.68rem] leading-tight font-bold">{l.texte}</span> : null}
        <Icone className={cn('size-5', l.style === 'pointilles' && 'opacity-60')} strokeWidth={2.6} aria-hidden="true" />
      </span>
    )
  }

  if (doc.disposition === 'cycle') {
    const n = doc.noeuds.length
    return (
      <div className="relative mx-auto aspect-square w-full max-w-[20rem]">
        <svg viewBox="-100 -100 200 200" className="absolute inset-0 size-full" aria-hidden="true">
          <defs>
            <marker id={`${doc.id}-pointe`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" style={{ fill: 'var(--encre-douce)' }} />
            </marker>
          </defs>
          {doc.noeuds.map((a, i) => {
            const b = doc.noeuds[(i + 1) % n]
            const l = lien(a.id, b.id)
            if (!l) return null
            const t0 = (-90 + (360 * i) / n + 360 / n / 3.2) * (Math.PI / 180)
            const t1 = (-90 + (360 * (i + 1)) / n - 360 / n / 3.2) * (Math.PI / 180)
            const r = 70
            const [x0, y0] = [r * Math.cos(t0), r * Math.sin(t0)]
            const [x1, y1] = [r * Math.cos(t1), r * Math.sin(t1)]
            const d = l.de === a.id ? `M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}` : `M${x1} ${y1}A${r} ${r} 0 0 0 ${x0} ${y0}`
            return (
              <path
                key={i}
                d={d}
                fill="none"
                style={{ stroke: 'var(--encre-douce)' }}
                strokeWidth={2.2}
                strokeDasharray={l.style === 'pointilles' ? '4 3' : undefined}
                markerEnd={`url(#${doc.id}-pointe)`}
              />
            )
          })}
        </svg>
        {doc.noeuds.map((nd, i) => {
          const t = (-90 + (360 * i) / n) * (Math.PI / 180)
          return (
            <div
              key={nd.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + 35 * Math.cos(t)}%`, top: `${50 + 35 * Math.sin(t)}%` }}
            >
              {noeud(nd)}
            </div>
          )
        })}
      </div>
    )
  }

  const vertical = doc.disposition === 'colonne'
  return (
    <div className={cn('flex items-center justify-center gap-1.5', vertical ? 'flex-col' : 'flex-wrap')}>
      {doc.noeuds.map((nd, i) => (
        <Fragment key={nd.id}>
          {noeud(nd)}
          {i < doc.noeuds.length - 1 ? fleche(nd.id, doc.noeuds[i + 1].id, vertical ? 'v' : 'h') : null}
        </Fragment>
      ))}
    </div>
  )
}
