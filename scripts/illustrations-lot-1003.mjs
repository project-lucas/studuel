/**
 * Fabrique LE LOT D'ILLUSTRATIONS DU 03/10/2026 (priorité 1 de
 * docs/illustrations-a-creer.md, générées avec Nano Banana 2 Lite) :
 *
 *   assets-sources/boss/{nox,mecatron,coach-turbo}.png  → public/images/boss/<id>.webp        (bustes, 1024², détourés)
 *   assets-sources/boss/mecatron-scene.png              → public/images/boss/mecatron-scene.webp (1024×576)
 *   assets-sources/modes/coop.png                       → public/images/defi/modes/coop.webp   (512, détouré)
 *   assets-sources/modes/coop-scene.png                 → public/images/defi/modes/coop-scene.webp (1024×576)
 *   assets-sources/vignettes/grand-oral.png             → public/images/matieres/vignettes/grand-oral.webp (320², détourée)
 *   assets-sources/bannieres-jeux/programme-scene.png   → public/images/defi/jeux/programme-scene.webp (1536×864)
 *   assets-sources/niveau/coffre-palier-{ferme,ouvert}.png → public/images/niveau/coffre-palier-*.webp
 *       (256², cadrage COMMUN : le coffre s'ouvre sur place)
 *
 *   node scripts/illustrations-lot-1003.mjs
 *
 * Mêmes formats que les fichiers voisins de chaque dossier ; détourage du fond
 * uni par scripts/lib/fond-peint.mjs. Les originaux sont LOCAUX (hors dépôt).
 */
import fs from 'node:fs'

import sharp from 'sharp'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 }

async function detoure(src, dest, cote, marge = 0.04) {
  const buffer = await sharp(await detourerFondPeint(src, { silencieux: true })).trim({ threshold: 1 }).png().toBuffer()
  const interieur = Math.round(cote * (1 - 2 * marge))
  const info = await sharp(buffer)
    .resize(interieur, interieur, { fit: 'contain', background: TRANSPARENT })
    .extend({
      top: Math.round(cote * marge),
      bottom: cote - interieur - Math.round(cote * marge),
      left: Math.round(cote * marge),
      right: cote - interieur - Math.round(cote * marge),
      background: TRANSPARENT,
    })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(dest)
  console.log(dest, Math.round(info.size / 1024), 'Ko')
}

async function scene(src, dest, largeur, hauteur, quality = 82) {
  const info = await sharp(src).resize(largeur, hauteur, { fit: 'cover' }).webp({ quality }).toFile(dest)
  console.log(dest, Math.round(info.size / 1024), 'Ko')
}

/** Deux états d'un même objet, posés dans une boîte commune (il ne saute pas). */
async function paire(srcA, srcB, destA, destB, cote, marge = 0.04) {
  const bufs = [
    await sharp(await detourerFondPeint(srcA, { silencieux: true })).png().toBuffer(),
    await sharp(await detourerFondPeint(srcB, { silencieux: true })).png().toBuffer(),
  ]
  const boites = await Promise.all(
    bufs.map(async (b) => {
      const { info } = await sharp(b).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true })
      return { left: -info.trimOffsetLeft, top: -info.trimOffsetTop, width: info.width, height: info.height }
    }),
  )
  const gauche = Math.min(...boites.map((b) => b.left))
  const haut = Math.min(...boites.map((b) => b.top))
  const droite = Math.max(...boites.map((b) => b.left + b.width))
  const bas = Math.max(...boites.map((b) => b.top + b.height))
  const larg = droite - gauche
  const haute = bas - haut
  const interieur = Math.round(cote * (1 - 2 * marge))
  const k = interieur / Math.max(larg, haute)
  for (const [b, dest] of [
    [bufs[0], destA],
    [bufs[1], destB],
  ]) {
    const w = Math.round(larg * k)
    const h = Math.round(haute * k)
    const info = await sharp(b)
      .extract({ left: gauche, top: haut, width: larg, height: haute })
      .resize(w, h)
      .extend({
        top: cote - h - Math.round(cote * marge),
        bottom: Math.round(cote * marge),
        left: Math.floor((cote - w) / 2),
        right: Math.ceil((cote - w) / 2),
        background: TRANSPARENT,
      })
      .webp({ quality: 90, alphaQuality: 100 })
      .toFile(dest)
    console.log(dest, Math.round(info.size / 1024), 'Ko')
  }
}

fs.mkdirSync('public/images/niveau', { recursive: true })
for (const id of ['nox', 'mecatron', 'coach-turbo']) {
  await detoure(`assets-sources/boss/${id}.png`, `public/images/boss/${id}.webp`, 1024, 0.02)
}
await scene('assets-sources/boss/mecatron-scene.png', 'public/images/boss/mecatron-scene.webp', 1024, 576)
await detoure('assets-sources/modes/coop.png', 'public/images/defi/modes/coop.webp', 512)
await scene('assets-sources/modes/coop-scene.png', 'public/images/defi/modes/coop-scene.webp', 1024, 576)
await detoure('assets-sources/vignettes/grand-oral.png', 'public/images/matieres/vignettes/grand-oral.webp', 320)
await scene('assets-sources/bannieres-jeux/programme-scene.png', 'public/images/defi/jeux/programme-scene.webp', 1536, 864)
await paire(
  'assets-sources/niveau/coffre-palier-ferme.png',
  'assets-sources/niveau/coffre-palier-ouvert.png',
  'public/images/niveau/coffre-palier-ferme.webp',
  'public/images/niveau/coffre-palier-ouvert.webp',
  256,
)

