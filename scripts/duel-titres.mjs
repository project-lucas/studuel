// LES TITRES ILLUSTRÉS DE LA FIN DE DUEL — « VICTOIRE ! » et « DÉFAITE »
// (13/10/2026, Lucas : « il faut faire de belles illustrations pour victoire,
// défaite »). Dessinés par Nano Banana 2.1 dans la famille nav (l'éclair d'XP
// et le globe des Capitales en référence), sur un FOND MAGENTA PUR qu'on
// détoure ici par chroma-key — comme les nuages de l'arène vivante.
//
//   node scripts/duel-titres.mjs            victoire + défaite (les fichiers choisis)
//   node scripts/duel-titres.mjs --tous     les six candidats, dans assets-sources/duel-titres/_keyed/
//
// Sources : assets-sources/duel-titres/<nom>.png (1376 × 768).
// Sorties : public/images/duel/victoire.webp, defaite.webp — 720 px de large,
// fond transparent, recadrés au plus près du dessin.

import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RACINE = path.resolve(import.meta.dirname, '..')
const SOURCES = path.join(RACINE, 'assets-sources', 'duel-titres')
const SORTIE = path.join(RACINE, 'public', 'images', 'duel')

/** Les candidats retenus (le numéro de la planche du 13/10/2026). */
const CHOIX = {
  victoire: 'victoire-1',
  defaite: 'defaite-1',
}

const LARGEUR = 720

/**
 * Chroma-key magenta → alpha, avec dé-contamination des bords : un pixel à
 * moitié magenta est à moitié dessin — on retire la part de magenta et on garde
 * la couleur du dessin, sinon le cerne prune prend un liseré rose.
 */
async function detourer(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const out = Buffer.alloc(data.length)
  const { width, height, channels } = info
  for (let i = 0; i < width * height; i += 1) {
    const r = data[i * channels]
    const g = data[i * channels + 1]
    const b = data[i * channels + 2]
    // Distance au magenta pur (255, 0, 255), ramenée à 0..1 : 0 = magenta.
    const d = Math.sqrt(((255 - r) ** 2 + g ** 2 + (255 - b) ** 2) / 3) / 255
    // En deçà de 0,12 : fond ; au-delà de 0,42 : dessin ; entre : le bord.
    const a = Math.min(1, Math.max(0, (d - 0.12) / 0.3))
    if (a <= 0) {
      out[i * channels] = 0
      out[i * channels + 1] = 0
      out[i * channels + 2] = 0
      out[i * channels + 3] = 0
      continue
    }
    // Dé-contamination : couleur = (c − (1 − a) · magenta) / a.
    const k = 1 - a
    const rr = Math.min(255, Math.max(0, (r - k * 255) / a))
    const gg = Math.min(255, Math.max(0, g / a))
    const bb = Math.min(255, Math.max(0, (b - k * 255) / a))
    out[i * channels] = rr
    out[i * channels + 1] = gg
    out[i * channels + 2] = bb
    out[i * channels + 3] = Math.round(a * 255)
  }
  return sharp(out, { raw: { width, height, channels } }).png().toBuffer()
}

async function produire(nom, cible) {
  const keyed = await detourer(path.join(SOURCES, `${nom}.png`))
  const info = await sharp(keyed)
    .trim({ threshold: 8 })
    .resize({ width: LARGEUR, withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 90 })
    .toFile(cible)
  console.log(`${path.relative(RACINE, cible)}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} Ko`)
}

async function main() {
  await mkdir(SORTIE, { recursive: true })
  if (process.argv.includes('--tous')) {
    const dossier = path.join(SOURCES, '_keyed')
    await mkdir(dossier, { recursive: true })
    for (const f of await readdir(SOURCES)) {
      if (!/^[a-z]+-\d\.png$/.test(f)) continue
      await produire(f.replace(/\.png$/, ''), path.join(dossier, f.replace(/\.png$/, '.webp')))
    }
    return
  }
  for (const [cle, nom] of Object.entries(CHOIX)) {
    await produire(nom, path.join(SORTIE, `${cle}.webp`))
  }
}

await main()
