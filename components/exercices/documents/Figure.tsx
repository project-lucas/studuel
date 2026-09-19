import type { DocFigure, Position } from '@/lib/exercices/types'
import { couleur, couleurClaire, etatCible, fondCible, propsCible, traitCible, type ZonesDoc } from '../commun'
import s from '../manuel.module.css'

/**
 * LA FIGURE DE GÉOMÉTRIE — sur le quadrillage du cahier : points en croix,
 * segments codés (les petits traits des longueurs égales), droites prolongées
 * jusqu'au bord, arcs d'angle et angle droit, axe de symétrie en trait mixte.
 * Coordonnées en unités (un carreau = une unité), y vers le haut comme en
 * maths ; c'est ici qu'on retourne l'axe pour le SVG.
 */

const DECALAGES: Record<Position, [number, number, 'start' | 'middle' | 'end']> = {
  n: [0, -1, 'middle'],
  ne: [0.7, -0.7, 'start'],
  e: [1, 0.35, 'start'],
  se: [0.7, 1, 'start'],
  s: [0, 1.25, 'middle'],
  so: [-0.7, 1, 'end'],
  o: [-1, 0.35, 'end'],
  no: [-0.7, -0.7, 'end'],
}

export function Figure({ doc, zones }: { doc: DocFigure; zones?: ZonesDoc }) {
  const { xmin, xmax, ymin, ymax } = doc.cadre
  let k = 320 / (xmax - xmin)
  if ((ymax - ymin) * k > 340) k = 340 / (ymax - ymin)
  const W = (xmax - xmin) * k
  const H = (ymax - ymin) * k
  const X = (x: number) => (x - xmin) * k
  const Y = (y: number) => (ymax - y) * k
  const pts = new Map((doc.points ?? []).map((p) => [p.id, p] as const))
  const P = (id: string): [number, number] => {
    const p = pts.get(id)
    return p ? [X(p.x), Y(p.y)] : [0, 0]
  }
  const police = 13
  const trait = 1.8

  /** Prolonge la droite (a, b) jusqu'aux bords du cadre (dans un seul sens si `demi`). */
  const prolonger = (a: [number, number], b: [number, number], demi = false): [number, number, number, number] => {
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const ts: number[] = []
    if (dx !== 0) ts.push(-a[0] / dx, (W - a[0]) / dx)
    if (dy !== 0) ts.push(-a[1] / dy, (H - a[1]) / dy)
    const valides = ts.filter((t) => {
      const x = a[0] + t * dx
      const y = a[1] + t * dy
      return x >= -0.5 && x <= W + 0.5 && y >= -0.5 && y <= H + 0.5
    })
    const tMax = Math.max(...valides)
    const tMin = demi ? 0 : Math.min(...valides)
    return [a[0] + tMin * dx, a[1] + tMin * dy, a[0] + tMax * dx, a[1] + tMax * dy]
  }

  return (
    <figure>
      <svg viewBox={`-8 -8 ${W + 16} ${H + 16}`} className={s.svg} role="img" aria-label={doc.titre ?? 'Figure'}>
        {doc.quadrillage ? (
          <g aria-hidden="true">
            {Array.from({ length: Math.floor(xmax) - Math.ceil(xmin) + 1 }, (_, i) => Math.ceil(xmin) + i).map((x) => (
              <line key={`x${x}`} x1={X(x)} x2={X(x)} y1={0} y2={H} style={{ stroke: 'color-mix(in oklch, var(--t-bleu), white 78%)' }} strokeWidth={0.8} />
            ))}
            {Array.from({ length: Math.floor(ymax) - Math.ceil(ymin) + 1 }, (_, i) => Math.ceil(ymin) + i).map((y) => (
              <line key={`y${y}`} x1={0} x2={W} y1={Y(y)} y2={Y(y)} style={{ stroke: 'color-mix(in oklch, var(--t-bleu), white 78%)' }} strokeWidth={0.8} />
            ))}
          </g>
        ) : null}
        {doc.axes ? (
          <g aria-hidden="true">
            <line x1={0} x2={W} y1={Y(0)} y2={Y(0)} style={{ stroke: 'var(--foreground)' }} strokeWidth={1.4} />
            <line x1={X(0)} x2={X(0)} y1={0} y2={H} style={{ stroke: 'var(--foreground)' }} strokeWidth={1.4} />
            {Array.from({ length: Math.floor(xmax) - Math.ceil(xmin) + 1 }, (_, i) => Math.ceil(xmin) + i)
              .filter((x) => x !== 0)
              .map((x) => (
                <text key={x} x={X(x)} y={Y(0) + 13} fontSize={10} textAnchor="middle" style={{ fill: 'var(--encre-douce)' }}>
                  {x}
                </text>
              ))}
            {Array.from({ length: Math.floor(ymax) - Math.ceil(ymin) + 1 }, (_, i) => Math.ceil(ymin) + i)
              .filter((y) => y !== 0)
              .map((y) => (
                <text key={y} x={X(0) - 5} y={Y(y) + 3.5} fontSize={10} textAnchor="end" style={{ fill: 'var(--encre-douce)' }}>
                  {y}
                </text>
              ))}
          </g>
        ) : null}

        {(doc.polygones ?? []).map((p, i) => {
          const etat = etatCible(p.id, zones)
          return (
            <polygon
              key={i}
              points={p.sommets.map((id) => P(id).join(',')).join(' ')}
              className={zones?.actif && p.id ? s.cible : undefined}
              {...propsCible(p.id, zones, `Polygone ${p.sommets.join('')}`)}
              style={{
                fill: fondCible(etat) ?? (p.motif === 'aucun' ? 'none' : couleurClaire(p.teinte, 'violet', 80)),
                stroke: couleur(p.teinte, 'encre'),
                ...traitCible(etat),
              }}
              strokeWidth={trait}
              strokeLinejoin="round"
            />
          )
        })}

        {(doc.cercles ?? []).map((c, i) => {
          const [cx, cy] = P(c.centre)
          const etat = etatCible(c.id, zones)
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={c.rayon * k}
              fill="none"
              className={zones?.actif && c.id ? s.cible : undefined}
              {...propsCible(c.id, zones, `Cercle de centre ${c.centre}`)}
              style={{ stroke: couleur(c.teinte, 'encre'), ...traitCible(etat) }}
              strokeWidth={trait}
              strokeDasharray={c.style === 'pointilles' ? '5 4' : undefined}
            />
          )
        })}

        {(doc.droites ?? []).map((d, i) => {
          const [x1, y1, x2, y2] = prolonger(P(d.par[0]), P(d.par[1]))
          const etat = etatCible(d.id, zones)
          const axe = d.style === 'axe'
          return (
            <g key={i} className={zones?.actif && d.id ? s.cible : undefined} {...propsCible(d.id, zones, `Droite ${d.nom ?? d.par.join('')}`)}>
              {zones?.actif && d.id ? <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={16} /> : null}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                style={{ stroke: couleur(d.teinte, axe ? 'corail' : 'encre'), ...traitCible(etat) }}
                strokeWidth={trait}
                strokeDasharray={axe ? '10 4 2 4' : d.style === 'pointilles' ? '5 4' : undefined}
              />
              {d.nom ? (
                <text x={x2 + (x2 > W - 20 ? -14 : 6)} y={y2 + (y2 < 12 ? 14 : -6)} fontSize={police} fontStyle="italic" fontWeight={700} style={{ fill: couleur(d.teinte, axe ? 'corail' : 'encre') }}>
                  {d.nom}
                </text>
              ) : null}
            </g>
          )
        })}

        {(doc.demiDroites ?? []).map((d, i) => {
          const [x1, y1, x2, y2] = prolonger(P(d.origine), P(d.par), true)
          const etat = etatCible(d.id, zones)
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className={zones?.actif && d.id ? s.cible : undefined} {...propsCible(d.id, zones, `Demi-droite [${d.origine}${d.par})`)} style={{ stroke: couleur(d.teinte, 'encre'), ...traitCible(etat) }} strokeWidth={trait} />
          )
        })}

        {(doc.segments ?? []).map((sg, i) => {
          const [x1, y1] = P(sg.de)
          const [x2, y2] = P(sg.a)
          const etat = etatCible(sg.id, zones)
          const mx = (x1 + x2) / 2
          const my = (y1 + y2) / 2
          const L = Math.hypot(x2 - x1, y2 - y1) || 1
          const nx = -(y2 - y1) / L
          const ny = (x2 - x1) / L
          const tx = (x2 - x1) / L
          const ty = (y2 - y1) / L
          return (
            <g key={i} className={zones?.actif && sg.id ? s.cible : undefined} {...propsCible(sg.id, zones, `Segment [${sg.de}${sg.a}]`)}>
              {zones?.actif && sg.id ? <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={16} /> : null}
              <line x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: couleur(sg.teinte, 'encre'), ...traitCible(etat) }} strokeWidth={trait + 0.2} strokeDasharray={sg.style === 'pointilles' ? '5 4' : undefined} strokeLinecap="round" />
              {sg.codage
                ? Array.from({ length: sg.codage }, (_, j) => {
                    const off = (j - (sg.codage! - 1) / 2) * 4
                    const cx = mx + tx * off
                    const cy = my + ty * off
                    return <line key={j} x1={cx + nx * 5} y1={cy + ny * 5} x2={cx - nx * 5} y2={cy - ny * 5} style={{ stroke: couleur(sg.teinte, 'encre') }} strokeWidth={1.5} />
                  })
                : null}
              {sg.longueur ? (
                <text x={mx + nx * 13} y={my + ny * 13 + 4} fontSize={police - 1} fontWeight={700} textAnchor="middle" style={{ fill: 'var(--t-bleu)', paintOrder: 'stroke', stroke: '#fffdf8', strokeWidth: 3 }}>
                  {sg.longueur}
                </text>
              ) : null}
            </g>
          )
        })}

        {(doc.angles ?? []).map((a, i) => {
          const [sx, sy] = P(a.sommet)
          const [ax, ay] = P(a.de)
          const [bx, by] = P(a.a)
          const a0 = Math.atan2(ay - sy, ax - sx)
          const a1 = Math.atan2(by - sy, bx - sx)
          let delta = a1 - a0
          while (delta <= -Math.PI) delta += 2 * Math.PI
          while (delta > Math.PI) delta -= 2 * Math.PI
          const r = 20
          const etat = etatCible(a.id, zones)
          const t = couleur(a.teinte, 'violet')
          if (a.droit) {
            const u1 = [Math.cos(a0), Math.sin(a0)]
            const u2 = [Math.cos(a1), Math.sin(a1)]
            const c = 11
            const d = `M${sx + u1[0] * c} ${sy + u1[1] * c}L${sx + (u1[0] + u2[0]) * c} ${sy + (u1[1] + u2[1]) * c}L${sx + u2[0] * c} ${sy + u2[1] * c}`
            return <path key={i} d={d} fill="none" style={{ stroke: t, ...traitCible(etat) }} strokeWidth={1.6} className={zones?.actif && a.id ? s.cible : undefined} {...propsCible(a.id, zones, `Angle ${a.de}${a.sommet}${a.a}`)} />
          }
          const fin = a0 + delta
          const x0 = sx + r * Math.cos(a0)
          const y0 = sy + r * Math.sin(a0)
          const x1 = sx + r * Math.cos(fin)
          const y1 = sy + r * Math.sin(fin)
          const milieu = a0 + delta / 2
          return (
            <g key={i} className={zones?.actif && a.id ? s.cible : undefined} {...propsCible(a.id, zones, `Angle ${a.de}${a.sommet}${a.a}`)}>
              <path d={`M${sx} ${sy}L${x0} ${y0}A${r} ${r} 0 0 ${delta > 0 ? 1 : 0} ${x1} ${y1}Z`} style={{ fill: fondCible(etat) ?? couleurClaire(a.teinte, 'violet', 75), stroke: t, ...traitCible(etat) }} strokeWidth={1.4} />
              {a.mesure ? (
                <text x={sx + (r + 14) * Math.cos(milieu)} y={sy + (r + 14) * Math.sin(milieu) + 4} fontSize={police - 1} fontWeight={800} textAnchor="middle" style={{ fill: t, paintOrder: 'stroke', stroke: '#fffdf8', strokeWidth: 3 }}>
                  {a.mesure}
                </text>
              ) : null}
            </g>
          )
        })}

        {(doc.textes ?? []).map((t, i) => (
          <text key={i} x={X(t.x)} y={Y(t.y)} fontSize={police} fontWeight={700} textAnchor="middle" style={{ fill: couleur(t.teinte, 'encre') }}>
            {t.texte}
          </text>
        ))}

        {(doc.points ?? []).map((p) => {
          if (p.cache) return null
          const x = X(p.x)
          const y = Y(p.y)
          const etat = etatCible(p.id, zones)
          const [dx, dy, ancre] = DECALAGES[p.position ?? 'ne']
          return (
            <g key={p.id} className={zones?.actif ? s.cible : undefined} {...propsCible(p.id, zones, `Point ${p.nom ?? p.id}`)}>
              {zones?.actif ? <circle cx={x} cy={y} r={14} fill="transparent" /> : null}
              {etat ? <circle cx={x} cy={y} r={9} style={{ fill: fondCible(etat), ...traitCible(etat) }} /> : null}
              <path d={`M${x - 4} ${y - 4}L${x + 4} ${y + 4}M${x - 4} ${y + 4}L${x + 4} ${y - 4}`} style={{ stroke: 'var(--foreground)' }} strokeWidth={1.8} strokeLinecap="round" />
              <text x={x + dx * 11} y={y + dy * 11 + 4} fontSize={police + 1} fontWeight={800} textAnchor={ancre} style={{ fill: 'var(--foreground)', paintOrder: 'stroke', stroke: '#fffdf8', strokeWidth: 3 }}>
                {p.nom ?? p.id}
              </text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}
