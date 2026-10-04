/**
 * LE CARNET DE MOI (04/10/2026). Maquette « cahier ouvert » choisie par Lucas :
 * un carnet à spirale posé sur un bureau, dont on tourne les pages.
 *
 * Fabrique, depuis les dessins Higgsfield (Nano Banana Pro) rangés dans
 * assets-sources/moi-carnet/ :
 *   - public/images/moi/carnet/bureau.webp — le bureau vu de dessus (livre,
 *     plante, crayon, cahier aux quatre coins ; le centre est libre : le carnet
 *     s'y pose) ;
 *   - papier.webp — une tuile de papier crème, répétée sur chaque page ;
 *   - doodle-<nom>.webp — douze croquis à l'encre violette, détourés : ce sont
 *     les illustrations écrites « à la main » sur les pages.
 *
 *   node scripts/moi-carnet.mjs
 */

import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import sharp from 'sharp'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC = 'assets-sources/moi-carnet'
const OUT = 'public/images/moi/carnet'
await mkdir(OUT, { recursive: true })

// --- Le bureau -----------------------------------------------------------------
// 900 px de large suffisent : il est couvert au centre par le carnet, et ses
// bords sont des objets flous de lumière chaude, pas des détails à lire.
await sharp(`${SRC}/bureau-v1.png`)
  .resize({ width: 900 })
  .webp({ quality: 78 })
  .toFile(`${OUT}/bureau.webp`)

// --- Le papier -----------------------------------------------------------------
await sharp(`${SRC}/papier-v1.png`)
  .extract({ left: 512, top: 512, width: 1024, height: 1024 })
  .resize(384)
  .webp({ quality: 72 })
  .toFile(`${OUT}/papier.webp`)

// --- Les croquis -----------------------------------------------------------------
// La planche est une grille de 4 × 3 sur fond blanc pur ; chaque case est
// détourée depuis ses bords (le trait sombre arrête le remplissage : les
// blancs intérieurs — le cadran du chrono, les visages — restent).
const NOMS = [
  ['flamme', 'trophee', 'bouclier', 'livre'],
  ['couronne', 'medaille', 'amis', 'epees'],
  ['chrono', 'courbe', 'etoile', 'laurier'],
]
const TAILLE = 160

/**
 * La grille de la planche n'est pas exactement celle demandée : une case
 * déborde parfois sur un bout du croquis voisin. On ne garde que les pièces
 * d'au moins 12 % de la plus grande (les deux moitiés du laurier, les deux
 * visages des amis restent ; les miettes du voisin partent).
 */
async function garderLesGrandesPieces(png) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const etiquette = new Int32Array(width * height)
  const tailles = [0]
  for (let depart = 0; depart < width * height; depart++) {
    if (etiquette[depart] || data[depart * 4 + 3] < 24) continue
    const id = tailles.length
    let taille = 0
    const pile = [depart]
    etiquette[depart] = id
    while (pile.length) {
      const p = pile.pop()
      taille++
      const x = p % width
      const y = (p - x) / width
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
        const q = ny * width + nx
        if (!etiquette[q] && data[q * 4 + 3] >= 24) {
          etiquette[q] = id
          pile.push(q)
        }
      }
    }
    tailles.push(taille)
  }
  const seuil = Math.max(...tailles) * 0.12
  for (let p = 0; p < width * height; p++) {
    const id = etiquette[p]
    if (id && tailles[id] < seuil) data[p * 4 + 3] = 0
  }
  return sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer()
}
const planche = sharp(`${SRC}/doodles-v1.png`)
const { width, height } = await planche.metadata()
const largeurCase = Math.floor(width / 4)
const hauteurCase = Math.floor(height / 3)

for (let ligne = 0; ligne < 3; ligne++) {
  for (let col = 0; col < 4; col++) {
    const nom = NOMS[ligne][col]
    const temp = join(tmpdir(), `doodle-${nom}.png`)
    await sharp(`${SRC}/doodles-v1.png`)
      .extract({ left: col * largeurCase, top: ligne * hauteurCase, width: largeurCase, height: hauteurCase })
      .png()
      .toFile(temp)
    const detoure = await garderLesGrandesPieces(await detourerFondPeint(temp, { silencieux: true }))
    const rogne = await sharp(detoure).trim({ threshold: 1 }).png().toBuffer()
    await sharp(rogne)
      .resize({ width: TAILLE, height: TAILLE, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 88, alphaQuality: 90 })
      .toFile(`${OUT}/doodle-${nom}.webp`)
  }
}

console.log('carnet : bureau, papier et 12 croquis écrits dans', OUT)
