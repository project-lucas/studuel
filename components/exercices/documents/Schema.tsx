import type { DocSchema, ElementSchema, Teinte } from '@/lib/exercices/types'
import { couleur, couleurFoncee, etatCible, fondCible, MotifsSvg, propsCible, remplissage, traitCible, type ZonesDoc } from '../commun'
import s from '../manuel.module.css'

/**
 * LE SCHÉMA — le document qu'on dessine « à la main » : une cellule, un
 * montage de filtration, un plan de jardin, une balance, un cercle
 * chromatique. Des formes simples dans un repère de `largeur × hauteur`
 * unités, aux teintes de la palette des documents ; celles qui portent un
 * `id` et `zone: true` se touchent.
 */

const TAILLES = { petit: 10, normal: 12.5, grand: 16 }

/** Une surface : sa teinte (gris par défaut), en aplat clair sauf motif écrit. */
function remplir(e: ElementSchema, idp: string, defaut: 'clair' | 'aucun'): string {
  return remplissage(e.teinte ?? 'gris', e.motif ?? defaut, idp)
}

function centreTexte(e: ElementSchema): [number, number] | null {
  if (e.forme === 'rect') return [e.x + e.l / 2, e.y + e.h / 2]
  if (e.forme === 'cercle') return [e.cx, e.cy]
  if (e.forme === 'ellipse') return [e.cx, e.cy]
  return null
}

export function Schema({ doc, zones }: { doc: DocSchema; zones?: ZonesDoc }) {
  const idp = `${doc.id}-s`
  const teintes = doc.elements.map((e) => e.teinte ?? 'gris').filter(Boolean) as Teinte[]
  const police = Math.max(9, doc.largeur / 30)
  return (
    <figure>
      <svg viewBox={`0 0 ${doc.largeur} ${doc.hauteur}`} className={s.svg} role="img" aria-label={doc.titre ?? 'Schéma'}>
        <MotifsSvg id={idp} teintes={teintes} echelle={doc.largeur / 320} />
        <defs>
          <marker id={`${idp}-f`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" style={{ fill: 'context-stroke' }} />
          </marker>
        </defs>
        {doc.elements.map((e, i) => {
          const etat = etatCible(e.id, zones)
          const touche = zones?.actif && e.id && e.zone
          const commun = {
            className: touche ? s.cible : undefined,
            ...(touche ? propsCible(e.id, zones, 'texte' in e && e.texte ? e.texte : `Élément ${i + 1}`) : {}),
          }
          // Une surface a un contour plus foncé que son aplat ; un trait garde sa teinte.
          const surface = e.forme === 'rect' || e.forme === 'cercle' || e.forme === 'ellipse' || e.forme === 'polygone' || (e.forme === 'chemin' && e.ferme)
          const trait = {
            stroke: surface ? (e.teinte ? couleurFoncee(e.teinte) : 'var(--foreground)') : couleur(e.teinte, 'encre'),
            ...traitCible(etat),
          }
          const t = 'texte' in e && e.texte && e.forme !== 'texte' && e.forme !== 'etiquette' ? centreTexte(e) : null
          const libelle =
            t && 'texte' in e && e.texte ? (
              <text x={t[0]} y={t[1] + police * 0.36} fontSize={police} fontWeight={700} textAnchor="middle" style={{ fill: 'var(--foreground)' }} pointerEvents="none">
                {e.texte}
              </text>
            ) : null
          switch (e.forme) {
            case 'rect':
              return (
                <g key={i} {...commun}>
                  <rect x={e.x} y={e.y} width={e.l} height={e.h} rx={e.arrondi ?? 0} style={{ fill: fondCible(etat) ?? remplir(e, idp, 'clair'), ...trait }} strokeWidth={1.6} />
                  {libelle}
                </g>
              )
            case 'cercle':
              return (
                <g key={i} {...commun}>
                  <circle cx={e.cx} cy={e.cy} r={e.r} style={{ fill: fondCible(etat) ?? remplir(e, idp, 'clair'), ...trait }} strokeWidth={1.6} />
                  {libelle}
                </g>
              )
            case 'ellipse':
              return (
                <g key={i} {...commun}>
                  <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} style={{ fill: fondCible(etat) ?? remplir(e, idp, 'clair'), ...trait }} strokeWidth={1.6} />
                  {libelle}
                </g>
              )
            case 'polygone':
              return <polygon key={i} {...commun} points={e.points.map((p) => p.join(',')).join(' ')} style={{ fill: fondCible(etat) ?? remplir(e, idp, 'clair'), ...trait }} strokeWidth={1.6} strokeLinejoin="round" />
            case 'chemin':
              return <path key={i} {...commun} d={e.d} style={{ fill: e.ferme ? (fondCible(etat) ?? remplir(e, idp, 'clair')) : 'none', ...trait }} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
            case 'ligne': {
              const [x1, y1] = e.de
              const [x2, y2] = e.a
              const d =
                e.courbe
                  ? `M${x1} ${y1}Q${(x1 + x2) / 2 - (y2 - y1) * e.courbe} ${(y1 + y2) / 2 + (x2 - x1) * e.courbe} ${x2} ${y2}`
                  : `M${x1} ${y1}L${x2} ${y2}`
              return (
                <g key={i} {...commun}>
                  {touche ? <path d={d} stroke="transparent" strokeWidth={14} fill="none" /> : null}
                  <path
                    d={d}
                    fill="none"
                    style={trait}
                    strokeWidth={0.8 + 0.7 * (e.epaisseur ?? 2)}
                    strokeDasharray={e.style === 'pointilles' ? '5 4' : undefined}
                    strokeLinecap="round"
                    markerEnd={e.fleche === 'fin' || e.fleche === 'deux' ? `url(#${idp}-f)` : undefined}
                    markerStart={e.fleche === 'debut' || e.fleche === 'deux' ? `url(#${idp}-f)` : undefined}
                  />
                </g>
              )
            }
            case 'texte': {
              const taille = TAILLES[e.taille ?? 'normal'] * (police / 12.5)
              const ancre = e.ancre === 'debut' ? 'start' : e.ancre === 'fin' ? 'end' : 'middle'
              return (
                <text
                  key={i}
                  {...commun}
                  x={e.x}
                  y={e.y}
                  fontSize={taille}
                  fontWeight={e.gras ? 800 : 600}
                  fontStyle={e.italique ? 'italic' : 'normal'}
                  textAnchor={ancre}
                  style={{ fill: fondCible(etat) ? 'var(--zone-choisie)' : couleur(e.teinte, 'encre'), paintOrder: 'stroke', stroke: '#fffdf8', strokeWidth: taille * 0.25 }}
                >
                  {e.texte}
                </text>
              )
            }
            case 'etiquette': {
              const larg = e.texte.length * police * 0.56 + 12
              const haut = police * 1.7
              return (
                <g key={i} {...commun}>
                  {e.vers ? <line x1={e.x} y1={e.y} x2={e.vers[0]} y2={e.vers[1]} style={{ stroke: 'var(--encre-douce)' }} strokeWidth={1.1} /> : null}
                  {e.vers ? <circle cx={e.vers[0]} cy={e.vers[1]} r={2.2} style={{ fill: 'var(--foreground)' }} /> : null}
                  <rect x={e.x - larg / 2} y={e.y - haut / 2} width={larg} height={haut} rx={haut / 2} style={{ fill: fondCible(etat) ?? '#fff', stroke: couleur(e.teinte, 'encre'), ...traitCible(etat) }} strokeWidth={1.3} />
                  <text x={e.x} y={e.y + police * 0.36} fontSize={police} fontWeight={700} textAnchor="middle" style={{ fill: 'var(--foreground)' }}>
                    {e.texte}
                  </text>
                </g>
              )
            }
            case 'emoji':
              return (
                <text key={i} {...commun} x={e.x} y={e.y} fontSize={e.taille ?? 24} textAnchor="middle" dominantBaseline="central">
                  {e.emoji}
                </text>
              )
          }
        })}
      </svg>
      {doc.legende?.length ? (
        <figcaption className={s.legende}>
          {doc.legende.map((l, i) => (
            <span key={i} className={s.legendeItem}>
              <span
                className={s.pastille}
                style={{
                  background:
                    l.motif === 'hachures'
                      ? `repeating-linear-gradient(45deg, ${couleur(l.teinte)} 0 1.5px, color-mix(in oklch, ${couleur(l.teinte)}, white 80%) 1.5px 4px)`
                      : l.motif === 'clair'
                        ? `color-mix(in oklch, ${couleur(l.teinte)}, white 72%)`
                        : couleur(l.teinte),
                }}
              />
              {l.texte}
            </span>
          ))}
        </figcaption>
      ) : null}
    </figure>
  )
}
