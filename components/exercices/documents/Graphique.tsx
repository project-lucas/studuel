import type { DocGraphique, Teinte } from '@/lib/exercices/types'
import { cn } from '@/lib/utils'
import { couleur, etatCible, fondCible, nombreFr, propsCible, traitCible, type ZonesDoc } from '../commun'
import s from '../manuel.module.css'

/**
 * LE GRAPHIQUE — dessiné à la main plutôt qu'avec une bibliothèque : il doit
 * ressembler à celui d'un manuel (axes fléchés, graduations nettes, valeurs
 * lisibles au doigt), se toucher barre par barre, et le diagramme climatique
 * (précipitations en barres, températures en courbe, P = 2T) n'existe dans
 * aucune bibliothèque de graphiques.
 */

const TEINTES_SERIES: Teinte[] = ['bleu', 'corail', 'vert']
const TEINTES_SECTEURS: Teinte[] = ['bleu', 'corail', 'jaune', 'vert', 'violet', 'turquoise', 'ambre', 'rose', 'gris', 'brun']

const W = 360
const POLICE = 11

/** Un pas « rond » (1, 2, 5 × 10ⁿ) pour environ `n` graduations. */
export function pasRond(etendue: number, n = 5): number {
  if (!(etendue > 0)) return 1
  const brut = etendue / n
  const p = Math.pow(10, Math.floor(Math.log10(brut)))
  const r = brut / p
  return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 2.5 ? 2.5 : r <= 5 ? 5 : 10) * p
}

function echelleY(doc: DocGraphique, valeurs: number[]) {
  const vmax = Math.max(0, ...valeurs)
  const vmin = Math.min(0, ...valeurs)
  const pas = doc.axeY?.pas ?? pasRond((doc.axeY?.max ?? vmax) - (doc.axeY?.min ?? vmin))
  const min = doc.axeY?.min ?? Math.floor(vmin / pas) * pas
  let max = doc.axeY?.max ?? Math.ceil(vmax / pas) * pas
  if (max <= min) max = min + pas
  const ticks: number[] = []
  for (let v = min; v <= max + pas / 1000; v += pas) ticks.push(Math.round(v * 1e6) / 1e6)
  return { min, max, ticks }
}

function Pointe({ id }: { id: string }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0 1L9 5L0 9z" style={{ fill: 'var(--foreground)' }} />
    </marker>
  )
}

export function Graphique({ doc, zones }: { doc: DocGraphique; zones?: ZonesDoc }) {
  if (doc.forme === 'secteurs') return <Secteurs doc={doc} zones={zones} />
  if (doc.forme === 'climat') return <Climat doc={doc} zones={zones} />
  if (doc.forme === 'barres-h') return <BarresH doc={doc} zones={zones} />

  const valeurs = doc.series.flatMap((x) => x.valeurs.filter((v): v is number => v !== null))
  const { min, max, ticks } = echelleY(doc, valeurs)
  const nCat = doc.categories.length
  const longueurMax = Math.max(...doc.categories.map((c) => c.length))
  const G = 12 + Math.max(...ticks.map((t) => nombreFr(t).length)) * 6.2
  const bande = (W - G - 14) / nCat
  // Une COURBE se pose sur des graduations (le premier point sur l'axe : une
  // proportionnalité passe par l'origine) ; des BARRES, au milieu de leur case.
  const courbe = doc.forme === 'courbe'
  const pasCourbe = (W - G - 24) / Math.max(1, nCat - 1)
  const px = (i: number) => (courbe ? G + i * pasCourbe : G + bande * (i + 0.5))
  const incline = longueurMax * 5.6 > (courbe ? pasCourbe : bande)
  const B = incline ? 26 + Math.min(longueurMax, 16) * 4.2 : 30
  const T = doc.axeY?.titre ? 26 : 12
  const H = T + 170 + B
  const y = (v: number) => T + 170 - ((v - min) / (max - min)) * 170
  const x0 = G
  const idp = `${doc.id}-g`

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className={s.svg} role="img" aria-label={doc.titre ?? 'Graphique'}>
        <defs>
          <Pointe id={`${idp}-p`} />
        </defs>
        {doc.axeY?.titre ? (
          <text x={4} y={12} fontSize={POLICE} fontWeight={700} style={{ fill: 'var(--encre-douce)' }}>
            {doc.axeY.titre}
            {doc.axeY.unite ? ` (${doc.axeY.unite})` : ''}
          </text>
        ) : null}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x0} x2={W - 8} y1={y(t)} y2={y(t)} style={{ stroke: 'var(--papier-trait)' }} strokeWidth={1} />
            <text x={x0 - 5} y={y(t) + 3.5} fontSize={POLICE - 1} textAnchor="end" style={{ fill: 'var(--encre-douce)' }}>
              {nombreFr(t)}
            </text>
          </g>
        ))}
        {/* Les axes, fléchés comme au tableau. */}
        <line x1={x0} x2={x0} y1={T + 172} y2={T - 6} style={{ stroke: 'var(--foreground)' }} strokeWidth={1.6} markerEnd={`url(#${idp}-p)`} />
        <line x1={x0 - 2} x2={W - 4} y1={y(Math.max(min, 0))} y2={y(Math.max(min, 0))} style={{ stroke: 'var(--foreground)' }} strokeWidth={1.6} markerEnd={`url(#${idp}-p)`} />

        {doc.forme === 'barres'
          ? doc.categories.map((_, i) => {
              const id = `k${i}`
              const etat = etatCible(id, zones)
              const n = doc.series.length
              const larg = Math.min(34, (bande * 0.72) / n)
              const debut = x0 + bande * i + (bande - larg * n) / 2
              return (
                <g key={i} className={zones?.actif ? s.cible : undefined} {...propsCible(id, zones, doc.categories[i])}>
                  {zones?.actif ? <rect x={x0 + bande * i} y={T} width={bande} height={170} fill="transparent" /> : null}
                  {doc.series.map((serie, k) => {
                    const v = serie.valeurs[i]
                    if (v === null) return null
                    const haut = y(Math.max(v, 0))
                    const bas = y(Math.min(v, 0))
                    return (
                      <g key={k}>
                        <rect
                          x={debut + k * larg}
                          y={haut}
                          width={larg - 2}
                          height={Math.max(1, bas - haut)}
                          rx={3}
                          style={{
                            fill: fondCible(etat) ?? couleur(serie.teinte ?? TEINTES_SERIES[k]),
                            ...traitCible(etat),
                          }}
                        />
                        {doc.valeurs ? (
                          <text x={debut + k * larg + (larg - 2) / 2} y={haut - 4} fontSize={POLICE - 1.5} fontWeight={700} textAnchor="middle" style={{ fill: 'var(--foreground)' }}>
                            {nombreFr(v)}
                          </text>
                        ) : null}
                      </g>
                    )
                  })}
                </g>
              )
            })
          : doc.series.map((serie, k) => {
              const teinte = serie.teinte ?? TEINTES_SERIES[k]
              const pts = serie.valeurs
                .map((v, i) => (v === null ? null : ([px(i), y(v)] as const)))
              const d = pts.reduce((acc, p, i) => (p ? `${acc}${acc && pts[i - 1] ? 'L' : 'M'}${p[0]} ${p[1]}` : acc), '')
              return (
                <g key={k}>
                  <path d={d} fill="none" style={{ stroke: couleur(teinte) }} strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" />
                  {pts.map((p, i) => {
                    if (!p) return null
                    const id = `k${i}`
                    const etat = k === 0 ? etatCible(id, zones) : null
                    return (
                      <g key={i} className={zones?.actif && k === 0 ? s.cible : undefined} {...(k === 0 ? propsCible(id, zones, doc.categories[i]) : {})}>
                        {zones?.actif && k === 0 ? <circle cx={p[0]} cy={p[1]} r={14} fill="transparent" /> : null}
                        <circle cx={p[0]} cy={p[1]} r={etat ? 6 : 3.8} style={{ fill: fondCible(etat) ?? '#fff', stroke: couleur(teinte), ...traitCible(etat) }} strokeWidth={2.2} />
                        {doc.valeurs && serie.valeurs[i] !== null ? (
                          <text x={p[0]} y={p[1] - 8} fontSize={POLICE - 1.5} fontWeight={700} textAnchor="middle" style={{ fill: 'var(--foreground)' }}>
                            {nombreFr(serie.valeurs[i] as number)}
                          </text>
                        ) : null}
                      </g>
                    )
                  })}
                </g>
              )
            })}

        {courbe
          ? doc.categories.map((_, i) => (
              <line key={`t${i}`} x1={px(i)} x2={px(i)} y1={y(Math.max(min, 0)) - 3} y2={y(Math.max(min, 0)) + 3} style={{ stroke: 'var(--foreground)' }} strokeWidth={1.4} />
            ))
          : null}
        {doc.categories.map((c, i) => {
          const cx = px(i)
          const cy = T + 170 + 14
          return incline ? (
            <text key={i} x={cx} y={cy} fontSize={POLICE - 1} textAnchor="end" transform={`rotate(-38 ${cx} ${cy})`} style={{ fill: 'var(--foreground)' }}>
              {c}
            </text>
          ) : (
            <text key={i} x={cx} y={cy} fontSize={POLICE - 1} textAnchor="middle" style={{ fill: 'var(--foreground)' }}>
              {c}
            </text>
          )
        })}
        {doc.axeX?.titre ? (
          <text x={W - 6} y={H - 4} fontSize={POLICE - 1} fontWeight={700} textAnchor="end" style={{ fill: 'var(--encre-douce)' }}>
            {doc.axeX.titre}
          </text>
        ) : null}
      </svg>
      <LegendeSeries doc={doc} />
    </figure>
  )
}

function LegendeSeries({ doc }: { doc: DocGraphique }) {
  if (doc.series.length < 2) return null
  return (
    <figcaption className={s.legende}>
      {doc.series.map((serie, k) => (
        <span key={k} className={s.legendeItem}>
          <span className={s.pastille} style={{ background: couleur(serie.teinte ?? TEINTES_SERIES[k]) }} />
          {serie.nom}
        </span>
      ))}
    </figcaption>
  )
}

function BarresH({ doc, zones }: { doc: DocGraphique; zones?: ZonesDoc }) {
  const valeurs = doc.series.flatMap((x) => x.valeurs.filter((v): v is number => v !== null))
  const { min, max, ticks } = echelleY(doc, valeurs)
  const G = Math.min(150, 14 + Math.max(...doc.categories.map((c) => c.length)) * 5.8)
  const ligne = 26
  const T = 8
  const H = T + doc.categories.length * ligne + 26
  const x = (v: number) => G + ((v - min) / (max - min)) * (W - G - 34)
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className={s.svg} role="img" aria-label={doc.titre ?? 'Graphique'}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={x(t)} x2={x(t)} y1={T} y2={H - 22} style={{ stroke: 'var(--papier-trait)' }} />
            <text x={x(t)} y={H - 8} fontSize={POLICE - 1} textAnchor="middle" style={{ fill: 'var(--encre-douce)' }}>
              {nombreFr(t)}
            </text>
          </g>
        ))}
        {doc.categories.map((c, i) => {
          const id = `k${i}`
          const etat = etatCible(id, zones)
          const n = doc.series.length
          const epais = (ligne * 0.7) / n
          return (
            <g key={i} className={zones?.actif ? s.cible : undefined} {...propsCible(id, zones, c)}>
              {zones?.actif ? <rect x={0} y={T + i * ligne} width={W} height={ligne} fill="transparent" /> : null}
              <text x={G - 6} y={T + i * ligne + ligne / 2 + 4} fontSize={POLICE - 0.5} textAnchor="end" fontWeight={600} style={{ fill: 'var(--foreground)' }}>
                {c}
              </text>
              {doc.series.map((serie, k) => {
                const v = serie.valeurs[i]
                if (v === null) return null
                const y0 = T + i * ligne + ligne * 0.15 + k * epais
                return (
                  <g key={k}>
                    <rect
                      x={x(Math.min(0, v))}
                      y={y0}
                      width={Math.max(1, Math.abs(x(v) - x(0)))}
                      height={epais - 2}
                      rx={3}
                      style={{ fill: fondCible(etat) ?? couleur(serie.teinte ?? TEINTES_SERIES[k]), ...traitCible(etat) }}
                    />
                    {doc.valeurs ? (
                      <text x={x(v) + 4} y={y0 + epais / 2 + 2.5} fontSize={POLICE - 1.5} fontWeight={700} style={{ fill: 'var(--foreground)' }}>
                        {nombreFr(v)}
                      </text>
                    ) : null}
                  </g>
                )
              })}
            </g>
          )
        })}
        <line x1={G} x2={G} y1={T - 2} y2={H - 22} style={{ stroke: 'var(--foreground)' }} strokeWidth={1.6} />
      </svg>
      {doc.axeY?.titre ? (
        <p className="mt-1 text-right text-[0.72rem] font-bold text-[var(--encre-douce)]">
          {doc.axeY.titre}
          {doc.axeY.unite ? ` (${doc.axeY.unite})` : ''}
        </p>
      ) : null}
      <LegendeSeries doc={doc} />
    </figure>
  )
}

function Secteurs({ doc, zones }: { doc: DocGraphique; zones?: ZonesDoc }) {
  const serie = doc.series[0]
  const valeurs = serie.valeurs.map((v) => Math.max(0, v ?? 0))
  const total = valeurs.reduce((a, b) => a + b, 0) || 1
  const R = 78
  const cx = 100
  const cy = 95
  // Les angles de départ, par sommes cumulées (pas de variable qui avance
  // pendant le rendu).
  const avant = valeurs.map((_, i) => valeurs.slice(0, i).reduce((a, b) => a + b, 0))
  const tranches = valeurs.map((v, i) => {
    const a0 = -Math.PI / 2 + (avant[i] / total) * Math.PI * 2
    return { i, v, a0, a1: a0 + (v / total) * Math.PI * 2 }
  })
  const pt = (a: number, r: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
  return (
    <figure className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      <svg viewBox="0 0 200 190" className={cn(s.svg, 'max-w-[15rem]')} role="img" aria-label={doc.titre ?? 'Diagramme circulaire'}>
        {tranches.map(({ i, v, a0, a1 }) => {
          if (v <= 0) return null
          const id = `k${i}`
          const etat = etatCible(id, zones)
          const [x0, y0] = pt(a0, R)
          const [x1, y1] = pt(a1, R)
          const grand = a1 - a0 > Math.PI ? 1 : 0
          const d = a1 - a0 >= Math.PI * 2 - 1e-6 ? `M${cx - R} ${cy}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0` : `M${cx} ${cy}L${x0} ${y0}A${R} ${R} 0 ${grand} 1 ${x1} ${y1}Z`
          const [lx, ly] = pt((a0 + a1) / 2, R * 0.64)
          const part = Math.round((v / total) * 100)
          return (
            <g key={i} className={zones?.actif ? s.cible : undefined} {...propsCible(id, zones, doc.categories[i])}>
              <path d={d} style={{ fill: fondCible(etat) ?? couleur(TEINTES_SECTEURS[i % TEINTES_SECTEURS.length]), stroke: '#fff', ...traitCible(etat) }} strokeWidth={2} />
              {part >= 6 ? (
                <text x={lx} y={ly + 4} fontSize={12} fontWeight={800} textAnchor="middle" style={{ fill: '#fff', paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.25)', strokeWidth: 2 }}>
                  {doc.valeurs === false ? '' : `${nombreFr(v)}${doc.axeY?.unite ?? ' %'}`}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
      <figcaption className="flex min-w-[9rem] flex-col gap-1 text-[0.8rem] font-semibold">
        {doc.categories.map((c, i) => (
          <span key={i} className={s.legendeItem}>
            <span className={s.pastille} style={{ background: couleur(TEINTES_SECTEURS[i % TEINTES_SECTEURS.length]) }} />
            {c}
          </span>
        ))}
      </figcaption>
    </figure>
  )
}

/** Le diagramme ombrothermique : barres de pluie (mm, à gauche), courbe de température (°C, à droite), P = 2T. */
function Climat({ doc, zones }: { doc: DocGraphique; zones?: ZonesDoc }) {
  const temp = doc.series[0].valeurs.map((v) => v ?? 0)
  const pluie = doc.series[1].valeurs.map((v) => v ?? 0)
  const tMin = Math.min(0, Math.floor(Math.min(...temp) / 10) * 10)
  const tMax = Math.max(30, Math.ceil(Math.max(...temp) / 10) * 10, Math.ceil(Math.max(...pluie) / 20) * 10)
  const pMax = tMax * 2
  const G = 34
  const D = 34
  const T = 22
  const hauteur = 170
  const H = T + hauteur + 24
  const bande = (W - G - D) / 12
  const yT = (v: number) => T + hauteur - ((v - tMin) / (tMax - tMin)) * hauteur
  const yP = (v: number) => T + hauteur - ((v - tMin * 2) / (pMax - tMin * 2)) * hauteur
  const graduations: number[] = []
  for (let v = tMin; v <= tMax; v += 10) graduations.push(v)
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className={s.svg} role="img" aria-label={doc.titre ?? 'Diagramme climatique'}>
        <text x={4} y={12} fontSize={POLICE - 1} fontWeight={700} style={{ fill: 'var(--t-bleu)' }}>
          Précipitations (mm)
        </text>
        <text x={W - 4} y={12} fontSize={POLICE - 1} fontWeight={700} textAnchor="end" style={{ fill: 'var(--t-corail)' }}>
          Températures (°C)
        </text>
        {graduations.map((v) => (
          <g key={v}>
            <line x1={G} x2={W - D} y1={yT(v)} y2={yT(v)} style={{ stroke: 'var(--papier-trait)' }} />
            <text x={G - 4} y={yT(v) + 3.5} fontSize={POLICE - 1.5} textAnchor="end" style={{ fill: 'var(--t-bleu)' }}>
              {v * 2}
            </text>
            <text x={W - D + 4} y={yT(v) + 3.5} fontSize={POLICE - 1.5} style={{ fill: 'var(--t-corail)' }}>
              {v}
            </text>
          </g>
        ))}
        {pluie.map((v, i) => {
          const id = `k${i}`
          const etat = etatCible(id, zones)
          return (
            <g key={i} className={zones?.actif ? s.cible : undefined} {...propsCible(id, zones, doc.categories[i])}>
              {zones?.actif ? <rect x={G + bande * i} y={T} width={bande} height={hauteur} fill="transparent" /> : null}
              <rect
                x={G + bande * i + 2}
                y={yP(v)}
                width={bande - 4}
                height={Math.max(0, yP(tMin * 2) - yP(v))}
                rx={2}
                style={{ fill: fondCible(etat) ?? 'color-mix(in oklch, var(--t-bleu), white 30%)', ...traitCible(etat) }}
              />
            </g>
          )
        })}
        <path
          d={temp.map((v, i) => `${i ? 'L' : 'M'}${G + bande * (i + 0.5)} ${yT(v)}`).join('')}
          fill="none"
          style={{ stroke: 'var(--t-corail)' }}
          strokeWidth={2.6}
          strokeLinejoin="round"
        />
        {temp.map((v, i) => (
          <circle key={i} cx={G + bande * (i + 0.5)} cy={yT(v)} r={3} style={{ fill: 'var(--t-corail)' }} />
        ))}
        <line x1={G} x2={W - D} y1={yT(tMin)} y2={yT(tMin)} style={{ stroke: 'var(--foreground)' }} strokeWidth={1.4} />
        {doc.categories.map((c, i) => (
          <text key={i} x={G + bande * (i + 0.5)} y={T + hauteur + 15} fontSize={POLICE - 1} textAnchor="middle" fontWeight={700} style={{ fill: 'var(--foreground)' }}>
            {c}
          </text>
        ))}
      </svg>
    </figure>
  )
}
