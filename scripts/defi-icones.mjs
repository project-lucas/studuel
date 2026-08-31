/**
 * Fabrique LES ICÔNES FLOTTANTES de l'arène :
 *   assets-sources/defi-icones-lot1/<source>.png  (originaux 2000×2000, fond PEINT)
 *     → public/images/defi/icones/<cible>-v2.webp  (256×256, fond transparent)
 *
 *   node scripts/defi-icones.mjs
 *
 * POURQUOI UN LOT, ET PLUS UN SCRIPT PAR ICÔNE
 *
 * Ces dessins ne valent que par leur PARENTÉ : c'est elle qui fait la cohérence
 * du HUD, pas la réussite de chacun. Les traiter un par un, c'est laisser
 * dériver une marge ici, une taille de toile là — et l'écart ne se voit qu'une
 * fois les huit posés côte à côte, quand il est trop tard. Un seul script, un
 * seul réglage : ils sortent rigoureusement identiques ou ils sortent tous faux.
 *
 * CE QUE LE LOT REMPLACE. Les anciennes icônes étaient des TUILES : la plaque
 * et sa couleur étaient peintes dans l'image (violet pour Amis, vert pour les
 * Quêtes…). Le HUD leur posait donc un second cadre par-dessus — au point que
 * le code avait dû inventer un drapeau `imageIsTile` pour éteindre le sien.
 * Les nouvelles ne portent que leur sujet ; l'orbe vient du CSS, comme partout
 * ailleurs dans l'app.
 *
 * LES NOMS PORTENT LEUR VERSION (`-v2`). Réécrire un fichier sous le même nom
 * ne change pas son URL, donc pas sa clé de cache : le navigateur continue
 * d'afficher l'ancien dessin et on cherche un bug qui n'existe pas. Un nom
 * versionné rend le problème impossible.
 */

import { readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { detourerFondPeint } from './lib/fond-peint.mjs'

// Les SOURCES 4K vivent hors de `public/` (elles n'ont rien à y faire : Next
// sert ce dossier tel quel). Seuls les webp générés y sont écrits.
const SOURCES = 'assets-sources/defi-icones-lot1'
const DOSSIER = 'public/images/defi/icones'

/**
 * Source → nom servi. La table est explicite parce que les deux vocabulaires
 * ne coïncident pas : le générateur reçoit des prompts en langage d'auteur
 * (« école », « missions », « parametre »), le code parle le sien (« tournoi »,
 * « quetes », « reglages »). Renommer les fichiers à la main aurait marché une
 * fois ; une table se relit.
 */
const LOT = {
  amis: 'amis',
  classement: 'classement',
  'école': 'tournoi',
  ligues: 'ligues',
  missions: 'quetes',
  parametre: 'reglages',
  boss: 'boss',
  's+': 'premium',
}

/** Côté de la toile finale : 256 px pour un dessin servi autour de 40. */
const SIZE = 256

/**
 * Marge autour du dessin, en part du côté. Le cerne sombre toucherait sinon le
 * bord de la toile, et le moindre rognage le mangerait.
 */
const MARGE = 0.04

const cote = Math.round(SIZE * (1 - 2 * MARGE))
const fichiers = await readdir(SOURCES)

for (const [source, cible] of Object.entries(LOT)) {
  const src = fichiers.find((f) => f === `${source}.png`)
  if (!src) {
    console.log(`  ⚠ ${source}.png absent — ${cible} conserve son dessin actuel`)
    continue
  }

  const dessin = await sharp(await detourerFondPeint(path.join(SOURCES, src)))
    .trim({ threshold: 2 })
    .png()
    .toBuffer()

  const dest = path.join(DOSSIER, `${cible}-v2.webp`)
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
    .toFile(dest)

  console.log(
    `  ${source.padEnd(11)} → ${cible}-v2.webp  ${Math.round(sortie.size / 1024)} ko`,
  )
}
