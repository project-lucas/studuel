// LES ILLUSTRATIONS DU BUREAU DE MARCEL (16/10/2026). Lucas : « fais les
// créations d'illustration qui s'imposent pour améliorer le rendu, le design de
// Marcel (outils…) ». La critique du bureau avait classé en P0 « Marcel absent
// de son propre bureau » et les outils étaient en pictogrammes Lucide.
// Commande et prompts : assets-sources/marcel-bureau/commande.md (Nano Banana
// 2.1, la barre d'onglets et le cahier en référence pour les icônes, Marcel
// qui salue et Marcel bravo pour les poses).
//
//   node scripts/marcel-illustrations.mjs
//
// 1. LES OUTILS — assets-sources/marcel-outils/<id>.png (fond blanc peint)
//    → public/images/marcel/outils/<id>.webp, 160 px, détourés et passés dans
//    la TRAME commune (scripts/lib/trame.mjs) : huit objets vus côte à côte
//    dans l'onglet Outils, deux tailles perçues différentes s'y liraient comme
//    un bug. Trois outils reprennent un dessin de Réviser (fiche, quiz,
//    exercice) et ne passent pas ici.
// 2. LES POSES — assets-sources/marcel-poses/<id>.png (fond MAGENTA pur)
//    → public/images/marcel/poses/<id>.webp, 384 px de haut, chroma-key avec
//    dé-contamination des bords (la méthode de scripts/duel-titres.mjs).
// 3. LE DÉCOR — assets-sources/marcel-decor/{jour,soir}.png (le bureau de
//    Marcel peint au jour et au soir, 1376×768) → public/images/marcel/decor/
//    <nom>.webp, 1000 px de large : il couvre l’en-tête du bureau.

import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { planDuLot } from './lib/trame.mjs'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const RACINE = path.resolve(import.meta.dirname, '..')
const OUTILS_SRC = path.join(RACINE, 'assets-sources', 'marcel-outils')
const OUTILS_DEST = path.join(RACINE, 'public', 'images', 'marcel', 'outils')
const POSES_SRC = path.join(RACINE, 'assets-sources', 'marcel-poses')
const POSES_DEST = path.join(RACINE, 'public', 'images', 'marcel', 'poses')

const DECOR_SRC = path.join(RACINE, 'assets-sources', 'marcel-decor')
const DECOR_DEST = path.join(RACINE, 'public', 'images', 'marcel', 'decor')

// Un outil s’affiche à 48 px au plus : 160 px couvrent les écrans 3×.
const TAILLE_OUTIL = 160
// Une pose s’affiche à 128 px de haut au plus : 384 px couvrent les écrans 3×.
const HAUTEUR_POSE = 384

const originaux = async (dossier) =>
  (await readdir(dossier)).filter((f) => /^[a-z0-9-]+\.(png|webp)$/.test(f))

async function outils() {
  await mkdir(OUTILS_DEST, { recursive: true })
  const dessins = {}
  for (const f of await originaux(OUTILS_SRC)) {
    const id = f.replace(/\.(png|webp)$/, '')
    dessins[id] = await sharp(await detourerFondPeint(path.join(OUTILS_SRC, f)))
      .trim({ threshold: 2 })
      .png()
      .toBuffer()
  }
  const { cible, plan } = await planDuLot(dessins, TAILLE_OUTIL)
  for (const id of Object.keys(plan).sort()) {
    const { width, height, encre } = plan[id]
    const dest = path.join(OUTILS_DEST, `${id}.webp`)
    await sharp(dessins[id])
      .resize(width, height)
      .extend({
        top: Math.floor((TAILLE_OUTIL - height) / 2),
        bottom: Math.ceil((TAILLE_OUTIL - height) / 2),
        left: Math.floor((TAILLE_OUTIL - width) / 2),
        right: Math.ceil((TAILLE_OUTIL - width) / 2),
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 86 })
      .toFile(dest)
    console.log(`outil ${id.padEnd(12)} ${width}x${height} · encre ${Math.round(encre)} (cible ${Math.round(cible)})`)
  }
}

/** Chroma-key magenta → alpha, bords dé-contaminés (cf. scripts/duel-titres.mjs). */
async function detourerMagenta(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const out = Buffer.alloc(data.length)
  const { width, height, channels } = info
  for (let i = 0; i < width * height; i += 1) {
    const r = data[i * channels]
    const g = data[i * channels + 1]
    const b = data[i * channels + 2]
    const d = Math.sqrt(((255 - r) ** 2 + g ** 2 + (255 - b) ** 2) / 3) / 255
    const a = Math.min(1, Math.max(0, (d - 0.12) / 0.3))
    if (a <= 0) continue
    const k = 1 - a
    out[i * channels] = Math.min(255, Math.max(0, (r - k * 255) / a))
    out[i * channels + 1] = Math.min(255, Math.max(0, g / a))
    out[i * channels + 2] = Math.min(255, Math.max(0, (b - k * 255) / a))
    out[i * channels + 3] = Math.round(a * 255)
  }
  return sharp(out, { raw: { width, height, channels } }).png().toBuffer()
}

async function poses() {
  await mkdir(POSES_DEST, { recursive: true })
  for (const f of await originaux(POSES_SRC)) {
    const id = f.replace(/\.(png|webp)$/, '')
    const dest = path.join(POSES_DEST, `${id}.webp`)
    const info = await sharp(await detourerMagenta(path.join(POSES_SRC, f)))
      .trim({ threshold: 8 })
      .resize({ height: HAUTEUR_POSE, withoutEnlargement: true })
      .webp({ quality: 84, alphaQuality: 88 })
      .toFile(dest)
    console.log(`pose  ${id.padEnd(12)} ${info.width}x${info.height} · ${Math.round(info.size / 1024)} Ko`)
  }
}

async function decor() {
  await mkdir(DECOR_DEST, { recursive: true })
  for (const f of await originaux(DECOR_SRC)) {
    const id = f.replace(/.(png|webp)$/, '')
    const dest = path.join(DECOR_DEST, `${id}.webp`)
    const info = await sharp(path.join(DECOR_SRC, f)).resize({ width: 1000 }).webp({ quality: 76 }).toFile(dest)
    console.log(`décor ${id.padEnd(12)} ${info.width}x${info.height} · ${Math.round(info.size / 1024)} Ko`)
  }
}

await outils()
await poses()
await decor()
