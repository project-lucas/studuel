/**
 * LA FEUILLE PUNAISÉE, AU JOUR (05/11/2026). La feuille de la page du joueur
 * (public/images/joueur/feuille-bureau.webp) porte, cuite dans l'image, une
 * grande ombre prune à 54 % qui déborde jusqu'aux bords : invisible sur la
 * chambre de nuit, elle pose une bande sombre sur la chambre repeinte au jour
 * (la DA de la fenêtre du Défi).
 *
 * Ce script refabrique la MÊME feuille, au pixel près, depuis le master
 * (assets-sources/joueur/feuille/feuille-bureau.png) :
 *   1. il retire l'ombre prune — elle est un plateau d'alpha 138, la feuille
 *      est opaque : la couverture d'un pixel vaut (alpha − 140) / (255 − 140), 2 de marge ;
 *   2. il cuit à la place une ombre de dessin : courte, brun chaud, à peine
 *      floue, posée juste sous la feuille.
 * Sortie : public/images/joueur/feuille-bureau-jour.webp, 1 500 × 1 008 — la
 * géométrie de l'autre, les emplacements mesurés ne bougent pas.
 *
 *   node scripts/feuille-jour.mjs
 */

import { stat } from 'node:fs/promises'
import sharp from 'sharp'

const SOURCE = 'assets-sources/joueur/feuille/feuille-bureau.png'
const SORTIE = 'public/images/joueur/feuille-bureau-jour.webp'
const LARGEUR = 1500
const HAUTEUR = 1008

/** L'alpha du plateau de l'ancienne ombre dans le master (138), plus 2 de marge : le redimensionnement le fait onduler. */
const ALPHA_OMBRE = 140
/** La nouvelle ombre : brun chaud du bois, décalée vers le bas, peu floue. */
const OMBRE = { r: 112, g: 74, b: 42, alpha: 0.34, decalage: 9, flou: 7 }

const { data, info } = await sharp(SOURCE)
  .resize(LARGEUR, HAUTEUR, { fit: 'fill' })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const pixels = info.width * info.height

// 1. La feuille seule : la couleur est gardée, l'alpha devient sa couverture.
//    Le masque de l'ombre est cette couverture, déjà décalée vers le bas.
const feuille = Buffer.alloc(pixels * 4)
const masque = Buffer.alloc(pixels)
const decalage = OMBRE.decalage * info.width
for (let p = 0; p < pixels; p++) {
  const alpha = data[p * 4 + 3]
  const couverture = Math.round((255 * Math.max(0, alpha - ALPHA_OMBRE)) / (255 - ALPHA_OMBRE))
  feuille[p * 4] = data[p * 4]
  feuille[p * 4 + 1] = data[p * 4 + 1]
  feuille[p * 4 + 2] = data[p * 4 + 2]
  feuille[p * 4 + 3] = couverture
  if (p + decalage < pixels) masque[p + decalage] = couverture
}

// 2. L'ombre : ce masque, flouté, teinté. sharp peut rendre le gris sur un ou
//    trois canaux : on lit le premier canal de chaque pixel (`canaux`).
const flou = await sharp(masque, { raw: { width: info.width, height: info.height, channels: 1 } })
  .blur(OMBRE.flou)
  .raw()
  .toBuffer({ resolveWithObject: true })
const canaux = flou.info.channels
const ombre = Buffer.alloc(pixels * 4)
for (let p = 0; p < pixels; p++) {
  ombre[p * 4] = OMBRE.r
  ombre[p * 4 + 1] = OMBRE.g
  ombre[p * 4 + 2] = OMBRE.b
  ombre[p * 4 + 3] = Math.round(flou.data[p * canaux] * OMBRE.alpha)
}

const brut = { raw: { width: info.width, height: info.height, channels: 4 } }
await sharp(ombre, brut)
  .composite([{ input: feuille, ...brut }])
  .webp({ quality: 84, alphaQuality: 90 })
  .toFile(SORTIE)

const { size } = await stat(SORTIE)
console.log(`${SORTIE} — ${LARGEUR} × ${HAUTEUR}, ${Math.round(size / 1024)} Ko`)
