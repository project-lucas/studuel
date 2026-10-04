/**
 * Fabrique L'ÉCLAIR D'XP (04/10/2026, choisi par Lucas parmi huit pistes :
 * l'éclair de toujours, redessiné dans la famille de la barre d'onglets) :
 *   assets-sources/xp/eclair.png   (original Nano Banana 2 Lite, LOCAL — hors dépôt)
 *     → public/images/xp/eclair.webp        (128 × 128) l'éclair SEUL : le bandeau,
 *                                            les « +N XP », tout ce qui fait 12-32 px
 *     → public/images/xp/eclair-eclats.webp (384 × 384) l'éclair et ses étincelles :
 *                                            la fête de niveau, les écrans de fin
 *
 *   node scripts/icone-xp.mjs
 *
 * L'original sort sur un fond blanc opaque : détourage par scripts/lib/fond-peint.mjs.
 * Les étincelles qui l'entourent ne se lisent pas à 16 px — elles y font des
 * points sales — : la version « seule » ne garde que la plus grande tache
 * d'un seul tenant (l'éclair).
 */
import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SOURCE = 'assets-sources/xp/eclair.png'
const DEST_DIR = 'public/images/xp'
/** Marge autour du dessin, en part de la toile : le cerne ne touche pas le bord. */
const MARGE = 0.03
/** Seuil d'opacité d'un pixel « visible ». */
const ALPHA_VISIBLE = 8

try {
  await access(SOURCE)
} catch {
  throw new Error(
    `Original introuvable : ${SOURCE}. Les originaux sont LOCAUX (assets-sources/ est ` +
      `dans .gitignore) — après un clone, il faut le redéposer avant de relancer ce script.`,
  )
}

/** Efface tout ce qui n'est pas la plus grande tache d'un seul tenant. */
function garderPlusGrandeTache(data, width, height, channels) {
  const etiquettes = new Int32Array(width * height)
  let meilleure = 0
  let tailleMeilleure = 0
  let prochaine = 1
  const pile = []
  for (let depart = 0; depart < width * height; depart++) {
    if (etiquettes[depart] || data[depart * channels + 3] <= ALPHA_VISIBLE) continue
    const etiquette = prochaine++
    let taille = 0
    pile.push(depart)
    etiquettes[depart] = etiquette
    while (pile.length) {
      const p = pile.pop()
      taille++
      const x = p % width
      const y = (p - x) / width
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue
        const q = ny * width + nx
        if (etiquettes[q] || data[q * channels + 3] <= ALPHA_VISIBLE) continue
        etiquettes[q] = etiquette
        pile.push(q)
      }
    }
    if (taille > tailleMeilleure) {
      tailleMeilleure = taille
      meilleure = etiquette
    }
  }
  const sortie = Buffer.from(data)
  for (let p = 0; p < width * height; p++) {
    if (etiquettes[p] !== meilleure) sortie[p * channels + 3] = 0
  }
  return sortie
}

/** Recadre sur les pixels visibles et centre dans un carré de `cote` px. */
async function poser(buffer, info, cote, fichier) {
  const { data } = { data: buffer }
  let gauche = info.width
  let haut = info.height
  let droite = -1
  let bas = -1
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > ALPHA_VISIBLE) {
        gauche = Math.min(gauche, x)
        droite = Math.max(droite, x)
        haut = Math.min(haut, y)
        bas = Math.max(bas, y)
      }
    }
  }
  const largeur = droite - gauche + 1
  const hauteur = bas - haut + 1
  const interieur = Math.round(cote * (1 - 2 * MARGE))
  const echelle = interieur / Math.max(largeur, hauteur)
  const l = Math.round(largeur * echelle)
  const h = Math.round(hauteur * echelle)
  const sortie = await sharp(buffer, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .extract({ left: gauche, top: haut, width: largeur, height: hauteur })
    .resize(l, h, { kernel: 'lanczos3' })
    .extend({
      top: Math.floor((cote - h) / 2),
      bottom: Math.ceil((cote - h) / 2),
      left: Math.floor((cote - l) / 2),
      right: Math.ceil((cote - l) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(`${DEST_DIR}/${fichier}`)
  console.log(`${DEST_DIR}/${fichier} · ${l}x${h} dans ${cote}² · ${Math.round(sortie.size / 1024)} Ko`)
}

await mkdir(DEST_DIR, { recursive: true })

const { data, info } = await sharp(await detourerFondPeint(SOURCE))
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

await poser(garderPlusGrandeTache(data, info.width, info.height, info.channels), info, 128, 'eclair.webp')
await poser(data, info, 384, 'eclair-eclats.webp')
