// LES ŒUVRES DU MUSÉE (14/10/2026) — les illustrations du jeu « Le Musée »
// (arts plastiques, lib/jeux/le-musee.ts). Chaque œuvre est reprise par Nano
// Banana 2.1 dans un cadre doré de musée, sur FOND MAGENTA, détourée ici,
// recadrée au plus près du cadre et servie en WebP transparent.
//
//   node scripts/oeuvres-musee.mjs            toutes les œuvres de assets-sources/musee/
//   node scripts/oeuvres-musee.mjs joconde    une seule
//
// Sources : assets-sources/musee/<id>.png (l'id de lib/jeux/le-musee).
// Sorties : public/images/jeux/musee/<id>.webp — 640 px au plus grand côté.
//
// DOMAINE PUBLIC SEULEMENT : voir l'en-tête de lib/jeux/le-musee.ts.

import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RACINE = path.resolve(import.meta.dirname, '..')
const SOURCES = path.join(RACINE, 'assets-sources', 'musee')
const SORTIE = path.join(RACINE, 'public', 'images', 'jeux', 'musee')
const COTE = 460
/** Le fond « magenta » que rend réellement le modèle (mesuré : ~254, 43, 249). */
const FOND = [254, 43, 249]

/**
 * Clé par « magentitude » (min(r, b) − g) : le fond mesure ~200, un tableau
 * jamais — même la peau rose de la Vénus de Botticelli garde son vert. Les
 * bords mi-fond mi-cadre sont décontaminés du fond.
 */
async function detourer(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const out = Buffer.alloc(data.length)
  const { width, height, channels } = info
  for (let i = 0; i < width * height; i += 1) {
    const r = data[i * channels]
    const g = data[i * channels + 1]
    const b = data[i * channels + 2]
    const a = Math.min(1, Math.max(0, (180 - (Math.min(r, b) - g)) / 80))
    if (a <= 0) continue
    const k = 1 - a
    out[i * channels] = Math.min(255, Math.max(0, (r - k * FOND[0]) / a))
    out[i * channels + 1] = Math.min(255, Math.max(0, (g - k * FOND[1]) / a))
    out[i * channels + 2] = Math.min(255, Math.max(0, (b - k * FOND[2]) / a))
    out[i * channels + 3] = Math.round(a * 255)
  }
  effacerFondDesBords(out, width, height, channels)
  return sharp(out, { raw: { width, height, channels } }).png().toBuffer()
}

/**
 * LE SECOND DÉTOURAGE. Le modèle n'obéit pas toujours au magenta : le Penseur
 * est sorti sur un rose, la Vénus de Milo sur un vert pâle. Quand le coin de
 * l'image est resté opaque, on efface le fond par remplissage depuis les
 * bords — tout pixel proche de la couleur du coin, de proche en proche —, et
 * on adoucit le bord d'un pixel.
 */
function effacerFondDesBords(px, w, h, c) {
  const coin = [px[0], px[1], px[2]]
  if (px[3] === 0) return
  const proche = (i) =>
    px[i * c + 3] > 0 &&
    Math.hypot(px[i * c] - coin[0], px[i * c + 1] - coin[1], px[i * c + 2] - coin[2]) < 48
  const vu = new Uint8Array(w * h)
  const pile = []
  for (let x = 0; x < w; x++) pile.push(x, (h - 1) * w + x)
  for (let y = 0; y < h; y++) pile.push(y * w, y * w + w - 1)
  while (pile.length) {
    const p = pile.pop()
    if (vu[p] || !proche(p)) continue
    vu[p] = 1
    px[p * c + 3] = 0
    const x = p % w
    if (x > 0) pile.push(p - 1)
    if (x < w - 1) pile.push(p + 1)
    if (p >= w) pile.push(p - w)
    if (p < w * h - w) pile.push(p + w)
  }
  // Le liseré : un pixel opaque qui touche le fond effacé passe à mi-opacité.
  for (let p = 0; p < w * h; p++) {
    if (vu[p] || px[p * c + 3] === 0) continue
    const x = p % w
    const voisinVide = (x > 0 && vu[p - 1]) || (x < w - 1 && vu[p + 1]) || (p >= w && vu[p - w]) || (p < w * h - w && vu[p + w])
    if (voisinVide) px[p * c + 3] = Math.round(px[p * c + 3] / 2)
  }
}

async function produire(id) {
  const keyed = await detourer(path.join(SOURCES, `${id}.png`))
  const cible = path.join(SORTIE, `${id}.webp`)
  const info = await sharp(keyed)
    .trim({ threshold: 8 })
    .resize({ width: COTE, height: COTE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 70, alphaQuality: 80 })
    .toFile(cible)
  console.log(`${path.relative(RACINE, cible)}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} Ko`)
}

async function main() {
  await mkdir(SORTIE, { recursive: true })
  const demandes = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  const ids = demandes.length
    ? demandes
    : (await readdir(SOURCES)).filter((f) => /^[a-z0-9-]+\.png$/.test(f)).map((f) => f.slice(0, -4))
  for (const id of ids) await produire(id)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
