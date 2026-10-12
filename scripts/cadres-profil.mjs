// -----------------------------------------------------------------------------
// LES CADRES DE LA PHOTO DE PROFIL — découpés dans UNE planche (05/10/2026).
//
//   node scripts/cadres-profil.mjs
//
// Source : assets-sources/moi-cadres/planche.png (Higgsfield, Nano Banana 2
// Lite) — huit cadres sur fond gris uni, quatre par rangée, du bronze à la
// légende, fenêtre en magenta pur. Une planche plutôt que huit images : les
// cadres gardent la même échelle (la méthode des coffres, scripts/coffres-amis).
//
// Pour chaque case : le cadre est isolé de son fond gris par remplissage depuis
// les bords (le gris À L'INTÉRIEUR d'un dessin reste), la fenêtre magenta est
// effacée, puis le tout est posé sur un carré de 512 px où le CORPS du cadre
// (sans les ailes de la légende) occupe la même place pour les huit. La boîte
// de la fenêtre est écrite dans lib/moi/cadres-geometrie.ts : l'app y pose la
// photo, derrière le cadre.
// -----------------------------------------------------------------------------

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SOURCE = 'assets-sources/moi-cadres/planche.png'
const SORTIE = 'public/images/moi/cadres'
const GEOMETRIE = 'lib/moi/cadres-geometrie.ts'
const IDS = ['bronze', 'argent', 'or', 'platine', 'diamant', 'emeraude', 'rubis', 'legende']
const COTE = 512
/** La FENÊTRE occupe cette part du carré : les huit photos ont la même taille. */
const FENETRE = 0.5

const { data, info } = await sharp(SOURCE).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const W = info.width
const H = info.height
const px = (x, y) => (y * W + x) * 4

// Le gris du fond, lu dans le coin.
const fond = [data[0], data[1], data[2]]
const estFond = (i) =>
  Math.abs(data[i] - fond[0]) + Math.abs(data[i + 1] - fond[1]) + Math.abs(data[i + 2] - fond[2]) < 70

fs.mkdirSync(SORTIE, { recursive: true })
const geometrie = {}

for (let k = 0; k < IDS.length; k += 1) {
  const cx0 = Math.floor(((k % 4) * W) / 4)
  const cy0 = Math.floor((Math.floor(k / 4) * H) / 2)
  const cw = Math.floor(W / 4)
  const ch = Math.floor(H / 2)

  // Remplissage du fond depuis les bords de la case.
  const dehors = new Uint8Array(cw * ch)
  const pile = []
  for (let x = 0; x < cw; x += 1) pile.push([x, 0], [x, ch - 1])
  for (let y = 0; y < ch; y += 1) pile.push([0, y], [cw - 1, y])
  while (pile.length) {
    const [x, y] = pile.pop()
    if (x < 0 || y < 0 || x >= cw || y >= ch) continue
    const j = y * cw + x
    if (dehors[j]) continue
    if (!estFond(px(cx0 + x, cy0 + y))) continue
    dehors[j] = 1
    pile.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }

  // La fenêtre : remplie depuis le centre de la case, frange rosée comprise
  // (la lueur du dessin teinte le bord du magenta).
  const rose = (i) => data[i] > 130 && data[i + 2] > 130 && data[i + 1] < data[i] - 45
  const fenetre = new Uint8Array(cw * ch)
  const pileF = [[Math.floor(cw / 2), Math.floor(ch / 2)]]
  while (pileF.length) {
    const [x, y] = pileF.pop()
    if (x < 0 || y < 0 || x >= cw || y >= ch) continue
    const j = y * cw + x
    if (fenetre[j]) continue
    if (!rose(px(cx0 + x, cy0 + y))) continue
    fenetre[j] = 1
    pileF.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }

  // Boîtes : le dessin entier, et la fenêtre magenta.
  let bx0 = cw, by0 = ch, bx1 = 0, by1 = 0
  let mx0 = cw, my0 = ch, mx1 = 0, my1 = 0
  const rgba = Buffer.alloc(cw * ch * 4)
  for (let y = 0; y < ch; y += 1) {
    for (let x = 0; x < cw; x += 1) {
      const i = px(cx0 + x, cy0 + y)
      const o = (y * cw + x) * 4
      const magenta = fenetre[y * cw + x] === 1
      if (magenta) {
        mx0 = Math.min(mx0, x); my0 = Math.min(my0, y); mx1 = Math.max(mx1, x); my1 = Math.max(my1, y)
      }
      const visible = !dehors[y * cw + x] && !magenta
      rgba[o] = data[i]; rgba[o + 1] = data[i + 1]; rgba[o + 2] = data[i + 2]
      rgba[o + 3] = visible ? 255 : 0
      if (visible) {
        bx0 = Math.min(bx0, x); by0 = Math.min(by0, y); bx1 = Math.max(bx1, x); by1 = Math.max(by1, y)
      }
    }
  }

  // Calé sur la FENÊTRE : même taille et même centre pour les huit — c'est
  // la photo qui ne doit pas bouger d'un cadre à l'autre.
  const echelle = (COTE * FENETRE) / (mx1 - mx0 + 1)
  const decX = Math.round(COTE / 2 - ((mx0 + mx1) / 2) * echelle)
  const decY = Math.round(COTE / 2 - ((my0 + my1) / 2) * echelle)

  const dessin = await sharp(rgba, { raw: { width: cw, height: ch, channels: 4 } })
    .resize(Math.round(cw * echelle), Math.round(ch * echelle))
    .png()
    .toBuffer()
  const meta = await sharp(dessin).metadata()
  // Le dessin agrandi peut déborder du carré : on recoupe ce qui dépasse.
  const gauche = Math.max(0, -decX)
  const haut = Math.max(0, -decY)
  const largeur = Math.min(meta.width - gauche, COTE - Math.max(0, decX))
  const hauteur = Math.min(meta.height - haut, COTE - Math.max(0, decY))
  const morceau = await sharp(dessin).extract({ left: gauche, top: haut, width: largeur, height: hauteur }).toBuffer()

  await sharp({ create: { width: COTE, height: COTE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: morceau, left: Math.max(0, decX), top: Math.max(0, decY) }])
    .webp({ quality: 88, alphaQuality: 95 })
    .toFile(path.join(SORTIE, `${IDS[k]}.webp`))

  // La fenêtre, en % du carré, rentrée d'un pixel pour que la photo passe
  // sous le liseré intérieur du cadre.
  const pct = (v) => Math.round((v / COTE) * 10000) / 100
  geometrie[IDS[k]] = {
    left: pct(mx0 * echelle + decX + 2),
    top: pct(my0 * echelle + decY + 2),
    width: pct((mx1 - mx0 + 1) * echelle - 4),
    height: pct((my1 - my0 + 1) * echelle - 4),
  }
  console.log(IDS[k], geometrie[IDS[k]])
}

const lignes = Object.entries(geometrie)
  .map(([id, b]) => `  ${id}: { left: ${b.left}, top: ${b.top}, width: ${b.width}, height: ${b.height} },`)
  .join('\n')
fs.writeFileSync(
  GEOMETRIE,
  `// GÉNÉRÉ par \`node scripts/cadres-profil.mjs\` — ne pas éditer à la main.
//
// La fenêtre de chaque cadre de profil (lib/moi/cadre-profil), en % du carré
// de l'image : la photo se pose là, DERRIÈRE le cadre.

export type FenetreCadre = { left: number; top: number; width: number; height: number }

export const FENETRES_CADRES: Record<string, FenetreCadre> = {
${lignes}
}
`,
)
console.log('→', SORTIE, GEOMETRIE)
