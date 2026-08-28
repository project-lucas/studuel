import { dureeLabel, type EffortDiagram, type EffortRow } from '@/lib/effort'
import { radarAxes } from '@/lib/effort'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// LA TOILE — le diagramme d'effort en radar.
//
// EN SVG NU, SANS BIBLIOTHÈQUE. `recharts` est déjà dans le projet et sait
// dessiner un radar, mais son propre module le dit : « près de neuf
// méga-octets sur le disque », chargé en import dynamique pour ne pas peser sur
// tout l'onglet Moi. Un hexagone est trente lignes de trigonométrie ; le faire
// à la main garde ce bloc en rendu SERVEUR, sans un octet de JavaScript en plus.
//
// DEUX POLYGONES, ET C'EST TOUT LE PROPOS.
//   · le VIOLET PLEIN — ce que l'élève donne à chaque matière ;
//   · le CONTOUR DORÉ — ce que le barème de son épreuve demande.
// Un radar seul dit « voilà ta forme », ce qui n'apprend rien et flatte
// toujours : une toile à moitié pleine a l'air d'un bon résultat. Deux formes
// superposées disent « voilà l'écart entre la tienne et celle qu'il faudrait »,
// et cet écart, lui, est vérifiable. C'est la seule variante d'un radar qui
// affirme quelque chose.
//
// L'ORDRE DES AXES NE DÉPEND PAS DE L'ÉLÈVE. L'aire d'un polygone radar change
// si l'on permute deux axes — elle ne mesure donc rien. L'ordre est figé sur le
// barème (`radarAxes`, lib/effort.ts) : la forme reste comparable d'une semaine
// à l'autre au lieu de se réarranger à chaque session.
//
// LA MOYENNE EST DANS L'ÉTIQUETTE D'AXE, et passe en corail sous 10. C'est ce
// qui fait qu'un « 6/20 en physique-chimie » se découvre en regardant la toile,
// sans lire une ligne de tableau.
// -----------------------------------------------------------------------------

/** Repère de dessin. Le SVG s'adapte, ces valeurs ne sont que des proportions. */
const R = 100
const CENTRE = 150
/** Anneaux de graduation — quatre, comme sur un radar de bulletin. */
const ANNEAUX = [0.25, 0.5, 0.75, 1]

/** Position d'un point d'axe : sens horaire depuis le HAUT (−90°). */
function pointSur(index: number, total: number, rayon: number) {
  const angle = (-90 + (index * 360) / total) * (Math.PI / 180)
  return {
    x: CENTRE + Math.cos(angle) * rayon,
    y: CENTRE + Math.sin(angle) * rayon,
  }
}

const polygone = (points: { x: number; y: number }[]) =>
  points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

/** « 6/20 », « 12,5/20 » — virgule décimale, comme sur un bulletin français. */
const noteLabel = (v: number) =>
  `${(Math.round(v * 10) / 10).toString().replace('.', ',')}/20`

export default function EffortRadar({ diagram }: { diagram: EffortDiagram }) {
  const axes = radarAxes(diagram)
  if (axes.length === 0) return null

  const n = axes.length
  const rayonDe = (v: number) =>
    diagram.scale > 0 ? Math.min(1, v / diagram.scale) * R : 0

  const effort = axes.map((a, i) => pointSur(i, n, rayonDe(a.share)))
  // Le contour du barème n'existe que si l'épreuve a plusieurs matières à
  // comparer : sinon il vaudrait 100 % sur un axe et rien sur les autres, ce
  // qui dessinerait une flèche, pas une cible.
  const barème =
    diagram.regime === 'comparaison'
      ? axes.map((a, i) => pointSur(i, n, rayonDe(a.weight ?? 0)))
      : null

  return (
    <figure className="mt-3">
      <svg
        viewBox="0 0 300 300"
        className="mx-auto block h-auto w-full max-w-[320px]"
        role="img"
        // LA TOILE EST DÉCORATIVE POUR UN LECTEUR D'ÉCRAN : elle ne dit rien
        // que la liste des matières, juste dessous, ne dise en toutes lettres.
        // Un polygone décrit point par point serait du bruit, pas de l'accès.
        aria-label={`Ta répartition de travail sur ${n} matières. Le détail chiffré suit dans la liste.`}
      >
        {/* LES ANNEAUX, en trait fin : ils donnent l'échelle sans la chiffrer.
            Les graduations en pourcentage d'un radar ne se lisent jamais — ce
            qui se lit, c'est la distance entre les deux polygones. */}
        {ANNEAUX.map((a) => (
          <polygon
            key={a}
            points={polygone(
              Array.from({ length: n }, (_, i) => pointSur(i, n, R * a)),
            )}
            className="fill-none stroke-black/10"
            strokeWidth={1}
          />
        ))}
        {/* Les rayons */}
        {axes.map((a, i) => {
          const p = pointSur(i, n, R)
          return (
            <line
              key={a.slug}
              x1={CENTRE}
              y1={CENTRE}
              x2={p.x}
              y2={p.y}
              className="stroke-black/10"
              strokeWidth={1}
            />
          )
        })}

        {/* LE BARÈME, en pointillé doré — la forme à atteindre. Dessiné AVANT
            l'effort : c'est le fond de la comparaison, pas son sujet. */}
        {barème ? (
          <polygon
            points={polygone(barème)}
            className="fill-none stroke-[color:var(--highlight)]"
            strokeWidth={2}
            strokeDasharray="5 4"
            strokeLinejoin="round"
          />
        ) : null}

        {/* LE NUMÉRO DE CHAQUE SOMMET. Sans lui, les étiquettes numérotées du
            dessous pointeraient vers rien — c'est le seul texte du SVG, et il
            n'a que deux caractères : aucun risque de débordement, contrairement
            à « Physique-Chimie » posé autour d'un hexagone de 320 px. */}
        {axes.map((a, i) => {
          const p = pointSur(i, n, R + 16)
          return (
            <text
              key={`n-${a.slug}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-foreground/45 text-[13px] font-bold"
            >
              {i + 1}
            </text>
          )
        })}

        {/* L'EFFORT, plein */}
        <polygon
          points={polygone(effort)}
          className="fill-[color:var(--primary)]/20 stroke-[color:var(--primary)]"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {axes.map((a, i) => {
          const p = effort[i]
          return (
            <circle
              key={a.slug}
              cx={p.x}
              cy={p.y}
              r={a.verdict === 'en_retard' ? 5 : 3.5}
              className={
                a.verdict === 'en_retard'
                  ? 'fill-[color:var(--destructive)]'
                  : 'fill-[color:var(--primary)]'
              }
            />
          )
        })}
      </svg>

      {/* LES ÉTIQUETTES SONT DU HTML, PAS DU <text> SVG. Un nom de matière peut
          faire deux lignes (« Physique-Chimie »), porter sa note dessous, et
          doit rester à la taille de police de l'élève : tout cela, le SVG le
          fait mal. Posées en grille sous la toile, elles restent lisibles à
          toutes les largeurs — et sur un téléphone, des étiquettes autour d'un
          hexagone de 320 px seraient de toute façon illisibles. */}
      <figcaption className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3">
        {axes.map((a, i) => (
          <Etiquette key={a.slug} row={a} index={i} />
        ))}
      </figcaption>

      <Legende barème={barème !== null} />
    </figure>
  )
}

function Etiquette({ row, index }: { row: EffortRow; index: number }) {
  return (
    <span className="flex min-w-0 items-baseline gap-1.5 text-[11px] leading-tight">
      {/* Le numéro relie l'étiquette à son sommet : sans lui, six noms sous un
          hexagone ne se rattachent à rien. Il suit le sens horaire depuis le
          haut, comme les axes. */}
      <span
        aria-hidden="true"
        className="grid size-4 shrink-0 place-items-center rounded-full bg-black/8 text-[9px] font-extrabold tabular-nums"
      >
        {index + 1}
      </span>
      <span className="min-w-0 flex-1 truncate font-bold" title={row.name}>
        {row.name}
      </span>
      {row.moyenne !== null ? (
        <span
          className={cn(
            'shrink-0 font-extrabold tabular-nums',
            row.verdict === 'en_retard' ? 'text-destructive' : 'text-foreground/60',
          )}
        >
          {noteLabel(row.moyenne)}
        </span>
      ) : (
        <span className="shrink-0 text-muted-foreground tabular-nums">
          {dureeLabel(row.minutes)}
        </span>
      )}
      {/* Ce que la toile dit par une distance, dit ici en toutes lettres. */}
      <span className="sr-only">
        {`, ${dureeLabel(row.minutes)} de révision, ${Math.round(row.share * 100)} % de ton travail`}
      </span>
    </span>
  )
}

/** Deux formes superposées ne se devinent pas : la légende les nomme. */
function Legende({ barème }: { barème: boolean }) {
  return (
    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="inline-block h-2 w-4 rounded-full bg-primary"
        />
        ton travail
      </span>
      {barème ? (
        <span className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block h-0 w-4 border-t-2 border-dashed border-[color:var(--highlight)]"
          />
          ce que pèse ton épreuve
        </span>
      ) : null}
    </p>
  )
}
