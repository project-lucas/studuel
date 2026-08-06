/**
 * Fabrique LES VIGNETTES DES CARTES MATIÈRES de l'accueil Réviser, toutes sur
 * la même trame :
 *   assets-sources/<lot>/*.png   (originaux, LOCAUX — hors dépôt)
 *     → public/images/matieres/vignettes/<slug>.webp   (320x320)
 *
 *   node scripts/vignettes-matieres.mjs
 *
 * PLUSIEURS LOTS, UNE SEULE PLANCHE. Les dessins n'arrivent pas tous en même
 * temps : le lot v3 en refait dix-sept, sept restent au dessin v2. On les passe
 * malgré tout dans le MÊME générateur, en une seule fournée — la trame calibre
 * sur la moyenne du lot traité, donc régénérer les dix-sept seuls leur donnerait
 * une taille perçue étrangère à celle de leurs sept voisines. SRC_DIRS est
 * ordonné du plus récent au plus ancien : le premier dossier qui contient le
 * fichier gagne.
 *
 * POURQUOI CE SCRIPT EXISTE
 *
 * Le lot précédent était normalisé sur la HAUTEUR seulement : les 22 dessins
 * faisaient tous 304 px de haut sur une toile de 320, mais leur largeur allait
 * de 222 à 300 px — du simple au tiers en plus. Dans une grille à deux colonnes,
 * Histoire-Géo (88 % de large) paraissait nettement plus grosse que Maths
 * (77 %), alors que les DEUX BOÎTES faisaient exactement 100x100 à l'écran.
 * Égaliser les boîtes ne suffit pas : l'œil compare des taches d'encre, pas des
 * rectangles. C'est tout l'objet de la trame — voir scripts/lib/trame.mjs, qui
 * porte la méthode et son raisonnement.
 *
 * DEUX PARTIS PRIS PROPRES AUX CARTES
 *
 * - CENTRAGE SUR LES DEUX AXES. La carte matière est passée en RANGÉE (vignette
 *   à gauche, nom à droite) : le dessin vit désormais dans une boîte carrée
 *   centrée, plus dans le coin bas-droit de la carte. Il était jusqu'ici posé
 *   sur une ligne de sol commune, à 2,5 % du bord bas — ce qui était juste tant
 *   que le bord de la toile était le bord de la carte, et qui ferait maintenant
 *   pendre les dessins courts dans le bas de leur case.
 *
 * - TOILE CARRÉE DE 320. Servie à 52 px (constante ICON_PX de SubjectsHome),
 *   c'est six fois la taille affichée : de la marge pour les écrans denses et
 *   pour agrandir la vignette plus tard sans repasser par le générateur.
 */

import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import { planDuLot } from './lib/trame.mjs'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC_DIRS = [
  'assets-sources/vignette v3/Copie de Copie de .webp (8)',
  'assets-sources/vignettes-v2',
]
const DEST_DIR = 'public/images/matieres/vignettes'

/** Côté de la toile finale. */
const SIZE = 320

/**
 * Slug de la matière → noms possibles du fichier original, du lot le plus récent
 * au plus ancien. La correspondance est explicite parce que les originaux
 * arrivent nommés à la main : accents, espaces, sigles en capitales, abréviation
 * (« math ») et deux orthographes fautives (« entreprenariat », « art
 * plastique »). Dériver le nom du slug marcherait pour quinze d'entre eux et
 * échouerait en silence sur les autres.
 *
 * Deux dessins du lot v3 n'apparaissent PAS ici : `italien` et `marketing`. Ces
 * matières n'existent pas dans `subjects` — les illustrer ne créerait aucune
 * carte, seulement un fichier que rien ne sert.
 */
const ORIGINAUX = {
  allemand: ['allemand'],
  anglais: ['anglais'],
  'arts-plastiques': ['art plastique'],
  economie: ['ECONOMIE', 'économie'],
  emc: ['EMC'],
  'enseignement-scientifique': ['enseignement scientifique'],
  entrepreneuriat: ['entreprenariat'],
  espagnol: ['espagnol'],
  'figures-historiques': ['figures historiques'],
  fiscalite: ['fiscalité'],
  francais: ['français'],
  grec: ['GREC', 'grec'],
  hggsp: ['HGGSP', 'hggsp'],
  'histoire-geo': ['histoire géo'],
  latin: ['LATIN', 'latin'],
  maths: ['math', 'mathématiques'],
  musique: ['musique'],
  nsi: ['NSI'],
  philosophie: ['philosophie'],
  'physique-chimie': ['physique-chimie', 'physique chimie'],
  ses: ['ses', 'SES'],
  sport: ['sport'],
  svt: ['svt'],
  technologie: ['technologie'],
}

/**
 * Le fichier original d'une matière : premier lot (le plus récent) qui porte
 * l'un de ses noms possibles. Renvoie aussi le dossier, pour dire à l'écran quel
 * lot a fourni quel dessin — sans quoi une régénération après livraison
 * partielle ne se relit plus.
 */
async function source(noms) {
  for (const dir of SRC_DIRS) {
    for (const nom of noms) {
      for (const ext of ['png', 'webp']) {
        const chemin = `${dir}/${nom}.${ext}`
        try {
          await access(chemin)
          return { chemin, dir }
        } catch {
          /* candidat suivant */
        }
      }
    }
  }
  throw new Error(
    `Original introuvable : ${noms.join(' | ')}.{png,webp} dans ` +
      `${SRC_DIRS.join(' ni ')}. Les originaux sont LOCAUX (assets-sources/ ` +
      `est dans .gitignore) — après un clone, il faut les redéposer avant de ` +
      `relancer ce script.`,
  )
}

await mkdir(DEST_DIR, { recursive: true })

// Les dessins détourés, avant toute mise à l'échelle.
const dessins = {}
const lotDe = {}
for (const [slug, noms] of Object.entries(ORIGINAUX)) {
  const { chemin, dir } = await source(noms)
  lotDe[slug] = SRC_DIRS.indexOf(dir) === 0 ? 'v3' : 'v2'
  dessins[slug] = await sharp(await detourerFondPeint(chemin))
    .trim({ threshold: 2 })
    .png()
    .toBuffer()
}

const { cible, plan } = await planDuLot(dessins, SIZE)

for (const slug of Object.keys(plan).sort()) {
  const { width, height, encre } = plan[slug]

  if (height > SIZE || width > SIZE) {
    throw new Error(
      `${slug} : ${width}x${height} dépasse la toile de ${SIZE}. ` +
        `Baisser maxDim dans les réglages de la trame avant d'insister.`,
    )
  }

  await sharp(dessins[slug])
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
    .toFile(`${DEST_DIR}/${slug}.webp`)

  console.log(
    `${slug.padEnd(26)} ${lotDe[slug]}  ${String(width).padStart(3)}x${String(height).padEnd(3)}` +
      ` · encre ${String(Math.round(encre)).padStart(3)} (cible ${Math.round(cible)})`,
  )
}
