import type { DocTableau } from '@/lib/exercices/types'
import { cn } from '@/lib/utils'
import { etatCible, Inline, type ZonesDoc } from '../commun'
import s from '../manuel.module.css'

/** Un tableau de manuel : en-tête teinté, coins arrondis, cases touchables. */
export function Tableau({ doc, zones }: { doc: DocTableau; zones?: ZonesDoc }) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1">
      <table className={s.tableau}>
        <thead>
          <tr>
            {doc.colonnes.map((c, j) => (
              <th key={j} scope="col">
                <Inline texte={c} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {doc.lignes.map((ligne, i) => (
            <tr key={i}>
              {ligne.map((v, j) => {
                const id = `r${i}c${j}`
                const etat = etatCible(id, zones)
                const texte = typeof v === 'number' ? String(v).replace('.', ',') : v
                const Cell = doc.enteteLignes && j === 0 ? 'th' : 'td'
                const touche = zones?.actif
                return (
                  <Cell
                    key={j}
                    scope={Cell === 'th' ? 'row' : undefined}
                    className={cn(
                      touche && s.caseTouchable,
                      etat === 'choisie' && s.caseChoisie,
                      etat === 'juste' && s.caseJuste,
                      etat === 'fausse' && s.caseFausse,
                      texte === '?' && 'font-extrabold text-[var(--t-violet)]',
                    )}
                    {...(touche
                      ? {
                          role: 'button',
                          tabIndex: 0,
                          'aria-pressed': zones.choisies.has(id),
                          onClick: () => zones.basculer(id),
                          onKeyDown: (e: React.KeyboardEvent) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              zones.basculer(id)
                            }
                          },
                        }
                      : {})}
                  >
                    <Inline texte={texte} />
                  </Cell>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
