/**
 * Fabrique LES JETONS DE LA SEMAINE DE SÉRIE (04/10/2026, Lucas : « ici cela ne
 * me plaît toujours pas, il faut trouver autre chose — le côté animation, une
 * animation particulière s'il est en série et s'il a fait une semaine
 * parfaite »). Quatre dessins de la famille de l'éclair d'XP (Nano Banana 2
 * Lite, l'éclair en référence) :
 *   assets-sources/serie-jours/flamme.png     → public/images/serie/jour-flamme.webp   un jour fait
 *   (la flamme d'or couronnée, flamme-or.png, est servie ANIMÉE : scripts/flamme-animee.mjs)
 *   assets-sources/serie-jours/braise.png     → public/images/serie/jour-braise.webp   un jour manqué
 *   assets-sources/serie-jours/glacon.png     → public/images/serie/jour-gele.webp     un jour gelé (+ gel-serie.webp, 256 px, le Marché)
 *   assets-sources/serie-jours/medaille.png   → public/images/serie/semaine-parfaite.webp
 *
 *   node scripts/serie-jours.mjs
 *
 * Fond blanc opaque détouré par scripts/lib/fond-peint.mjs. Les étincelles
 * détachées (des points à 40 px) sont retirées : on garde les taches d'un seul
 * tenant qui font au moins 4 % de la plus grande — la couronne et la fumée
 * restent, les poussières partent. Tous recadrés au même gabarit carré.
 */
import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC = 'assets-sources/serie-jours'
const DEST = 'public/images/serie'
const ALPHA = 8
/** Part minimale (de la plus grande tache) pour qu'une tache soit gardée. */
const PART_MIN = 0.04
const MARGE = 0.04

const LOT = [
  { src: 'flamme.png', dest: 'jour-flamme.webp', cote: 128 },
  { src: 'braise.png', dest: 'jour-braise.webp', cote: 128 },
  // Le gel de série (04/10/2026) : un glaçon, la flamme figée dedans — un jour
  // gelé de la semaine, et la carte du gel dans le Marché.
  { src: 'glacon.png', dest: 'jour-gele.webp', cote: 128 },
  { src: 'glacon.png', dest: 'gel-serie.webp', cote: 256 },
  { src: 'medaille.png', dest: 'semaine-parfaite.webp', cote: 256 },
]

function nettoyer(data, w, h, c) {
  const etiq = new Int32Array(w * h)
  const tailles = [0]
  const pile = []
  for (let d = 0; d < w * h; d++) {
    if (etiq[d] || data[d * c + 3] <= ALPHA) continue
    const e = tailles.length
    let n = 0
    etiq[d] = e
    pile.push(d)
    while (pile.length) {
      const p = pile.pop()
      n++
      const x = p % w
      const y = (p - x) / w
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue
        const q = ny * w + nx
        if (etiq[q] || data[q * c + 3] <= ALPHA) continue
        etiq[q] = e
        pile.push(q)
      }
    }
    tailles.push(n)
  }
  const max = Math.max(...tailles)
  const out = Buffer.from(data)
  for (let p = 0; p < w * h; p++) if (tailles[etiq[p]] < max * PART_MIN) out[p * c + 3] = 0
  return out
}

await mkdir(DEST, { recursive: true })
for (const { src, dest, cote } of LOT) {
  const chemin = `${SRC}/${src}`
  try {
    await access(chemin)
  } catch {
    throw new Error(`Original introuvable : ${chemin} (assets-sources/ est local, hors dépôt).`)
  }
  const { data, info } = await sharp(await detourerFondPeint(chemin, { silencieux: true }))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const propre = nettoyer(data, info.width, info.height, info.channels)
  let g = info.width, h = info.height, d = -1, b = -1
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (propre[(y * info.width + x) * info.channels + 3] > ALPHA) {
        g = Math.min(g, x); d = Math.max(d, x); h = Math.min(h, y); b = Math.max(b, y)
      }
  const l = d - g + 1
  const ht = b - h + 1
  const interieur = Math.round(cote * (1 - 2 * MARGE))
  const k = interieur / Math.max(l, ht)
  const L = Math.round(l * k)
  const H = Math.round(ht * k)
  const sortie = await sharp(propre, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .extract({ left: g, top: h, width: l, height: ht })
    .resize(L, H, { kernel: 'lanczos3' })
    // Posé en bas de la toile : toutes les flammes partagent la même ligne de sol.
    .extend({
      top: cote - H - Math.round(cote * MARGE),
      bottom: Math.round(cote * MARGE),
      left: Math.floor((cote - L) / 2),
      right: Math.ceil((cote - L) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(`${DEST}/${dest}`)
  console.log(`${DEST}/${dest} · ${L}x${H} dans ${cote}² · ${Math.round(sortie.size / 1024)} Ko`)
}
