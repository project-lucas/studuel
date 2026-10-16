// LES BLASONS DE LIGUE PAR DIVISION (15/10/2026, Lucas : « actualiser les
// blasons pour que le tout soit cohérent avec les cadres de l'avatar »).
// Une planche Nano Banana 2.1 par métal (2 × 2 : IV III / II I), avec en
// référence l'ancien blason du métal (public/images/defi/ranks) et la planche
// de ses quatre cadres (scripts/cadres-rang.mjs) : chaque division du blason
// reprend l'ornement de la division du cadre (rivets, lauriers, ailes, gemme).
//
//   node scripts/blasons-ligue.mjs
//
// Sources : assets-sources/cadres-rang/blason-<rang>.png (fond magenta).
// Sortie : public/images/rangs/blasons/<rang>-<division>.webp, 192 × 192 —
// les quatre divisions d'un métal à la MÊME échelle (la plus grande remplit
// le carré) : un blason ne rapetisse pas quand il gagne ses lauriers.

import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RACINE = path.resolve(import.meta.dirname, '..')
const SOURCES = path.join(RACINE, 'assets-sources', 'cadres-rang')
const SORTIE = path.join(RACINE, 'public', 'images', 'rangs', 'blasons')
const METAUX = ['bronze', 'argent', 'or', 'platine', 'diamant']
const DIVISIONS = [4, 3, 2, 1]
const COTE = 192
const MARGE = 6

function alphaMagenta(r, g, b) {
  const d = Math.sqrt(((255 - r) ** 2 + g ** 2 + (255 - b) ** 2) / 3) / 255
  return Math.min(1, Math.max(0, (d - 0.12) / 0.3))
}

async function detourer(source) {
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const out = Buffer.alloc(data.length)
  for (let i = 0; i < width * height; i += 1) {
    const r = data[i * channels], g = data[i * channels + 1], b = data[i * channels + 2]
    const a = alphaMagenta(r, g, b)
    if (a <= 0) continue
    const k = 1 - a
    out[i * channels] = Math.min(255, Math.max(0, (r - k * 255) / a))
    out[i * channels + 1] = Math.min(255, Math.max(0, g / a))
    out[i * channels + 2] = Math.min(255, Math.max(0, (b - k * 255) / a))
    out[i * channels + 3] = Math.round(a * 255)
  }
  return { out, width, height, channels }
}

async function main() {
  await mkdir(SORTIE, { recursive: true })
  for (const metal of METAUX) {
    const { out, width, height, channels } = await detourer(path.join(SOURCES, `blason-${metal}.png`))
    const cw = Math.floor(width / 2)
    const ch = Math.floor(height / 2)
    const cases = []
    for (let k = 0; k < 4; k += 1) {
      const buf = await sharp(out, { raw: { width, height, channels } })
        .extract({ left: (k % 2) * cw, top: Math.floor(k / 2) * ch, width: cw, height: ch })
        .png()
        .toBuffer()
      const { data, info } = await sharp(buf).trim({ threshold: 8 }).png().toBuffer({ resolveWithObject: true })
      cases.push({ data, w: info.width, h: info.height })
    }
    const echelle = (COTE - 2 * MARGE) / Math.max(...cases.flatMap((c) => [c.w, c.h]))
    for (let k = 0; k < 4; k += 1) {
      const c = cases[k]
      const w = Math.round(c.w * echelle)
      const h = Math.round(c.h * echelle)
      const img = await sharp(c.data).resize(w, h).png().toBuffer()
      const fichier = path.join(SORTIE, `${metal}-${DIVISIONS[k]}.webp`)
      const res = await sharp({ create: { width: COTE, height: COTE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
        .composite([{ input: img, left: Math.round((COTE - w) / 2), top: Math.round((COTE - h) / 2) }])
        .webp({ quality: 82, alphaQuality: 90 })
        .toFile(fichier)
      console.log(`${metal}-${DIVISIONS[k]}  ${w}×${h}  ${Math.round(res.size / 1024)} Ko`)
    }
  }
}

await main()
