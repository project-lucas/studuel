/**
 * Fabrique LES TITRES DE CATÉGORIE DE LA BOUTIQUE — une image par style :
 *   assets-sources/boutique-bannieres/<id>.png   (originaux, LOCAUX — hors dépôt)
 *     → public/images/boutique/banniere/<id>.webp (fond transparent, 240 px de haut)
 *
 *   node scripts/bannieres-boutique.mjs
 *
 * plaque (Boost) · parchemin (Capsules) · ruban (Gemmes) · ruban-clair (Pour
 * ton profil) — un style par catégorie, comme au magasin de Clash Royale
 * (Lucas, 18/09/2026). AUCUN TEXTE dans l'image : l'app écrit le titre
 * par-dessus (components/boutique/BandeauSection.tsx).
 *
 * Les originaux sortent du générateur en 21:9, 6 336 px et 10 à 13 Mo, sur un
 * fond blanc OPAQUE. D'où le détourage (scripts/lib/fond-peint.mjs : le
 * remplissage part des bords et s'arrête sur le trait sombre qui cerne chaque
 * dessin), le rognage au ras du dessin, puis 240 px de haut — trois fois la
 * plus grande hauteur affichée (78 px, le parchemin), pour les écrans denses.
 *
 * L'app pose ces images en NEUF TRANCHES (`border-image`) : les deux bouts
 * gardent leurs proportions, seul le centre uni s'étire à la largeur de
 * l'écran. Les points de coupe sont dans components/boutique/
 * BandeauSection.module.css (une classe par style), en
 * % de la largeur : ils valent quelle que soit la taille de sortie.
 *
 * Nouvel original ? Le déposer dans assets-sources/boutique-bannieres/,
 * l'ajouter à BANNIERES ci-dessous, relancer, puis le déclarer dans
 * BandeauSection.
 */
import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC_DIR = 'assets-sources/boutique-bannieres'
const DEST_DIR = 'public/images/boutique/banniere'
const HAUTEUR = 240

const BANNIERES = ['plaque', 'parchemin', 'ruban', 'ruban-clair']

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

for (const id of BANNIERES) {
  const detoure = await sharp(await detourerFondPeint(await source(id)))
    .trim({ threshold: 2 })
    .png()
    .toBuffer()
  const info = await sharp(detoure)
    .resize({ height: HAUTEUR })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(`${DEST_DIR}/${id}.webp`)
  console.log(
    `${id.padEnd(12)} ${String(info.width).padStart(4)}x${info.height}` +
      ` · ${(info.width / info.height).toFixed(2)}:1 · ${Math.round(info.size / 1024)} Ko`,
  )
}
