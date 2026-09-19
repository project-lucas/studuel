import type { DocFrise, Teinte } from '@/lib/exercices/types'
import { annee, couleur, couleurClaire, etatCible, fondCible, propsCible, traitCible, type ZonesDoc } from '../commun'
import s from '../manuel.module.css'

/**
 * LA FRISE CHRONOLOGIQUE — l'axe fléché du manuel d'histoire : les périodes en
 * bandes colorées au-dessus, les événements en jalons, étagés en hauteur pour
 * que leurs étiquettes ne se chevauchent pas. Les années négatives sont
 * « av. J.-C. » : la graduation l'écrit en court (−3000), l'étiquette en long.
 */

// Étroit à dessein : sur un téléphone, une unité fait plus d'un pixel et les
// étiquettes restent lisibles (≈ 11 px).
const W = 300
const TEINTES: Teinte[] = ['ambre', 'turquoise', 'rose', 'vert', 'violet', 'bleu']

export function Frise({ doc, zones }: { doc: DocFrise; zones?: ZonesDoc }) {
  const G = 14
  const D = 22
  const x = (a: number) => G + ((a - doc.debut) / (doc.fin - doc.debut)) * (W - G - D)
  const periodes = doc.periodes ?? []
  const evenements = [...(doc.evenements ?? [])].sort((a, b) => a.date - b.date)

  // Les étages des événements : on descend d'un cran tant que l'étiquette
  // chevaucherait la précédente au même étage.
  const LARGEUR_CAR = 5.3
  const MAX = 20
  const etages: number[] = []
  const finParEtage: number[] = []
  // Le centre de l'étiquette, retenu dans le cadre (un événement au bord de
  // la frise garde son jalon au bon endroit, son étiquette glisse vers l'intérieur).
  const centre = (e: { date: number; nom: string }) => {
    const larg = Math.min(e.nom.length, MAX) * LARGEUR_CAR + 10
    return Math.max(larg / 2 + 2, Math.min(W - larg / 2 - 2, x(e.date)))
  }
  for (const e of evenements) {
    const larg = Math.min(e.nom.length, MAX) * LARGEUR_CAR
    const debut = centre(e) - larg / 2
    let etage = 0
    while (finParEtage[etage] !== undefined && finParEtage[etage] > debut - 6) etage++
    finParEtage[etage] = debut + larg
    etages.push(etage)
  }
  const nEtages = Math.max(1, ...etages.map((e) => e + 1))

  const HP = periodes.length ? 26 : 0
  const Y_AXE = 12 + HP + 12
  // L'axe, les années dessous, puis les étages d'étiquettes (26 unités chacun).
  const H = Y_AXE + 34 + nEtages * 26
  const graduations: number[] = []
  for (let a = doc.debut; a <= doc.fin + 1e-9; a += doc.pas) graduations.push(Math.round(a))
  const croise = doc.debut < 0 && doc.fin > 0
  // Une étiquette de graduation sur `saut` quand elles se serreraient (une
  // année s'écrit sur ~5 caractères : il lui faut ~28 unités).
  const espacement = (W - G - D) / Math.max(1, graduations.length - 1)
  const saut = Math.max(1, Math.ceil(28 / espacement))

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className={s.svg} role="img" aria-label={doc.titre ?? 'Frise chronologique'}>
        <defs>
          <marker id={`${doc.id}-f`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0L10 5L0 10z" style={{ fill: 'var(--foreground)' }} />
          </marker>
        </defs>

        {periodes.map((p, i) => {
          const etat = etatCible(p.id, zones)
          const t = p.teinte ?? TEINTES[i % TEINTES.length]
          const x0 = x(p.debut)
          const x1 = x(p.fin)
          return (
            <g key={i} className={zones?.actif && p.id ? s.cible : undefined} {...propsCible(p.id, zones, p.nom)}>
              <rect
                x={x0}
                y={12}
                width={Math.max(2, x1 - x0)}
                height={HP - 4}
                rx={5}
                style={{ fill: fondCible(etat) ?? couleurClaire(t, 'encre', 55), stroke: couleur(t), ...traitCible(etat) }}
                strokeWidth={1.4}
              />
              <text
                x={(x0 + x1) / 2}
                y={12 + (HP - 4) / 2 + 3.8}
                fontSize={x1 - x0 > p.nom.length * 5.6 ? 10.5 : 9}
                fontWeight={800}
                textAnchor="middle"
                style={{ fill: 'color-mix(in oklch, var(--foreground), black 10%)' }}
              >
                {x1 - x0 > p.nom.length * 4 ? p.nom : `${p.nom.slice(0, Math.max(3, Math.floor((x1 - x0) / 4.6)))}…`}
              </text>
            </g>
          )
        })}

        {/* L'axe, fléché vers le futur. */}
        <rect x={G - 4} y={Y_AXE - 5} width={W - G - D + 12} height={10} rx={5} style={{ fill: 'color-mix(in oklch, var(--foreground), white 88%)' }} />
        <line x1={G - 4} x2={W - 6} y1={Y_AXE} y2={Y_AXE} style={{ stroke: 'var(--foreground)' }} strokeWidth={2} markerEnd={`url(#${doc.id}-f)`} />
        {graduations.map((a, i) => (
          <g key={a}>
            <line x1={x(a)} x2={x(a)} y1={Y_AXE - 5} y2={Y_AXE + 5} style={{ stroke: 'var(--foreground)' }} strokeWidth={1.3} />
            {i % saut === 0 ? (
              <text x={x(a)} y={Y_AXE + 17} fontSize={9.5} fontWeight={700} textAnchor="middle" style={{ fill: 'var(--encre-douce)' }}>
                {a === 0 && croise ? 'J.-C.' : annee(a, true)}
              </text>
            ) : null}
          </g>
        ))}

        {evenements.map((e, i) => {
          const etat = etatCible(e.id, zones)
          const ex = x(e.date)
          const lx = centre(e)
          const ey = Y_AXE + 38 + etages[i] * 26
          const t = couleur(e.teinte, 'corail')
          return (
            <g key={e.id} className={zones?.actif ? s.cible : undefined} {...propsCible(e.id, zones, e.nom)}>
              <line x1={ex} x2={lx} y1={Y_AXE} y2={ey - 10} style={{ stroke: t }} strokeWidth={1.4} strokeDasharray="2 2" />
              <circle cx={ex} cy={Y_AXE} r={4.2} style={{ fill: t, stroke: '#fff' }} strokeWidth={1.5} />
              <rect
                x={lx - Math.min(e.nom.length, MAX) * LARGEUR_CAR * 0.5 - 5}
                y={ey - 10}
                width={Math.min(e.nom.length, MAX) * LARGEUR_CAR + 10}
                height={19}
                rx={9.5}
                style={{ fill: fondCible(etat) ?? '#fff', stroke: t, ...traitCible(etat) }}
                strokeWidth={1.4}
              />
              <text x={lx} y={ey + 3.6} fontSize={10} fontWeight={700} textAnchor="middle" style={{ fill: 'var(--foreground)' }}>
                {e.nom.length > MAX ? `${e.nom.slice(0, MAX - 1)}…` : e.nom}
              </text>
            </g>
          )
        })}
      </svg>
      {evenements.some((e) => e.nom.length > 20) ? (
        <ul className="mt-2 space-y-0.5 text-[0.76rem]">
          {evenements
            .filter((e) => e.nom.length > 20)
            .map((e) => (
              <li key={e.id}>
                <strong>{annee(e.date)}</strong> — {e.nom}
              </li>
            ))}
        </ul>
      ) : null}
    </figure>
  )
}
