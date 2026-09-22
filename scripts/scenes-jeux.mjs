/**
 * Fabrique LES SCÈNES DES BILLETS DE JEUX à partir des bannières déposées par
 * Lucas dans assets-sources/bannieres-jeux/ (PNG 3840×2160 ou 5504×3072) :
 *
 *   assets-sources/bannieres-jeux/<nom libre>.png
 *     → public/images/defi/jeux/<id du jeu>-scene.webp   (1536×864, 16:9)
 *
 * Le nom du fichier source est celui que le générateur a donné, pas l'id du
 * jeu : la correspondance est écrite ICI, en clair, et c'est elle qui fait
 * foi. Les trois bannières « hf_… » sans nom ont été identifiées à l'œil le
 * 22/09/2026 (le singe et ses amis = Classe-moi ça, le labo aux fioles = Chasse
 * aux éléments, le pied à coulisse et la balance = La bonne unité).
 *
 * Le format est celui des sept scènes déjà en place (juillet 2026) : 1536×864,
 * webp, couvrant (les sources sont toutes en 16:9, rien n'est rogné). Une
 * scène refaite se dépose sous le MÊME nom : `gameScene` (lib/defi/modes-catalog)
 * ne connaît que l'id, et la liste GAME_SCENE_IDS dit lesquelles existent.
 *
 *   node scripts/scenes-jeux.mjs            # toutes
 *   node scripts/scenes-jeux.mjs anatomie-express   # une seule
 */

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'assets-sources/bannieres-jeux'
const DEST = 'public/images/defi/jeux'
const LARGEUR = 1536
const HAUTEUR = 864

/** id du jeu (lib/jeux/catalog) → fichier source. */
const SCENES = {
  'anatomie-express': 'anatomie express.png',
  'phrase-en-vrac': 'phrase-en-vrac.png',
  'falsos-amigos': 'falsos-amigos.png',
  'classe-moi-ca': 'hf_20260922_155530_60f6532b-cfe2-462f-9e05-d8c50cf1d11d.png',
  'chasse-elements': 'hf_20260922_155539_71cf8f2e-6ec4-422e-aaa2-db1c4bcb2026.png',
  'bonne-unite': 'hf_20260922_155548_618a6ab1-ef78-4364-99bd-c9f1c8f7434f.png',
  // Les sept de juillet, déjà en place — relancer le script les refait à
  // l'identique depuis leur source.
  'calcul-mental': 'calcul mentale éclair.png',
  capitales: 'capitales du monde (1).png',
  'chasse-faute': 'chasse aux fautes.png',
  'conjugaison-eclair': 'conjugaison éclair (1).png',
  'frise-folle': 'frise folle.png',
  'traduccion-flash': 'traduccion flash.png',
  'traduction-flash': 'traduction flash.png',
}

const demandes = process.argv.slice(2)
const ids = demandes.length > 0 ? demandes : Object.keys(SCENES)

for (const id of ids) {
  const source = SCENES[id]
  if (!source) {
    console.error(`Jeu inconnu : ${id}`)
    process.exitCode = 1
    continue
  }
  const entree = path.join(SRC, source)
  const sortie = path.join(DEST, `${id}-scene.webp`)
  if (!fs.existsSync(entree)) {
    console.error(`Source absente : ${entree}`)
    process.exitCode = 1
    continue
  }
  await sharp(entree)
    .resize(LARGEUR, HAUTEUR, { fit: 'cover', position: 'centre' })
    .webp({ quality: 82 })
    .toFile(sortie)
  const { size } = fs.statSync(sortie)
  console.log(`${id} ← ${source} → ${sortie} (${Math.round(size / 1024)} Ko)`)
}
