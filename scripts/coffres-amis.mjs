/**
 * Fabrique LES COFFRES D'AMIS, UN PAR NIVEAU (03/10/2026) — onglet Amis :
 *   assets-sources/amis/coffres amis.png          (planche des 5 fermés, LOCALE)
 *   assets-sources/amis/coffres amis ouverts.png  (planche des 5 ouverts, LOCALE)
 *     → public/images/amis/coffre/niveau-<n>-ferme.webp · niveau-<n>-ouvert.webp
 *       (256 × 256, fond transparent)
 *
 *   node scripts/coffres-amis.mjs
 *
 * Lucas : un coffre par niveau du coffre d'équipe, sobre — fer, puis une gemme,
 * puis l'or, puis des gemmes violettes. Les cinq ont été dessinés sur UNE
 * planche (2 en haut, 3 en bas) pour que l'échelle reste cohérente ; le
 * script les retrouve (bandes de pixels non crème), les détoure
 * (scripts/lib/fond-peint.mjs) et les pose TOUS à la même échelle.
 *
 * LE CORPS COMME REPÈRE. Le couvercle ouvert part en arrière : la boîte d'un
 * coffre ouvert n'a pas la forme de celle du fermé, et les deux planches n'ont
 * pas la même définition. On mesure donc la largeur du CORPS (le bas du
 * dessin), on met tous les corps à la même largeur, centrés, posés sur la
 * même ligne de sol : fermé ou ouvert, de niveau en niveau, le coffre ne
 * saute pas et ne change pas de taille.
 */
import sharp from 'sharp'
import { access, mkdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC_DIR = 'assets-sources/amis'
const DEST_DIR = 'public/images/amis/coffre'
const PLANCHES = { ferme: 'coffres amis.png', ouvert: 'coffres amis ouverts.png' }
const SIZE = 256
/** Marge autour du dessin, en part de la toile. */
const MARGE = 0.04
/** Hauteur de la bande du « corps », en part de la hauteur du coffre fermé. */
const BANDE_CORPS = 0.2

async function source(nom) {
  const chemin = `${SRC_DIR}/${nom}`
  try {
    await access(chemin)
    return chemin
  } catch {
    throw new Error(`Original introuvable : ${chemin} (assets-sources/ est local, hors dépôt).`)
  }
}

/** Les cinq coffres d'une planche, dans l'ordre de lecture (haut, puis bas). */
async function coffresDeLaPlanche(chemin) {
  const { data, info } = await sharp(chemin).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H } = info
  const fond = [data[0], data[1], data[2]]
  const encre = (x, y) => {
    const i = (y * W + x) * 3
    return Math.abs(data[i] - fond[0]) + Math.abs(data[i + 1] - fond[1]) + Math.abs(data[i + 2] - fond[2]) > 60
  }
  const pas = Math.max(1, Math.round(W / 1000))
  const plages = (n, pleine) => {
    const out = []
    let debut = -1
    for (let i = 0; i <= n; i++) {
      const v = i < n && pleine(i)
      if (v && debut < 0) debut = i
      if (!v && debut >= 0) {
        if (i - debut > n * 0.05) out.push([debut, i])
        debut = -1
      }
    }
    return out
  }
  const boites = []
  for (const [y0, y1] of plages(H, (y) => {
    let c = 0
    for (let x = 0; x < W; x += pas) if (encre(x, y)) c++
    return c > 3
  })) {
    for (const [x0, x1] of plages(W, (x) => {
      let c = 0
      for (let y = y0; y < y1; y += pas) if (encre(x, y)) c++
      return c > 3
    })) {
      boites.push({ x0, y0, x1, y1 })
    }
  }
  if (boites.length !== 5) throw new Error(`${chemin} : ${boites.length} coffres trouvés au lieu de 5.`)
  return boites
}

/** Boîte des pixels visibles d'une image détourée, et largeur de son corps. */
async function mesurer(buffer, hauteurCorps) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const plein = (x, y) => data[(y * info.width + x) * 4 + 3] > 8
  let gauche = info.width
  let droite = -1
  let haut = info.height
  let bas = -1
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (plein(x, y)) {
        gauche = Math.min(gauche, x)
        droite = Math.max(droite, x)
        haut = Math.min(haut, y)
        bas = Math.max(bas, y)
      }
  const bande = Math.round((hauteurCorps ?? bas - haut) * BANDE_CORPS)
  let cg = info.width
  let cd = -1
  for (let y = bas - bande; y <= bas; y++)
    for (let x = 0; x < info.width; x++)
      if (plein(x, y)) {
        cg = Math.min(cg, x)
        cd = Math.max(cd, x)
      }
  return { gauche, droite, haut, bas, corpsG: cg, corpsD: cd, hauteur: bas - haut }
}

await mkdir(DEST_DIR, { recursive: true })
const tmp = path.join(tmpdir(), `coffres-amis-${process.pid}`)
await mkdir(tmp, { recursive: true })

// 1. Découper et détourer les dix dessins.
const dessins = []
for (const [etat, fichier] of Object.entries(PLANCHES)) {
  const planche = await source(fichier)
  const boites = await coffresDeLaPlanche(planche)
  for (let i = 0; i < 5; i++) {
    const b = boites[i]
    const m = 6
    const meta = await sharp(planche).metadata()
    const left = Math.max(0, b.x0 - m)
    const top = Math.max(0, b.y0 - m)
    const morceau = path.join(tmp, `${etat}-${i + 1}.png`)
    await sharp(planche)
      .extract({
        left,
        top,
        width: Math.min(meta.width - left, b.x1 - b.x0 + 2 * m),
        height: Math.min(meta.height - top, b.y1 - b.y0 + 2 * m),
      })
      .png()
      .toFile(morceau)
    const buffer = await sharp(await detourerFondPeint(morceau, { silencieux: true })).png().toBuffer()
    dessins.push({ niveau: i + 1, etat, buffer })
  }
}

// 2. Mesurer : la bande du corps se prend sur la hauteur du coffre FERMÉ du
//    même niveau (le couvercle ouvert ne doit pas l'agrandir).
for (const d of dessins.filter((d) => d.etat === 'ferme')) d.mesure = await mesurer(d.buffer)
for (const d of dessins.filter((d) => d.etat === 'ouvert')) {
  const ferme = dessins.find((f) => f.etat === 'ferme' && f.niveau === d.niveau)
  // Les deux planches n'ont pas la même définition : la hauteur du corps se
  // rapporte à la largeur du corps, identique fermé ou ouvert.
  const brut = await mesurer(d.buffer)
  const ratio = ferme.mesure.hauteur / (ferme.mesure.corpsD - ferme.mesure.corpsG)
  d.mesure = await mesurer(d.buffer, Math.round(ratio * (brut.corpsD - brut.corpsG)))
}

// 3. Une seule largeur de corps pour les dix, la plus grande qui fasse tout
//    tenir dans la toile (corps centré, posé sur la ligne de sol).
const interieur = SIZE * (1 - 2 * MARGE)
let largeurCorps = Infinity
for (const { mesure: m } of dessins) {
  const corps = m.corpsD - m.corpsG
  const centre = (m.corpsG + m.corpsD) / 2
  const demiLargeur = Math.max(centre - m.gauche, m.droite - centre)
  largeurCorps = Math.min(largeurCorps, (interieur / 2 / demiLargeur) * corps, (interieur / m.hauteur) * corps)
}

// 4. Poser chaque dessin.
for (const { niveau, etat, buffer, mesure: m } of dessins) {
  const k = largeurCorps / (m.corpsD - m.corpsG)
  const meta = await sharp(buffer).metadata()
  const redim = await sharp(buffer)
    .resize(Math.round(meta.width * k), Math.round(meta.height * k))
    .png()
    .toBuffer()
  const centre = ((m.corpsG + m.corpsD) / 2) * k
  const left = Math.round(SIZE / 2 - centre)
  const top = Math.round(SIZE * (1 - MARGE) - m.bas * k)
  const rmeta = await sharp(redim).metadata()
  // Composer sur une toile transparente : extract borne ce qui déborderait.
  const cx = Math.max(0, -left)
  const cy = Math.max(0, -top)
  const morceau = await sharp(redim)
    .extract({
      left: cx,
      top: cy,
      width: Math.min(rmeta.width - cx, SIZE - Math.max(0, left)),
      height: Math.min(rmeta.height - cy, SIZE - Math.max(0, top)),
    })
    .png()
    .toBuffer()
  const sortie = `${DEST_DIR}/niveau-${niveau}-${etat}.webp`
  const info = await sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: morceau, left: Math.max(0, left), top: Math.max(0, top) }])
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(sortie)
  console.log(`${sortie} · ${Math.round(info.size / 1024)} Ko`)
}

await rm(tmp, { recursive: true, force: true })
