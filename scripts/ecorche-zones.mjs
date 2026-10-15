// LES ZONES DE L'ÉCORCHÉ, TIRÉES DE LA PEINTURE (14/10/2026).
//
// L'écorché de « Muscles express » est peint (scripts/ecorche-muscles.mjs) :
// chaque muscle est une plage corail cernée de prune. Plutôt que de retracer
// ses contours à la main — et de rater d'un millimètre ce que l'œil voit —, on
// les LIT dans l'image : une graine posée dans chaque muscle, un remplissage
// qui suit le corail jusqu'au cerne, une fermeture qui soude les chefs d'un
// même groupe (les quatre du quadriceps, les huit carreaux des abdominaux), et
// le contour extérieur, simplifié, devient le chemin SVG de la zone.
//
//   node scripts/ecorche-zones.mjs              écrit lib/jeux/muscles-ecorche-zones.ts
//   node scripts/ecorche-zones.mjs --controle   + assets-sources/muscles/_controle/<vue>.png
//
// Les graines sont en pixels de la toile servie (1000 × 1800, la même pour les
// deux vues) ; le chemin sort en unités du viewBox (÷ 10 : 100 × 180).
// Refaire une vue = revoir ses graines sur la grille de contrôle.

import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RACINE = path.resolve(import.meta.dirname, '..')
// Deux planches peintes (14/10/2026) : l'écorché de Muscles express et la
// planche des organes d'Anatomie express.
//   node scripts/ecorche-zones.mjs --planche=organes --controle
const NOM = (process.argv.find((a) => a.startsWith('--planche=')) ?? '--planche=muscles').slice(10)
if (NOM !== 'muscles' && NOM !== 'organes') throw new Error(`planche inconnue : ${NOM}`)
const IMAGES = path.join(RACINE, 'public', 'images', 'jeux', NOM)
const CONTROLE = path.join(RACINE, 'assets-sources', NOM, '_controle')
const SORTIE = path.join(RACINE, 'lib', 'jeux', NOM === 'muscles' ? 'muscles-ecorche-zones.ts' : 'organes-planche-zones.ts')

/** Pixels de toile → unités du viewBox. */
const ECHELLE = 0.1
/** Rayon de fermeture (px) : soude les chefs d'un groupe à travers le cerne. */
const FERMETURE = 9
/** Tolérance de simplification du contour (px). */
const SIMPLIFIE = 2.2
/** Une composante plus petite n'est qu'une miette du remplissage. */
const AIRE_MIN = 900

/**
 * Les graines, par vue et par zone, dans l'ORDRE DU DESSIN (la dernière zone
 * est au-dessus). Chaque paire gauche / droite est écrite : la figure peinte
 * n'est pas parfaitement symétrique.
 */
/**
 * Les COUPES : là où deux muscles voisins se touchent sans cerne fermé (au dos,
 * le trapèze et le grand dorsal ne sont séparés que par un trait qui s'efface),
 * on trace la frontière peinte à la main, en lignes brisées de 7 px.
 */
const COUPES_MUSCLES = {
  dos: [
    [[292, 405], [332, 442], [385, 520], [418, 600], [446, 672]],
    [[628, 405], [588, 442], [536, 520], [502, 600], [474, 672]],
  ],
}

const VUES_MUSCLES = {
  face: [
    { id: 'cou', graines: [[462, 410], [538, 410], [440, 430], [560, 430]] },
    { id: 'deltoides', graines: [[300, 520], [700, 520]] },
    { id: 'pectoraux', graines: [[420, 530], [580, 530]] },
    { id: 'biceps', graines: [[300, 645], [700, 645]] },
    {
      id: 'avant-bras',
      graines: [[232, 800], [262, 790], [288, 760], [222, 862], [768, 800], [738, 790], [712, 760], [778, 862]],
    },
    {
      id: 'obliques',
      graines: [
        [375, 640], [390, 680], [400, 720], [400, 760], [392, 800], [378, 850],
        [625, 640], [610, 680], [600, 720], [600, 760], [608, 800], [622, 850],
      ],
    },
    {
      id: 'abdominaux',
      graines: [[462, 640], [538, 640], [462, 700], [538, 700], [462, 765], [538, 765], [466, 850], [534, 850]],
    },
    {
      id: 'quadriceps',
      graines: [
        [355, 1080], [392, 1080], [380, 1150], [445, 1185],
        [645, 1080], [608, 1080], [620, 1150], [555, 1185],
      ],
    },
    { id: 'couturier', graines: [[430, 1030], [578, 1000], [556, 1080]] },
    { id: 'adducteurs', graines: [[476, 1000], [524, 1000]] },
    { id: 'tibial', graines: [[374, 1420], [626, 1420]] },
    { id: 'mollets', graines: [[442, 1360], [558, 1360]] },
  ],
  dos: [
    { id: 'trapezes', graines: [[400, 450], [520, 450], [432, 320], [488, 320], [420, 560], [500, 560]] },
    { id: 'deltoides', graines: [[255, 460], [665, 460]] },
    { id: 'omoplate', graines: [[325, 550], [340, 560], [585, 545]] },
    { id: 'triceps', graines: [[240, 600], [680, 600], [262, 560], [658, 560]] },
    {
      id: 'avant-bras',
      graines: [[172, 820], [200, 780], [222, 760], [748, 820], [720, 780], [698, 760]],
    },
    { id: 'dorsaux', graines: [[345, 700], [575, 700], [360, 760], [560, 760]] },
    { id: 'fessiers', graines: [[380, 900], [540, 900]] },
    {
      id: 'ischios',
      graines: [[350, 1130], [390, 1130], [420, 1150], [570, 1130], [530, 1130], [500, 1150]],
    },
    {
      id: 'mollets',
      graines: [[332, 1360], [380, 1360], [538, 1360], [586, 1360], [335, 1560], [585, 1560]],
    },
  ],
}

const VUES_ORGANES = {
  face: [
    { id: 'diaphragme', graines: [[330, 640], [450, 640], [480, 640], [540, 650]] },
    { id: 'poumons', graines: [[340, 520], [560, 520], [340, 600], [560, 600], [310, 570], [590, 590]] },
    // La trachée est faite d'anneaux crème, de la couleur du corps : son
    // contour est posé à la main, sur la grille de contrôle.
    { id: 'trachee', polygone: [[410, 352], [457, 352], [455, 430], [452, 498], [415, 498], [412, 430]] },
    { id: 'coeur', graines: [[450, 560], [430, 600]] },
    { id: 'reins', graines: [[345, 835], [530, 835]] },
    { id: 'pancreas', graines: [[450, 810], [460, 800], [480, 810], [430, 830]] },
    { id: 'rate', graines: [[570, 735]] },
    { id: 'foie', graines: [[350, 740], [450, 700], [320, 700]] },
    { id: 'estomac', graines: [[480, 740], [500, 710]] },
    {
      id: 'intestin-grele',
      graines: [[430, 930], [450, 950], [390, 930], [370, 940], [410, 950], [520, 920], [500, 950], [440, 920], [460, 920], [480, 990], [420, 1010], [440, 1000]],
    },
    {
      id: 'gros-intestin',
      graines: [[310, 930], [450, 880], [560, 950], [480, 1040], [325, 1010], [380, 880], [540, 880]],
    },
    // Jaune pâle, presque la paroi : une tolérance serrée.
    { id: 'vessie', graines: [[425, 1110], [425, 1090]], tolerance: 26 },
    { id: 'cerveau', graines: [[370, 120], [370, 140], [400, 150], [350, 125], [480, 140], [520, 120]] },
  ],
}

const VUES = NOM === 'muscles' ? VUES_MUSCLES : VUES_ORGANES
// La paroi du thorax, à gauche du poumon, a la couleur du diaphragme et le
// rejoint : une coupe l'en sépare.
const COUPES_ORGANES = { face: [[[250, 618], [312, 618]]] }
const COUPES = NOM === 'muscles' ? COUPES_MUSCLES : COUPES_ORGANES
/** Muscles : la chair corail. Organes : la couleur de la graine. */
const PAR_COULEUR = NOM === 'organes'
/** Écart de couleur toléré autour de la graine (RVB). */
const TOLERANCE = 62

// ------------------------------------------------------------------ l'image

async function lire(vue) {
  const { data, info } = await sharp(path.join(IMAGES, `${vue}.webp`))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { data, w: info.width, h: info.height }
}

/** Le pixel est-il de la chair de muscle (corail, reflets compris) ? */
function estChair(img, i) {
  const r = img.data[i * 4]
  const g = img.data[i * 4 + 1]
  const b = img.data[i * 4 + 2]
  const a = img.data[i * 4 + 3]
  return a > 200 && r > 165 && r - g > 42 && r - b > 30
}

/** Remplissage 4-connexe depuis une graine, dans le corail. */
/** Remplit un polygone (règle pair-impair), en pixels de toile. */
function remplirPolygone(m, w, h, poly) {
  for (let y = 0; y < h; y++) {
    const xs = []
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i]
      const [xj, yj] = poly[j]
      if (yi > y !== yj > y) xs.push(xi + ((y - yi) * (xj - xi)) / (yj - yi))
    }
    xs.sort((a, b) => a - b)
    for (let k = 0; k + 1 < xs.length; k += 2) {
      for (let x = Math.ceil(xs[k]); x <= Math.floor(xs[k + 1]); x++) if (x >= 0 && x < w) m[y * w + x] = 1
    }
  }
}

/** La couleur moyenne autour d'une graine (5 × 5 px). */
function couleurGraine(img, x, y) {
  let r = 0
  let g = 0
  let b = 0
  let n = 0
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      const i = (y + dy) * img.w + x + dx
      r += img.data[i * 4]
      g += img.data[i * 4 + 1]
      b += img.data[i * 4 + 2]
      n++
    }
  }
  return [r / n, g / n, b / n]
}

function remplir(img, masque, x, y, tolerance = TOLERANCE) {
  const { w, h } = img
  const depart = y * w + x
  let estMuscle = estChair
  if (PAR_COULEUR) {
    const [cr, cg, cb] = couleurGraine(img, x, y)
    estMuscle = (im, i) => {
      const r = im.data[i * 4]
      const g = im.data[i * 4 + 1]
      const b = im.data[i * 4 + 2]
      if (im.data[i * 4 + 3] < 200) return false
      // Le cerne prune n'est jamais un organe.
      if (0.3 * r + 0.59 * g + 0.11 * b < 80) return false
      return Math.hypot(r - cr, g - cg, b - cb) < tolerance
    }
  }
  if (!estMuscle(img, depart)) return 0
  const pile = [depart]
  let n = 0
  while (pile.length) {
    const p = pile.pop()
    if (masque[p]) continue
    masque[p] = 1
    n++
    const px = p % w
    const py = (p - px) / w
    if (px > 0 && !masque[p - 1] && estMuscle(img, p - 1)) pile.push(p - 1)
    if (px < w - 1 && !masque[p + 1] && estMuscle(img, p + 1)) pile.push(p + 1)
    if (py > 0 && !masque[p - w] && estMuscle(img, p - w)) pile.push(p - w)
    if (py < h - 1 && !masque[p + w] && estMuscle(img, p + w)) pile.push(p + w)
  }
  return n
}

/** Dilatation par un disque de rayon r (deux passes : lignes puis colonnes, carré ≈ disque). */
function dilater(m, w, h, r) {
  const tmp = new Uint8Array(m.length)
  for (let y = 0; y < h; y++) {
    let dernier = -Infinity
    for (let x = 0; x < w; x++) {
      if (m[y * w + x]) dernier = x
      if (x - dernier <= r) tmp[y * w + x] = 1
    }
    dernier = Infinity
    for (let x = w - 1; x >= 0; x--) {
      if (m[y * w + x]) dernier = x
      if (dernier - x <= r) tmp[y * w + x] = 1
    }
  }
  const out = new Uint8Array(m.length)
  for (let x = 0; x < w; x++) {
    let dernier = -Infinity
    for (let y = 0; y < h; y++) {
      if (tmp[y * w + x]) dernier = y
      if (y - dernier <= r) out[y * w + x] = 1
    }
    dernier = Infinity
    for (let y = h - 1; y >= 0; y--) {
      if (tmp[y * w + x]) dernier = y
      if (dernier - y <= r) out[y * w + x] = 1
    }
  }
  return out
}

function eroder(m, w, h, r) {
  const inv = new Uint8Array(m.length)
  for (let i = 0; i < m.length; i++) inv[i] = m[i] ? 0 : 1
  const d = dilater(inv, w, h, r)
  const out = new Uint8Array(m.length)
  for (let i = 0; i < m.length; i++) out[i] = d[i] ? 0 : 1
  return out
}

/** Bouche les trous : tout ce que le fond n'atteint pas depuis le bord est plein. */
function boucher(m, w, h) {
  const dehors = new Uint8Array(m.length)
  const pile = []
  for (let x = 0; x < w; x++) pile.push(x, (h - 1) * w + x)
  for (let y = 0; y < h; y++) pile.push(y * w, y * w + w - 1)
  while (pile.length) {
    const p = pile.pop()
    if (dehors[p] || m[p]) continue
    dehors[p] = 1
    const x = p % w
    if (x > 0) pile.push(p - 1)
    if (x < w - 1) pile.push(p + 1)
    if (p >= w) pile.push(p - w)
    if (p < m.length - w) pile.push(p + w)
  }
  const out = new Uint8Array(m.length)
  for (let i = 0; i < m.length; i++) out[i] = dehors[i] ? 0 : 1
  return out
}

/** Les composantes 8-connexes du masque (listes d'indices). */
function composantes(m, w, h) {
  const vu = new Uint8Array(m.length)
  const out = []
  for (let i = 0; i < m.length; i++) {
    if (!m[i] || vu[i]) continue
    const pile = [i]
    const pixels = []
    vu[i] = 1
    while (pile.length) {
      const p = pile.pop()
      pixels.push(p)
      const x = p % w
      const y = (p - x) / w
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
          const q = ny * w + nx
          if (m[q] && !vu[q]) {
            vu[q] = 1
            pile.push(q)
          }
        }
      }
    }
    out.push(pixels)
  }
  return out
}

/**
 * Le contour extérieur d'une composante, par marche sur les arêtes des pixels
 * (« marching squares » sur la grille des coins) : une suite de coins, sans
 * auto-intersection, dans le sens des aiguilles d'une montre.
 */
function contour(pixels, w) {
  const dedans = new Set(pixels)
  const plein = (x, y) => x >= 0 && y >= 0 && x < w && dedans.has(y * w + x)
  // Point de départ : le pixel le plus haut puis le plus à gauche ; on part de
  // son coin haut-gauche, cap à l'est.
  let depart = pixels[0]
  for (const p of pixels) if (p < depart) depart = p
  const x0 = depart % w
  const y0 = (depart - x0) / w
  const pts = []
  let x = x0
  let y = y0
  let dir = 0 // 0 est, 1 sud, 2 ouest, 3 nord (sur la grille des coins)
  const DX = [1, 0, -1, 0]
  const DY = [0, 1, 0, -1]
  let garde = 0
  do {
    pts.push([x, y])
    // Les quatre pixels autour du coin (x, y) : HG, HD, BG, BD.
    // On tourne pour garder le plein à droite de la marche.
    for (let essai = 0; essai < 4; essai++) {
      const d = (dir + 3 + essai) % 4 // essaie à gauche, tout droit, à droite, demi-tour
      // Le pixel à droite de l'arête (x, y) → (x + DX, y + DY), et celui à gauche.
      let droite
      let gauche
      if (d === 0) {
        droite = plein(x, y)
        gauche = plein(x, y - 1)
      } else if (d === 1) {
        droite = plein(x - 1, y)
        gauche = plein(x, y)
      } else if (d === 2) {
        droite = plein(x - 1, y - 1)
        gauche = plein(x - 1, y)
      } else {
        droite = plein(x, y - 1)
        gauche = plein(x - 1, y - 1)
      }
      if (droite && !gauche) {
        dir = d
        break
      }
    }
    x += DX[dir]
    y += DY[dir]
    if (++garde > 400000) throw new Error('contour sans fin')
  } while (x !== x0 || y !== y0)
  return pts
}

/** Douglas–Peucker sur un polygone fermé. */
function simplifier(pts, eps) {
  if (pts.length < 8) return pts
  // On coupe le polygone au point le plus éloigné du premier.
  let loin = 0
  let dmax = -1
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1])
    if (d > dmax) {
      dmax = d
      loin = i
    }
  }
  const dp = (a) => {
    if (a.length < 3) return a
    const [ax, ay] = a[0]
    const [bx, by] = a[a.length - 1]
    const l = Math.hypot(bx - ax, by - ay) || 1
    let imax = 0
    let m = -1
    for (let i = 1; i < a.length - 1; i++) {
      const d = Math.abs((bx - ax) * (ay - a[i][1]) - (ax - a[i][0]) * (by - ay)) / l
      if (d > m) {
        m = d
        imax = i
      }
    }
    if (m <= eps) return [a[0], a[a.length - 1]]
    const g = dp(a.slice(0, imax + 1))
    const d2 = dp(a.slice(imax))
    return [...g.slice(0, -1), ...d2]
  }
  const a = dp(pts.slice(0, loin + 1))
  const b = dp([...pts.slice(loin), pts[0]])
  return [...a.slice(0, -1), ...b.slice(0, -1)]
}

/** Le point le plus « au cœur » d'une composante (le plus loin du bord) : l'ancre. */
function coeur(m, w, h) {
  // Distance de chanfrein 3-4, deux passes.
  const D = new Float32Array(m.length)
  const INF = 1e9
  for (let i = 0; i < m.length; i++) D[i] = m[i] ? INF : 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      if (!D[i]) continue
      let v = D[i]
      if (x > 0) v = Math.min(v, D[i - 1] + 3)
      if (y > 0) v = Math.min(v, D[i - w] + 3)
      if (x > 0 && y > 0) v = Math.min(v, D[i - w - 1] + 4)
      if (x < w - 1 && y > 0) v = Math.min(v, D[i - w + 1] + 4)
      D[i] = v
    }
  }
  let best = 0
  for (let y = h - 1; y >= 0; y--) {
    for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x
      if (!D[i]) continue
      let v = D[i]
      if (x < w - 1) v = Math.min(v, D[i + 1] + 3)
      if (y < h - 1) v = Math.min(v, D[i + w] + 3)
      if (x < w - 1 && y < h - 1) v = Math.min(v, D[i + w + 1] + 4)
      if (x > 0 && y < h - 1) v = Math.min(v, D[i + w - 1] + 4)
      D[i] = v
      if (v > D[best]) best = i
    }
  }
  return [best % w, Math.floor(best / w)]
}

const u = (v) => Math.round(v * ECHELLE * 10) / 10

/** Efface le corail le long des coupes (le remplissage ne les franchit plus). */
function couper(img, lignes) {
  const { w, data } = img
  for (const ligne of lignes) {
    for (let k = 0; k < ligne.length - 1; k++) {
      const [ax, ay] = ligne[k]
      const [bx, by] = ligne[k + 1]
      const n = Math.ceil(Math.hypot(bx - ax, by - ay))
      for (let t = 0; t <= n; t++) {
        const cx = ax + ((bx - ax) * t) / n
        const cy = ay + ((by - ay) * t) / n
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const i = (Math.round(cy) + dy) * w + Math.round(cx) + dx
            data[i * 4 + 3] = 0
          }
        }
      }
    }
  }
}

async function traiterVue(vue, zones) {
  const img = await lire(vue)
  couper(img, COUPES[vue] ?? [])
  const { w, h } = img
  const sortie = []
  const masques = []
  for (const zone of zones) {
    const brut = new Uint8Array(w * h)
    const rates = []
    for (const [x, y] of zone.graines ?? []) {
      if (remplir(img, brut, x, y, zone.tolerance) === 0 && !brut[y * w + x]) rates.push(`${x},${y}`)
    }
    // Une zone posée à la main (la trachée) : son polygone, rempli tel quel.
    if (zone.polygone) remplirPolygone(brut, w, h, zone.polygone)
    if (rates.length) console.warn(`⚠️ ${vue}/${zone.id} : graine hors du corail en ${rates.join(' · ')}`)
    // Fermeture : dilater puis éroder soude les chefs voisins à travers le
    // cerne sans grossir la zone ; une dilatation finale de 3 px rend au muscle
    // la moitié du cerne qui le borde (le doigt qui tombe sur le trait compte).
    const ferme = eroder(dilater(brut, w, h, FERMETURE), w, h, FERMETURE)
    const m = boucher(dilater(ferme, w, h, 3), w, h)
    const comps = composantes(m, w, h).filter((c) => c.length >= AIRE_MIN)
    const sousChemins = comps.map((c) => {
      const pts = simplifier(contour(c, w), SIMPLIFIE)
      return `M${pts.map(([x, y]) => `${u(x)} ${u(y)}`).join(' L')} Z`
    })
    // L'ancre : le cœur de la plus grande composante.
    const grande = comps.reduce((a, b) => (b.length > a.length ? b : a), comps[0] ?? [])
    const mg = new Uint8Array(w * h)
    for (const p of grande) mg[p] = 1
    const [ax, ay] = coeur(mg, w, h)
    sortie.push({ id: zone.id, d: sousChemins.join(' '), ancre: [u(ax), u(ay)], composantes: comps.length })
    masques.push(m)
    console.log(`${vue}/${zone.id}: ${comps.length} morceau(x), ${comps.reduce((s, c) => s + c.length, 0)} px, ancre ${u(ax)} ${u(ay)}`)
  }
  return { largeur: u(w), hauteur: u(h), zones: sortie, masques, img }
}

const TEINTES = [
  [255, 0, 0], [0, 160, 255], [0, 200, 0], [255, 160, 0], [170, 0, 255], [0, 220, 200],
  [255, 0, 170], [120, 80, 0], [0, 0, 255], [255, 220, 0], [80, 80, 80], [200, 100, 255],
]

async function controle(vue, res) {
  const { img, masques } = res
  const { w, h } = img
  const out = Buffer.alloc(w * h * 3)
  for (let i = 0; i < w * h; i++) {
    const a = img.data[i * 4 + 3] / 255
    let r = img.data[i * 4] * a + 255 * (1 - a)
    let g = img.data[i * 4 + 1] * a + 255 * (1 - a)
    let b = img.data[i * 4 + 2] * a + 255 * (1 - a)
    masques.forEach((m, k) => {
      if (!m[i]) return
      const [tr, tg, tb] = TEINTES[k % TEINTES.length]
      r = r * 0.45 + tr * 0.55
      g = g * 0.45 + tg * 0.55
      b = b * 0.45 + tb * 0.55
    })
    out[i * 3] = r
    out[i * 3 + 1] = g
    out[i * 3 + 2] = b
  }
  await mkdir(CONTROLE, { recursive: true })
  await sharp(out, { raw: { width: w, height: h, channels: 3 } })
    .resize({ width: 500 })
    .png()
    .toFile(path.join(CONTROLE, `${vue}.png`))
}

async function main() {
  const resultats = {}
  for (const [vue, zones] of Object.entries(VUES)) {
    resultats[vue] = await traiterVue(vue, zones)
    if (process.argv.includes('--controle')) await controle(vue, resultats[vue])
  }
  const lignes = [
    `// GÉNÉRÉ par \`node scripts/ecorche-zones.mjs --planche=${NOM}\` — ne pas éditer à la main.`,
    NOM === 'muscles'
      ? '// Les zones de l’écorché peint de « Muscles express », lues dans l’image :'
      : '// Les zones de la planche peinte d’« Anatomie express », lues dans l’image :',
    '// un chemin par zone (ses deux moitiés en sous-chemins), en unités du',
    '// viewBox (la toile en px ÷ 10), et l’ancre au cœur de la zone.',
    '',
    ...(NOM === 'muscles'
      ? [
          'export type ZoneEcorche = { id: string; d: string; ancre: readonly [number, number] }',
          '',
          'export type VueEcorche = { largeur: number; hauteur: number; zones: readonly ZoneEcorche[] }',
          '',
          'export const ECORCHE: Record<\'face\' | \'dos\', VueEcorche> = {',
        ]
      : [
          "import type { VueEcorche } from '@/lib/jeux/muscles-ecorche-zones'",
          '',
          'export const PLANCHE_PEINTE_ORGANES: Record<\'face\', VueEcorche> = {',
        ]),
  ]
  for (const [vue, r] of Object.entries(resultats)) {
    lignes.push(`  ${vue}: {`, `    largeur: ${r.largeur},`, `    hauteur: ${r.hauteur},`, '    zones: [')
    for (const z of r.zones) {
      lignes.push(`      {`, `        id: '${z.id}',`, `        d: '${z.d}',`, `        ancre: [${z.ancre[0]}, ${z.ancre[1]}],`, '      },')
    }
    lignes.push('    ],', '  },')
  }
  lignes.push('}', '')
  await writeFile(SORTIE, lignes.join('\n'))
  console.log(`→ ${path.relative(RACINE, SORTIE)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
