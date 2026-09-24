/**
 * Fabrique LES COUCHES DE L'ARÈNE VIVANTE (/defi) :
 *   assets-sources/arene-vivante/<plage>/plate.(png|jpg)   (ciel repeint SANS ses éléments mobiles)
 *   assets-sources/arene-vivante/<plage>/<élément>.png     (chaque nuage, chaque rocher détouré)
 *     → public/images/arene/vivante/<plage>-plate.webp       (1080 de large)
 *     → public/images/arene/vivante/<plage>-<élément>.webp   (taille d'origine, alpha, bords adoucis)
 *
 *   node scripts/arene-vivante.mjs
 *
 * D'OÙ VIENNENT CES FICHIERS
 *
 * Lucas exporte l'animation d'une plage depuis son outil de design en
 * « Project HTML » (le 23/09/2026 : l'aube, puis le soir). L'archive contient
 * la planche (`assets/plate.png` ou `night-plate.jpg`, 2160×3840 :
 * l'illustration horaire agrandie deux fois, dont les éléments mobiles ont été
 * GOMMÉS) et ces éléments découpés à part (`assets/cloud-*.png`,
 * `night-rock-*.png`, fond transparent) — c'est ce qui permet aux nuages de
 * dériver devant un ciel intact. On les range ici sous leur nom servi
 * (`plate`, `cloud-1`, `cloud-a`, `rock-l`…). Les positions et les mouvements
 * sont recopiés dans `lib/arena-vivante.ts` ; ce script ne fait que réduire,
 * adoucir et convertir.
 *
 * POURQUOI RÉDUIRE
 *
 * Une planche pèse 7 Mo en PNG. Servie telle quelle, ce serait sept
 * mégaoctets avant le premier écran de l'onglet le plus visité. À 1080 de
 * large en webp, elle retombe au poids des six décors horaires (~60 Ko) : la
 * scène est peinte en `cover` sur un téléphone de 390 px, personne ne verra la
 * différence. Les éléments gardent leur taille d'origine (deux fois leur cote
 * d'affichage : nets sur un écran Retina).
 *
 * POURQUOI ADOUCIR LES BORDS
 *
 * Le détourage de l'outil coupe net au bord de la boîte : un nuage posé contre
 * le bord de la planche s'y arrête d'un trait vertical, et le « cloud-d » du
 * soir traîne un rectangle de ciel semi-opaque. Immobile, rien ne se voit —
 * la découpe recouvre exactement le ciel d'origine. Mais un nuage se balance
 * de 20 à 46 px : le trait se décolle du bord et se lit comme une vitre. On
 * fond donc l'alpha de chaque élément à zéro sur ses bords (FONDU px), ce qui
 * ne touche jamais le cœur d'un nuage.
 */

import sharp from 'sharp'
import { mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'

const SRC_DIR = 'assets-sources/arene-vivante'
const DEST_DIR = 'public/images/arene/vivante'

/** Largeur servie, alignée sur les six décors horaires (1080×1920). */
const WIDTH = 1080
/** Même qualité que le fond d'arène (scripts/arene-fond.mjs). */
const QUALITY = 82
/** Les éléments : des dégradés doux sur de la transparence, 80 suffit. */
const ELEMENT_QUALITY = 80
/**
 * Largeur du fondu des bords d'un élément, en pixels SOURCE (le double des
 * pixels de planche) : 48 px source = 24 px de planche, un peu plus que la
 * moitié du plus grand balancement.
 */
const FONDU = 48

/** L'élément, son alpha fondu à zéro sur les FONDU px de chaque bord. */
async function adoucirLesBords(src) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const fondu = Math.max(1, Math.min(FONDU, Math.floor(Math.min(width, height) / 4)))
  for (let y = 0; y < height; y++) {
    const fy = Math.min(1, y / fondu, (height - 1 - y) / fondu)
    for (let x = 0; x < width; x++) {
      const f = Math.min(fy, x / fondu, (width - 1 - x) / fondu)
      if (f >= 1) continue
      const i = (y * width + x) * channels + 3
      data[i] = Math.round(data[i] * f)
    }
  }
  return sharp(data, { raw: { width, height, channels } })
}

await mkdir(DEST_DIR, { recursive: true })

for (const plage of await readdir(SRC_DIR)) {
  const dir = path.join(SRC_DIR, plage)
  if (!(await stat(dir)).isDirectory()) continue

  for (const fichier of await readdir(dir)) {
    const src = path.join(dir, fichier)
    const nom = path.parse(fichier).name
    const dest = path.join(DEST_DIR, `${plage}-${nom}.webp`)
    const { width, height } = await sharp(src).metadata()

    const info =
      nom === 'plate'
        ? await sharp(src)
            .resize({ width: WIDTH, withoutEnlargement: false })
            .webp({ quality: QUALITY })
            .toFile(dest)
        : await (await adoucirLesBords(src))
            .webp({ quality: ELEMENT_QUALITY, alphaQuality: 90 })
            .toFile(dest)

    console.log(
      `${plage}/${fichier}  ${width}x${height} → ${info.width}x${info.height}  ` +
        `${Math.round(info.size / 1024)} Ko  →  ${dest}`,
    )
  }
}
