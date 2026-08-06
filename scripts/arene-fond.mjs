/**
 * Fabrique LE FOND DE L'ARÈNE (/defi) :
 *   assets-sources/arene/arena-mascotte.png   (original, LOCAL — hors dépôt)
 *     → public/images/arene/arena-mascotte.webp   (1080 de large)
 *
 *   node scripts/arene-fond.mjs
 *
 * POURQUOI CE SCRIPT EXISTE
 *
 * L'original arrive en PNG de 2 Mo. Servi tel quel, c'est DEUX MÉGAOCTETS avant
 * le premier écran de l'onglet le plus visité — trente fois le poids des six
 * décors horaires qu'il remplace (~65 Ko chacun). Il n'a rien à faire dans
 * `public/`, qui est déployé tel quel : la source vit dans `assets-sources/`
 * (ignoré par git, comme tous les originaux du projet) et c'est ce script qui
 * produit le fichier servi.
 *
 * LARGEUR 1080, comme les six décors horaires : la hauteur suit le rapport de
 * l'original. Le CSS peint le fond en `background-size: cover` (.arena-img),
 * donc un rapport un peu différent des autres ne déforme rien — il décide
 * seulement de ce qui est rogné sur les bords.
 */

import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SRC = 'assets-sources/arene/arena-mascotte.png'
const DEST_DIR = 'public/images/arene'
const DEST = `${DEST_DIR}/arena-mascotte.webp`

/** Largeur servie, alignée sur les six décors horaires (1080x1920). */
const WIDTH = 1080

/**
 * Qualité webp. 82 pose ce décor autour de 150 Ko : plus haut, on paie des
 * kilo-octets pour des dégradés de ciel que personne ne regarde de près ; plus
 * bas, les aplats du ciel violet commencent à se bander.
 */
const QUALITY = 82

await mkdir(DEST_DIR, { recursive: true })

const { width, height } = await sharp(SRC).metadata()

const info = await sharp(SRC)
  .resize({ width: WIDTH, withoutEnlargement: false })
  .webp({ quality: QUALITY })
  .toFile(DEST)

console.log(
  `fond d'arène  ${width}x${height} → ${info.width}x${info.height}  ` +
    `${Math.round(info.size / 1024)} Ko  →  ${DEST}`,
)
