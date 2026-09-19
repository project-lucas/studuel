'use client'

import { useEffect, useState } from 'react'
import type { DonneesFond } from '@/lib/exercices/cartes/donnees'
import { lieu as lieuDuRepertoire } from '@/lib/exercices/cartes/lieux'
import { boiteDuCadrage, dimensions, projeter, type Fond } from '@/lib/exercices/cartes/projections'
import type { DocCarte, LieuCarte, Teinte } from '@/lib/exercices/types'
import { cn } from '@/lib/utils'
import { couleur, couleurFoncee, etatCible, fondCible, MotifsSvg, propsCible, remplissage, traitCible, type ZonesDoc } from '../commun'
import s from '../manuel.module.css'

/**
 * LA CARTE — France (régions, fleuves, massifs), Méditerranée antique, Europe,
 * monde. Les fonds sont des tracés déjà projetés (scripts/cartes-exercices.ts),
 * chargés À LA DEMANDE : un exercice sans carte ne paie pas ses 50 à 90 Ko.
 * Les lieux s'écrivent en longitude/latitude (ou par leur nom du répertoire)
 * et se projettent ici, avec la formule qui a dessiné le fond.
 */

const CHARGEURS: Record<Fond, () => Promise<{ FOND: DonneesFond }>> = {
  france: () => import('@/lib/exercices/cartes/fonds/france'),
  monde: () => import('@/lib/exercices/cartes/fonds/monde'),
  mediterranee: () => import('@/lib/exercices/cartes/fonds/mediterranee'),
  europe: () => import('@/lib/exercices/cartes/fonds/europe'),
}

const cache = new Map<Fond, DonneesFond>()

function useFond(fond: Fond): DonneesFond | null {
  const [donnees, setDonnees] = useState<DonneesFond | null>(() => cache.get(fond) ?? null)
  useEffect(() => {
    if (donnees?.fond === fond) return
    let actif = true
    CHARGEURS[fond]()
      .then((m) => {
        cache.set(fond, m.FOND)
        if (actif) setDonnees(m.FOND)
      })
      .catch(() => {})
    return () => {
      actif = false
    }
  }, [fond, donnees])
  return donnees?.fond === fond ? donnees : null
}

function position(fond: Fond, l: LieuCarte | string | [number, number]): [number, number] | null {
  if (Array.isArray(l)) return projeter(fond, l[0], l[1])
  if (typeof l === 'string') {
    const r = lieuDuRepertoire(l)
    return r ? projeter(fond, r.lon, r.lat) : null
  }
  if (l.lieu) {
    const r = lieuDuRepertoire(l.lieu)
    return r ? projeter(fond, r.lon, r.lat) : null
  }
  if (typeof l.lon === 'number' && typeof l.lat === 'number') return projeter(fond, l.lon, l.lat)
  return null
}

function selection(liste: boolean | string[] | undefined, dispo: { id: string }[]): Set<string> {
  if (liste === true) return new Set(dispo.map((x) => x.id))
  return new Set(Array.isArray(liste) ? liste : [])
}

function etoile(cx: number, cy: number, r: number): string {
  let d = ''
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rr = i % 2 === 0 ? r : r * 0.45
    d += `${i ? 'L' : 'M'}${cx + rr * Math.cos(a)} ${cy + rr * Math.sin(a)}`
  }
  return `${d}Z`
}

export function Carte({ doc, zones }: { doc: DocCarte; zones?: ZonesDoc }) {
  const fond = useFond(doc.fond)
  const { largeur, hauteur } = dimensions(doc.fond)
  const [vx, vy, vw, vh] = doc.cadrage ? boiteDuCadrage(doc.fond, doc.cadrage) : [0, 0, largeur, hauteur]
  const u = vw / 100 // une « unité » de dessin : 1 % de la largeur visible
  // Le corps des écritures : ≈ 11 px sur un téléphone, quelle que soit la carte.
  const f = u * (doc.fond === 'monde' && !doc.cadrage ? 1.05 : 1.3)
  // Le monde entier se dessine dans l'ovale du globe ; tout le reste, dans un rectangle.
  const globe = doc.fond === 'monde' && !doc.cadrage
  const idp = `${doc.id}-c`

  if (!fond) {
    return <div className="w-full animate-pulse rounded-xl bg-[var(--carte-mer)]" style={{ aspectRatio: `${vw} / ${vh}` }} aria-hidden="true" />
  }

  const colories = new Map((doc.regions ?? []).map((r) => [r.code, r] as const))
  const cliquables = doc.regionsCliquables && zones?.actif
  const dessinerZones = doc.fond === 'france' || doc.fond === 'monde' || doc.frontieres || doc.regionsCliquables
  const fleuves = selection(doc.fleuves, fond.fleuves)
  const reliefs = selection(doc.reliefs, fond.reliefs)
  const deserts = selection(doc.deserts, fond.deserts)
  const teintes: Teinte[] = [
    'brun',
    'sable',
    ...(doc.regions ?? []).map((r) => r.teinte),
    ...(doc.aires ?? []).map((a) => a.teinte),
  ]
  const halo = { paintOrder: 'stroke', stroke: 'rgba(255,253,248,0.92)', strokeWidth: f * 0.5, strokeLinejoin: 'round' } as const
  // Les écritures du fond (mers, pays) s'effacent devant celles de l'exercice :
  // une mer dont le nom passerait sur un lieu nommé ou un repère se tait.
  const occupes = (doc.lieux ?? [])
    .map((l) => position(doc.fond, l))
    .filter((p): p is [number, number] => p !== null)
  const gene = (x: number, y: number, longueur: number) =>
    occupes.some(([px, py]) => Math.abs(px - x) < (longueur * f * 1.25) / 2 + f * 5 && Math.abs(py - y) < f * 3)
  // Le nom d'une mer se détache de ce qu'il survole par un halo couleur d'eau.
  const haloMer = { paintOrder: 'stroke', stroke: 'color-mix(in oklch, var(--carte-mer), white 35%)', strokeWidth: f * 0.45, strokeLinejoin: 'round' } as const

  return (
    <figure>
      <svg
        viewBox={`${vx} ${vy} ${vw} ${vh}`}
        className={cn(s.svg, 'rounded-xl')}
        // Un recadrage ne montre QUE sa boîte : le reste du fond ne déborde pas du cadre.
        style={{ overflow: 'hidden' }}
        role="img"
        aria-label={doc.titre ?? 'Carte'}
      >
        <MotifsSvg id={idp} teintes={teintes} echelle={u / 3.2} />
        <defs>
          <clipPath id={`${idp}-bord`}>
            <path d={fond.contour} />
          </clipPath>
          {doc.aires?.some((a) => a.surTerre) ? (
            <clipPath id={`${idp}-terres`}>
              {fond.terre ? <path d={fond.terre} /> : null}
              {fond.silhouette ? <path d={fond.silhouette} /> : null}
              {!fond.terre ? fond.zones.map((z) => <path key={z.code} d={z.d} />) : null}
            </clipPath>
          ) : null}
          <marker id={`${idp}-fl`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" style={{ fill: 'context-stroke' }} />
          </marker>
        </defs>
        {globe ? (
          <path d={fond.contour} style={{ fill: 'var(--carte-mer)' }} />
        ) : (
          // Une carte régionale (ou recadrée) est une feuille : la mer remplit la boîte.
          <rect x={vx} y={vy} width={vw} height={vh} style={{ fill: 'var(--carte-mer)' }} />
        )}
        <g clipPath={globe ? `url(#${idp}-bord)` : undefined}>
          {doc.reperes && fond.reperes.length > 0
            ? fond.reperes.map((r) => (
                <path key={r.id} d={r.d} fill="none" style={{ stroke: 'color-mix(in oklch, var(--t-corail), transparent 35%)' }} strokeWidth={u * 0.25} strokeDasharray={`${u * 1.2} ${u * 0.8}`} />
              ))
            : null}
          {fond.terre ? (
            <path
              d={fond.terre}
              style={{
                fill: doc.fond === 'france' ? 'var(--carte-voisin)' : 'var(--carte-terre)',
                stroke: doc.fond === 'france' ? 'var(--carte-voisin)' : 'var(--carte-cote)',
              }}
              strokeWidth={doc.fond === 'france' ? u * 0.9 : u * 0.18}
              strokeLinejoin="round"
            />
          ) : null}
          {doc.fond === 'france' && fond.terre ? (
            <path d={fond.terre} fill="none" style={{ stroke: 'var(--carte-cote)' }} strokeWidth={u * 0.14} />
          ) : null}

          {dessinerZones
            ? fond.zones.map((z) => {
                const colorie = colories.get(z.code)
                const etat = etatCible(z.code, zones)
                return (
                  <g key={z.code} className={cliquables ? s.cible : undefined} {...(cliquables ? propsCible(z.code, zones, z.nom) : {})}>
                    <path
                      d={z.d}
                      style={{
                        fill: fondCible(etat) ?? (colorie ? remplissage(colorie.teinte, colorie.motif, idp) : 'var(--carte-terre)'),
                        stroke: doc.fond === 'france' ? '#fff' : 'var(--carte-frontiere)',
                        ...traitCible(etat),
                      }}
                      strokeWidth={etat ? u * 0.5 : doc.fond === 'france' ? u * 0.32 : u * 0.14}
                      strokeLinejoin="round"
                    />
                  </g>
                )
              })
            : (doc.regions ?? []).map((r) => {
                const z = fond.zones.find((x) => x.code === r.code)
                return z ? <path key={r.code} d={z.d} style={{ fill: remplissage(r.teinte, r.motif, idp), stroke: 'var(--carte-cote)' }} strokeWidth={u * 0.14} /> : null
              })}
          {doc.fond === 'france' ? (
            <path d={fond.silhouette} fill="none" style={{ stroke: 'var(--carte-cote)' }} strokeWidth={u * 0.22} strokeLinejoin="round" pointerEvents="none" />
          ) : null}

          {fond.deserts
            .filter((d) => deserts.has(d.id))
            .map((d) => (
              <path key={d.id} d={d.d} style={{ fill: `url(#${idp}-p-sable)` }} opacity={0.9} pointerEvents="none" />
            ))}
          {fond.reliefs
            .filter((r) => reliefs.has(r.id))
            .map((r) => (
              <path key={r.id} d={r.d} style={{ fill: `url(#${idp}-h-brun)` }} opacity={0.75} pointerEvents="none" />
            ))}
          {fond.fleuves
            .filter((f) => fleuves.has(f.id))
            .map((f) => (
              <path key={f.id} d={f.d} fill="none" style={{ stroke: 'var(--carte-fleuve)' }} strokeWidth={u * 0.42} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />
            ))}

          {(doc.aires ?? []).map((a, i) => {
            const pts = a.contour.map(([lon, lat]) => projeter(doc.fond, lon, lat))
            const etat = etatCible(a.id, zones)
            return (
              <g
                key={i}
                className={zones?.actif && a.id ? s.cible : undefined}
                clipPath={a.surTerre ? `url(#${idp}-terres)` : undefined}
                {...propsCible(a.id, zones, a.etiquette ?? 'Zone')}
              >
                <path
                  d={`${pts.map(([x, y], k) => `${k ? 'L' : 'M'}${x} ${y}`).join('')}Z`}
                  style={{
                    fill: fondCible(etat) ?? remplissage(a.teinte, a.motif ?? 'clair', idp),
                    stroke: a.surTerre ? 'none' : couleur(a.teinte),
                    ...traitCible(etat),
                  }}
                  strokeWidth={u * 0.35}
                  strokeLinejoin="round"
                  fillOpacity={a.motif === 'plein' ? 0.85 : 1}
                />
              </g>
            )
          })}
          {/* Les côtes, redessinées PAR-DESSUS les aires posées sur les terres. */}
          {doc.aires?.some((a) => a.surTerre) && fond.terre ? (
            <path d={`${fond.terre}${fond.silhouette}`} fill="none" style={{ stroke: 'var(--carte-cote)' }} strokeWidth={u * 0.18} pointerEvents="none" />
          ) : null}
        </g>

        {/* Les écritures du fond : mers, pays voisins — tues sur une carte muette. */}
        {doc.muette
          ? null
          : fond.etiquettes.filter((e) => !gene(e.x, e.y, e.texte.length)).map((e, i) => (
              <text
                key={i}
                x={e.x}
                y={e.y}
                fontSize={e.style === 'continent' ? f * 2.5 : f * 2.3}
                textAnchor="middle"
                fontStyle={e.style === 'mer' ? 'italic' : 'normal'}
                fontWeight={e.style === 'continent' ? 800 : 600}
                letterSpacing={e.style === 'continent' ? u * 0.3 : 0}
                style={{ fill: e.style === 'mer' ? 'var(--carte-texte-mer)' : 'var(--encre-douce)', ...(e.style === 'mer' ? haloMer : halo) }}
                pointerEvents="none"
              >
                {e.texte}
              </text>
            ))}

        {(doc.aires ?? [])
          .filter((a) => a.etiquette)
          .map((a, i) => {
            const [x, y] = a.etiquetteA
              ? projeter(doc.fond, a.etiquetteA[0], a.etiquetteA[1])
              : (() => {
                  const pts = a.contour.map(([lon, lat]) => projeter(doc.fond, lon, lat))
                  return [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length]
                })()
            return (
              <text key={`aire-${i}`} x={x} y={y} fontSize={f * 2.5} fontWeight={800} textAnchor="middle" style={{ fill: couleurFoncee(a.teinte), ...halo }} pointerEvents="none">
                {a.etiquette}
              </text>
            )
          })}

        {(doc.regions ?? [])
          .filter((r) => r.etiquette)
          .map((r) => {
            const z = fond.zones.find((x) => x.code === r.code)
            return z ? (
              <text key={r.code} x={z.cx} y={z.cy} fontSize={f * 2.3} fontWeight={800} textAnchor="middle" style={{ fill: 'var(--foreground)', ...halo }} pointerEvents="none">
                {r.etiquette}
              </text>
            ) : null
          })}

        {(doc.traits ?? []).map((t, i) => {
          const pts = t.points.map((p) => position(doc.fond, p)).filter((p): p is [number, number] => p !== null)
          if (pts.length < 2) return null
          const etat = etatCible(t.id, zones)
          let d = `M${pts[0][0]} ${pts[0][1]}`
          if (pts.length === 2 && t.style === 'fleche') {
            const [[x0, y0], [x1, y1]] = pts
            const mx = (x0 + x1) / 2 - (y1 - y0) * 0.18
            const my = (y0 + y1) / 2 + (x1 - x0) * 0.18
            d += `Q${mx} ${my} ${x1} ${y1}`
          } else d += pts.slice(1).map(([x, y]) => `L${x} ${y}`).join('')
          const milieu = pts[Math.floor(pts.length / 2)]
          return (
            <g key={i} className={zones?.actif && t.id ? s.cible : undefined} {...propsCible(t.id, zones, t.etiquette ?? 'Tracé')}>
              {zones?.actif && t.id ? <path d={d} fill="none" stroke="transparent" strokeWidth={u * 4} /> : null}
              <path
                d={d}
                fill="none"
                style={{ stroke: couleur(t.teinte, 'corail'), ...traitCible(etat) }}
                strokeWidth={u * (0.35 + 0.25 * (t.epaisseur ?? 2))}
                strokeDasharray={t.style === 'pointilles' ? `${u * 1.4} ${u}` : undefined}
                strokeLinecap="round"
                markerEnd={t.style === 'fleche' ? `url(#${idp}-fl)` : undefined}
              />
              {t.etiquette ? (
                <text x={milieu[0]} y={milieu[1] - u * 1.2} fontSize={f * 2.2} fontWeight={700} textAnchor="middle" style={{ fill: couleur(t.teinte, 'corail'), ...halo }}>
                  {t.etiquette}
                </text>
              ) : null}
            </g>
          )
        })}

        {(doc.etiquettes ?? []).map((e, i) => {
          const [x, y] = projeter(doc.fond, e.lon, e.lat)
          return (
            <text
              key={i}
              x={x}
              y={y}
              fontSize={e.style === 'pays' || e.style === 'region' ? f * 2.2 : f * 2.35}
              fontWeight={e.style === 'ville' ? 600 : 800}
              fontStyle={e.style === 'mer' ? 'italic' : 'normal'}
              textAnchor="middle"
              letterSpacing={e.style === 'pays' || e.style === 'region' ? u * 0.15 : 0}
              style={{ fill: e.style === 'mer' ? 'var(--carte-texte-mer)' : 'var(--foreground)', ...halo }}
              pointerEvents="none"
            >
              {e.style === 'pays' || e.style === 'region' ? e.texte.toUpperCase() : e.texte}
            </text>
          )
        })}

        {(doc.lieux ?? []).map((l) => {
          const p = position(doc.fond, l)
          if (!p) return null
          const [x, y] = p
          const etat = etatCible(l.id, zones)
          const r = u * (0.8 + 0.35 * (l.taille ?? 2))
          const teinte = couleur(l.teinte, 'encre')
          const fondSymbole = fondCible(etat) ?? teinte
          const aDroite = x < vx + vw * 0.78
          return (
            <g key={l.id} className={zones?.actif ? s.cible : undefined} {...propsCible(l.id, zones, l.nom ?? l.lettre ?? 'Lieu')}>
              {zones?.actif ? <circle cx={x} cy={y} r={u * 3.6} fill="transparent" /> : null}
              {etat ? <circle cx={x} cy={y} r={r * 2.2} style={{ fill: 'none', ...traitCible(etat) }} /> : null}
              {l.symbole === 'lettre' ? (
                <>
                  <circle cx={x} cy={y} r={f * 2} style={{ fill: fondSymbole, stroke: '#fff' }} strokeWidth={u * 0.4} />
                  <text x={x} y={y + f * 0.85} fontSize={f * 2.4} fontWeight={800} textAnchor="middle" style={{ fill: '#fff' }}>
                    {l.lettre}
                  </text>
                </>
              ) : l.symbole === 'etoile' ? (
                <path d={etoile(x, y, r * 1.5)} style={{ fill: fondSymbole, stroke: '#fff' }} strokeWidth={u * 0.3} />
              ) : l.symbole === 'carre' ? (
                <rect x={x - r} y={y - r} width={2 * r} height={2 * r} style={{ fill: fondSymbole, stroke: '#fff' }} strokeWidth={u * 0.3} />
              ) : l.symbole === 'triangle' ? (
                <path d={`M${x} ${y - r * 1.3}L${x + r * 1.15} ${y + r * 0.75}L${x - r * 1.15} ${y + r * 0.75}Z`} style={{ fill: fondSymbole, stroke: '#fff' }} strokeWidth={u * 0.3} />
              ) : (
                <circle cx={x} cy={y} r={r} style={{ fill: fondSymbole, stroke: '#fff' }} strokeWidth={u * 0.35} />
              )}
              {l.nom ? (
                <text
                  x={aDroite ? x + r + u * 0.9 : x - r - u * 0.9}
                  y={y + u * 0.9}
                  fontSize={f * 2.3}
                  fontWeight={700}
                  textAnchor={aDroite ? 'start' : 'end'}
                  style={{ fill: 'var(--foreground)', ...halo }}
                >
                  {l.nom}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>
      {doc.legende?.length ? (
        <figcaption className={s.legende}>
          {doc.legende.map((l, i) => (
            <span key={i} className={s.legendeItem}>
              {l.symbole ? (
                <svg viewBox="-6 -6 12 12" className="size-3.5" aria-hidden="true">
                  {l.symbole === 'etoile' ? (
                    <path d={etoile(0, 0, 5.5)} style={{ fill: couleur(l.teinte) }} />
                  ) : l.symbole === 'carre' ? (
                    <rect x={-4.5} y={-4.5} width={9} height={9} style={{ fill: couleur(l.teinte) }} />
                  ) : l.symbole === 'triangle' ? (
                    <path d="M0 -5.5L5 4L-5 4Z" style={{ fill: couleur(l.teinte) }} />
                  ) : (
                    <circle r={4.5} style={{ fill: couleur(l.teinte) }} />
                  )}
                </svg>
              ) : (
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
              )}
              {l.texte}
            </span>
          ))}
        </figcaption>
      ) : null}
    </figure>
  )
}
