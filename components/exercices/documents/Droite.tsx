import { graduations, idGraduation } from '@/lib/exercices/zones'
import type { DocDroite } from '@/lib/exercices/types'
import { couleur, etatCible, fondCible, nombreFr, propsCible, traitCible, type ZonesDoc } from '../commun'
import s from '../manuel.module.css'

/**
 * LA DROITE GRADUÉE — graduations principales numérotées, fines entre elles,
 * points repérés par une lettre au-dessus. Quand la question le demande,
 * CHAQUE graduation se touche : c'est « place le nombre 2,7 ».
 */
export function Droite({ doc, zones }: { doc: DocDroite; zones?: ZonesDoc }) {
  const W = 340
  const G = 18
  const D = 26
  const Y = 44
  const x = (v: number) => G + ((v - doc.min) / (doc.max - doc.min)) * (W - G - D)
  const toutes = graduations(doc)
  const principales = new Set(graduations({ ...doc, division: 1 }).map((v) => idGraduation(v)))
  const numerotees = doc.etiquettes ? new Set(doc.etiquettes.map(idGraduation)) : principales
  const cliquables = doc.graduationsCliquables && zones?.actif
  const pas = (W - G - D) / Math.max(1, toutes.length - 1)
  return (
    <figure>
      <svg viewBox={`0 0 ${W} 80`} className={s.svg} role="img" aria-label={doc.titre ?? 'Droite graduée'}>
        <defs>
          <marker id={`${doc.id}-d`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0L10 5L0 10z" style={{ fill: 'var(--foreground)' }} />
          </marker>
        </defs>
        <line x1={G - 10} x2={W - 6} y1={Y} y2={Y} style={{ stroke: 'var(--foreground)' }} strokeWidth={2} markerEnd={`url(#${doc.id}-d)`} />
        {toutes.map((v) => {
          const id = idGraduation(v)
          const grande = principales.has(id)
          const etat = etatCible(id, zones)
          return (
            <g key={id} className={cliquables ? s.cible : undefined} {...(cliquables ? propsCible(id, zones, nombreFr(v)) : {})}>
              {cliquables ? <rect x={x(v) - pas / 2} y={Y - 22} width={pas} height={40} fill="transparent" /> : null}
              {etat ? <circle cx={x(v)} cy={Y} r={6.5} style={{ fill: fondCible(etat), ...traitCible(etat) }} /> : null}
              <line x1={x(v)} x2={x(v)} y1={Y - (grande ? 8 : 4.5)} y2={Y + (grande ? 8 : 4.5)} style={{ stroke: 'var(--foreground)' }} strokeWidth={grande ? 1.8 : 1.1} />
              {numerotees.has(id) ? (
                <text x={x(v)} y={Y + 24} fontSize={12} fontWeight={700} textAnchor="middle" style={{ fill: 'var(--foreground)' }}>
                  {nombreFr(v)}
                </text>
              ) : null}
            </g>
          )
        })}
        {(doc.points ?? []).map((p) => {
          const etat = etatCible(p.id, zones)
          return (
            <g key={p.id} className={zones?.actif ? s.cible : undefined} {...propsCible(p.id, zones, `Point ${p.nom}`)}>
              {zones?.actif ? <circle cx={x(p.valeur)} cy={Y - 16} r={13} fill="transparent" /> : null}
              <path d={`M${x(p.valeur)} ${Y - 2}l-5 -9h10z`} style={{ fill: fondCible(etat) ?? couleur(p.teinte, 'violet'), ...traitCible(etat) }} />
              <text x={x(p.valeur)} y={Y - 16} fontSize={13} fontWeight={800} textAnchor="middle" style={{ fill: couleur(p.teinte, 'violet') }}>
                {p.nom}
              </text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
