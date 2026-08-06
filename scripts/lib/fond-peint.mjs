/**
 * DÉTOURER UN FOND PEINT.
 *
 * Le générateur d'images rend parfois le fond en COULEUR OPAQUE au lieu de le
 * laisser transparent : aplat crème sur certains lots, damier gris/blanc sur
 * d'autres — le motif qui figure la transparence dans un éditeur, aplati dans
 * le PNG. Tel quel, le dessin porte un rectangle bien visible dès qu'il se pose
 * sur autre chose que du blanc. Le piège ne se voit PAS dans la visionneuse de
 * fichiers, qui dessine exactement le même damier pour figurer la transparence
 * — seulement une fois l'image dans l'app.
 *
 * Ce module portait sur les vignettes de matières ; il sert aussi à la flamme
 * de série, et servira au lot suivant : les originaux arrivent tous du même
 * générateur, avec le même défaut.
 */

import sharp from 'sharp'

/**
 * Tolérance du détourage, par canal, autour de CHAQUE ton de la palette de fond.
 * Assez large pour absorber le bruit du générateur, assez serrée pour ne pas
 * fusionner les deux carreaux du damier en une seule plage qui engloberait les
 * gris clairs des dessins. Sans danger de toute façon : le remplissage part des
 * bords et s'arrête sur le trait sombre qui cerne tous ces dessins.
 */
const TOLERANCE_FOND = 22

/** Part minimale du pourtour pour qu'un ton compte comme « fond ». */
const PART_MIN_TON = 0.06

/**
 * La PALETTE DE FOND d'une image : les tons qui occupent son pourtour. On
 * histogramme les quatre bords par paquets de 8 niveaux, et tout ton qui couvre
 * au moins PART_MIN_TON du pourtour est déclaré « fond ».
 *
 * Pourquoi une palette et non une couleur : le damier peint a deux tons (≈205
 * et ≈250) ; se caler sur la seule couleur du coin n'en effaçait qu'un sur deux
 * et laissait un quadrillage bien visible.
 */
function paletteDuFond(data, width, height, channels) {
  const bacs = new Map()
  const compter = (p) => {
    const i = p * channels
    if (data[i + 3] < 128) return
    const cle = `${data[i] >> 3},${data[i + 1] >> 3},${data[i + 2] >> 3}`
    const bac = bacs.get(cle)
    if (bac) {
      bac.n++
      bac.r += data[i]
      bac.g += data[i + 1]
      bac.b += data[i + 2]
    } else {
      bacs.set(cle, { n: 1, r: data[i], g: data[i + 1], b: data[i + 2] })
    }
  }
  for (let x = 0; x < width; x++) {
    compter(x)
    compter((height - 1) * width + x)
  }
  for (let y = 0; y < height; y++) {
    compter(y * width)
    compter(y * width + width - 1)
  }

  const total = 2 * (width + height)
  return [...bacs.values()]
    .filter((b) => b.n / total >= PART_MIN_TON)
    .map((b) => [b.r / b.n, b.g / b.n, b.b / b.n])
}

/**
 * Détoure le fond peint d'un fichier et renvoie un PNG à fond transparent.
 *
 * On remplit depuis LES BORDS, de proche en proche, tant que le pixel appartient
 * à la palette de fond. Partir des bords plutôt que de filtrer ces couleurs
 * partout est ce qui protège le dessin : ces illustrations contiennent des
 * blancs et des gris clairs (le marbre du buste, le parchemin, les reflets)
 * qu'un filtre global effacerait. Le remplissage, lui, s'arrête sur le cerne
 * sombre qui entoure chaque dessin.
 *
 * Rien à faire quand l'image a déjà son alpha : on renvoie le fichier tel quel.
 */
export async function detourerFondPeint(chemin, { silencieux = false } = {}) {
  const { data, info } = await sharp(chemin)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info

  if (data[3] < 128) return sharp(chemin).png().toBuffer()

  const palette = paletteDuFond(data, width, height, channels)

  // UNE PLAGE, PAS UNE LISTE DE TONS. Reconnaître exactement les deux tons du
  // damier ne suffisait pas : agrandis à 4000 px, les carreaux se touchent par
  // un dégradé de quelques pixels, et le remplissage — qui avance de proche en
  // proche — restait bloqué à la frontière d'un carreau. Il n'effaçait plus que
  // 8 à 20 % de la toile sur cinq dessins. On accepte donc TOUT ton neutre situé
  // entre les extrêmes de la palette : les valeurs intermédiaires du dégradé en
  // font partie, et le remplissage traverse.
  //
  // La contrainte de neutralité (écart entre canaux) est ce qui protège le
  // dessin : les couleurs vives des illustrations en sortent d'office. Elle
  // s'ajuste au fond observé — un aplat crème (245,239,225), lui, n'est pas
  // neutre au sens strict.
  const canaux = palette.flat()
  const bas = Math.min(...canaux) - TOLERANCE_FOND
  const haut = Math.max(...canaux) + TOLERANCE_FOND
  const ecartFond = Math.max(
    ...palette.map((t) => Math.max(...t) - Math.min(...t)),
  )
  const ecartMax = ecartFond + 10

  const estFond = (p) => {
    const i = p * channels
    if (data[i + 3] < 128) return false
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    if (r < bas || r > haut || g < bas || g > haut || b < bas || b > haut) {
      return false
    }
    return Math.max(r, g, b) - Math.min(r, g, b) <= ecartMax
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

  if (!silencieux) {
    console.log(
      `  détourage ${chemin.split(/[\\/]/).pop()} : ${palette.length} ton(s) de fond ` +
        `(${palette.map(([r]) => Math.round(r)).join(', ')}) — ` +
        `${Math.round((100 * efface) / (width * height))} % de la toile effacé`,
    )
  }
  return sharp(data, { raw: { width, height, channels } }).png().toBuffer()
}
