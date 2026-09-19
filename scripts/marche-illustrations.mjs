/**
 * Fabrique LES ILLUSTRATIONS DU MARCHÉ — les trois cartes de consommables de
 * la Boutique :
 *   assets-sources/boutique-marche/<id>.png      (originaux, LOCAUX — hors dépôt)
 *     → public/images/boutique/marche/<id>.webp   (512x512, fond transparent)
 *
 *   node scripts/marche-illustrations.mjs
 *
 * xp (Boost XP, carte ambre) · bouclier (Bouclier de trophées, carte bleue) ·
 * fiche (Fiche de révision, carte rose). Même chaîne que les packs de gemmes
 * (scripts/packs-gemmes.mjs), dont elles partagent la carte
 * (components/boutique/CarteMagasin.tsx) : des OBJETS DÉTOURÉS, posés au sol
 * de l'écrin — c'est l'app qui dessine le fond sobre et l'ombre liée à
 * l'objet, pas l'image.
 *
 * Les originaux sortent du générateur en 4 096 px et 13 à 16 Mo, sur un fond
 * blanc OPAQUE : d'où le détourage (scripts/lib/fond-peint.mjs — le
 * remplissage part des bords et s'arrête sur le trait sombre qui cerne chaque
 * dessin ; les étincelles isolées restent), puis la trame (scripts/lib/
 * trame.mjs) : les trois cartes côte à côte doivent paraître de la même
 * taille, alors que la potion est ronde, le bouclier haut et la fiche large.
 *
 * Nouvel original ? Le déposer dans assets-sources/boutique-marche/,
 * l'ajouter à ILLUSTRATIONS ci-dessous, relancer, puis le déclarer dans
 * components/boutique/Marche.tsx.
 */
import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import { planDuLot } from './lib/trame.mjs'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC_DIR = 'assets-sources/boutique-marche'
const DEST_DIR = 'public/images/boutique/marche'
const SIZE = 512

const ILLUSTRATIONS = ['xp', 'bouclier', 'fiche']

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
for (const id of ILLUSTRATIONS) {
  dessins[id] = await sharp(await detourerFondPeint(await source(id)))
    .trim({ threshold: 2 })
    .png()
    .toBuffer()
}

const { cible, plan } = await planDuLot(dessins, SIZE)

for (const id of Object.keys(plan)) {
  const { width, height, encre } = plan[id]
  // Posé EN BAS de la toile : l'objet repose sur le sol de l'écrin, là où
  // l'app dessine son ombre ; il ne flotte pas au milieu.
  const info = await sharp(dessins[id])
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
    `${id.padEnd(9)} ${String(width).padStart(3)}x${String(height).padEnd(3)}` +
      ` · encre ${String(Math.round(encre)).padStart(3)} (cible ${Math.round(cible)})` +
      ` · ${Math.round(info.size / 1024)} Ko`,
  )
}
