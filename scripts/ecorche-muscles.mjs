// L'ÉCORCHÉ DE « MUSCLES EXPRESS » — la version peinte (14/10/2026, Lucas :
// « peux-tu faire la version encore plus supérieure du mode de jeu Muscles
// express ? »). Deux vues dessinées par Nano Banana 2.1 sur FOND MAGENTA PUR,
// détourées ici par chroma-key (la même recette que les titres de fin de duel
// et les nuages de l'arène vivante), recadrées au plus près du dessin et
// servies en WebP transparent.
//
//   node scripts/ecorche-muscles.mjs            face + dos
//   node scripts/ecorche-muscles.mjs face       une seule vue
//
// Sources : assets-sources/muscles/face.png, dos.png (9:16, ~1152 × 2048).
// Sorties : public/images/jeux/muscles/face.webp, dos.webp — toile 1000 × 1800.
//
// ⚠️ Les ZONES de la planche (lib/jeux/muscles-planche.ts) sont tracées dans
// le repère de l'image SERVIE (son viewBox = sa taille en pixels, écrite dans
// `lib/jeux/muscles-planche.ts`) : refaire une vue, c'est retracer ses zones.
// Le script écrit la taille obtenue pour qu'on la recopie.

import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RACINE = path.resolve(import.meta.dirname, '..')
// Deux planches peintes passent par ici (14/10/2026) : l'écorché de Muscles
// express (face + dos) et la planche des organes d'Anatomie express (face).
//   node scripts/ecorche-muscles.mjs --planche=organes
const PLANCHES = {
  // `cle` : 'distance' (la clé d'origine, validée sur l'écorché — la changer
  // décalerait le recadrage et toutes ses graines), 'magentitude' (les organes
  // roses : la distance les rendait à moitié transparents).
  muscles: { dossier: 'muscles', toile: { largeur: 1000, hauteur: 1800 }, vues: ['face', 'dos'], cle: 'distance' },
  organes: { dossier: 'organes', toile: { largeur: 1000, hauteur: 1300 }, vues: ['face'], cle: 'magentitude' },
}
const NOM = (process.argv.find((a) => a.startsWith('--planche=')) ?? '--planche=muscles').slice(10)
const CONFIG = PLANCHES[NOM]
if (!CONFIG) throw new Error(`planche inconnue : ${NOM}`)
const SOURCES = path.join(RACINE, 'assets-sources', CONFIG.dossier)
const SORTIE = path.join(RACINE, 'public', 'images', 'jeux', CONFIG.dossier)

/** La toile commune aux deux vues : même cadre, même viewBox (100 × 180 unités). */
export const TOILE = CONFIG.toile

/**
 * Chroma-key magenta → alpha, avec dé-contamination des bords : un pixel à
 * moitié magenta est à moitié dessin — on retire la part de magenta et on garde
 * la couleur du dessin, sinon le cerne prune prend un liseré rose.
 */
/** Le fond « magenta » que rend réellement le modèle (mesuré sur les trois sources). */
const FOND = [254, 43, 249]

async function detourer(src) {
  const fond = CONFIG.cle === 'magentitude' ? FOND : [255, 0, 255]
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const out = Buffer.alloc(data.length)
  const { width, height, channels } = info
  for (let i = 0; i < width * height; i += 1) {
    const r = data[i * channels]
    const g = data[i * channels + 1]
    const b = data[i * channels + 2]
    // La « magentitude » : le magenta pur a le rouge et le bleu au plus haut et
    // le vert à zéro. On la mesure par min(r, b) − g, et non par la distance au
    // magenta : un poumon rose (246, 160, 155) en était assez près pour sortir
    // à moitié transparent, alors que son vert le dit clairement « pas fond ».
    const magentitude = Math.min(r, b) - g
    // Le fond généré mesure ~200 (254, 43, 249) ; le cerne prune ~60, un poumon ~10.
    const a =
      CONFIG.cle === 'magentitude'
        ? Math.min(1, Math.max(0, (180 - magentitude) / 80))
        : Math.min(1, Math.max(0, (Math.sqrt(((255 - r) ** 2 + g ** 2 + (255 - b) ** 2) / 3) / 255 - 0.12) / 0.3))
    if (a <= 0) {
      out[i * channels] = 0
      out[i * channels + 1] = 0
      out[i * channels + 2] = 0
      out[i * channels + 3] = 0
      continue
    }
    const k = 1 - a
    out[i * channels] = Math.min(255, Math.max(0, (r - k * fond[0]) / a))
    out[i * channels + 1] = Math.min(255, Math.max(0, (g - k * fond[1]) / a))
    out[i * channels + 2] = Math.min(255, Math.max(0, (b - k * fond[2]) / a))
    out[i * channels + 3] = Math.round(a * 255)
  }
  return sharp(out, { raw: { width, height, channels } }).png().toBuffer()
}

async function produire(vue) {
  const keyed = await detourer(path.join(SOURCES, `${vue}.png`))
  const cible = path.join(SORTIE, `${vue}.webp`)
  // Recadré au plus près du dessin, puis posé au centre de la toile commune :
  // la face et le dos gardent exactement le même cadre.
  const serre = await sharp(keyed).trim({ threshold: 8 }).toBuffer()
  const pose = await sharp(serre)
    .resize({ width: TOILE.largeur - 40, height: TOILE.hauteur - 40, fit: 'inside' })
    .toBuffer({ resolveWithObject: true })
  const gauche = Math.round((TOILE.largeur - pose.info.width) / 2)
  const haut = Math.round((TOILE.hauteur - pose.info.height) / 2)
  const info = await sharp({
    create: { width: TOILE.largeur, height: TOILE.hauteur, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: pose.data, left: gauche, top: haut }])
    .webp({ quality: 86, alphaQuality: 90 })
    .toFile(cible)
  console.log(
    `${path.relative(RACINE, cible)}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} Ko  → viewBox 0 0 ${info.width} ${info.height}`,
  )
}

async function main() {
  await mkdir(SORTIE, { recursive: true })
  const vues = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  for (const vue of vues.length ? vues : CONFIG.vues) await produire(vue)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
