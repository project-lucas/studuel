/**
 * Fabrique LA FLAMME DE SÉRIE :
 *   assets-sources/fire (série)/fire.png   (original, LOCAL — hors dépôt)
 *     → public/images/serie/flamme.webp    (256x256, fond transparent)
 *
 *   node scripts/serie-flamme.mjs
 *
 * POURQUOI CE SCRIPT EXISTE
 *
 * L'original arrive en 4000x4000 SANS canal alpha : le damier gris/blanc qui
 * figure la transparence est PEINT dans le fichier. Posé tel quel dans l'app, on
 * verrait un carré quadrillé derrière la flamme — et le défaut est invisible
 * dans la visionneuse de fichiers, qui dessine exactement le même damier pour
 * figurer la transparence. Le détourage vit dans scripts/lib/fond-peint.mjs, il
 * est partagé avec les vignettes de matières qui souffraient du même mal.
 *
 * TOILE CARRÉE. La flamme est haute et étroite : sur une toile à sa mesure, sa
 * hauteur serait celle de sa boîte et elle dépasserait ses voisines dès qu'on la
 * pose dans une rangée. Sur une toile carrée, elle se règle comme n'importe
 * quelle autre icône (`size-11` et rien d'autre), avec le vide sur les côtés.
 *
 * PAS DE TRAME ICI. La flamme ne fait partie d'aucun lot — elle ne se compare à
 * aucune voisine, il n'y a donc pas de tache d'encre à égaliser (cf.
 * scripts/lib/trame.mjs, qui sert quand plusieurs dessins doivent paraître de
 * même taille). Elle occupe simplement sa toile, à une marge près.
 */

import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC = 'assets-sources/fire (série)/fire.png'
const DEST_DIR = 'public/images/serie'
const DEST = `${DEST_DIR}/flamme.webp`

/** Côté de la toile finale : 256 px pour une icône servie autour de 44. */
const SIZE = 256

/**
 * Marge autour du dessin, en part du côté. Le cerne sombre de la flamme touche
 * sinon le bord de la toile, et le moindre rognage (arrondi, `object-cover`
 * ailleurs dans l'app) le mangerait.
 */
const MARGE = 0.04

await mkdir(DEST_DIR, { recursive: true })

const dessin = await sharp(await detourerFondPeint(SRC))
  .trim({ threshold: 2 })
  .png()
  .toBuffer()

const { width, height } = await sharp(dessin).metadata()

// `fit: 'contain'` avec un fond transparent fait la mise à l'échelle ET le
// centrage en une fois : le rapport hauteur/largeur est conservé, le vide part
// à parts égales de chaque côté.
const dedans = Math.round(SIZE * (1 - 2 * MARGE))
await sharp(dessin)
  .resize(dedans, dedans, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .extend({
    top: Math.round(SIZE * MARGE),
    bottom: SIZE - dedans - Math.round(SIZE * MARGE),
    left: Math.round(SIZE * MARGE),
    right: SIZE - dedans - Math.round(SIZE * MARGE),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .webp({ quality: 92 })
  .toFile(DEST)

console.log(`flamme  source ${width}x${height} détourée  →  ${DEST} (${SIZE}x${SIZE})`)
