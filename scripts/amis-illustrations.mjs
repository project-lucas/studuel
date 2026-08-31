/**
 * Fabrique les illustrations de l'onglet Amis (lot L6) :
 *   assets-sources/amis/<id>.png   (sorties du générateur, ~2000×2000, fond PEINT)
 *     → public/images/amis/<id>.webp  (détourées, transparentes, servies)
 *
 *   node scripts/amis-illustrations.mjs
 *
 * LE FOND EST CRÈME, PAS BLANC. Le prompt demandait « a plain flat white
 * background » ; le modèle a rendu le crème de la marque (#EDE7D6). C'est sans
 * importance : `detourerFondPeint` classe les tons de fond par échantillonnage
 * des bords, il ne cherche pas une valeur écrite à l'avance. Mais il faut le
 * savoir avant de conclure qu'un détourage « n'a pas marché ».
 *
 * DEUX GABARITS, ET C'EST LA SEULE VRAIE DÉCISION DU SCRIPT.
 *
 * Trois de ces dessins sont des OBJETS : ils vont dans une case carrée, à côté
 * d'un texte, comme les icônes du Défi. Le quatrième — le podium — est un
 * BANDEAU : il se pose en tête du bloc de classement, sur toute la largeur, et
 * l'app viendra placer les avatars des trois premiers sur ses marches.
 *
 * D'où le recadrage `trim()` commun puis deux traitements :
 *   · `carre`  → toile carrée, dessin centré, marge de 4 %
 *   · `bandeau`→ toile 3:1, dessin centré, marge de 6 % — le podium sorti du
 *     générateur est un carré dont les deux tiers sont du vide ; le trim le
 *     ramène à sa vraie forme, large et basse.
 *
 * Ne PAS forcer le podium dans un carré : les marches se retrouveraient hautes
 * de 200 px dans une case de 512, et tout le reste serait du vide transparent
 * que le composant devrait ensuite rogner à l'aveugle.
 */

import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC = 'assets-sources/amis'
const DEST = 'public/images/amis'

/**
 * Le lot. `gabarit` décide de la toile, pas le nom du fichier : le jour où une
 * cinquième illustration arrive, il n'y a qu'une ligne à ajouter.
 *
 * ⚠️ LES NOMS DE SOURCE ONT ÉTÉ CROISÉS À LA RÉCEPTION. Le fichier livré
 * `podium.png` contenait la MASCOTTE sur une marche (l'état vide), et
 * `classement.png` contenait le PODIUM VIDE. Ils ont été renommés en entrant
 * dans `assets-sources/` pour que le nom dise ce que l'image montre — c'est
 * `solo` qui porte un personnage et `podium` qui n'en porte aucun.
 */
const LOT = [
  {
    id: 'podium',
    gabarit: 'bandeau',
    quoi: 'les trois marches vides — or au centre, argent à gauche, bronze à droite',
  },
  {
    id: 'solo',
    gabarit: 'carre',
    quoi: 'la mascotte qui salue, pour l’état vide « En solo pour l’instant »',
  },
  {
    id: 'parrainage',
    gabarit: 'carre',
    quoi: 'le check à deux mains, gemme violette entre les paumes',
  },
  {
    id: 'oral',
    gabarit: 'carre',
    quoi: 'le micro de bois à bonnette violette, pour l’écoute de l’oral',
  },
]

/** Toile carrée des objets — même côté que les icônes du Défi. */
const COTE = 512
/** Toile du bandeau : 3 fois plus large que haute. */
const BANDEAU = { largeur: 1536, hauteur: 512 }

await mkdir(DEST, { recursive: true })

for (const { id, gabarit, quoi } of LOT) {
  const source = path.join(SRC, `${id}.png`)

  // Détourage, puis `trim` : le générateur laisse beaucoup de fond autour du
  // sujet, et sans ce recadrage la marge dépendrait de son humeur du jour.
  const dessin = await sharp(await detourerFondPeint(source))
    .trim({ threshold: 2 })
    .png()
    .toBuffer()

  const { largeur, hauteur, marge } =
    gabarit === 'bandeau'
      ? { largeur: BANDEAU.largeur, hauteur: BANDEAU.hauteur, marge: 0.06 }
      : { largeur: COTE, hauteur: COTE, marge: 0.04 }

  const sortie = await sharp({
    create: {
      width: largeur,
      height: hauteur,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: await sharp(dessin)
          .resize(
            Math.round(largeur * (1 - 2 * marge)),
            Math.round(hauteur * (1 - 2 * marge)),
            // `inside` conserve les proportions : le dessin touche le bord le
            // plus contraignant et flotte sur l'autre axe. C'est ce qui permet
            // au même code de traiter un personnage debout et un podium large.
            { fit: 'inside' },
          )
          .toBuffer(),
        gravity: 'center',
      },
    ])
    .webp({ quality: 92 })
    .toFile(path.join(DEST, `${id}.webp`))

  console.log(
    `  ${id.padEnd(11)} → ${largeur}×${hauteur}  ${Math.round(sortie.size / 1024)} ko   ${quoi}`,
  )
}
