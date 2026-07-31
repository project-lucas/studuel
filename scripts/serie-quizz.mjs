/**
 * Fabrique les 10 réactions de série du quiz :
 *   public/images/serie quizz/{1..5}{+,-}.png  (sources 4000x4000, LOCALES)
 *     → public/images/mascotte/reaction-{bonne,mauvaise}-{1..5}.webp  (500x360, servies)
 *
 *   node scripts/serie-quizz.mjs
 *
 * Les sources n'ont PAS de canal alpha : le damier de « transparence » est PEINT
 * dans l'image, et la plupart ont en plus un fond blanc/crème avec des rayons
 * dorés et des confettis. Tout ça saute — les rayons jureraient sur le panneau
 * menthe/rosé de la feuille de retour, qui porte déjà sa propre couleur.
 *
 * Deux étapes :
 *
 * 1. DÉTOURAGE, en trois passes dont chacune répare un défaut de la précédente :
 *    a. classer les pixels « fond » (gris neutres du damier, blanc, or)
 *    b. ne vider QUE ce qui touche le bord — sinon on perce le blanc des yeux,
 *       les verres et la peau, tous clairs mais enfermés dans le trait noir
 *    c. ne garder que la plus grosse composante — sinon les confettis dorés,
 *       isolés du bord, survivent en débris flottants
 *
 * 2. RECADRAGE À TÊTE CONSTANTE. Les 10 sources sont cadrées très différemment
 *    (plan buste pour les unes, gros plan visage pour les autres) : sans
 *    normalisation la mascotte semblerait zoomer au hasard d'une question à
 *    l'autre. On aligne sur LES LUNETTES — le seul repère stable de la série,
 *    puisque les cheveux, eux, disparaissent au fil des erreurs. Leur largeur et
 *    la ligne des yeux sont mesurées à la main dans ANCRES (en fractions de
 *    l'image détourée) puis ramenées aux mêmes valeurs pour tout le monde.
 */

import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const SRC = 'public/images/serie quizz'
const DEST = 'public/images/mascotte'
const WORK = 1024 // résolution de travail du masque

// Canevas MESURÉ, pas choisi à l'œil. Le personnage a été mesuré sur les dix
// sources détourées, à l'échelle cible, autour de l'ancre « lunettes » :
//
//   au-dessus des yeux  ≤ 166 px  (coiffe du rang 1, poings levés du rang 3)
//   à gauche / à droite ≤ 240 px  (bras grands ouverts du rang 5)
//
// Le canevas précédent (341×256, yeux à 0.42) n'offrait que 107 px au-dessus des
// yeux et 170 px de demi-largeur : la coiffe était coupée sur TOUTES les
// vignettes et les bras sur les rangs 3 et 5. D'où ces valeurs, mesures + un
// filet d'air. Vers le BAS en revanche le buste reste volontairement tranché :
// la feuille de retour passe par-dessus, la mascotte plonge derrière elle.
const WIDTH = 500
const HEIGHT = 360

// Cadrage cible. La largeur des lunettes est en PIXELS ABSOLUS, pas en fraction
// du canevas : élargir le cadre doit ajouter de la marge autour de la mascotte,
// surtout pas la grossir.
const GLASSES_PX = 118
const EYE_LINE = 0.5 // ligne des yeux, en fraction de la hauteur → 180 px d'air

/**
 * Position des lunettes sur chaque image DÉTOURÉE, en fraction de sa largeur et
 * de sa hauteur. Relevé à la main sur planche graduée : aucune détection
 * automatique ne tient, la calvitie progressive fausse tous les repères
 * (le crâne nu devient la plus grande zone claire de l'image).
 */
const ANCRES = {
  '1+': { x0: 0.04, x1: 0.61, eye: 0.43 },
  '2+': { x0: 0.29, x1: 0.69, eye: 0.4 },
  '3+': { x0: 0.31, x1: 0.61, eye: 0.38 },
  '4+': { x0: 0.245, x1: 0.775, eye: 0.41 },
  '5+': { x0: 0.415, x1: 0.685, eye: 0.32 },
  '1-': { x0: 0.03, x1: 0.62, eye: 0.44 },
  '2-': { x0: 0.02, x1: 0.63, eye: 0.44 },
  '3-': { x0: 0.035, x1: 0.665, eye: 0.52 },
  '4-': { x0: 0.1, x1: 0.68, eye: 0.5 },
  '5-': { x0: 0.11, x1: 0.69, eye: 0.5 },
}

function isBackgroundLike(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const sat = max === 0 ? 0 : (max - min) / max

  // Damier et blanc : gris parfaitement neutres. Les carreaux sombres du damier
  // descendent à 182, d'où ce seuil bas — la saturation quasi nulle suffit à les
  // séparer de la peau (chaude) et des verres (bleutés).
  if (max > 168 && sat < 0.08) return true
  // Rayons, halos et confettis dorés : jaunes clairs, r > g > b.
  if (max > 195 && sat < 0.85 && r > g && g > b) return true
  // Crème très clair des fonds « blancs ».
  if (max > 230 && sat < 0.2) return true
  return false
}

/** Plus grosse composante connexe (4-voisins) d'un masque booléen. */
function largestComponent(mask, w, h) {
  const seen = new Uint8Array(w * h)
  const keep = new Uint8Array(w * h)
  let best = []
  for (let start = 0; start < w * h; start += 1) {
    if (seen[start] || !mask[start]) continue
    const comp = []
    const stack = [start]
    seen[start] = 1
    while (stack.length) {
      const i = stack.pop()
      comp.push(i)
      const x = i % w
      const y = (i - x) / w
      const voisins = []
      if (x > 0) voisins.push(i - 1)
      if (x < w - 1) voisins.push(i + 1)
      if (y > 0) voisins.push(i - w)
      if (y < h - 1) voisins.push(i + w)
      for (const n of voisins) {
        if (!seen[n] && mask[n]) {
          seen[n] = 1
          stack.push(n)
        }
      }
    }
    if (comp.length > best.length) best = comp
  }
  for (const i of best) keep[i] = 1
  return keep
}

async function detourer(file) {
  const { data, info } = await sharp(path.join(SRC, file))
    .resize(WORK, WORK, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width: w, height: h, channels: ch } = info

  const bgLike = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i += 1) {
    const o = i * ch
    bgLike[i] = isBackgroundLike(data[o], data[o + 1], data[o + 2]) ? 1 : 0
  }

  const outside = new Uint8Array(w * h)
  const stack = []
  const push = (x, y) => {
    const i = y * w + x
    if (!outside[i] && bgLike[i]) {
      outside[i] = 1
      stack.push(i)
    }
  }
  for (let x = 0; x < w; x += 1) {
    push(x, 0)
    push(x, h - 1)
  }
  for (let y = 0; y < h; y += 1) {
    push(0, y)
    push(w - 1, y)
  }
  while (stack.length) {
    const i = stack.pop()
    const x = i % w
    const y = (i - x) / w
    if (x > 0) push(x - 1, y)
    if (x < w - 1) push(x + 1, y)
    if (y > 0) push(x, y - 1)
    if (y < h - 1) push(x, y + 1)
  }

  const solid = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i += 1) solid[i] = outside[i] ? 0 : 1
  const keep = largestComponent(solid, w, h)
  for (let i = 0; i < w * h; i += 1) {
    if (!keep[i]) data[i * ch + 3] = 0
  }

  const cut = await sharp(data, { raw: { width: w, height: h, channels: ch } }).png().toBuffer()
  // Léger flou d'alpha : adoucit l'escalier laissé par le seuil binaire.
  const alpha = await sharp(cut).extractChannel(3).blur(0.8).linear(1.4, -30).toBuffer()
  const feathered = await sharp(cut).joinChannel(alpha).png().toBuffer()

  // Recadre sur le personnage : les marges devenues transparentes ne servent
  // plus, et les ancres sont exprimées par rapport à CE cadre.
  return sharp(feathered).trim({ threshold: 1 }).png().toBuffer()
}

/** Ramène les lunettes à la même largeur et la même ligne d'yeux pour toutes. */
async function normaliser(buffer, ancre) {
  const { width: w, height: h } = await sharp(buffer).metadata()

  const echelle = GLASSES_PX / ((ancre.x1 - ancre.x0) * w)
  const larg = Math.round(w * echelle)
  const haut = Math.round(h * echelle)

  // Où tombent l'axe des lunettes et la ligne des yeux une fois redimensionné…
  const cx = ((ancre.x0 + ancre.x1) / 2) * larg
  const cy = ancre.eye * haut
  // …donc quel coin haut-gauche de la source vient se poser en (0,0) du canevas.
  const srcLeft = Math.round(cx - WIDTH / 2)
  const srcTop = Math.round(cy - EYE_LINE * HEIGHT)

  const redim = await sharp(buffer).resize(larg, haut).png().toBuffer()

  // Le personnage déborde souvent de la fenêtre (buste, bras levés…) : on
  // rembourre en transparent pour que l'extraction reste dans les clous, puis on
  // découpe. Un simple composite refuserait une source plus grande que le
  // canevas — et le rembourrage sert AUSSI à l'inverse, quand la mascotte est
  // plus étroite que le cadre élargi.
  const padL = Math.max(0, -srcLeft)
  const padT = Math.max(0, -srcTop)
  const padR = Math.max(0, srcLeft + WIDTH - larg)
  const padB = Math.max(0, srcTop + HEIGHT - haut)

  const transparent = { r: 0, g: 0, b: 0, alpha: 0 }
  const rembourre =
    padL || padT || padR || padB
      ? await sharp(redim)
          .extend({ top: padT, bottom: padB, left: padL, right: padR, background: transparent })
          .png()
          .toBuffer()
      : redim

  return sharp(rembourre)
    .extract({ left: srcLeft + padL, top: srcTop + padT, width: WIDTH, height: HEIGHT })
    .webp({ quality: 85, effort: 6 })
    .toBuffer()
}

await mkdir(DEST, { recursive: true })

const fichiers = (await readdir(SRC)).filter((f) => f.endsWith('.png'))
for (const file of fichiers.sort()) {
  const cle = path.basename(file, '.png')
  const ancre = ANCRES[cle]
  if (!ancre) {
    console.warn(`! ${file} : pas d'ancre relevée, ignoré`)
    continue
  }
  const rang = cle.slice(0, -1)
  const sens = cle.endsWith('+') ? 'bonne' : 'mauvaise'
  const sortie = path.join(DEST, `reaction-${sens}-${rang}.webp`)

  const out = await normaliser(await detourer(file), ancre)
  await sharp(out).toFile(sortie)
  console.log(`${cle.padEnd(3)} → ${sortie}  ${(out.length / 1024).toFixed(1)} ko`)
}
