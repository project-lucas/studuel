/**
 * Fabrique LES OBJETS DES TALONS des billets de jeux de salon — ce qui se
 * trouve à droite de la perforation d'un billet (`components/defi/ModeTicket`),
 * là où il n'y avait jusqu'ici qu'un emoji (🔎, ⚡, 🧮…) :
 *   assets-sources/talons-jeux/<id>.png      (originaux, LOCAUX — hors dépôt ;
 *                                             <id> = l'identifiant du jeu dans
 *                                             lib/jeux/catalog.ts)
 *     → public/images/defi/jeux/<id>-talon.webp   (256×256, fond transparent)
 *
 *   node scripts/talons-jeux.mjs
 *
 * POURQUOI CE SCRIPT EXISTE
 *
 * Les billets sont relevés au pixel sur Clash Royale, et sur le modèle le talon
 * porte l'OBJET du mode — une épée, un coffre, une couronne —, dessiné dans le
 * style du jeu. Chez nous, douze billets sur quatorze montraient un emoji, le
 * seul dessin de l'app qui ne soit pas de la maison : la police d'emoji du
 * téléphone décidait de leur forme, et deux téléphones ne montraient pas le
 * même billet. Lucas, 12/10/2026 : « fais le nécessaire aussi pour les icônes
 * d'ici ». Les objets sont dessinés dans la famille de la barre d'onglets
 * (cerne prune, aplats, violet · or · crème), un modèle validé avant la série
 * (la loupe de « Chasse à la faute »).
 *
 * LA TRAME : même raisonnement que les supports et la barre d'onglets
 * (scripts/lib/trame.mjs). Les talons se voient les uns sous les autres dans
 * la feuille « Modes de jeu » et dans la porte Jeux d'une matière — deux
 * objets de taille perçue différente s'y lisent comme un bug. Le lot est
 * l'ensemble des originaux présents : ajouter un dessin rejoue toute la série,
 * c'est voulu (la cible d'encre est la moyenne du lot).
 *
 * LE NOM PORTE LE SUFFIXE `-talon` : la scène du même jeu est `<id>-scene.webp`
 * dans le même dossier. Un dessin refait prend un nouveau nom d'original
 * (`<id>-v2.png` → `<id>-v2-talon.webp`) et `GAME_TALON_IDS` suit : l'URL
 * change, donc la clé de cache aussi (leçon de `modes-v4`).
 */

import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import { planDuLot } from './lib/trame.mjs'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC_DIR = 'assets-sources/talons-jeux'
const DEST_DIR = 'public/images/defi/jeux'

/** 256 px : le talon fait ~70 px sur un billet compact, ~90 sur le grand. */
const SIZE = 256

// Un original s'appelle comme son identifiant (`chasse-faute.png`) : tout
// autre fichier du dossier (planche de contrôle, capture, essai écarté) est
// ignoré — le 13/10/2026 une planche et deux captures y sont entrées dans la
// trame et ont faussé la cible d'encre de toute la série.
let fichiers
try {
  fichiers = (await readdir(SRC_DIR)).filter((f) => /^[a-z0-9-]+\.(png|webp)$/.test(f))
} catch {
  throw new Error(
    `Dossier introuvable : ${SRC_DIR}. Les originaux sont LOCAUX ` +
      `(assets-sources/ est dans .gitignore) — après un clone, il faut les redéposer.`,
  )
}
if (fichiers.length === 0) throw new Error(`Aucun original dans ${SRC_DIR}.`)

await mkdir(DEST_DIR, { recursive: true })

// Les dessins détourés, avant toute mise à l'échelle.
const dessins = {}
for (const f of fichiers) {
  const id = f.replace(/\.(png|webp)$/i, '')
  dessins[id] = await sharp(await detourerFondPeint(`${SRC_DIR}/${f}`))
    .trim({ threshold: 2 })
    .png()
    .toBuffer()
}

const { cible, plan } = await planDuLot(dessins, SIZE)

for (const id of Object.keys(plan).sort()) {
  const { width, height, encre } = plan[id]

  if (height > SIZE || width > SIZE) {
    throw new Error(
      `${id} : ${width}x${height} dépasse la toile de ${SIZE}. ` +
        `Baisser maxDim dans les réglages de la trame avant d'insister.`,
    )
  }

  const dest = `${DEST_DIR}/${id}-talon.webp`
  await sharp(dessins[id])
    .resize(width, height)
    .extend({
      // Centrage sur les deux axes ; le pixel impair part en bas à droite.
      top: Math.floor((SIZE - height) / 2),
      bottom: Math.ceil((SIZE - height) / 2),
      left: Math.floor((SIZE - width) / 2),
      right: Math.ceil((SIZE - width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 92 })
    .toFile(dest)

  console.log(
    `${id.padEnd(20)} ${String(width).padStart(3)}x${String(height).padEnd(3)}` +
      ` · encre ${String(Math.round(encre)).padStart(3)} (cible ${Math.round(cible)}) → ${dest}`,
  )
}
