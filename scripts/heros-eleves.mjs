// -----------------------------------------------------------------------------
// LES HÉROS DE L'ACADÉMIE → public/ (31/10/2026)
//
// Les quinze élèves-héros retenus par Lucas (PNG 9:16 de Higgsfield, rangés
// dans assets-sources/heros/eleves/retenus/) deviennent, pour chacun :
//   · la SCÈNE servie à l'écran de choix et en décor de la page du joueur :
//     public/images/heros/eleves/<clé>.webp, 720 px de large ;
//   · le VISAGE, un carré recadré à la main sur la tête du héros, qui sert
//     d'avatar partout ailleurs (bandeau, classement, amis, duel) :
//     public/images/heros/eleves/<clé>-visage2.webp, 384 × 384 (« 2 » : le
//     recadrage du 05/11/2026, servi sous une NOUVELLE adresse).
//
// Le recadrage est en FRACTIONS de l'image source : centre (x, y) du visage
// et côté du carré en part de la largeur. Mesuré sur une planche quadrillée
// (scratch du 31/10), vérifié sur la planche des visages.
//
// Les clés et l'ordre doivent suivre `HEROS_ELEVES` de lib/heros/eleves.ts.
//
//   node scripts/heros-eleves.mjs [--visages]
// -----------------------------------------------------------------------------

import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'assets-sources/heros/eleves/retenus')
const OUT = path.join(ROOT, 'public/images/heros/eleves')

/** clé → [fichier source, x, y, côté] */
// Recadré le 05/11/2026 sur la TÊTE (centre entre le haut des cheveux et le
// menton, mesuré sur une planche quadrillée par héros) : l'ancien cadrage
// laissait des visages coupés au bord d'un rond (gobeline-mur, elfe-ombre,
// naine-poney) ou perdus dans la capuche (elfe-rodeur).
const HEROS = {
  'elfe-cerf-volant': ['fille-elfe-cerf-volant', 0.57, 0.28, 0.32],
  'elfe-course': ['fille-elfe-course', 0.46, 0.31, 0.34],
  'gobeline-lectrice': ['fille-gobelin-lectrice', 0.31, 0.38, 0.32],
  'gobeline-mur': ['fille-gobelin-mur', 0.45, 0.345, 0.36],
  'humaine-luth': ['fille-humaine-luth', 0.53, 0.315, 0.32],
  'naine-poney': ['fille-naine-poney', 0.4, 0.33, 0.3],
  'demi-elfe-mage': ['garcon-demi-elfe-mage', 0.5, 0.24, 0.4],
  'demi-elfe-orage': ['garcon-demi-elfe-orage', 0.49, 0.365, 0.38],
  'elfe-harpon': ['garcon-elfe-bleu-harpon', 0.54, 0.355, 0.28],
  'elfe-ombre': ['garcon-elfe-ombre', 0.43, 0.32, 0.34],
  'elfe-rodeur': ['garcon-elfe-rodeur', 0.53, 0.495, 0.3],
  'nain-forge': ['garcon-nain-forge', 0.52, 0.345, 0.34],
  'orc-chien': ['garcon-orc-chien', 0.29, 0.44, 0.3],
  'orc-classe': ['garcon-orc-classe', 0.55, 0.29, 0.32],
  'troll-pont': ['garcon-troll-pont', 0.53, 0.325, 0.34],
}

// Un héros redessiné prend une base neuve (miroir de VERSION_IMAGE dans lib/heros/eleves.ts).
const VERSION_IMAGE = { 'demi-elfe-mage': 2 }
const base = (cle) => (VERSION_IMAGE[cle] ? `${cle}-v${VERSION_IMAGE[cle]}` : cle)

// `--visages` : ne refait que les visages (la scène reste celle servie).
const VISAGES_SEULS = process.argv.includes('--visages')

mkdirSync(OUT, { recursive: true })

for (const [cle, [fichier, x, y, cote]] of Object.entries(HEROS)) {
  const src = path.join(SRC, `${fichier}.png`)
  const { width: W, height: H } = await sharp(src).metadata()

  if (!VISAGES_SEULS) {
    await sharp(src)
      .resize({ width: 720 })
      .webp({ quality: 74, effort: 6 })
      .toFile(path.join(OUT, `${base(cle)}.webp`))
  }

  const c = Math.round(cote * W)
  const left = Math.min(Math.max(Math.round(x * W - c / 2), 0), W - c)
  const top = Math.min(Math.max(Math.round(y * H - c / 2), 0), H - c)
  await sharp(src)
    .extract({ left, top, width: c, height: c })
    .resize(384, 384)
    .webp({ quality: 80, effort: 6 })
    .toFile(path.join(OUT, `${base(cle)}-visage2.webp`))

  console.log(cle)
}
