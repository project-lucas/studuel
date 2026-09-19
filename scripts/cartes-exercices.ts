// -----------------------------------------------------------------------------
// LES FONDS DE CARTE DES EXERCICES — fabriqués une fois, rangés dans le dépôt.
//
//   node node_modules/jiti/lib/jiti-cli.mjs scripts/cartes-exercices.ts <dossier-geojson>
//
// Écrit lib/exercices/cartes/fonds/{france,monde,mediterranee,europe}.ts et
// lib/exercices/cartes/codes.ts. Les contours sont PROJETÉS (même formule que
// l'écran, lib/exercices/cartes/projections.ts), DÉCOUPÉS au cadre du fond,
// SIMPLIFIÉS (Douglas-Peucker, au demi-pixel) et arrondis au dixième : un fond
// pèse quelques dizaines de Ko, chargé seulement quand un exercice l'affiche.
//
// SOURCES (à télécharger dans <dossier-geojson>) :
//   · Natural Earth — domaine public — https://www.naturalearthdata.com
//     (github.com/nvkelso/natural-earth-vector/tree/master/geojson) :
//       ne_110m_admin_0_countries, ne_50m_admin_0_countries, ne_50m_land,
//       ne_10m_rivers_lake_centerlines, ne_50m_rivers_lake_centerlines,
//       ne_10m_rivers_europe, ne_10m_geography_regions_polys
//   · Régions de France simplifiées — Grégoire David, d'après l'IGN (Admin
//     Express), Licence Ouverte — github.com/gregoiredavid/france-geojson :
//       regions-version-simplifiee.geojson → fr-regions.geojson
//       metropole-version-simplifiee.geojson → fr-metropole.geojson
// -----------------------------------------------------------------------------

import fs from 'node:fs'
import path from 'node:path'
import { dimensions, EMPRISES, projeter, type Fond } from '../lib/exercices/cartes/projections'
import type { DonneesFond, EtiquetteFond, TraceFond, ZoneFond } from '../lib/exercices/cartes/donnees'

type Pt = [number, number]
type Anneau = Pt[]
type Geometrie =
  | { type: 'Polygon'; coordinates: Pt[][] }
  | { type: 'MultiPolygon'; coordinates: Pt[][][] }
  | { type: 'LineString'; coordinates: Pt[] }
  | { type: 'MultiLineString'; coordinates: Pt[][] }
type Entite = { properties: Record<string, unknown>; geometry: Geometrie | null }

const DATA = process.argv[2]
if (!DATA) {
  console.error('Usage : cartes-exercices.ts <dossier-geojson>')
  process.exit(1)
}
const lire = (nom: string): Entite[] => {
  const brut = JSON.parse(fs.readFileSync(path.join(DATA, `${nom}.geojson`), 'utf8'))
  // Une FeatureCollection, ou une Feature seule (le contour de la métropole).
  return (brut.type === 'Feature' ? [brut] : brut.features) as Entite[]
}

const SORTIE = path.join(process.cwd(), 'lib', 'exercices', 'cartes')

// ------------------------------------------------------------- géométrie

type Boite = [number, number, number, number]

function polygones(g: Geometrie | null): Pt[][][] {
  if (!g) return []
  if (g.type === 'Polygon') return [g.coordinates]
  if (g.type === 'MultiPolygon') return g.coordinates
  return []
}

function lignes(g: Geometrie | null): Pt[][] {
  if (!g) return []
  if (g.type === 'LineString') return [g.coordinates]
  if (g.type === 'MultiLineString') return g.coordinates
  return []
}

/** Densifie un anneau en lon/lat (une conique courbe les longs segments). */
function densifier(a: Pt[], pasDeg = 1): Pt[] {
  const out: Pt[] = []
  for (let i = 0; i < a.length; i++) {
    const p = a[i]
    out.push(p)
    const q = a[i + 1]
    if (!q) continue
    const d = Math.max(Math.abs(q[0] - p[0]), Math.abs(q[1] - p[1]))
    const n = Math.floor(d / pasDeg)
    for (let k = 1; k <= n; k++) {
      const t = k / (n + 1)
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t])
    }
  }
  return out
}

const proj = (fond: Fond, a: Pt[]): Pt[] => densifier(a).map(([lon, lat]) => projeter(fond, lon, lat))

/** Sutherland–Hodgman : un anneau découpé par la boîte. */
function decouperPolygone(a: Anneau, [x0, y0, x1, y1]: Boite): Anneau {
  const bords: [(p: Pt) => boolean, (p: Pt, q: Pt) => Pt][] = [
    [(p) => p[0] >= x0, (p, q) => [x0, p[1] + ((q[1] - p[1]) * (x0 - p[0])) / (q[0] - p[0])]],
    [(p) => p[0] <= x1, (p, q) => [x1, p[1] + ((q[1] - p[1]) * (x1 - p[0])) / (q[0] - p[0])]],
    [(p) => p[1] >= y0, (p, q) => [p[0] + ((q[0] - p[0]) * (y0 - p[1])) / (q[1] - p[1]), y0]],
    [(p) => p[1] <= y1, (p, q) => [p[0] + ((q[0] - p[0]) * (y1 - p[1])) / (q[1] - p[1]), y1]],
  ]
  let sortie = a
  for (const [dedans, couper] of bords) {
    const entree = sortie
    sortie = []
    if (entree.length === 0) break
    let s = entree[entree.length - 1]
    for (const e of entree) {
      if (dedans(e)) {
        if (!dedans(s)) sortie.push(couper(s, e))
        sortie.push(e)
      } else if (dedans(s)) {
        sortie.push(couper(s, e))
      }
      s = e
    }
  }
  return sortie
}

/** Une ligne découpée par la boîte : ses morceaux intérieurs. */
function decouperLigne(l: Pt[], [x0, y0, x1, y1]: Boite): Pt[][] {
  const dedans = (p: Pt) => p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1
  const morceaux: Pt[][] = []
  let courant: Pt[] = []
  for (const p of l) {
    if (dedans(p)) courant.push(p)
    else if (courant.length) {
      morceaux.push(courant)
      courant = []
    }
  }
  if (courant.length) morceaux.push(courant)
  return morceaux.filter((m) => m.length > 1)
}

function distanceSegment(p: Pt, a: Pt, b: Pt): number {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const l2 = dx * dx + dy * dy
  if (l2 === 0) return Math.hypot(p[0] - a[0], p[1] - a[1])
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2))
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy))
}

/** Douglas-Peucker. */
function simplifier(pts: Pt[], tol: number): Pt[] {
  if (pts.length < 3) return pts
  let max = 0
  let idx = 0
  for (let i = 1; i < pts.length - 1; i++) {
    const d = distanceSegment(pts[i], pts[0], pts[pts.length - 1])
    if (d > max) {
      max = d
      idx = i
    }
  }
  if (max <= tol) return [pts[0], pts[pts.length - 1]]
  return [...simplifier(pts.slice(0, idx + 1), tol).slice(0, -1), ...simplifier(pts.slice(idx), tol)]
}

/** Un anneau fermé simplifié : on le coupe en deux pour garder sa forme. */
function simplifierAnneau(a: Anneau, tol: number): Anneau {
  if (a.length < 8) return a
  const m = Math.floor(a.length / 2)
  return [...simplifier(a.slice(0, m + 1), tol).slice(0, -1), ...simplifier(a.slice(m), tol)]
}

function aire(a: Anneau): number {
  let s = 0
  for (let i = 0; i < a.length; i++) {
    const [x1, y1] = a[i]
    const [x2, y2] = a[(i + 1) % a.length]
    s += x1 * y2 - x2 * y1
  }
  return s / 2
}

function centroide(a: Anneau): Pt {
  let cx = 0
  let cy = 0
  let s = 0
  for (let i = 0; i < a.length; i++) {
    const [x1, y1] = a[i]
    const [x2, y2] = a[(i + 1) % a.length]
    const f = x1 * y2 - x2 * y1
    cx += (x1 + x2) * f
    cy += (y1 + y2) * f
    s += f
  }
  if (s === 0) return a[0]
  return [cx / (3 * s), cy / (3 * s)]
}

const r1 = (n: number) => Math.round(n * 10) / 10

/** Un tracé SVG compact : premier point absolu, puis déplacements relatifs. */
function versD(chemins: Pt[][], ferme: boolean): string {
  let d = ''
  for (const c of chemins) {
    if (c.length < 2) continue
    const pts = c.map(([x, y]) => [r1(x), r1(y)] as Pt)
    d += `M${pts[0][0]} ${pts[0][1]}`
    let [px, py] = pts[0]
    let l = ''
    for (let i = 1; i < pts.length; i++) {
      const dx = r1(pts[i][0] - px)
      const dy = r1(pts[i][1] - py)
      if (dx === 0 && dy === 0) continue
      l += `${l ? ' ' : 'l'}${dx} ${dy}`
      px = pts[i][0]
      py = pts[i][1]
    }
    d += l + (ferme ? 'z' : '')
  }
  return d.replace(/ -/g, '-')
}

type Reglages = { tol: number; aireMin: number; marge: number }

function boite(fond: Fond, marge: number): Boite {
  const { largeur, hauteur } = dimensions(fond)
  return [-marge, -marge, largeur + marge, hauteur + marge]
}

/**
 * La boîte en lon/lat où l'on découpe AVANT de projeter (fonds régionaux).
 *
 * Une conique ne sait pas projeter la Terre entière : un point à 170° de son
 * méridien central fait le tour du cône, et un anneau géant (l'Eurasie de
 * Natural Earth, l'Afrique) se retourne sur lui-même — la découpe dans le plan
 * rendait alors un polygone qui s'annule, et la Méditerranée perdait ses
 * terres. On découpe donc d'abord en degrés, avec une marge, puis on projette.
 */
function boiteDegres(fond: Fond): Boite | null {
  if (fond === 'monde') return null
  const [lonMin, latMin, lonMax, latMax] = EMPRISES[fond].emprise
  return [lonMin - 8, latMin - 6, lonMax + 8, latMax + 6]
}

/** Les anneaux projetés, découpés et simplifiés d'une géométrie. */
function anneaux(fond: Fond, g: Geometrie | null, r: Reglages): Anneau[] {
  const b = boite(fond, r.marge)
  const bd = boiteDegres(fond)
  const out: Anneau[] = []
  for (const poly of polygones(g)) {
    for (const ring of poly) {
      const enDegres = bd ? decouperPolygone(ring, bd) : ring
      if (enDegres.length < 3) continue
      const coupe = decouperPolygone(proj(fond, enDegres), b)
      if (coupe.length < 3) continue
      const simple = simplifierAnneau(coupe, r.tol)
      if (simple.length < 3 || Math.abs(aire(simple)) < r.aireMin) continue
      out.push(simple)
    }
  }
  return out
}

function traits(fond: Fond, entites: Entite[], r: Reglages): Pt[][] {
  const b = boite(fond, r.marge)
  const bd = boiteDegres(fond)
  const out: Pt[][] = []
  for (const e of entites)
    for (const brute of lignes(e.geometry))
      for (const l of bd ? decouperLigne(brute, bd) : [brute])
      for (const m of decouperLigne(proj(fond, l), b)) {
        const s = simplifier(m, r.tol)
        if (s.length > 1) out.push(s)
      }
  return out
}

function zoneDe(code: string, nom: string, rings: Anneau[], continent?: string): ZoneFond | null {
  if (rings.length === 0) return null
  const plus = rings.reduce((a, b) => (Math.abs(aire(b)) > Math.abs(aire(a)) ? b : a))
  const [cx, cy] = centroide(plus)
  return { code, nom, d: versD(rings, true), cx: r1(cx), cy: r1(cy), ...(continent ? { continent } : {}) }
}

function etiquette(fond: Fond, texte: string, lon: number, lat: number, style: EtiquetteFond['style']): EtiquetteFond {
  const [x, y] = projeter(fond, lon, lat)
  return { texte, x: r1(x), y: r1(y), style }
}

// ------------------------------------------------------------- les sources

const pays110 = lire('ne_110m_admin_0_countries')
const pays50 = lire('ne_50m_admin_0_countries')
const terre50 = lire('ne_50m_land')
const fleuves10 = [...lire('ne_10m_rivers_lake_centerlines'), ...lire('ne_10m_rivers_europe')]
const fleuves50 = lire('ne_50m_rivers_lake_centerlines')
const regionsGeo = lire('ne_10m_geography_regions_polys')
const regionsFr = lire('fr-regions')
const metropole = lire('fr-metropole')

const nomDe = (e: Entite) => String(e.properties.name ?? e.properties.NAME ?? '')

/** Les fleuves : id, nom français, noms Natural Earth. */
const FLEUVES: [string, string, string[]][] = [
  ['seine', 'Seine', ['Seine']],
  ['loire', 'Loire', ['Loire']],
  ['garonne', 'Garonne', ['Garonne']],
  ['rhone', 'Rhône', ['Rhône']],
  ['rhin', 'Rhin', ['Rhin', 'Rhine']],
  ['dordogne', 'Dordogne', ['Dordogne']],
  ['marne', 'Marne', ['Marne']],
  ['vienne', 'Vienne', ['Vienne']],
  ['tarn', 'Tarn', ['Tarn']],
  ['durance', 'Durance', ['Durance']],
  ['moselle', 'Moselle', ['Mosel']],
  ['meuse', 'Meuse', ['Maas']],
  ['saone', 'Saône', ['Saône']],
  ['lot', 'Lot', ['Lot']],
  ['allier', 'Allier', ['Allier']],
  ['adour', 'Adour', ['Adour']],
  ['charente', 'Charente', ['Charente']],
  ['po', 'Pô', ['Po']],
  ['tibre', 'Tibre', ['Tevere']],
  ['ebre', 'Èbre', ['Ebro']],
  ['tage', 'Tage', ['Tajo', 'Tejo']],
  ['douro', 'Douro', ['Duero']],
  ['guadalquivir', 'Guadalquivir', ['Guadalquivir']],
  ['danube', 'Danube', ['Danube']],
  ['elbe', 'Elbe', ['Elbe']],
  ['oder', 'Oder', ['Oder']],
  ['vistule', 'Vistule', ['Vistula']],
  ['tamise', 'Tamise', ['Thames']],
  ['dniepr', 'Dniepr', ['Dnipro']],
  ['volga', 'Volga', ['Volga']],
  ['nil', 'Nil', ['Nile']],
  ['tigre', 'Tigre', ['Tigris']],
  ['euphrate', 'Euphrate', ['Euphrates']],
  ['jourdain', 'Jourdain', ['Jordan']],
  ['amazone', 'Amazone', ['Amazonas']],
  ['mississippi', 'Mississippi', ['Mississippi']],
  ['yangzi', 'Yangzi Jiang', ['Yangtze']],
  ['huang-he', 'Huang He', ['Huang']],
  ['gange', 'Gange', ['Ganges']],
  ['indus', 'Indus', ['Indus']],
  ['niger', 'Niger', ['Niger']],
  ['congo', 'Congo', ['Congo']],
  ['mekong', 'Mékong', ['Mekong']],
  ['senegal', 'Sénégal', ['Sénégal']],
  ['zambeze', 'Zambèze', ['Zambezi']],
  ['saint-laurent', 'Saint-Laurent', ['St. Lawrence']],
  ['parana', 'Paraná', ['Paraná']],
  ['ob', 'Ob', ['Ob']],
  ['ienissei', 'Ienisseï', ['Yenisey']],
  ['lena', 'Léna', ['Lena']],
  ['brahmaputra', 'Brahmapoutre', ['Brahmaputra']],
]

/** Les massifs et déserts : id, nom français, noms Natural Earth. */
const RELIEFS: [string, string, string[]][] = [
  ['alpes', 'Alpes', ['ALPS']],
  ['pyrenees', 'Pyrénées', ['PYRENEES']],
  ['massif-central', 'Massif central', ['Massif Central']],
  ['jura', 'Jura', ['Jura']],
  ['vosges', 'Vosges', ['Vosges']],
  ['ardennes', 'Ardennes', ['Ardennes']],
  ['apennins', 'Apennins', ['APPENNINI']],
  ['carpates', 'Carpates', ['CARPATHIAN MOUNTAINS']],
  ['balkans', 'Balkans', ['Balkan Mts.']],
  ['alpes-dinariques', 'Alpes dinariques', ['Dinaric Alps']],
  ['pinde', 'Pinde', ['Pindus Mts.']],
  ['caucase', 'Caucase', ['CAUCASUS MTS.']],
  ['oural', 'Oural', ['URAL MOUNTAINS']],
  ['alpes-scandinaves', 'Alpes scandinaves', ['KJØLEN MOUNTAINS']],
  ['atlas', 'Atlas', ['ATLAS MOUNTAINS', 'HAUT ATLAS', 'ATLAS SAHARIEN', 'Moyen Atlas', 'Atlas Tellien']],
  ['taurus', 'Taurus', ['Taurus Mts.']],
  ['zagros', 'Zagros', ['ZAGROS MOUNTAINS']],
  ['liban', 'Mont Liban', ['Lebanon Mts.']],
  ['himalaya', 'Himalaya', ['HIMALAYAS']],
  ['andes', 'Andes', ['ANDES']],
  ['rocheuses', 'Rocheuses', ['ROCKY MOUNTAINS']],
  ['appalaches', 'Appalaches', ['APPALACHIAN MTS.']],
  ['tibet', 'Plateau tibétain', ['PLATEAU OF TIBET']],
  ['tian-shan', 'Tian Shan', ['TIAN SHAN']],
]

const DESERTS: [string, string, string[]][] = [
  ['sahara', 'Sahara', ['SAHARA']],
  ['gobi', 'Gobi', ['GOBI DESERT']],
  ['kalahari', 'Kalahari', ['KALAHARI DESERT']],
  ['namib', 'Namib', ['NAMIB DESERT']],
  ['atacama', 'Atacama', ['DESIERTO DE ATACAMA']],
  ['arabie', 'Rub al-Khali', ['RUB’ AL KHALI']],
  ['syrie', 'Désert de Syrie', ['SYRIAN DESERT']],
  ['thar', 'Thar', ['THAR DESERT']],
  ['australie', 'Grand désert de Victoria', ['GREAT VICTORIA DESERT', 'GREAT SANDY DESERT']],
]

function tracesFleuves(fond: Fond, ids: string[], source: Entite[], r: Reglages): TraceFond[] {
  const out: TraceFond[] = []
  for (const [id, nom, noms] of FLEUVES) {
    if (!ids.includes(id)) continue
    const ents = source.filter((e) => noms.includes(nomDe(e)))
    const t = traits(fond, ents, r)
    if (t.length) out.push({ id, nom, d: versD(t, false) })
  }
  return out
}

function tracesPolygones(fond: Fond, table: [string, string, string[]][], ids: string[], r: Reglages): TraceFond[] {
  const out: TraceFond[] = []
  for (const [id, nom, noms] of table) {
    if (!ids.includes(id)) continue
    const ents = regionsGeo.filter((e) => noms.includes(nomDe(e)))
    const rings = ents.flatMap((e) => anneaux(fond, e.geometry, r))
    if (rings.length) out.push({ id, nom, d: versD(rings, true) })
  }
  return out
}

const code3 = (e: Entite) => String(e.properties.ADM0_A3)
const nomFr = (e: Entite) => String(e.properties.NAME_FR ?? e.properties.NAME)
const CONTINENTS: Record<string, string> = {
  Africa: 'afrique',
  Europe: 'europe',
  Asia: 'asie',
  'North America': 'amerique-nord',
  'South America': 'amerique-sud',
  Oceania: 'oceanie',
  Antarctica: 'antarctique',
  'Seven seas (open ocean)': 'oceanie',
}

function zonesPays(fond: Fond, source: Entite[], r: Reglages, exclure: string[] = []): ZoneFond[] {
  const out: ZoneFond[] = []
  for (const e of source) {
    const code = code3(e)
    if (exclure.includes(code)) continue
    const z = zoneDe(code, nomFr(e), anneaux(fond, e.geometry, r), CONTINENTS[String(e.properties.CONTINENT)])
    if (z) out.push(z)
  }
  return out.sort((a, b) => a.code.localeCompare(b.code))
}

function terreDe(fond: Fond, source: Entite[], r: Reglages): string {
  return versD(
    source.flatMap((e) => anneaux(fond, e.geometry, r)),
    true,
  )
}

// ------------------------------------------------------------- les fonds

/** Le bord du fond : son emprise projetée, échantillonnée (ovale pour le monde). */
function contourDe(fond: Fond): string {
  const [lonMin, latMin, lonMax, latMax] = EMPRISES[fond].emprise
  const pts: Pt[] = []
  for (let lat = latMin; lat <= latMax; lat += 1) pts.push([lonMin, lat])
  for (let lon = lonMin; lon <= lonMax; lon += 1) pts.push([lon, latMax])
  for (let lat = latMax; lat >= latMin; lat -= 1) pts.push([lonMax, lat])
  for (let lon = lonMax; lon >= lonMin; lon -= 1) pts.push([lon, latMin])
  return versD([simplifier(pts.map(([lon, lat]) => projeter(fond, lon, lat)), 0.3)], true)
}

const INSEE_VERS_ISO: Record<string, string> = {
  '11': 'IDF',
  '24': 'CVL',
  '27': 'BFC',
  '28': 'NOR',
  '32': 'HDF',
  '44': 'GES',
  '52': 'PDL',
  '53': 'BRE',
  '75': 'NAQ',
  '76': 'OCC',
  '84': 'ARA',
  '93': 'PAC',
  '94': 'COR',
}

/** Où écrire le nom d'une région quand le centroïde tombe mal. */
const ETIQUETTES_REGIONS: Record<string, [number, number]> = {
  PAC: [6.2, 43.95],
  ARA: [4.6, 45.45],
  OCC: [2.2, 43.75],
  NAQ: [0.4, 45.3],
  HDF: [2.75, 49.95],
}

function fondFrance(): DonneesFond {
  const fond: Fond = 'france'
  const r: Reglages = { tol: 0.35, aireMin: 2, marge: 12 }
  const voisins = pays50.filter((e) => code3(e) !== 'FRA')
  const zones: ZoneFond[] = []
  for (const e of regionsFr) {
    const code = INSEE_VERS_ISO[String(e.properties.code)]
    if (!code) continue
    const z = zoneDe(code, String(e.properties.nom), anneaux(fond, e.geometry, r))
    if (!z) continue
    const fixe = ETIQUETTES_REGIONS[code]
    if (fixe) {
      const [x, y] = projeter(fond, fixe[0], fixe[1])
      z.cx = r1(x)
      z.cy = r1(y)
    }
    zones.push(z)
  }
  const { largeur, hauteur } = dimensions(fond)
  return {
    fond,
    largeur,
    hauteur,
    contour: contourDe(fond),
    silhouette: versD(metropole.flatMap((e) => anneaux(fond, e.geometry, r)), true),
    terre: terreDe(fond, voisins, r),
    zones: zones.sort((a, b) => a.code.localeCompare(b.code)),
    fleuves: tracesFleuves(
      fond,
      ['seine', 'loire', 'garonne', 'rhone', 'rhin', 'dordogne', 'marne', 'vienne', 'tarn', 'durance', 'moselle', 'meuse', 'saone', 'lot', 'allier', 'adour', 'charente'],
      fleuves10,
      { ...r, tol: 0.5 },
    ),
    reliefs: tracesPolygones(fond, RELIEFS, ['alpes', 'pyrenees', 'massif-central', 'jura', 'vosges', 'ardennes'], {
      ...r,
      tol: 0.8,
    }),
    deserts: [],
    reperes: [],
    etiquettes: [
      etiquette(fond, 'Manche', -2.2, 50.05, 'mer'),
      etiquette(fond, 'Mer du Nord', 2.4, 51.55, 'mer'),
      etiquette(fond, 'Océan Atlantique', -4.2, 45.6, 'mer'),
      etiquette(fond, 'Mer Méditerranée', 5.6, 42.3, 'mer'),
      etiquette(fond, 'Royaume-Uni', -1.6, 51.15, 'pays'),
      etiquette(fond, 'Belgique', 4.6, 50.5, 'pays'),
      etiquette(fond, 'Allemagne', 9.0, 50.2, 'pays'),
      etiquette(fond, 'Suisse', 8.1, 46.75, 'pays'),
      etiquette(fond, 'Italie', 8.6, 44.9, 'pays'),
      etiquette(fond, 'Espagne', -2.6, 42.2, 'pays'),
      etiquette(fond, 'Lux.', 6.1, 49.75, 'pays'),
    ],
  }
}

function reperesMonde(fond: Fond): TraceFond[] {
  const ligne = (lat: number): string => {
    const pts: Pt[] = []
    for (let lon = -180; lon <= 180; lon += 2) pts.push(projeter(fond, lon, lat))
    return versD([pts], false)
  }
  return [
    { id: 'equateur', nom: 'Équateur', d: ligne(0) },
    { id: 'tropique-cancer', nom: 'Tropique du Cancer', d: ligne(23.44) },
    { id: 'tropique-capricorne', nom: 'Tropique du Capricorne', d: ligne(-23.44) },
    { id: 'cercle-arctique', nom: 'Cercle polaire arctique', d: ligne(66.56) },
    { id: 'cercle-antarctique', nom: 'Cercle polaire antarctique', d: ligne(-66.56) },
  ]
}

function fondMonde(): DonneesFond {
  const fond: Fond = 'monde'
  const r: Reglages = { tol: 0.55, aireMin: 3, marge: 6 }
  const { largeur, hauteur } = dimensions(fond)
  return {
    fond,
    largeur,
    hauteur,
    contour: contourDe(fond),
    silhouette: '',
    terre: '',
    zones: zonesPays(fond, pays110, r, ['ATA']),
    fleuves: tracesFleuves(
      fond,
      ['nil', 'amazone', 'mississippi', 'yangzi', 'huang-he', 'gange', 'indus', 'niger', 'congo', 'mekong', 'volga', 'danube', 'saint-laurent', 'ob', 'ienissei', 'lena', 'parana', 'zambeze', 'brahmaputra'],
      fleuves50,
      { ...r, tol: 0.8 },
    ),
    reliefs: tracesPolygones(fond, RELIEFS, ['himalaya', 'andes', 'rocheuses', 'alpes', 'oural', 'atlas', 'appalaches', 'tibet', 'caucase'], {
      ...r,
      tol: 1,
    }),
    deserts: tracesPolygones(fond, DESERTS, DESERTS.map(([id]) => id), { ...r, tol: 1 }),
    reperes: reperesMonde(fond),
    etiquettes: [
      // Un nom par océan, loin des bords (le planisphère est petit sur un téléphone).
      etiquette(fond, 'Océan Pacifique', -135, -12, 'mer'),
      etiquette(fond, 'Océan Atlantique', -35, 15, 'mer'),
      etiquette(fond, 'Océan Indien', 78, -25, 'mer'),
      etiquette(fond, 'Océan Austral', 20, -55, 'mer'),
      etiquette(fond, 'AMÉRIQUE DU NORD', -102, 46, 'continent'),
      etiquette(fond, 'AMÉRIQUE DU SUD', -60, -12, 'continent'),
      etiquette(fond, 'EUROPE', 18, 53, 'continent'),
      etiquette(fond, 'AFRIQUE', 20, 6, 'continent'),
      etiquette(fond, 'ASIE', 95, 50, 'continent'),
      etiquette(fond, 'OCÉANIE', 134, -25, 'continent'),
    ],
  }
}

function fondMediterranee(): DonneesFond {
  const fond: Fond = 'mediterranee'
  const r: Reglages = { tol: 0.45, aireMin: 2.5, marge: 10 }
  const { largeur, hauteur } = dimensions(fond)
  return {
    fond,
    largeur,
    hauteur,
    contour: contourDe(fond),
    silhouette: '',
    terre: terreDe(fond, terre50, r),
    zones: zonesPays(fond, pays50, r).filter((z) => z.d.length > 0),
    fleuves: tracesFleuves(
      fond,
      ['nil', 'tigre', 'euphrate', 'jourdain', 'danube', 'po', 'tibre', 'rhone', 'ebre', 'tage', 'douro', 'guadalquivir', 'garonne', 'loire', 'seine', 'rhin'],
      fleuves10,
      { ...r, tol: 0.6 },
    ),
    reliefs: tracesPolygones(fond, RELIEFS, ['alpes', 'pyrenees', 'apennins', 'atlas', 'taurus', 'zagros', 'caucase', 'balkans', 'pinde', 'liban', 'alpes-dinariques', 'carpates'], {
      ...r,
      tol: 0.9,
    }),
    deserts: tracesPolygones(fond, DESERTS, ['sahara', 'arabie', 'syrie'], { ...r, tol: 1.2 }),
    reperes: [],
    etiquettes: [
      etiquette(fond, 'Mer Méditerranée', 17.5, 34.2, 'mer'),
      etiquette(fond, 'Mer Noire', 34, 43.3, 'mer'),
      etiquette(fond, 'Mer Égée', 25, 38.9, 'mer'),
      etiquette(fond, 'Mer Adriatique', 16.2, 42.7, 'mer'),
      etiquette(fond, 'Mer Tyrrhénienne', 12.2, 39.8, 'mer'),
      etiquette(fond, 'Mer Rouge', 37.6, 22.8, 'mer'),
      etiquette(fond, 'Golfe Persique', 50.5, 27.3, 'mer'),
      etiquette(fond, 'Mer Caspienne', 50.8, 41.2, 'mer'),
      etiquette(fond, 'Océan Atlantique', -8.3, 31.5, 'mer'),
    ],
  }
}

function fondEurope(): DonneesFond {
  const fond: Fond = 'europe'
  const r: Reglages = { tol: 0.45, aireMin: 2.5, marge: 10 }
  const { largeur, hauteur } = dimensions(fond)
  return {
    fond,
    largeur,
    hauteur,
    contour: contourDe(fond),
    silhouette: '',
    terre: terreDe(fond, terre50, r),
    zones: zonesPays(fond, pays50, r).filter((z) => z.d.length > 0),
    fleuves: tracesFleuves(
      fond,
      ['rhin', 'danube', 'rhone', 'seine', 'loire', 'elbe', 'oder', 'vistule', 'tamise', 'po', 'ebre', 'tage', 'douro', 'dniepr', 'volga', 'garonne', 'meuse'],
      fleuves10,
      { ...r, tol: 0.6 },
    ),
    reliefs: tracesPolygones(fond, RELIEFS, ['alpes', 'pyrenees', 'apennins', 'carpates', 'balkans', 'alpes-dinariques', 'caucase', 'oural', 'alpes-scandinaves', 'massif-central'], {
      ...r,
      tol: 0.9,
    }),
    deserts: [],
    reperes: [],
    etiquettes: [
      etiquette(fond, 'Océan Atlantique', -16, 47, 'mer'),
      etiquette(fond, 'Mer du Nord', 3.2, 56.3, 'mer'),
      etiquette(fond, 'Mer Baltique', 19.2, 57.6, 'mer'),
      etiquette(fond, 'Mer Méditerranée', 16, 35.6, 'mer'),
      etiquette(fond, 'Mer Noire', 34, 43.2, 'mer'),
      etiquette(fond, 'Manche', -3, 49.9, 'mer'),
      etiquette(fond, 'Mer de Norvège', 2, 66, 'mer'),
    ],
  }
}

// ------------------------------------------------------------- l'écriture

function ecrire(donnees: DonneesFond) {
  const fichier = path.join(SORTIE, 'fonds', `${donnees.fond}.ts`)
  fs.mkdirSync(path.dirname(fichier), { recursive: true })
  const corps = `// FICHIER GÉNÉRÉ par scripts/cartes-exercices.ts — ne pas éditer à la main.
// Sources : Natural Earth (domaine public)${donnees.fond === 'france' ? ' ; régions : Grégoire David d’après l’IGN, Licence Ouverte' : ''}.

import type { DonneesFond } from '../donnees'

export const FOND: DonneesFond = ${JSON.stringify(donnees)}
`
  fs.writeFileSync(fichier, corps)
  console.log(`${donnees.fond} : ${donnees.zones.length} zones, ${donnees.fleuves.length} fleuves, ${donnees.reliefs.length} reliefs, ${donnees.deserts.length} déserts — ${Math.round(corps.length / 1024)} Ko`)
}

const fonds = [fondFrance(), fondMonde(), fondMediterranee(), fondEurope()]
fonds.forEach(ecrire)

// Le répertoire LÉGER des codes (sans tracés) : le validateur et les libellés
// d'accessibilité en ont besoin sans charger les fonds.
const codes: Record<string, { zones: Record<string, string>; fleuves: string[]; reliefs: string[]; deserts: string[] }> = {}
for (const f of fonds) {
  codes[f.fond] = {
    zones: Object.fromEntries(f.zones.map((z) => [z.code, z.nom])),
    fleuves: f.fleuves.map((t) => t.id),
    reliefs: f.reliefs.map((t) => t.id),
    deserts: f.deserts.map((t) => t.id),
  }
}
fs.writeFileSync(
  path.join(SORTIE, 'codes.ts'),
  `// FICHIER GÉNÉRÉ par scripts/cartes-exercices.ts — ne pas éditer à la main.
// Les codes des régions / pays, fleuves, massifs et déserts de chaque fond.

import type { Fond } from './projections'

export const CODES_FONDS: Record<Fond, { zones: Record<string, string>; fleuves: string[]; reliefs: string[]; deserts: string[] }> = ${JSON.stringify(codes, null, 1)}
`,
)
console.log('codes.ts écrit')
