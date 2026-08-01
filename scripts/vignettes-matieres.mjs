/**
 * Fabrique LES VIGNETTES DES CARTES MATIÈRES de l'accueil Réviser, toutes sur
 * la même trame :
 *   assets-sources/vignettes-v2/*.png   (originaux, LOCAUX — hors dépôt)
 *     → public/images/matieres/vignettes/<slug>.webp   (320x320)
 *
 *   node scripts/vignettes-matieres.mjs
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
 * - ALIGNEMENT PAR LE BAS. La vignette est ancrée dans le coin bas-droit de la
 *   carte. Centrer verticalement ferait flotter les dessins courts au-dessus du
 *   bord ; on les pose donc tous sur une même ligne de sol, à MARGE_BAS du bord
 *   de la toile. Horizontalement en revanche, on centre : le dessinateur a
 *   composé autour d'un axe, le décaler à droite déséquilibrerait les objets qui
 *   dépassent du dossier.
 *
 * - TOILE CARRÉE DE 320. Servie à 100 px (constante ART_PX de SubjectsHome),
 *   c'est trois fois la taille affichée : de la marge pour les écrans denses et
 *   pour agrandir la vignette plus tard sans repasser par le générateur.
 */

import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import { planDuLot } from './lib/trame.mjs'

const SRC_DIR = 'assets-sources/vignettes-v2'
const DEST_DIR = 'public/images/matieres/vignettes'

/** Côté de la toile finale. */
const SIZE = 320

/**
 * Distance entre le bas du dessin et le bas de la toile, en fraction du canevas.
 * Assez pour que l'ombre portée du CSS ne soit pas coupée par le bord de la
 * carte, assez peu pour que le dessin repose vraiment dans l'angle.
 */
const MARGE_BAS = 0.025

/**
 * Slug de la matière → nom du fichier original. La correspondance est explicite
 * parce que les originaux arrivent nommés à la main : accents, espaces, sigles
 * en capitales et deux orthographes fautives (« entreprenariat », « art
 * plastique »). Dériver le nom du slug marcherait pour quinze d'entre eux et
 * échouerait en silence sur les sept autres.
 */
const ORIGINAUX = {
  allemand: 'allemand',
  anglais: 'anglais',
  'arts-plastiques': 'art plastique',
  economie: 'économie',
  entrepreneuriat: 'entreprenariat',
  espagnol: 'espagnol',
  'figures-historiques': 'figures historiques',
  fiscalite: 'fiscalité',
  francais: 'français',
  grec: 'grec',
  hggsp: 'hggsp',
  'histoire-geo': 'histoire géo',
  latin: 'latin',
  maths: 'mathématiques',
  musique: 'musique',
  nsi: 'NSI',
  philosophie: 'philosophie',
  'physique-chimie': 'physique chimie',
  ses: 'SES',
  sport: 'sport',
  svt: 'svt',
  technologie: 'technologie',
}

/**
 * Tolérance du détourage, par canal, autour de la couleur du coin. Large parce
 * que le fond peint n'est pas parfaitement uni (bruit du générateur) ; sans
 * danger parce que le remplissage s'arrête sur le trait marine qui cerne tous
 * les dessins de ce lot.
 */
const TOLERANCE_FOND = 40

/**
 * DÉTOURE UN FOND PEINT. Le générateur d'images rend parfois le fond en
 * COULEUR OPAQUE au lieu de le laisser transparent — `grec.png` arrive avec un
 * aplat crème (245,239,225) sur toute sa surface. Tel quel, la vignette porte
 * un rectangle clair bien visible sur la carte, là où ses voisines flottent sur
 * le fond crème. C'est le même piège que les icônes du HUD (damier peint) : il
 * ne se voit pas dans la visionneuse de fichiers, seulement une fois posé dans
 * l'app.
 *
 * On remplit depuis LES BORDS, de proche en proche, tant que le pixel reste
 * proche de la couleur du coin. Partir des bords plutôt que de filtrer la
 * couleur globalement est ce qui protège le dessin : le grec contient des blancs
 * et des gris très clairs (la colonne, le parchemin) qu'un filtre global
 * effacerait. Le remplissage, lui, s'arrête sur le cerne sombre du dessin.
 *
 * Rien à faire quand l'image a déjà son alpha : on renvoie le fichier tel quel.
 */
async function detourerFondPeint(chemin) {
  const { data, info } = await sharp(chemin)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  if (data[3] < 128) return sharp(chemin).png().toBuffer()

  const [fr, fg, fb] = [data[0], data[1], data[2]]
  const estFond = (p) => {
    const i = p * channels
    return (
      data[i + 3] > 128 &&
      Math.abs(data[i] - fr) <= TOLERANCE_FOND &&
      Math.abs(data[i + 1] - fg) <= TOLERANCE_FOND &&
      Math.abs(data[i + 2] - fb) <= TOLERANCE_FOND
    )
  }

  const vus = new Uint8Array(width * height)
  const pile = []
  const amorcer = (p) => {
    if (!vus[p] && estFond(p)) {
      vus[p] = 1
      pile.push(p)
    }
  }
  for (let x = 0; x < width; x++) {
    amorcer(x)
    amorcer((height - 1) * width + x)
  }
  for (let y = 0; y < height; y++) {
    amorcer(y * width)
    amorcer(y * width + width - 1)
  }

  let efface = 0
  while (pile.length > 0) {
    const p = pile.pop()
    data[p * channels + 3] = 0
    efface++
    const x = p % width
    const y = (p - x) / width
    if (x + 1 < width) amorcer(p + 1)
    if (x > 0) amorcer(p - 1)
    if (y + 1 < height) amorcer(p + width)
    if (y > 0) amorcer(p - width)
  }

  console.log(
    `  détourage ${chemin} : fond peint (${fr},${fg},${fb}) — ` +
      `${Math.round((100 * efface) / (width * height))} % de la toile effacé`,
  )
  return sharp(data, { raw: { width, height, channels } }).png().toBuffer()
}

async function source(nom) {
  for (const ext of ['png', 'webp']) {
    const chemin = `${SRC_DIR}/${nom}.${ext}`
    try {
      await access(chemin)
      return chemin
    } catch {
      /* extension suivante */
    }
  }
  throw new Error(
    `Original introuvable : ${SRC_DIR}/${nom}.{png,webp}. ` +
      `Les originaux sont LOCAUX (assets-sources/ est dans .gitignore) — ` +
      `après un clone, il faut les redéposer avant de relancer ce script.`,
  )
}

await mkdir(DEST_DIR, { recursive: true })

// Les dessins détourés, avant toute mise à l'échelle.
const dessins = {}
for (const [slug, fichier] of Object.entries(ORIGINAUX)) {
  dessins[slug] = await sharp(await detourerFondPeint(await source(fichier)))
    .trim({ threshold: 2 })
    .png()
    .toBuffer()
}

const { cible, plan } = await planDuLot(dessins, SIZE)

for (const slug of Object.keys(plan).sort()) {
  const { width, height, encre } = plan[slug]

  const bas = Math.round(SIZE * MARGE_BAS)
  const haut = SIZE - height - bas
  if (haut < 0) {
    throw new Error(
      `${slug} : ${height} px de haut + ${bas} px de marge dépassent la toile de ` +
        `${SIZE}. Baisser maxDim dans les réglages de la trame avant d'insister.`,
    )
  }

  await sharp(dessins[slug])
    .resize(width, height)
    .extend({
      top: haut,
      bottom: bas,
      // Centrage horizontal ; le pixel impair part à droite.
      left: Math.floor((SIZE - width) / 2),
      right: Math.ceil((SIZE - width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 92 })
    .toFile(`${DEST_DIR}/${slug}.webp`)

  console.log(
    `${slug.padEnd(20)} ${String(width).padStart(3)}x${String(height).padEnd(3)}` +
      ` · encre ${String(Math.round(encre)).padStart(3)} (cible ${Math.round(cible)})`,
  )
}
