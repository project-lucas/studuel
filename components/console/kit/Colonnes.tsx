'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export type Colonne = { cle: string; valeur: number; etiquette: string; detail?: string }

/**
 * Un histogramme en colonnes, une seule série (violet), info-bulle au survol
 * (la zone de survol est la colonne entière, plus large que la marque) et
 * quelques étiquettes d'axe seulement. Données en table pour les lecteurs
 * d'écran.
 */
export default function Colonnes({
  donnees,
  hauteur = 160,
  format = (n: number) => n.toLocaleString('fr-FR'),
  etiquettesTous = 1,
  titre,
}: {
  donnees: Colonne[]
  hauteur?: number
  format?: (n: number) => string
  /** Une étiquette d'axe toutes les N colonnes. */
  etiquettesTous?: number
  titre: string
}) {
  const [survol, setSurvol] = useState<number | null>(null)
  const max = Math.max(1, ...donnees.map((d) => d.valeur))
  const actif = survol !== null ? donnees[survol] : null

  return (
    <figure className="relative">
      <div className="relative" style={{ height: hauteur }} onMouseLeave={() => setSurvol(null)}>
        {/* Deux lignes de repère, discrètes. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-primary/10" />
        <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-primary/10" />
        <span className="pointer-events-none absolute -top-2 right-0 text-[10px] font-bold text-muted-foreground tabular-nums">{format(max)}</span>
        <div className="flex h-full items-end gap-[2px]" aria-hidden="true">
          {donnees.map((d, i) => (
            <div key={d.cle} className="flex h-full flex-1 items-end" onMouseEnter={() => setSurvol(i)}>
              <div
                className={cn('w-full rounded-t-[4px] transition-opacity', survol === null || survol === i ? 'bg-primary' : 'bg-primary/40')}
                style={{ height: `${d.valeur > 0 ? Math.max(2, (d.valeur / max) * 100) : 0}%` }}
              />
            </div>
          ))}
        </div>
        {actif ? (
          <div
            className="pointer-events-none absolute -top-1 z-10 -translate-x-1/2 -translate-y-full rounded-xl bg-foreground px-2.5 py-1.5 text-xs whitespace-nowrap text-background shadow-lg"
            style={{ left: `${((survol! + 0.5) / donnees.length) * 100}%` }}
          >
            <span className="font-bold">{actif.etiquette}</span> · <span className="tabular-nums">{format(actif.valeur)}</span>
            {actif.detail ? <span className="block opacity-75">{actif.detail}</span> : null}
          </div>
        ) : null}
      </div>
      <div className="mt-1 flex gap-[2px]" aria-hidden="true">
        {donnees.map((d, i) => (
          <span key={d.cle} className="flex-1 truncate text-center text-[10px] font-semibold text-muted-foreground">
            {i % etiquettesTous === 0 ? d.etiquette : ''}
          </span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{titre}</caption>
        <tbody>
          {donnees.map((d) => (
            <tr key={d.cle}>
              <th scope="row">{d.etiquette}</th>
              <td>{format(d.valeur)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
