// -----------------------------------------------------------------------------
// LES HUMEURS DES HÉROS → public/ (05/11/2026, lib/heros/humeurs.ts)
//
// Pour chaque héros, deux portraits peints par Higgsfield (Nano Banana 2.1, la
// tête recadrée de sa scène en référence, 1:1) : la VICTOIRE et la DÉFAITE,
// rangés dans assets-sources/heros/eleves/humeurs/<clé>-<humeur>.png.
// Ici, recadrés sur la tête (centre x, y et côté en fractions de l'image) et
// servis en 384 × 384 dans public/images/heros/eleves/humeurs/.
//
//   node scripts/heros-humeurs.mjs
// -----------------------------------------------------------------------------

import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'assets-sources/heros/eleves/humeurs')
const OUT = path.join(ROOT, 'public/images/heros/eleves/humeurs')

/** clé → { humeur: [x, y, côté] } */
const CADRAGES = {
  'elfe-rodeur': { victoire: [0.57, 0.44, 0.58], defaite: [0.52, 0.46, 0.7] },
  'elfe-cerf-volant': { victoire: [0.45, 0.52, 0.7], defaite: [0.5, 0.49, 0.7] },
  'elfe-course': { victoire: [0.46, 0.49, 0.7], defaite: [0.5, 0.49, 0.7] },
  'gobeline-lectrice': { victoire: [0.53, 0.54, 0.7], defaite: [0.48, 0.52, 0.7] },
  'gobeline-mur': { victoire: [0.42, 0.46, 0.7], defaite: [0.48, 0.46, 0.7] },
  'humaine-luth': { victoire: [0.43, 0.46, 0.7], defaite: [0.48, 0.46, 0.7] },
  'naine-poney': { victoire: [0.48, 0.49, 0.7], defaite: [0.52, 0.49, 0.7] },
  'demi-elfe-mage': { victoire: [0.5, 0.52, 0.7], defaite: [0.5, 0.52, 0.7] },
  'demi-elfe-orage': { victoire: [0.45, 0.49, 0.7], defaite: [0.48, 0.49, 0.7] },
  'elfe-harpon': { victoire: [0.5, 0.44, 0.7], defaite: [0.5, 0.46, 0.7] },
  'elfe-ombre': { victoire: [0.56, 0.46, 0.7], defaite: [0.5, 0.46, 0.7] },
  'nain-forge': { victoire: [0.5, 0.49, 0.7], defaite: [0.5, 0.49, 0.7] },
  'orc-chien': { victoire: [0.55, 0.52, 0.7], defaite: [0.5, 0.49, 0.7] },
  'orc-classe': { victoire: [0.47, 0.53, 0.7], defaite: [0.5, 0.53, 0.7] },
  'troll-pont': { victoire: [0.47, 0.55, 0.7], defaite: [0.5, 0.53, 0.7] },
}

mkdirSync(OUT, { recursive: true })
for (const [cle, humeurs] of Object.entries(CADRAGES)) {
  for (const [humeur, [x, y, cote]] of Object.entries(humeurs)) {
    const src = path.join(SRC, `${cle}-${humeur}.png`)
    if (!existsSync(src)) throw new Error(`source absente : ${src}`)
    const { width: W, height: H } = await sharp(src).metadata()
    const c = Math.round(cote * W)
    const left = Math.min(Math.max(Math.round(x * W - c / 2), 0), W - c)
    const top = Math.min(Math.max(Math.round(y * H - c / 2), 0), H - c)
    await sharp(src)
      .extract({ left, top, width: c, height: c })
      .resize(384, 384)
      .webp({ quality: 80, effort: 6 })
      .toFile(path.join(OUT, `${cle}-${humeur}.webp`))
    console.log(`${cle}-${humeur}`)
  }
}
