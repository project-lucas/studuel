/**
 * LES VIGNETTES DES MATIÈRES DU SUPÉRIEUR (03/11/2026), sur la trame des
 * vignettes du collège et du lycée :
 *   assets-sources/superieur/vignettes/<slug>.png   (originaux, LOCAUX — hors dépôt)
 *     → public/images/matieres/vignettes/<slug>.webp   (320x320)
 *
 *   node scripts/vignettes-superieur.mjs            # toutes
 *   node scripts/vignettes-superieur.mjs droit-civil # une seule
 *
 * POURQUOI UN SCRIPT À PART, ET NON UN LOT DE PLUS DANS vignettes-matieres.mjs.
 * Ce dernier calibre la trame sur la MOYENNE du lot traité : y verser soixante
 * dessins de plus déplacerait la cible d'encre et retoucherait en douce les
 * vingt-cinq vignettes déjà validées. Ici, les dessins REJOIGNENT le lot sans
 * en bouger l'équilibre (`echellePour`, la recette du cadre de l'avatar) : la
 * cible est mesurée sur les vignettes existantes, telles qu'elles sont servies.
 *
 * Les slugs viennent de lib/superieur/cursus.ts (lu en texte : ce script tourne
 * sous Node sans TypeScript). Un slug sans original fait échouer le script —
 * mieux qu'un médaillon nu découvert dans l'app.
 */

import sharp from 'sharp'
import { access, readFile } from 'node:fs/promises'
import { echellePour, mesurer } from './lib/trame.mjs'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC_DIR = 'assets-sources/superieur/vignettes'
const DEST_DIR = 'public/images/matieres/vignettes'
const SIZE = 320

/** Les vignettes du collège et du lycée, qui fixent la cible d'encre. */
const LOT_DE_REFERENCE = [
  'allemand', 'anglais', 'arts-plastiques', 'economie', 'emc',
  'enseignement-scientifique', 'entrepreneuriat', 'espagnol',
  'figures-historiques', 'fiscalite', 'francais', 'grand-oral', 'grec', 'hggsp',
  'histoire-geo', 'latin', 'maths', 'musique', 'nsi', 'philosophie',
  'physique-chimie', 'ses', 'sport', 'svt', 'technologie',
]

/** Les slugs des matières du supérieur, lus dans le catalogue des cursus. */
async function slugsDuSuperieur() {
  const source = await readFile('lib/superieur/cursus.ts', 'utf8')
  const slugs = [...source.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1])
  if (slugs.length === 0) throw new Error('Aucun slug lu dans lib/superieur/cursus.ts')
  return [...new Set(slugs)]
}

/** La cible d'encre du lot existant : la moyenne de ses vignettes servies. */
async function cibleDuLot() {
  let somme = 0
  for (const slug of LOT_DE_REFERENCE) {
    const boite = await mesurer(await readFile(`${DEST_DIR}/${slug}.webp`))
    somme += Math.sqrt(boite.ink)
  }
  return somme / LOT_DE_REFERENCE.length
}

const tous = await slugsDuSuperieur()
const demandes = process.argv.slice(2)
const slugs = demandes.length > 0 ? demandes : tous
for (const slug of slugs) {
  if (!tous.includes(slug)) throw new Error(`${slug} n'est pas une matière du supérieur`)
}

const cible = await cibleDuLot()
console.log(`cible d'encre du lot existant : ${Math.round(cible)}`)

for (const slug of slugs) {
  const chemin = `${SRC_DIR}/${slug}.png`
  try {
    await access(chemin)
  } catch {
    throw new Error(`Original introuvable : ${chemin}`)
  }
  const dessin = await sharp(await detourerFondPeint(chemin, { silencieux: true }))
    .trim({ threshold: 2 })
    .png()
    .toBuffer()
  const boite = await mesurer(dessin)
  const echelle = echellePour(boite, cible, SIZE)
  const width = Math.round(boite.width * echelle)
  const height = Math.round(boite.height * echelle)

  await sharp(dessin)
    .resize(width, height)
    .extend({
      top: Math.floor((SIZE - height) / 2),
      bottom: Math.ceil((SIZE - height) / 2),
      left: Math.floor((SIZE - width) / 2),
      right: Math.ceil((SIZE - width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 90 })
    .toFile(`${DEST_DIR}/${slug}.webp`)

  console.log(
    `${slug.padEnd(32)} ${String(width).padStart(3)}x${String(height).padEnd(3)}` +
      ` · encre ${Math.round(Math.sqrt(boite.ink) * echelle)}`,
  )
}
