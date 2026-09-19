import type { DocHorloge, DocSolide } from '@/lib/exercices/types'
import s from '../manuel.module.css'

/** L'HORLOGE — un cadran à aiguilles, et l'heure en chiffres si on la demande. */
export function Horloge({ doc }: { doc: DocHorloge }) {
  const m = doc.minutes
  const h = doc.heures % 12
  const angleM = (m / 60) * 360
  const angleH = ((h + m / 60) / 12) * 360
  const aiguille = (angle: number, long: number) => {
    const a = ((angle - 90) * Math.PI) / 180
    return [100 + long * Math.cos(a), 100 + long * Math.sin(a)]
  }
  const [hx, hy] = aiguille(angleH, 46)
  const [mx, my] = aiguille(angleM, 70)
  return (
    <figure className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className={s.svg} style={{ maxWidth: '12rem' }} role="img" aria-label={doc.titre ?? 'Horloge'}>
        <circle cx={100} cy={100} r={94} style={{ fill: '#fff', stroke: 'var(--foreground)' }} strokeWidth={5} />
        {Array.from({ length: 60 }, (_, i) => {
          const a = (i * 6 - 90) * (Math.PI / 180)
          const grand = i % 5 === 0
          return (
            <line
              key={i}
              x1={100 + (grand ? 76 : 82) * Math.cos(a)}
              y1={100 + (grand ? 76 : 82) * Math.sin(a)}
              x2={100 + 87 * Math.cos(a)}
              y2={100 + 87 * Math.sin(a)}
              style={{ stroke: 'var(--foreground)' }}
              strokeWidth={grand ? 3 : 1.2}
            />
          )
        })}
        {Array.from({ length: 12 }, (_, i) => {
          const n = i + 1
          const a = (n * 30 - 90) * (Math.PI / 180)
          return (
            <text key={n} x={100 + 62 * Math.cos(a)} y={100 + 62 * Math.sin(a) + 6} fontSize={17} fontWeight={800} textAnchor="middle" style={{ fill: 'var(--foreground)' }}>
              {n}
            </text>
          )
        })}
        <line x1={100} y1={100} x2={hx} y2={hy} style={{ stroke: 'var(--foreground)' }} strokeWidth={7} strokeLinecap="round" />
        <line x1={100} y1={100} x2={mx} y2={my} style={{ stroke: 'var(--t-corail)' }} strokeWidth={4} strokeLinecap="round" />
        <circle cx={100} cy={100} r={6} style={{ fill: 'var(--foreground)' }} />
      </svg>
      {doc.numerique ? (
        <p className="mt-2 rounded-lg bg-[var(--foreground)] px-3 py-1 font-mono text-lg font-bold tracking-widest text-white tabular-nums">
          {String(doc.heures).padStart(2, '0')}:{String(doc.minutes).padStart(2, '0')}
        </p>
      ) : null}
    </figure>
  )
}

/**
 * LE PAVÉ DROIT en perspective cavalière (fuyantes à 45°, réduites de moitié),
 * avec ses cubes-unités si on veut les compter, et ses dimensions.
 */
export function Solide({ doc }: { doc: DocSolide }) {
  const L = doc.longueur
  const l = doc.largeur
  const h = doc.hauteur
  const k = Math.min(220 / (L + l * 0.5), 180 / (h + l * 0.5))
  const fx = 0.5 * Math.cos(Math.PI / 4) * k
  const fy = 0.5 * Math.sin(Math.PI / 4) * k
  const ox = 30
  const oy = 20 + l * fy + h * k
  const P = (x: number, y: number, z: number): [number, number] => [ox + x * k + z * fx, oy - y * k - z * fy]
  const poly = (pts: [number, number][]) => pts.map((p) => p.join(',')).join(' ')
  const W = ox + L * k + l * fx + 40
  const H = oy + 30
  const lignes: [number, number, number, number][] = []
  if (doc.cubes) {
    for (let x = 1; x < L; x++) {
      lignes.push([...P(x, 0, 0), ...P(x, h, 0)], [...P(x, h, 0), ...P(x, h, l)])
    }
    for (let y = 1; y < h; y++) {
      lignes.push([...P(0, y, 0), ...P(L, y, 0)], [...P(L, y, 0), ...P(L, y, l)])
    }
    for (let z = 1; z < l; z++) {
      lignes.push([...P(0, h, z), ...P(L, h, z)], [...P(L, 0, z), ...P(L, h, z)])
    }
  }
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className={s.svg} style={{ maxWidth: '22rem', margin: '0 auto' }} role="img" aria-label={doc.titre ?? 'Pavé droit'}>
        <polygon points={poly([P(0, 0, 0), P(L, 0, 0), P(L, h, 0), P(0, h, 0)])} style={{ fill: 'color-mix(in oklch, var(--t-bleu), white 78%)', stroke: 'var(--foreground)' }} strokeWidth={1.8} />
        <polygon points={poly([P(0, h, 0), P(L, h, 0), P(L, h, l), P(0, h, l)])} style={{ fill: 'color-mix(in oklch, var(--t-bleu), white 88%)', stroke: 'var(--foreground)' }} strokeWidth={1.8} />
        <polygon points={poly([P(L, 0, 0), P(L, 0, l), P(L, h, l), P(L, h, 0)])} style={{ fill: 'color-mix(in oklch, var(--t-bleu), white 66%)', stroke: 'var(--foreground)' }} strokeWidth={1.8} />
        {/* Les arêtes cachées, en pointillés. */}
        <line x1={P(0, 0, l)[0]} y1={P(0, 0, l)[1]} x2={P(L, 0, l)[0]} y2={P(L, 0, l)[1]} style={{ stroke: 'var(--foreground)' }} strokeWidth={1.2} strokeDasharray="4 3" />
        <line x1={P(0, 0, l)[0]} y1={P(0, 0, l)[1]} x2={P(0, h, l)[0]} y2={P(0, h, l)[1]} style={{ stroke: 'var(--foreground)' }} strokeWidth={1.2} strokeDasharray="4 3" />
        <line x1={P(0, 0, 0)[0]} y1={P(0, 0, 0)[1]} x2={P(0, 0, l)[0]} y2={P(0, 0, l)[1]} style={{ stroke: 'var(--foreground)' }} strokeWidth={1.2} strokeDasharray="4 3" />
        {lignes.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: 'color-mix(in oklch, var(--foreground), transparent 55%)' }} strokeWidth={1} />
        ))}
        {doc.cotes ? (
          <g fontSize={13} fontWeight={800} style={{ fill: 'var(--t-bleu)' }}>
            <text x={(P(0, 0, 0)[0] + P(L, 0, 0)[0]) / 2} y={P(0, 0, 0)[1] + 18} textAnchor="middle">
              {L}
              {doc.unite ? ` ${doc.unite}` : ''}
            </text>
            <text x={P(0, 0, 0)[0] - 8} y={(P(0, 0, 0)[1] + P(0, h, 0)[1]) / 2 + 4} textAnchor="end">
              {h}
              {doc.unite ? ` ${doc.unite}` : ''}
            </text>
            <text x={(P(L, 0, 0)[0] + P(L, 0, l)[0]) / 2 + 10} y={(P(L, 0, 0)[1] + P(L, 0, l)[1]) / 2 + 12}>
              {l}
              {doc.unite ? ` ${doc.unite}` : ''}
            </text>
          </g>
        ) : null}
      </svg>
    </figure>
  )
}
