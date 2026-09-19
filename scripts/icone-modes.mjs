/**
 * Fabrique L'ICÔNE « MODES » du flanc gauche de la barre d'action :
 *   assets-sources/defi-icones-lot2/mode de jeu 2.png  (original 2000×2000, déjà
 *                                                       transparent)
 *     → public/images/defi/icones/modes-v4.webp  (256×256, fond transparent)
 *
 * La « 2 » est la version RETENUE : LE DÉ (Lucas, 16/09/2026). Un dé dit
 * « jeu » sans désigner un support, là où la manette seule ne disait que
 * « jouer » et la manette à l'éventail de cartes trop de choses à 36 px. Les
 * trois autres originaux du lot 2 (`mode de jeu 0`, `mode de jeu 1 - manette
 * seule`, `mode de jeu 2 - manette et cartes`) restent à côté, ils ne servent
 * pas.
 *
 *   node scripts/icone-modes.mjs
 *
 * POURQUOI CE SCRIPT EXISTE
 *
 * Même mal et même remède que la loupe, la flamme de série ou les vignettes de
 * matières : le générateur rend le fond en BLANC OPAQUE au lieu de le laisser
 * transparent. Posée telle quelle sur la plaque anthracite du flanc, l'icône
 * porterait un carré blanc. Le piège ne se voit PAS dans la visionneuse de
 * fichiers — seulement une fois l'image dans l'app.
 *
 * LE FORMAT EST CELUI DE SES VOISINES, et ce n'est pas un détail : les sept
 * autres icônes de ce dossier (amis, boss, classement, ligues, quêtes,
 * réglages, historique) sont toutes en webp 256×256 avec canal alpha. Une
 * huitième en PNG 2000×2000 pèserait cent fois plus lourd pour le même rendu à
 * 36 px, et casserait la seule chose qui fasse d'un dossier un LOT : que ses
 * pièces soient interchangeables.
 *
 * Ces voisines avaient été déposées à la main, sans script. Celui-ci est donc
 * le premier du dossier : le jour où l'une d'elles sera refaite, il y aura un
 * chemin à suivre plutôt qu'un geste à répéter.
 */

import sharp from 'sharp'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC = 'assets-sources/defi-icones-lot2/mode de jeu 2.png'
/**
 * LE NOM PORTE SA VERSION, et ce n'est pas de la coquetterie.
 *
 * La première mouture s'appelait `modes.webp`. En la remplaçant sous le même
 * nom, l'URL n'a pas bougé — donc la clé de cache non plus : le navigateur a
 * continué d'afficher l'ancien dessin, et `next/image` sert justement des
 * en-têtes de cache longs. On a cherché un bug là où il n'y en avait pas.
 *
 * Un nom versionné rend le problème impossible : nouveau dessin, nouveau
 * chemin, nouvelle clé. Le jour où l'illustration changera encore, on montera
 * à `-v3` et l'ancienne restera lisible dans le dossier — un historique plutôt
 * qu'un écrasement.
 */
const DEST = 'public/images/defi/icones/modes-v4.webp'

/** Côté de la toile finale — celui de toutes les icônes de ce dossier. */
const SIZE = 256

/**
 * Marge autour du dessin, en part du côté. Le cerne sombre toucherait sinon le
 * bord de la toile, et le moindre rognage le mangerait.
 */
const MARGE = 0.04

// Le lot 2 arrive déjà transparent : pas de fond à détourer (le détourage
// cherche la palette du pourtour, et sur du vide il ne trouverait rien).
const meta = await sharp(SRC).metadata()
const coin = meta.hasAlpha
  ? await sharp(SRC).extract({ left: 0, top: 0, width: 1, height: 1 }).ensureAlpha().raw().toBuffer()
  : null
const base = coin && coin[3] === 0 ? SRC : await detourerFondPeint(SRC)
const dessin = await sharp(base)
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
      input: await sharp(dessin).resize(cote, cote, { fit: 'inside' }).toBuffer(),
      gravity: 'center',
    },
  ])
  .webp({ quality: 92 })
  .toFile(DEST)

console.log(
  `modes → ${DEST} ${sortie.width}×${sortie.height}, ${Math.round(sortie.size / 1024)} ko`,
)
