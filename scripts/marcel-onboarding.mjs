// LES POSES DE MARCEL POUR L'ONBOARDING (13/10/2026, Lucas : « tout doit être
// tourné via des illustrations de Marcel, inspire-toi de Duolingo sans le côté
// question »). Comme Duo chez Duolingo, Marcel accueille, présente l'app et
// commente chaque écran dans sa bulle.
//
//   node scripts/marcel-onboarding.mjs
//
// Neuf poses peintes par Nano Banana 2.1 avec `marcel-bravo.webp` en
// référence, sur FOND MAGENTA PUR détouré ici par chroma-key (la méthode des
// illustrations de fiches, scripts/fiches-illustrations.mjs) :
//   assets-sources/onboarding/marcel/<pose>.png → public/images/onboarding/marcel-<pose>.webp
// Poses : salut (accueil) · jeu, trophee, plan (le tuto) · classe · cadre
// (l'avatar) · flamme (le rythme) · cle (le compte) · fete (la bienvenue).
// 640 px de haut, fond transparent, ~40 Ko chacune.

import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'

const SRC = 'assets-sources/onboarding/marcel'
const DEST = 'public/images/onboarding'
const HAUTEUR = 640

/** Chroma-key magenta → alpha, avec dé-contamination des bords. */
async function detourer(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const out = Buffer.alloc(data.length)
  const { width, height, channels } = info
  for (let i = 0; i < width * height; i += 1) {
    const r = data[i * channels]
    const g = data[i * channels + 1]
    const b = data[i * channels + 2]
    const d = Math.sqrt(((255 - r) ** 2 + g ** 2 + (255 - b) ** 2) / 3) / 255
    const a = Math.min(1, Math.max(0, (d - 0.12) / 0.3))
    if (a <= 0) {
      out[i * channels] = 0
      out[i * channels + 1] = 0
      out[i * channels + 2] = 0
      out[i * channels + 3] = 0
      continue
    }
    const k = 1 - a
    out[i * channels] = Math.min(255, Math.max(0, (r - k * 255) / a))
    out[i * channels + 1] = Math.min(255, Math.max(0, g / a))
    out[i * channels + 2] = Math.min(255, Math.max(0, (b - k * 255) / a))
    out[i * channels + 3] = Math.round(a * 255)
  }
  return sharp(out, { raw: { width, height, channels } }).png().toBuffer()
}

await mkdir(DEST, { recursive: true })
const poses = (await readdir(SRC)).filter((f) => /^[a-z]+\.png$/.test(f))
for (const f of poses.sort()) {
  const pose = f.replace(/\.png$/, '')
  const keyed = await detourer(`${SRC}/${f}`)
  const info = await sharp(keyed)
    .trim({ threshold: 8 })
    .resize({ height: HAUTEUR, withoutEnlargement: true })
    .webp({ quality: 86 })
    .toFile(`${DEST}/marcel-${pose}.webp`)
  console.log(`marcel-${pose}.webp`.padEnd(22), `${info.width}x${info.height} · ${Math.round(info.size / 1024)} Ko`)
}
