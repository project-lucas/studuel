// -----------------------------------------------------------------------------
// LES COURBES DE L'ONGLET MOI — un tracé arrondi, en SVG, sans bibliothèque.
//
// La référence visuelle (applications de santé) tient en une seule idée : la
// courbe n'est pas un graphique scientifique, c'est une VAGUE. Angles arrondis,
// trait épais, halo dégradé en dessous, un point posé au bout. On lit une
// tendance d'un coup d'œil, pas une valeur au pixel.
//
// POURQUOI PAS RECHARTS. La trajectoire au bac l'utilise, et c'est justifié :
// deux courbes projetées, une zone d'écart, des axes. Ici on dessine UNE
// polyligne arrondie — l'embarquer coûterait plus cher en octets que le tracé
// lui-même, et sa forme par défaut (angles vifs, points ronds) est exactement ce
// qu'on ne veut pas.
//
// UNE SEULE PRIMITIVE pour les deux formes des maquettes : `cheminArrondi`
// arrondit les angles d'une polyligne quelconque. Une série de valeurs continues
// (le temps de travail) donne une vague ; une série de OUI/NON (une habitude
// tenue ou non) donne un créneau — et un créneau aux angles arrondis EST le
// tracé des maquettes.
//
// Logique pure, aucun DOM. Le repère est celui du SVG : y augmente vers le BAS,
// donc une valeur haute a un petit y.
// -----------------------------------------------------------------------------

export type Point = { x: number; y: number }

/** Deux décimales : au-delà, on allonge le HTML sans rien voir de plus. */
const arrondi = (n: number) => Math.round(n * 100) / 100

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y)
}

/** Le point situé à `d` de `depuis`, en allant vers `vers`. */
function versLe(depuis: Point, vers: Point, d: number): Point {
  const longueur = distance(depuis, vers)
  if (longueur === 0) return { ...depuis }
  const ratio = Math.min(1, d / longueur)
  return {
    x: depuis.x + (vers.x - depuis.x) * ratio,
    y: depuis.y + (vers.y - depuis.y) * ratio,
  }
}

/**
 * Le chemin SVG d'une polyligne dont chaque angle est adouci par une courbe.
 *
 * Le rayon est RABOTÉ à la moitié du plus court des deux segments qui forment
 * l'angle : sans ce garde-fou, deux points rapprochés produisent des courbes qui
 * se chevauchent et le tracé part en nœud (visible dès qu'une semaine sur deux
 * est vide).
 */
export function cheminArrondi(points: readonly Point[], rayon: number): string {
  if (points.length === 0) return ''
  const p = points.map((pt) => ({ x: arrondi(pt.x), y: arrondi(pt.y) }))
  if (p.length === 1) return `M ${p[0].x} ${p[0].y}`

  let d = `M ${p[0].x} ${p[0].y}`
  for (let i = 1; i < p.length - 1; i++) {
    const avant = p[i - 1]
    const ici = p[i]
    const apres = p[i + 1]
    const r = Math.max(
      0,
      Math.min(rayon, distance(avant, ici) / 2, distance(ici, apres) / 2),
    )
    if (r === 0) {
      d += ` L ${ici.x} ${ici.y}`
      continue
    }
    const entree = versLe(ici, avant, r)
    const sortie = versLe(ici, apres, r)
    d += ` L ${arrondi(entree.x)} ${arrondi(entree.y)}`
    d += ` Q ${ici.x} ${ici.y} ${arrondi(sortie.x)} ${arrondi(sortie.y)}`
  }
  const dernier = p[p.length - 1]
  return `${d} L ${dernier.x} ${dernier.y}`
}

/** Le même chemin refermé sur le bas du cadre : la surface du halo dégradé. */
export function cheminRempli(
  chemin: string,
  points: readonly Point[],
  bas: number,
): string {
  if (points.length === 0 || chemin === '') return ''
  const premier = points[0]
  const dernier = points[points.length - 1]
  return `${chemin} L ${arrondi(dernier.x)} ${arrondi(bas)} L ${arrondi(premier.x)} ${arrondi(bas)} Z`
}

/**
 * Une série de valeurs → des points, mise à l'échelle du cadre.
 *
 * Le maximum est celui de la SÉRIE, jamais une constante : chaque courbe
 * raconte sa propre amplitude. Une série toute plate (ou vide de tout relief)
 * se pose à mi-hauteur plutôt qu'écrasée sur le bord — collée en bas, elle se
 * confondrait avec l'axe et donnerait l'impression d'un zéro.
 */
export function pointsDeSerie(
  valeurs: readonly number[],
  largeur: number,
  hauteur: number,
  marge = 0,
): Point[] {
  const n = valeurs.length
  if (n === 0) return []
  const haut = marge
  const bas = hauteur - marge
  const pas = n === 1 ? 0 : (largeur - marge * 2) / (n - 1)
  const max = valeurs.reduce((m, v) => Math.max(m, Number.isFinite(v) ? v : 0), 0)

  return valeurs.map((valeur, i) => {
    const v = Number.isFinite(valeur) ? Math.max(0, valeur) : 0
    const ratio = max === 0 ? 0.5 : v / max
    return { x: marge + i * pas, y: bas - ratio * (bas - haut) }
  })
}

/**
 * Une série de OUI/NON → un CRÉNEAU (un palier par jour, pas une diagonale).
 *
 * C'est la forme honnête pour une habitude : « tenue mardi » vaut pour tout
 * mardi, et une diagonale entre mardi et mercredi dessinerait une progression
 * continue qui n'existe pas. Chaque jour occupe donc une marche, et deux points
 * par marche suffisent — l'arrondi de `cheminArrondi` fait le reste.
 */
export function pointsDeCreneau(
  valeurs: readonly boolean[],
  largeur: number,
  hauteur: number,
  marge = 0,
): Point[] {
  const n = valeurs.length
  if (n === 0) return []
  const haut = marge
  const bas = hauteur - marge
  const pas = (largeur - marge * 2) / n

  const points: Point[] = []
  valeurs.forEach((tenu, i) => {
    const y = tenu ? haut : bas
    points.push({ x: marge + i * pas, y })
    points.push({ x: marge + (i + 1) * pas, y })
  })
  return points
}
