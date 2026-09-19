// -----------------------------------------------------------------------------
// LES PROJECTIONS DES FONDS DE CARTE — partagées par le script qui dessine les
// fonds (scripts/cartes-exercices.ts) et par l'écran qui y pose des points.
//
// Un lieu (Lyon, Carthage, Tokyo) s'écrit en longitude/latitude dans le
// contenu ; l'écran le projette avec EXACTEMENT la formule qui a servi à
// dessiner le fond — sinon Lyon tomberait à côté du Rhône.
//
//   france        conique conforme de Lambert (parallèles 44° et 49°, comme
//                 le Lambert-93 de l'IGN) : la France « a sa vraie forme »
//   mediterranee  Lambert aussi (30° et 42°) : du détroit de Gibraltar au Golfe
//   europe        Lambert (40° et 60°)
//   monde         Equal Earth : les continents gardent leurs vraies surfaces,
//                 sans l'Afrique rétrécie du Mercator
//
// Les coordonnées sortent dans le repère SVG du fond (x vers la droite, y vers
// le bas), à l'échelle choisie pour que la largeur fasse `largeur` unités.
// -----------------------------------------------------------------------------

export type Fond = 'france' | 'monde' | 'mediterranee' | 'europe'

const RAD = Math.PI / 180

type Brut = (lon: number, lat: number) => [number, number]

/** Conique conforme de Lambert (sphère), y vers le NORD. */
function lambert(lon0: number, lat0: number, lat1: number, lat2: number): Brut {
  const p1 = lat1 * RAD
  const p2 = lat2 * RAD
  const n =
    Math.log(Math.cos(p1) / Math.cos(p2)) /
    Math.log(Math.tan(Math.PI / 4 + p2 / 2) / Math.tan(Math.PI / 4 + p1 / 2))
  const F = (Math.cos(p1) * Math.pow(Math.tan(Math.PI / 4 + p1 / 2), n)) / n
  const rho = (lat: number) => F / Math.pow(Math.tan(Math.PI / 4 + (lat * RAD) / 2), n)
  const rho0 = rho(lat0)
  return (lon, lat) => {
    const r = rho(lat)
    const t = n * (lon - lon0) * RAD
    return [r * Math.sin(t), rho0 - r * Math.cos(t)]
  }
}

/** Equal Earth (Šavrič, Patterson, Jenny 2018), y vers le NORD. */
const equalEarth: Brut = (lon, lat) => {
  const A1 = 1.340264
  const A2 = -0.081106
  const A3 = 0.000893
  const A4 = 0.003796
  const M = Math.sqrt(3) / 2
  const l = lon * RAD
  const p = Math.asin(M * Math.sin(lat * RAD))
  const p2 = p * p
  const p6 = p2 * p2 * p2
  const x = (l * Math.cos(p)) / (M * (A1 + 3 * A2 * p2 + p6 * (7 * A3 + 9 * A4 * p2)))
  const y = p * (A1 + A2 * p2 + p6 * (A3 + A4 * p2))
  return [x, y]
}

/**
 * Chaque fond : sa projection brute, son emprise en lon/lat (ce que le fond
 * montre) et la largeur de son repère SVG. L'échelle et le décalage se
 * déduisent de l'emprise, une fois pour toutes.
 */
export const EMPRISES: Record<Fond, { brut: Brut; emprise: [number, number, number, number]; largeur: number }> = {
  france: { brut: lambert(3, 46.5, 44, 49), emprise: [-5.6, 41.2, 10.2, 51.65], largeur: 600 },
  mediterranee: { brut: lambert(20, 36, 30, 42), emprise: [-11, 22, 52, 48], largeur: 900 },
  europe: { brut: lambert(12, 52, 40, 60), emprise: [-25, 33, 45, 71], largeur: 800 },
  monde: { brut: equalEarth, emprise: [-180, -60, 180, 84], largeur: 1000 },
}

type Repere = { echelle: number; x0: number; y0: number; largeur: number; hauteur: number }

/** Le cadre projeté d'une emprise : on échantillonne son contour (une conique courbe les parallèles). */
function cadreProjete(brut: Brut, [lonMin, latMin, lonMax, latMax]: [number, number, number, number]) {
  let xmin = Infinity
  let xmax = -Infinity
  let ymin = Infinity
  let ymax = -Infinity
  const N = 24
  for (let i = 0; i <= N; i++) {
    for (const [lon, lat] of [
      [lonMin + ((lonMax - lonMin) * i) / N, latMin],
      [lonMin + ((lonMax - lonMin) * i) / N, latMax],
      [lonMin, latMin + ((latMax - latMin) * i) / N],
      [lonMax, latMin + ((latMax - latMin) * i) / N],
    ]) {
      const [x, y] = brut(lon, lat)
      xmin = Math.min(xmin, x)
      xmax = Math.max(xmax, x)
      ymin = Math.min(ymin, y)
      ymax = Math.max(ymax, y)
    }
  }
  return { xmin, xmax, ymin, ymax }
}

const reperes = new Map<Fond, Repere>()

function repere(fond: Fond): Repere {
  const deja = reperes.get(fond)
  if (deja) return deja
  const { brut, emprise, largeur } = EMPRISES[fond]
  const c = cadreProjete(brut, emprise)
  const echelle = largeur / (c.xmax - c.xmin)
  const r = {
    echelle,
    x0: c.xmin,
    y0: c.ymax,
    largeur,
    hauteur: Math.round((c.ymax - c.ymin) * echelle),
  }
  reperes.set(fond, r)
  return r
}

/** Largeur et hauteur du repère SVG d'un fond. */
export function dimensions(fond: Fond): { largeur: number; hauteur: number } {
  const r = repere(fond)
  return { largeur: r.largeur, hauteur: r.hauteur }
}

/** [lon, lat] → [x, y] dans le repère SVG du fond. */
export function projeter(fond: Fond, lon: number, lat: number): [number, number] {
  const r = repere(fond)
  const [bx, by] = EMPRISES[fond].brut(lon, lat)
  return [(bx - r.x0) * r.echelle, (r.y0 - by) * r.echelle]
}

/** La boîte SVG [x, y, l, h] d'un recadrage donné en lon/lat. */
export function boiteDuCadrage(fond: Fond, cadrage: [number, number, number, number]): [number, number, number, number] {
  const r = repere(fond)
  const c = cadreProjete(EMPRISES[fond].brut, cadrage)
  const x = (c.xmin - r.x0) * r.echelle
  const y = (r.y0 - c.ymax) * r.echelle
  return [x, y, (c.xmax - c.xmin) * r.echelle, (c.ymax - c.ymin) * r.echelle]
}
