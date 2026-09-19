import type { ReactNode } from 'react'
import type { Composant, DocCircuit } from '@/lib/exercices/types'
import { etatCible, fondCible, propsCible, traitCible, type ZonesDoc } from '../commun'
import s from '../manuel.module.css'

/**
 * LE SCHÉMA DE CIRCUIT — les symboles normalisés qu'on apprend au collège :
 * pile (le grand trait est la borne +), lampe (un cercle barré d'une croix),
 * interrupteur ouvert ou fermé, moteur (M), DEL et diode, résistance,
 * ampèremètre (A), voltmètre (V), générateur (G). Les fils suivent le
 * quadrillage ; les points de dérivation se posent tout seuls là où se
 * rejoignent trois fils ou plus.
 */

const K = 40 // un carreau du quadrillage, en unités SVG

/** La demi-largeur du symbole le long de son fil (le fil s'arrête là). */
const DEMI: Record<Composant, number> = {
  pile: 4,
  lampe: 12,
  'interrupteur-ouvert': 13,
  'interrupteur-ferme': 13,
  moteur: 12,
  del: 10,
  diode: 10,
  resistance: 14,
  amperemetre: 12,
  voltmetre: 12,
  generateur: 12,
  buzzer: 12,
}

/** Les signes + et − de la pile, posés droits (le texte ne tourne pas avec le symbole). */
function SignesPile({ angle }: { angle: number }) {
  const r = (angle * Math.PI) / 180
  const tourner = ([x, y]: [number, number]) => [x * Math.cos(r) - y * Math.sin(r), x * Math.sin(r) + y * Math.cos(r)]
  const [px, py] = tourner([-11, -14])
  const [mx, my] = tourner([11, -14])
  return (
    <>
      <text x={px} y={py + 5} fontSize={14} fontWeight={800} textAnchor="middle" style={{ fill: 'var(--t-corail)' }}>
        +
      </text>
      <text x={mx} y={my + 5} fontSize={14} fontWeight={800} textAnchor="middle" style={{ fill: 'var(--t-bleu)' }}>
        −
      </text>
    </>
  )
}

function Symbole({ c, allume, trait }: { c: Composant; allume?: boolean; trait: React.CSSProperties }): ReactNode {
  const encre = { stroke: 'var(--foreground)', ...trait }
  const cercle = (lettre: string) => (
    <>
      <circle r={12} style={{ fill: '#fff', ...encre }} strokeWidth={2} />
      <text y={5} fontSize={14} fontWeight={800} textAnchor="middle" style={{ fill: 'var(--foreground)' }}>
        {lettre}
      </text>
    </>
  )
  switch (c) {
    case 'pile':
      return (
        <>
          <line x1={-4} y1={-15} x2={-4} y2={15} style={encre} strokeWidth={2} />
          <line x1={4} y1={-8} x2={4} y2={8} style={encre} strokeWidth={5} />
        </>
      )
    case 'lampe':
      return (
        <>
          {allume
            ? [0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <line
                  key={a}
                  x1={16 * Math.cos((a * Math.PI) / 180)}
                  y1={16 * Math.sin((a * Math.PI) / 180)}
                  x2={21 * Math.cos((a * Math.PI) / 180)}
                  y2={21 * Math.sin((a * Math.PI) / 180)}
                  style={{ stroke: 'var(--t-jaune)' }}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
              ))
            : null}
          <circle r={12} style={{ fill: allume ? 'color-mix(in oklch, var(--t-jaune), white 45%)' : '#fff', ...encre }} strokeWidth={2} />
          <line x1={-8.5} y1={-8.5} x2={8.5} y2={8.5} style={encre} strokeWidth={2} />
          <line x1={-8.5} y1={8.5} x2={8.5} y2={-8.5} style={encre} strokeWidth={2} />
        </>
      )
    case 'interrupteur-ouvert':
      return (
        <>
          <circle cx={-13} r={2.6} style={{ fill: 'var(--foreground)' }} />
          <circle cx={13} r={2.6} style={{ fill: 'var(--foreground)' }} />
          <line x1={-13} y1={0} x2={10} y2={-12} style={encre} strokeWidth={2.2} strokeLinecap="round" />
        </>
      )
    case 'interrupteur-ferme':
      return (
        <>
          <circle cx={-13} r={2.6} style={{ fill: 'var(--foreground)' }} />
          <circle cx={13} r={2.6} style={{ fill: 'var(--foreground)' }} />
          <line x1={-13} y1={0} x2={13} y2={-1} style={encre} strokeWidth={2.2} strokeLinecap="round" />
        </>
      )
    case 'moteur':
      return (
        <>
          {cercle('M')}
          {allume ? <path d="M-9 -17 A 18 18 0 0 1 9 -17" fill="none" style={{ stroke: 'var(--t-bleu)' }} strokeWidth={1.8} markerEnd="" /> : null}
        </>
      )
    case 'del':
    case 'diode':
      return (
        <>
          <path d="M-9 -10 L-9 10 L8 0 Z" style={{ fill: c === 'del' && allume ? 'color-mix(in oklch, var(--t-corail), white 40%)' : '#fff', ...encre }} strokeWidth={2} strokeLinejoin="round" />
          <line x1={8} y1={-10} x2={8} y2={10} style={encre} strokeWidth={2.2} />
          {c === 'del' ? (
            <g style={{ stroke: allume ? 'var(--t-corail)' : 'var(--foreground)' }} strokeWidth={1.6} fill="none">
              <path d="M1 -12 L8 -20 M8 -20 L4 -19 M8 -20 L7 -16" />
              <path d="M6 -9 L13 -17 M13 -17 L9 -16 M13 -17 L12 -13" />
            </g>
          ) : null}
        </>
      )
    case 'resistance':
      return <rect x={-14} y={-6.5} width={28} height={13} style={{ fill: '#fff', ...encre }} strokeWidth={2} />
    case 'amperemetre':
      return cercle('A')
    case 'voltmetre':
      return cercle('V')
    case 'generateur':
      return cercle('G')
    case 'buzzer':
      return (
        <>
          <rect x={-12} y={-9} width={24} height={18} rx={3} style={{ fill: '#fff', ...encre }} strokeWidth={2} />
          <text y={5} fontSize={13} textAnchor="middle" style={{ fill: 'var(--foreground)' }}>
            ♪
          </text>
        </>
      )
  }
}

export function Circuit({ doc, zones }: { doc: DocCircuit; zones?: ZonesDoc }) {
  const xs = doc.branches.flatMap((b) => [b.de[0], b.a[0]])
  const ys = doc.branches.flatMap((b) => [b.de[1], b.a[1]])
  const x0 = Math.min(...xs) - 1
  const y0 = Math.min(...ys) - 1
  const W = (Math.max(...xs) - x0 + 1) * K
  const H = (Math.max(...ys) - y0 + 1) * K
  const P = ([x, y]: [number, number]): [number, number] => [(x - x0) * K, (y - y0) * K]

  // Les nœuds où se rejoignent trois fils ou plus : un point de dérivation.
  const degre = new Map<string, number>()
  for (const b of doc.branches) for (const p of [b.de, b.a]) degre.set(p.join(','), (degre.get(p.join(',')) ?? 0) + 1)
  const noeuds = [...degre.entries()].filter(([, n]) => n >= 3).map(([k]) => k.split(',').map(Number) as [number, number])

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className={s.svg} style={{ maxWidth: `${Math.max(W * 1.1, 240)}px`, margin: '0 auto' }} role="img" aria-label={doc.titre ?? 'Schéma électrique'}>
        {doc.branches.map((b, i) => {
          const [ax, ay] = P(b.de)
          const [bx, by] = P(b.a)
          const trait = { stroke: 'var(--foreground)' }
          if (!b.composant)
            return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} style={trait} strokeWidth={2} strokeLinecap="round" />
          const mx = (ax + bx) / 2
          const my = (ay + by) / 2
          const horizontal = ay === by
          const sens = horizontal ? Math.sign(bx - ax) : Math.sign(by - ay)
          const demi = DEMI[b.composant]
          const etat = etatCible(b.id, zones)
          // Le fil, coupé autour du symbole.
          const [c1x, c1y] = horizontal ? [mx - sens * demi, my] : [mx, my - sens * demi]
          const [c2x, c2y] = horizontal ? [mx + sens * demi, my] : [mx, my + sens * demi]
          const angle = horizontal ? (sens > 0 ? 0 : 180) : sens > 0 ? 90 : 270
          return (
            <g key={i}>
              <line x1={ax} y1={ay} x2={c1x} y2={c1y} style={trait} strokeWidth={2} strokeLinecap="round" />
              <line x1={c2x} y1={c2y} x2={bx} y2={by} style={trait} strokeWidth={2} strokeLinecap="round" />
              <g
                transform={`translate(${mx} ${my})`}
                className={zones?.actif && b.id ? s.cible : undefined}
                {...propsCible(b.id, zones, b.nom ?? b.composant)}
              >
                {zones?.actif && b.id ? <circle r={20} fill="transparent" /> : null}
                {etat ? <circle r={20} style={{ fill: fondCible(etat), ...traitCible(etat) }} /> : null}
                {/* La pile garde son sens : on ne la retourne pas, on la tourne. */}
                <g transform={`rotate(${b.composant === 'pile' ? angle : horizontal ? 0 : 90})`}>
                  <Symbole c={b.composant} allume={b.allume} trait={{}} />
                </g>
                {b.composant === 'pile' ? <SignesPile angle={angle} /> : null}
                {b.nom ? (
                  <text
                    x={horizontal ? 0 : 20}
                    y={horizontal ? 30 : 5}
                    fontSize={13}
                    fontWeight={800}
                    textAnchor={horizontal ? 'middle' : 'start'}
                    style={{ fill: 'var(--t-bleu)' }}
                  >
                    {b.nom}
                  </text>
                ) : null}
              </g>
            </g>
          )
        })}
        {noeuds.map(([x, y]) => {
          const [px, py] = P([x, y])
          return <circle key={`${x},${y}`} cx={px} cy={py} r={4} style={{ fill: 'var(--foreground)' }} />
        })}
      </svg>
    </figure>
  )
}
