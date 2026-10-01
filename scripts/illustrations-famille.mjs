/**
 * Fabrique LES ILLUSTRATIONS « FAMILLE NAV » — celles du chantier
 * d'homogénéité du 24/09/2026, dessinées dans le style de la barre d'onglets :
 *
 *   assets-sources/famille/<lot>/<id>.png   (originaux, LOCAUX — hors dépôt)
 *     → public/images/<destination du lot>/<id>.webp  (fond transparent)
 *
 *   node scripts/illustrations-famille.mjs            (tous les lots présents)
 *   node scripts/illustrations-famille.mjs badges     (un seul lot)
 *
 * Lots :
 *   badges  → public/images/badges/<slug>.webp          (médailles, 256 px)
 *   objets  → public/images/boutique/objets/<id>.webp   (vitrine, 256 px)
 *   rangs   → public/images/defi/ranks/<id>.webp        (blasons, 256 px ;
 *             REMPLACE les six blasons : bronze, argent, or, platine, diamant, maitre)
 *   amis    → public/images/amis/<nom>.webp             (256 px ; remplace
 *             oral, parrainage, trophee)
 *
 * Chaque original est traité s'il est là ; un lot vide est sauté. Même chaîne
 * que le Marché (scripts/marche-illustrations.mjs) : détourage du fond peint
 * (le remplissage part des bords et s'arrête sur le cerne prune), puis la
 * TRAME du lot (scripts/lib/trame.mjs) pour que des dessins ronds, hauts ou
 * larges paraissent de la même taille côte à côte. Centré sur la toile.
 *
 * Après un lot badges ou objets : déclarer les ids livrés dans
 * lib/illustrations.ts (BADGES_ILLUSTRES, OBJETS_ILLUSTRES) — lib/assets.test.ts
 * vérifie que chaque fichier déclaré existe.
 */
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { planDuLot } from './lib/trame.mjs'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SOURCES = 'assets-sources/famille'
const LOTS = {
  badges: { dest: 'public/images/badges', size: 256 },
  objets: { dest: 'public/images/boutique/objets', size: 256 },
  rangs: { dest: 'public/images/defi/ranks', size: 256 },
  amis: { dest: 'public/images/amis', size: 256 },
}

const demandes = process.argv.slice(2)
const lots = demandes.length > 0 ? demandes : Object.keys(LOTS)

for (const lot of lots) {
  const reglage = LOTS[lot]
  if (!reglage) throw new Error(`Lot inconnu : ${lot} (attendus : ${Object.keys(LOTS).join(', ')})`)
  const dossier = path.join(SOURCES, lot)
  if (!existsSync(dossier)) {
    console.log(`${lot} : aucun original dans ${dossier}, sauté`)
    continue
  }
  const fichiers = (await readdir(dossier)).filter((f) => /\.png$/i.test(f))
  if (fichiers.length === 0) {
    console.log(`${lot} : dossier vide, sauté`)
    continue
  }

  const dessins = {}
  for (const f of fichiers) {
    const id = f.replace(/\.png$/i, '')
    dessins[id] = await sharp(await detourerFondPeint(path.join(dossier, f)))
      .trim({ threshold: 2 })
      .png()
      .toBuffer()
  }

  const { size, dest } = reglage
  await mkdir(dest, { recursive: true })
  const { plan } = await planDuLot(dessins, size)
  for (const id of Object.keys(plan)) {
    const { width, height } = plan[id]
    const info = await sharp(dessins[id])
      .resize(width, height)
      .extend({
        top: Math.floor((size - height) / 2),
        bottom: Math.ceil((size - height) / 2),
        left: Math.floor((size - width) / 2),
        right: Math.ceil((size - width) / 2),
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 88 })
      .toFile(`${dest}/${id}.webp`)
    console.log(`${lot.padEnd(7)} ${id.padEnd(22)} ${width}x${height} · ${Math.round(info.size / 1024)} Ko`)
  }
}
