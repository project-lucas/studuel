/**
 * Fabrique LES ILLUSTRATIONS DES PACKS DE GEMMES — la section « Gemmes » de
 * la Boutique :
 *   assets-sources/boutique-gemmes/<id>.png      (originaux, LOCAUX — hors dépôt)
 *     → public/images/boutique/gemmes/<id>.webp   (512x512, fond transparent)
 *
 *   node scripts/packs-gemmes.mjs
 *
 * DES OBJETS DÉTOURÉS, POSÉS SUR UN FOND SOBRE. Le décor n'est pas dans
 * l'image : l'écrin du pack (components/boutique/CarteMagasin.tsx,
 * l'écrin de CarteMagasin.module.css) porte un fond de studio et une ombre au sol, comme les
 * cartes du magasin de Clash Royale. Des scènes peintes avec fond ont été
 * essayées puis écartées le 18/09/2026 (Lucas : « on va juste faire un fond
 * plus sobre avec une ombre derrière »).
 *
 * Les originaux sortent du générateur en 2 000 px et 4 Mo, sur un fond blanc
 * OPAQUE (même quand le PNG déclare une couche alpha) : posés tels quels, ils
 * dessineraient un carré blanc dans l'écrin. D'où le détourage
 * (scripts/lib/fond-peint.mjs — le remplissage part des bords et s'arrête sur
 * l'épais trait prune qui cerne chaque dessin), puis la trame
 * (scripts/lib/trame.mjs) : les packs côte à côte doivent paraître de la même
 * taille, alors que la poignée est large et le sac plus haut que large.
 *
 * Nouvel original ? Le déposer dans assets-sources/boutique-gemmes/, l'ajouter
 * à PACKS ci-dessous, relancer, puis le déclarer dans ILLUSTRATIONS
 * (components/boutique/RayonGemmes.tsx).
 */
import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import { planDuLot } from './lib/trame.mjs'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC_DIR = 'assets-sources/boutique-gemmes'
const DEST_DIR = 'public/images/boutique/gemmes'
const SIZE = 512

/** id du pack (lib/boutique/packs-gemmes.ts) → nom de l'original. */
const PACKS = {
  poignee: 'poignee',
  sac: 'sac',
  baril: 'baril',
}

async function source(nom) {
  const chemin = `${SRC_DIR}/${nom}.png`
  try {
    await access(chemin)
    return chemin
  } catch {
    throw new Error(
      `Original introuvable : ${chemin}. Les originaux sont LOCAUX ` +
        `(assets-sources/ est dans .gitignore) — après un clone, il faut les ` +
        `redéposer avant de relancer ce script.`,
    )
  }
}

await mkdir(DEST_DIR, { recursive: true })

const dessins = {}
for (const [id, nom] of Object.entries(PACKS)) {
  dessins[id] = await sharp(await detourerFondPeint(await source(nom)))
    .trim({ threshold: 2 })
    .png()
    .toBuffer()
}

const { cible, plan } = await planDuLot(dessins, SIZE)

for (const id of Object.keys(plan)) {
  const { width, height, encre } = plan[id]
  // Posé EN BAS de la toile : le sac, le baril reposent sur le sol de
  // l'écrin, là où l'app dessine leur ombre ; ils ne flottent pas au milieu.
  await sharp(dessins[id])
    .resize(width, height)
    .extend({
      top: SIZE - height,
      bottom: 0,
      left: Math.floor((SIZE - width) / 2),
      right: Math.ceil((SIZE - width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 88 })
    .toFile(`${DEST_DIR}/${id}.webp`)
  console.log(
    `${id.padEnd(8)} ${String(width).padStart(3)}x${String(height).padEnd(3)}` +
      ` · encre ${String(Math.round(encre)).padStart(3)} (cible ${Math.round(cible)})`,
  )
}
