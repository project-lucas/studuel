/**
 * Fabrique LE TROPHÉE ANIMÉ de l'onglet Amis — l'icône posée à côté du compte de
 * trophées de chaque ami (components/amis/TropheeAnime.tsx) :
 *   assets-sources/amis/trophee.gif       (Flaticon, 640×640, 39 images, LOCAL — hors dépôt)
 *     → public/images/amis/trophee.webp   (96×96, WebP animé, fond transparent)
 *
 *   node scripts/trophee-amis.mjs
 *
 * POURQUOI PAS LE GIF TEL QUEL. Il pèse 557 Ko pour une icône de 16 px, et son
 * fond est un BLANC OPAQUE : posé sur la pastille grise du compteur, il aurait
 * dessiné un carré blanc. On le passe en WebP animé (net sur un écran à densité
 * triplée pour 24 px servis) en rendant le blanc transparent — `unflatten()`
 * de sharp le fait image par image ; le dessin lui-même n'a pas de blanc pur,
 * sauf l'étoile de la coupe, qui est cernée de bleu marine et reste pleine.
 */

import fs from 'node:fs'
import sharp from 'sharp'

const SRC = 'assets-sources/amis/trophee.gif'
const OUT = 'public/images/amis/trophee.webp'
const SIZE = 96

const meta = await sharp(SRC, { animated: true }).metadata()
const buf = await sharp(SRC, { animated: true })
  .unflatten()
  // Sur une entrée animée, la hauteur demandée est celle d'UNE image.
  .resize(SIZE, SIZE, { kernel: 'lanczos3' })
  .webp({ quality: 82, effort: 6, loop: meta.loop ?? 0 })
  .toBuffer()

fs.mkdirSync('public/images/amis', { recursive: true })
fs.writeFileSync(OUT, buf)
const out = await sharp(OUT, { animated: true }).metadata()
console.log(
  `${SRC} (${meta.pages} images) → ${OUT} (${Math.round(buf.length / 1024)} Ko, ${out.pages} images, alpha ${out.hasAlpha})`,
)
