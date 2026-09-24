/**
 * Fabrique LES DEUX ILLUSTRATIONS DU COFFRE D'ÉQUIPE (onglet Amis, bandeau,
 * carte du joueur de l'arène) :
 *   assets-sources/amis/coffre ferme.png   (original, LOCAL — hors dépôt)
 *   assets-sources/amis/coffre ouvert.png
 *     → public/images/amis/coffre/ferme.webp · ouvert.webp (256 × 256, fond transparent)
 *
 *   node scripts/coffre-equipe.mjs
 *
 * Les originaux sortent du générateur en 2 000 px sur un fond crème OPAQUE :
 * détourage par scripts/lib/fond-peint.mjs (le remplissage part des bords et
 * s'arrête sur le trait sombre qui cerne le dessin), comme les illustrations
 * du Marché. Puis UN SEUL cadrage pour les deux — la boîte qui contient l'un
 * ET l'autre : le coffre ne saute pas quand il passe de fermé à ouvert, il
 * s'ouvre sur place. Posés en bas de la toile (le coffre repose au sol).
 */
import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC_DIR = 'assets-sources/amis'
const DEST_DIR = 'public/images/amis/coffre'
const SIZE = 256
/** Marge autour du dessin, en part de la toile : le cerne ne touche pas le bord. */
const MARGE = 0.04

const COFFRES = { ferme: 'coffre ferme.png', ouvert: 'coffre ouvert.png' }

async function source(nom) {
  const chemin = `${SRC_DIR}/${nom}`
  try {
    await access(chemin)
    return chemin
  } catch {
    throw new Error(
      `Original introuvable : ${chemin}. Les originaux sont LOCAUX (assets-sources/ est ` +
        `dans .gitignore) — après un clone, il faut les redéposer avant de relancer ce script.`,
    )
  }
}

/** La boîte des pixels visibles d'une image détourée. */
async function boite(buffer) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let gauche = info.width
  let haut = info.height
  let droite = -1
  let bas = -1
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * info.channels + 3] > 8) {
        if (x < gauche) gauche = x
        if (x > droite) droite = x
        if (y < haut) haut = y
        if (y > bas) bas = y
      }
    }
  }
  return { gauche, haut, droite, bas, largeur: info.width, hauteur: info.height }
}

await mkdir(DEST_DIR, { recursive: true })

const detoures = {}
for (const [id, fichier] of Object.entries(COFFRES)) {
  detoures[id] = await sharp(await detourerFondPeint(await source(fichier))).png().toBuffer()
}

// La boîte commune aux deux dessins, carrée, pour garder les proportions.
const boites = await Promise.all(Object.values(detoures).map(boite))
const gauche = Math.min(...boites.map((b) => b.gauche))
const haut = Math.min(...boites.map((b) => b.haut))
const droite = Math.max(...boites.map((b) => b.droite))
const bas = Math.max(...boites.map((b) => b.bas))
const cote = Math.max(droite - gauche + 1, bas - haut + 1)
const interieur = Math.round(SIZE * (1 - 2 * MARGE))

for (const [id, buffer] of Object.entries(detoures)) {
  const recadre = await sharp(buffer)
    .extract({ left: gauche, top: haut, width: droite - gauche + 1, height: bas - haut + 1 })
    .png()
    .toBuffer()
  const echelle = interieur / cote
  const largeur = Math.round((droite - gauche + 1) * echelle)
  const hauteur = Math.round((bas - haut + 1) * echelle)
  const marge = Math.round(SIZE * MARGE)
  const info = await sharp(recadre)
    .resize(largeur, hauteur)
    .extend({
      top: SIZE - hauteur - marge,
      bottom: marge,
      left: Math.floor((SIZE - largeur) / 2),
      right: Math.ceil((SIZE - largeur) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(`${DEST_DIR}/${id}.webp`)
  console.log(`${DEST_DIR}/${id}.webp · ${largeur}x${hauteur} · ${Math.round(info.size / 1024)} Ko`)
}
