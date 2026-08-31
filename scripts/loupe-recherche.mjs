/**
 * Fabrique LA LOUPE de l'écran de recherche d'adversaire :
 *   assets-sources/defi-search/v1.png   (original 2000×2000, fond blanc PEINT)
 *     → public/images/defi/loupe.webp   (256×256, fond transparent)
 *
 *   node scripts/loupe-recherche.mjs
 *
 * Les originaux du lot restent dans `search/` : c'est la convention du dépôt
 * (l'image livrée par le générateur est gardée, le webp servi est fabriqué).
 *
 * POURQUOI CE SCRIPT EXISTE
 *
 * Même mal et même remède que la flamme de série ou la mascotte de la modale de
 * sortie : le générateur rend le fond en BLANC OPAQUE au lieu de le laisser
 * transparent, et le rectangle se voit dès que le dessin se pose sur autre chose
 * que du blanc — ici une plaque anthracite. Le piège ne se voit PAS dans la
 * visionneuse de fichiers ; seulement une fois l'image dans l'app.
 * `detourerFondPeint` s'en charge.
 *
 * CE QUE CE SCRIPT A CESSÉ DE FAIRE, ET POURQUOI C'EST NOTABLE
 *
 * Il recadrait la toile sur le CENTRE DU DISQUE DE VERRE, trouvé par plus grand
 * cercle inscrit. C'était nécessaire tant que la loupe tournait sur son axe :
 * le pivot de CSS est le centre de l'image, et comme le dessin est asymétrique
 * (verre en haut à droite, manche en bas à gauche), une rotation autour du
 * centre géométrique faisait ORBITER le manche autour du verre au lieu de faire
 * tourner l'objet.
 *
 * La rotation a été abandonnée : une loupe qui pivote ne cherche rien, elle
 * visse. Elle BALAYE désormais un 8 de quelques pixels, rigide, sans changer
 * d'orientation (cf. `trajectoireLoupe`). Plus aucun pivot, donc plus aucune
 * raison de décentrer la toile — et le recadrage sur la lentille laissait un
 * bon tiers de canevas vide en haut à droite, que le composant devait
 * compenser en agrandissant la boîte.
 *
 * D'où le retour au cadrage ordinaire : on rogne au plus près du dessin et on
 * le pose au centre d'une toile carrée. Le fichier servi ne contient plus que
 * de la loupe.
 */

import sharp from 'sharp'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC = 'assets-sources/defi-search/v1.png'
const DEST = 'public/images/defi/loupe.webp'

/** Côté de la toile finale : 256 px pour un dessin servi autour de 72. */
const SIZE = 256

/**
 * Marge autour du dessin, en part du côté. Le cerne sombre toucherait sinon le
 * bord de la toile, et le moindre rognage le mangerait — même réglage que la
 * mascotte de la modale de sortie.
 */
const MARGE = 0.04

const dessin = await sharp(await detourerFondPeint(SRC))
  .trim({ threshold: 2 })
  .png()
  .toBuffer()

const cote = Math.round(SIZE * (1 - 2 * MARGE))

const sortie = await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    {
      input: await sharp(dessin)
        .resize(cote, cote, { fit: 'inside', withoutEnlargement: false })
        .toBuffer(),
      gravity: 'center',
    },
  ])
  .webp({ quality: 92 })
  .toFile(DEST)

console.log(
  `loupe → ${DEST} ${sortie.width}×${sortie.height}, ${Math.round(sortie.size / 1024)} ko`,
)
