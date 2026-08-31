/**
 * Fabrique L'ILLUSTRATION DE LA MODALE « Tu nous quittes déjà ? » :
 *   assets-sources/mascotte/tu nous quittes deja.png   (original 4000x4000)
 *     → public/images/mascotte/quitte-deja.webp       (512x512, fond transparent)
 *
 *   node scripts/mascotte-quitter.mjs
 *
 * POURQUOI CE SCRIPT EXISTE
 *
 * L'original pèse 13,5 Mo et arrive SANS canal alpha : le damier gris/blanc qui
 * figure la transparence est PEINT dans le fichier. Servi tel quel dans une
 * modale, on téléchargerait treize méga-octets pour afficher un carré quadrillé
 * de 140 px sur une carte blanche. Le défaut ne se voit PAS dans la visionneuse
 * de fichiers, qui dessine exactement le même damier pour figurer la
 * transparence — seulement une fois l'image dans l'app. Même mal, même remède
 * que la flamme de série et les vignettes de matières : `detourerFondPeint`.
 *
 * TOILE CARRÉE, comme la flamme (scripts/serie-flamme.mjs) : le composant règle
 * alors l'image avec une seule dimension (`size-36`) et le dessin se centre tout
 * seul, quel que soit son rapport hauteur/largeur.
 *
 * PAS DE TRAME. Ce dessin ne fait partie d'aucun lot — il ne se compare à aucune
 * voisine, il n'y a donc pas de tache d'encre à égaliser (cf. scripts/lib/trame.mjs).
 */

import sharp from 'sharp'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC = 'assets-sources/mascotte/tu nous quittes deja.png'
const DEST = 'public/images/mascotte/quitte-deja.webp'

/** Côté de la toile finale : 512 px pour un dessin servi autour de 144. */
const SIZE = 512

/**
 * Marge autour du dessin, en part du côté : le cerne sombre toucherait sinon le
 * bord de la toile, et le moindre rognage le mangerait.
 */
const MARGE = 0.04

const dessin = await sharp(await detourerFondPeint(SRC))
  .trim({ threshold: 2 })
  .png()
  .toBuffer()

const { width, height } = await sharp(dessin).metadata()

// `fit: 'contain'` avec un fond transparent fait la mise à l'échelle ET le
// centrage en une fois : le rapport est conservé, le vide part à parts égales.
const dedans = Math.round(SIZE * (1 - 2 * MARGE))
const marge = Math.round(SIZE * MARGE)
await sharp(dessin)
  .resize(dedans, dedans, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .extend({
    top: marge,
    bottom: SIZE - dedans - marge,
    left: marge,
    right: SIZE - dedans - marge,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .webp({ quality: 92 })
  .toFile(DEST)

console.log(
  `« Tu nous quittes déjà ? »  dessin ${width}x${height} détouré  →  ${DEST} (${SIZE}x${SIZE})`,
)
