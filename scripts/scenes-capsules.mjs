/**
 * Fabrique LES SCÈNES DES CAPSULES — les images qui défilent dans le bloc d'une
 * capsule, façon offres du magasin de Clash Royale (Lucas, 24/09/2026) :
 *   assets-sources/capsules/<id de la capsule>/<fichiers>.png
 *     → public/images/capsules/<id>/1.webp, 2.webp…   (1280×720, 16:9)
 *
 *   node scripts/scenes-capsules.mjs            # toutes les capsules
 *   node scripts/scenes-capsules.mjs sommeil    # une seule
 *
 * L'ORDRE EST CELUI DES NOMS DE FICHIERS (tri naturel) : c'est l'ordre du
 * défilement, donc de l'histoire — le problème, le super-pouvoir, la méthode,
 * le résultat. Renommer les sources `1.png`, `2.png`… suffit à le fixer ; un
 * nom de générateur (« hf_2026… ») trie par date de génération.
 *
 * 1280 px : le bloc prend la largeur d'un téléphone (~360 px, ×3 en densité),
 * et le webp à 82 reste autour de 100 Ko. Les sources sont en 16:9 (5504×3072
 * chez Higgsfield) : `cover` ne rogne presque rien.
 *
 * Après un ajout, déclarer le NOMBRE de scènes dans lib/capsules-scenes.ts
 * (`SCENES_CAPSULES`) : lib/assets.test.ts vérifie que chaque fichier annoncé
 * existe.
 */

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'assets-sources/capsules'
const DEST = 'public/images/capsules'
const LARGEUR = 1280
const HAUTEUR = 720

const triNaturel = new Intl.Collator('fr', { numeric: true, sensitivity: 'base' })

const demandes = process.argv.slice(2)
const ids =
  demandes.length > 0
    ? demandes
    : fs.readdirSync(SRC, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)

for (const id of ids) {
  const dossier = path.join(SRC, id)
  if (!fs.existsSync(dossier)) {
    console.error(`Capsule sans dossier source : ${dossier}`)
    process.exitCode = 1
    continue
  }
  const sources = fs
    .readdirSync(dossier)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort(triNaturel.compare)
  if (sources.length === 0) {
    console.error(`Aucune image dans ${dossier}`)
    process.exitCode = 1
    continue
  }

  const sortieDossier = path.join(DEST, id)
  fs.mkdirSync(sortieDossier, { recursive: true })
  // Une scène retirée des sources ne doit pas survivre dans public/.
  for (const ancien of fs.readdirSync(sortieDossier)) fs.unlinkSync(path.join(sortieDossier, ancien))

  for (const [index, source] of sources.entries()) {
    const sortie = path.join(sortieDossier, `${index + 1}.webp`)
    await sharp(path.join(dossier, source))
      .resize(LARGEUR, HAUTEUR, { fit: 'cover', position: 'centre' })
      .webp({ quality: 82 })
      .toFile(sortie)
    const { size } = fs.statSync(sortie)
    console.log(`${id} ${index + 1} ← ${source} (${Math.round(size / 1024)} Ko)`)
  }
  console.log(`→ déclarer ${id}: ${sources.length} dans SCENES_CAPSULES (lib/capsules-scenes.ts)`)
}
