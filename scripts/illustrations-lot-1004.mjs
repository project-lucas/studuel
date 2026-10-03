/**
 * Fabrique LE LOT D'ILLUSTRATIONS DU 04/10/2026 (priorités 2 et 3 de
 * docs/illustrations-a-creer.md, générées avec Nano Banana 2 Lite) :
 *
 *   assets-sources/bannieres-profil/<clé>.png  → public/banners/<clé>.webp            (1280×720, 16:9)
 *                                             → public/images/boutique/objets/banner-<clé>.webp
 *                                               (vignette de vitrine 256², coins arrondis — seulement
 *                                                pour les bannières EN VENTE, cf. BANNIERES_EN_VENTE)
 *   assets-sources/profil/<matière>-<nom>.png → public/images/profil/personnages/<matière>-<nom>.webp
 *                                               (384², détouré : les avatars historiques à débloquer)
 *
 *   node scripts/illustrations-lot-1004.mjs
 *
 * Les scènes des capsules passent par scripts/scenes-capsules.mjs, les
 * accessoires (equip-*) par scripts/illustrations-famille.mjs objets. Les
 * originaux sont LOCAUX (hors dépôt).
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }

// Les bannières vendues dans « Pour ton profil » (migration 200) : leur
// vignette de vitrine est un recadrage carré de la bannière.
const BANNIERES_EN_VENTE = ['couronne-royale', 'dragon-savoir', 'vitrail']

// --- Bannières de profil ----------------------------------------------------
const SRC_BANNIERES = 'assets-sources/bannieres-profil'
fs.mkdirSync('public/banners', { recursive: true })
fs.mkdirSync('public/images/boutique/objets', { recursive: true })
for (const f of fs.readdirSync(SRC_BANNIERES).filter((f) => f.endsWith('.png'))) {
  const cle = f.replace(/\.png$/, '')
  const src = path.join(SRC_BANNIERES, f)
  const info = await sharp(src).resize(1280, 720, { fit: 'cover' }).webp({ quality: 80 }).toFile(`public/banners/${cle}.webp`)
  console.log(`bannière ${cle.padEnd(18)} ${Math.round(info.size / 1024)} Ko`)

  if (!BANNIERES_EN_VENTE.includes(cle)) continue
  const cote = 256
  const masque = Buffer.from(
    `<svg width="${cote}" height="${cote}"><rect width="${cote}" height="${cote}" rx="44" ry="44"/></svg>`,
  )
  const vignette = await sharp(src)
    .resize(cote, cote, { fit: 'cover', position: sharp.strategy.attention })
    .composite([{ input: masque, blend: 'dest-in' }])
    .webp({ quality: 86, alphaQuality: 100 })
    .toFile(`public/images/boutique/objets/banner-${cle}.webp`)
  console.log(`vignette banner-${cle.padEnd(11)} ${Math.round(vignette.size / 1024)} Ko`)
}

// --- Avatars historiques ----------------------------------------------------
const SRC_PROFIL = 'assets-sources/profil'
const DEST_PERSOS = 'public/images/profil/personnages'
fs.mkdirSync(DEST_PERSOS, { recursive: true })
const COTE = 384
const MARGE = 0.03
for (const f of fs.readdirSync(SRC_PROFIL).filter((f) => /^[a-z]+-[a-z0-9-]+\.png$/.test(f))) {
  const id = f.replace(/\.png$/, '')
  const detoure = await sharp(await detourerFondPeint(path.join(SRC_PROFIL, f), { silencieux: true }))
    .trim({ threshold: 1 })
    .png()
    .toBuffer()
  const interieur = Math.round(COTE * (1 - 2 * MARGE))
  const bord = Math.round(COTE * MARGE)
  const info = await sharp(detoure)
    .resize(interieur, interieur, { fit: 'contain', background: TRANSPARENT })
    .extend({ top: bord, bottom: COTE - interieur - bord, left: bord, right: COTE - interieur - bord, background: TRANSPARENT })
    .webp({ quality: 84, alphaQuality: 90, effort: 6 })
    .toFile(`${DEST_PERSOS}/${id}.webp`)
  console.log(`avatar ${id.padEnd(28)} ${Math.round(info.size / 1024)} Ko`)
}
