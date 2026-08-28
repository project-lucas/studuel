import { dureeLabel, type EffortDiagram } from '@/lib/effort'
import { radarAxes } from '@/lib/effort'

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

/**
 * Repère de dessin. La toile est plus LARGE que haute : les noms posés à gauche
 * et à droite débordent horizontalement bien plus que ceux du haut et du bas ne
 * débordent verticalement. Un carré obligerait à rétrécir le rayon pour les
 * loger.
 */
const CX = 190
const CY = 126
/** Anneaux de graduation — quatre, comme sur un radar de bulletin. */
const ANNEAUX = [0.25, 0.5, 0.75, 1]

/** Position d'un point d'axe : sens horaire depuis le HAUT (−90°). */
function pointSur(index: number, total: number, rayon: number) {
  const angle = (-90 + (index * 360) / total) * (Math.PI / 180)
  return {
    x: CX + Math.cos(angle) * rayon,
    y: CY + Math.sin(angle) * rayon,
    cos: Math.cos(angle),
    sin: Math.sin(angle),
  }
}

/**
 * LE NOM AU BOUT DU RAYON, coupé en deux lignes s'il est long.
 *
 * « Physique-Chimie » ou « Ens. scientifique » posés d'un bloc à gauche de la
 * toile la repousseraient hors du cadre. On coupe donc au dernier séparateur
 * avant la limite — jamais au milieu d'un mot, qui rendrait le nom illisible.
 */
function couper(nom: string, limite: number, lignesMax: number): string[] {
  if (nom.length <= limite) return [nom]
  if (lignesMax === 1) {
    // Une seule ligne autorisée : on coupe au dernier mot entier qui tient,
    // avec une ellipse. Tronquer au caractère près donnerait « Physique-Chim ».
    const mot = nom.lastIndexOf(' ', limite)
    return [(mot > 3 ? nom.slice(0, mot) : nom.slice(0, limite - 1)) + '…']
  }
  const coupe = Math.max(nom.lastIndexOf(' ', limite), nom.lastIndexOf('-', limite))
  if (coupe <= 0) return [nom]
  const tete = nom.slice(0, nom[coupe] === '-' ? coupe + 1 : coupe)
  return [tete, nom.slice(coupe + 1)]
}

/**
 * LA TYPOGRAPHIE S'ADAPTE AU NOMBRE DE BRANCHES, et c'est ce qui remplace le
 * plafond d'axes qu'on avait d'abord posé.
 *
 * À six branches, l'écart angulaire est de 60° : les noms ont toute la place,
 * deux lignes comprises. À quinze, il tombe à 24° et deux étiquettes voisines
 * se chevauchent — la réponse n'est pas d'en cacher neuf, c'est de réduire le
 * corps, d'interdire la seconde ligne et de raccourcir les noms.
 *
 * La NOTE, elle, ne disparaît jamais quand la matière est sous la moyenne :
 * c'est la seule information de ce graphique qui appelle un geste immédiat, et
 * elle survit à toutes les densités.
 */
function reglages(n: number) {
  // LA DEUXIÈME LIGNE RESTE AUTORISÉE MÊME À DOUZE BRANCHES, et c'est le
  // réglage qui a demandé une mesure plutôt qu'une intuition. La contrainte
  // n'est pas horizontale — les étiquettes latérales ont une centaine de
  // pixels — mais VERTICALE, entre deux étiquettes voisines du même côté. À
  // douze axes le pas est de 30°, soit environ 40 px entre deux pointes : deux
  // lignes de dix pixels y tiennent largement. Un premier réglage interdisait
  // la seconde ligne dès huit branches et rendait « Histoire-… », « Arts… »,
  // « Ens.… » — des noms tronqués n'apprennent rien, alors que le bloc entier
  // existe pour se lire d'un coup d'œil.
  if (n <= 7) return { corps: 11, limite: 14, lignes: 2, rayon: 92, notes: 'toutes' as const }
  if (n <= 12) return { corps: 10, limite: 13, lignes: 2, rayon: 84, notes: 'toutes' as const }
  // Au-delà, le pas tombe sous 25° : la note ne s'affiche plus que là où elle
  // appelle un geste, c'est-à-dire sous la moyenne.
  return { corps: 9, limite: 12, lignes: 2, rayon: 76, notes: 'retards' as const }
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
  const reg = reglages(n)
  const R = reg.rayon
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
        viewBox="0 0 380 272"
        className="mx-auto block h-auto w-full max-w-[380px]"
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
              x1={CX}
              y1={CY}
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
          <g>
            {/* L'OR SUR CRÈME MANQUE DE CONTRASTE, et c'est le trait le plus
                important du graphique : il porte toute la comparaison. Un
                liseré sombre dessous le détache du fond sans changer sa
                couleur — deux tracés, le même pointillé. */}
            <polygon
              points={polygone(barème)}
              className="fill-none stroke-[color:var(--foreground)]/25"
              strokeWidth={4}
              strokeDasharray="5 4"
              strokeLinejoin="round"
            />
            <polygon
              points={polygone(barème)}
              className="fill-none stroke-[color:var(--highlight)]"
              strokeWidth={2.5}
              strokeDasharray="5 4"
              strokeLinejoin="round"
            />
          </g>
        ) : null}

        {/* LE NOM AU BOUT DU RAYON — et non plus un numéro renvoyant à une
            légende posée dessous. Le premier jet numérotait les sommets 1 à 6 et
            listait les noms en grille sous la toile : l'œil devait faire un
            aller-retour permanent entre le dessin et sa légende pour savoir de
            quelle matière parlait chaque pointe. Un radar qu'il faut DÉCODER a
            perdu sa raison d'être, qui était de se lire en une seconde. */}
        {axes.map((a, i) => {
          const p = pointSur(i, n, R + 14)
          // L'ancrage suit l'angle : à droite de la toile le texte part vers la
          // droite, à gauche il finit à gauche, en haut et en bas il se centre.
          const ancre =
            Math.abs(p.cos) < 0.25 ? 'middle' : p.cos > 0 ? 'start' : 'end'
          const lignes = couper(a.name, reg.limite, reg.lignes)
          const montreNote =
            a.moyenne !== null &&
            (reg.notes === 'toutes' || a.verdict === 'en_retard')
          // Le bloc de texte est remonté de sa hauteur quand il est au-dessus
          // du centre : sans ça, un nom sur deux lignes au sommet nord
          // chevaucherait la toile.
          const pas = reg.corps + 1
          const hauteur = lignes.length * pas + (montreNote ? pas : 0)
          const y = p.y + (p.sin < -0.3 ? -hauteur + 8 : p.sin > 0.3 ? 4 : -2)
          return (
            <text
              key={`l-${a.slug}`}
              x={p.x}
              y={y}
              textAnchor={ancre}
              className="fill-foreground font-bold"
              style={{ fontSize: reg.corps }}
            >
              {lignes.map((ligne, j) => (
                <tspan key={ligne + j} x={p.x} dy={j === 0 ? 0 : pas}>
                  {ligne}
                </tspan>
              ))}
              {/* LA MOYENNE SOUS LE NOM : c'est le seul chiffre vérifiable du
                  graphique — le travail est estimé, le barème est un barème, la
                  note est un fait. En corail sous 10, c'est elle qui doit sauter
                  aux yeux avant toute considération de répartition. */}
              {montreNote ? (
                <tspan
                  x={p.x}
                  dy={pas}
                  className={
                    a.verdict === 'en_retard'
                      ? 'fill-destructive font-extrabold'
                      : 'fill-foreground/55 font-semibold'
                  }
                  style={{ fontSize: reg.corps }}
                >
                  {noteLabel(a.moyenne ?? 0)}
                </tspan>
              ) : null}
            </text>
          )
        })}

        {/* LA SEULE GRADUATION CHIFFRÉE, sur l'anneau extérieur. Quatre
            graduations ne se lisent jamais ; aucune, et l'on ne sait plus ce que
            vaut un rayon. Une suffit à donner l'échelle. */}
        <text
          x={CX + 4}
          y={CY - R + 2}
          className="fill-foreground/35 text-[9px] font-bold"
        >
          {Math.round(diagram.scale * 100)} %
        </text>

        {/* L'EFFORT, plein */}
        <polygon
          points={polygone(effort)}
          className="fill-[color:var(--primary)]/20 stroke-[color:var(--primary)]"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {axes.map((a, i) => {
          const p = effort[i]
          const retard = a.verdict === 'en_retard'
          return (
            <g key={a.slug}>
              {/* LE HALO DU RETARD. Un point corail de 5 px se perdait sur la
                  toile — or c'est LA découverte que cet écran doit provoquer.
                  L'anneau le fait sortir sans changer la forme du polygone. */}
              {retard ? (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={9}
                  className="fill-[color:var(--destructive)]/20"
                />
              ) : null}
              <circle
                cx={p.x}
                cy={p.y}
                r={retard ? 5.5 : 3.5}
                className={
                  retard
                    ? 'fill-[color:var(--destructive)]'
                    : 'fill-[color:var(--primary)]'
                }
              />
            </g>
          )
        })}
      </svg>

      {/* PLUS DE GRILLE D'ÉTIQUETTES SOUS LA TOILE : les noms sont désormais au
          bout de leur rayon. Il reste la version LUE — ce que la toile dit par
          une distance, dit ici en toutes lettres. Un polygone décrit point par
          point serait du bruit ; une phrase par matière est de l'accès. */}
      <figcaption className="sr-only">
        <ul>
          {axes.map((a) => (
            <li key={a.slug}>
              {`${a.name} : ${dureeLabel(a.minutes)} de révision, ${Math.round(
                a.share * 100,
              )} % de ton travail`}
              {a.weight !== null
                ? `, pèse ${Math.round(a.weight * 100)} % de ton épreuve`
                : ''}
              {a.moyenne !== null ? `, moyenne ${noteLabel(a.moyenne)}` : ''}
              {a.verdict === 'en_retard' ? ', sous la moyenne' : ''}
            </li>
          ))}
        </ul>
      </figcaption>

      <Legende barème={barème !== null} />
    </figure>
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
