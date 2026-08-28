/**
 * Fabrique LES NUMÉROS DE FICHE — les nombres 1 à 19, peints :
 *   assets-sources/chiffres/<n>.png     (originaux, LOCAUX — hors dépôt)
 *     → public/images/chiffres/<n>.webp (hauteur fixe, largeur naturelle)
 *
 *   node scripts/chiffres.mjs
 *
 * ⚠️ CE SCRIPT NE PASSE PAS PAR LA TRAME, ET C'EST LE POINT ESSENTIEL.
 *
 * Tous les autres lots de dessins de l'app (matières, barre d'onglets,
 * supports) sont normalisés sur la SURFACE D'ENCRE par scripts/lib/trame.mjs,
 * parce que l'œil compare des taches et non des boîtes. Un jeu de NOMBRES est
 * l'exception, et l'appliquer ici serait un contresens : un « 1 » porte environ
 * le tiers de l'encre d'un « 8 », et un « 18 » le double. Égaliser l'encre
 * gonflerait le 1 jusqu'à le rendre deux fois plus haut que ses voisins — soit
 * exactement ce qu'aucune typographie ne fait.
 *
 * Un nombre se normalise comme une lettre : même HAUTEUR DE CAPITALE, même
 * ligne de base, largeur libre. C'est ce que fait ce script — rogner, mettre à
 * la hauteur commune, et laisser la largeur suivre. Les originaux sont dessinés
 * en chiffres bâtons (pas de jambage descendant) et occupent toute la hauteur de
 * leur toile : après rognage, la mise à hauteur aligne donc les lignes de base
 * toute seule.
 *
 * CONSÉQUENCE POUR LA MISE EN PAGE : un « 12 » est deux fois plus large qu'un
 * « 1 ». C'est normal et voulu — c'est le comportement d'une police. Le
 * médaillon qui les porte (`components/reviser/ChapterItem.tsx`) est donc une
 * PASTILLE ÉLASTIQUE, pas un carré fixe : il s'élargit sous un nombre à deux
 * chiffres au lieu de le rapetisser.
 */

import sharp from 'sharp'
import { readdir, mkdir } from 'node:fs/promises'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC_DIR = 'assets-sources/chiffres'
const DEST_DIR = 'public/images/chiffres'

/**
 * Hauteur commune, en pixels. Le médaillon fait 36 à 44 px à l'écran : 128
 * laisse un facteur 3 pour les écrans denses, sans peser (un nombre est une
 * forme simple, ses fichiers font quelques kilo-octets).
 */
const HAUTEUR = 128

await mkdir(DEST_DIR, { recursive: true })

const nombres = (await readdir(SRC_DIR))
  .filter((f) => /^\d+\.(png|webp)$/i.test(f))
  .map((f) => Number(f.replace(/\.\w+$/, '')))
  .sort((a, b) => a - b)

if (nombres.length === 0) {
  throw new Error(
    `Aucun original dans ${SRC_DIR}. Ils sont LOCAUX (assets-sources/ est dans ` +
      `.gitignore) — après un clone, il faut les redéposer avant de relancer ce script.`,
  )
}

for (const n of nombres) {
  // DÉTOURER D'ABORD, ROGNER ENSUITE. Ces originaux arrivent avec un fond
  // PEINT en blanc opaque — leur canal alpha est plein d'un bord à l'autre.
  // Un `trim()` seul n'y coupe donc rien : les dix-neuf sortaient carrés,
  // 1024x1024, et le « 1 » se retrouvait aussi large qu'un « 18 ». C'est le
  // même piège que sur les vignettes de matières, et le même remède.
  const rogne = await sharp(await detourerFondPeint(`${SRC_DIR}/${n}.png`))
    .trim({ threshold: 2 })
    .png()
    .toBuffer()

  const { width, height } = await sharp(rogne).metadata()
  const largeur = Math.max(1, Math.round((width / height) * HAUTEUR))

  await sharp(rogne)
    .resize(largeur, HAUTEUR)
    .webp({ quality: 92 })
    .toFile(`${DEST_DIR}/${n}.webp`)

  console.log(
    `${String(n).padStart(2)}  ${String(largeur).padStart(3)}x${HAUTEUR}` +
      `  (ratio ${(largeur / HAUTEUR).toFixed(2)})`,
  )
}

console.log(
  `\n${nombres.length} nombres écrits dans ${DEST_DIR}. ` +
    `Au-delà de ${Math.max(...nombres)}, ChapterItem retombe sur le chiffre en Baloo 2.`,
)
