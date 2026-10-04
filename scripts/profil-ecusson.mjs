/**
 * LA TÊTE DE MOI : LA BANNIÈRE DU JOUEUR (04/10/2026). Maquette « C » de Lucas,
 * puis : « remplace les couronnes par le croisement de stylos (le logo de
 * l'app), sinon l'app est trop proche de Clash Royale » et « avatar à gauche,
 * inscrit dans une bannière rectangulaire, série, trophées et niveau à droite ».
 *
 * Fabrique, depuis les dessins Higgsfield rangés dans
 * assets-sources/profil-ecusson/ et assets-sources/portraits-v2/ :
 *   - public/images/moi/banniere/banniere-1..5.webp — la bannière à son métal
 *     (bronze, argent, or, diamant, légende), INTÉRIEUR TRANSPARENT : le
 *     dessin a été demandé avec un intérieur magenta pur, effacé ici ;
 *   - embleme (les crayons croisés du logo), blason-niveau, academie (.webp) ;
 *   - public/images/profil/v2/<2..14>.webp — les treize portraits par défaut,
 *     redessinés dans le style de la maquette (carrés, sans écu).
 * et écrit lib/moi/bannieres-geometrie.ts : la boîte de l'intérieur de chaque
 * bannière, en % de l'image.
 *
 *   node scripts/profil-ecusson.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const SRC = 'assets-sources/profil-ecusson'
const OUT = 'public/images/moi/banniere'
await mkdir(OUT, { recursive: true })

/** Efface le magenta (intérieur du cadre) et rend la boîte de la zone centrale. */
async function effacerMagenta(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  for (let p = 0; p < width * height; p++) {
    const i = p * channels
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    // « Magenta » : rouge et bleu forts, vert bien plus bas ; seuils serrés,
    // les gemmes violettes (rouge ~150) ne doivent pas passer. Un pixel de
    // frange (mélange avec le cerne) perd son alpha à proportion.
    const force = Math.min(r, b) - g
    if (force > 60 && r > 190 && b > 190) {
      const alpha = force > 140 ? 0 : Math.round(255 * (1 - (force - 60) / 80))
      data[i + 3] = Math.min(data[i + 3], alpha)
    }
  }
  // La boîte ne retient que la zone vidée qui contient le CENTRE : un éclat
  // magenta isolé (gemme, reflet) ne doit pas l'agrandir.
  const vide = (p) => data[p * channels + 3] === 0
  const vus = new Uint8Array(width * height)
  const depart = Math.floor(height * 0.55) * width + Math.floor(width / 2)
  const pile = vide(depart) ? [depart] : []
  if (pile.length) vus[depart] = 1
  let x0 = width
  let y0 = height
  let x1 = -1
  let y1 = -1
  while (pile.length) {
    const p = pile.pop()
    const x = p % width
    const y = (p - x) / width
    if (x < x0) x0 = x
    if (x > x1) x1 = x
    if (y < y0) y0 = y
    if (y > y1) y1 = y
    for (const q of [p - 1, p + 1, p - width, p + width]) {
      if (q >= 0 && q < width * height && !vus[q] && vide(q)) {
        vus[q] = 1
        pile.push(q)
      }
    }
  }
  const png = await sharp(data, { raw: { width, height, channels } }).png().toBuffer()
  return { png, boite: { x0, y0, x1, y1 } }
}

/** Rogne le transparent autour, et rend le décalage pour recaler une boîte. */
async function rogner(png) {
  const { info } = await sharp(png).trim({ threshold: 1 }).toBuffer({ resolveWithObject: true })
  const decalX = -(info.trimOffsetLeft ?? 0)
  const decalY = -(info.trimOffsetTop ?? 0)
  const rogne = await sharp(png).trim({ threshold: 1 }).png().toBuffer()
  return { rogne, decalX, decalY, largeur: info.width, hauteur: info.height }
}

const geometrie = {}
for (let n = 1; n <= 5; n++) {
  const detoure = await detourerFondPeint(`${SRC}/banniere-${n}.png`, { silencieux: true })
  const { png, boite } = await effacerMagenta(detoure)
  const { rogne, decalX, decalY, largeur, hauteur } = await rogner(png)
  const pct = (v, total) => Math.round((v / total) * 1000) / 10
  geometrie[n] = {
    ratio: Math.round((largeur / hauteur) * 1000) / 1000,
    gauche: pct(boite.x0 - decalX, largeur),
    haut: pct(boite.y0 - decalY, hauteur),
    largeur: pct(boite.x1 - boite.x0 + 1, largeur),
    hauteur: pct(boite.y1 - boite.y0 + 1, hauteur),
  }
  await sharp(rogne).resize({ width: 760 }).webp({ quality: 86, alphaQuality: 90 }).toFile(`${OUT}/banniere-${n}.webp`)
}

const SIMPLES = { embleme: 160, 'blason-niveau-crayons': 200 }
for (const [nom, largeur] of Object.entries(SIMPLES)) {
  const detoure = await detourerFondPeint(`${SRC}/${nom}.png`, { silencieux: true })
  const { rogne } = await rogner(detoure)
  const sortie = nom === 'blason-niveau-crayons' ? 'blason-niveau' : nom
  await sharp(rogne).resize({ width: largeur }).webp({ quality: 86, alphaQuality: 90 }).toFile(`${OUT}/${sortie}.webp`)
}

// LE MOTIF DU FOND : une tuile de 120 px, deux emblèmes décalés, inclinés en
// sens contraire — c'est son alpha qui sert de masque (TableauDeBord.module.css).
{
  const petit = await sharp(`${OUT}/embleme.webp`).resize(34, 34).toBuffer()
  const penche = await sharp(`${OUT}/embleme.webp`).resize(34, 34).rotate(-18, { background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer()
  await sharp({ create: { width: 120, height: 120, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: petit, left: 13, top: 13 },
      { input: penche, left: 68, top: 66 },
    ])
    .webp({ quality: 80, alphaQuality: 80 })
    .toFile(`${OUT}/motif.webp`)
}

// L'ACADÉMIE : son bord bas est VIOLET plein, que le détourage par les bords
// prendrait pour du fond. On n'y efface que le blanc du ciel.
{
  const { data, info } = await sharp(`${SRC}/academie.png`).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let p = 0; p < info.width * info.height; p++) {
    const i = p * info.channels
    const clair = Math.min(data[i], data[i + 1], data[i + 2])
    if (clair > 240) data[i + 3] = 0
    else if (clair > 215) data[i + 3] = Math.round((255 * (240 - clair)) / 25)
  }
  const png = await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } }).png().toBuffer()
  const { rogne, largeur, hauteur } = await rogner(png)
  // On ne garde que la silhouette et un liseré de son pied : l'aplat violet
  // du bas prendrait la place du contenu au-dessus de la barre d'onglets.
  await sharp(rogne)
    .extract({ left: 0, top: 0, width: largeur, height: Math.round(hauteur * 0.72) })
    .resize({ width: 1000 }).webp({ quality: 86, alphaQuality: 90 }).toFile(`${OUT}/academie.webp`)
}

// Rangés sous v2/ : une nouvelle ADRESSE, sinon l'optimiseur d'images (et les
// navigateurs) resservent l'ancien dessin sous l'ancienne.
await mkdir('public/images/profil/v2', { recursive: true })
for (let k = 2; k <= 14; k++) {
  await sharp(`assets-sources/portraits-v2/${k}.png`)
    .resize(384, 384)
    .webp({ quality: 84 })
    .toFile(`public/images/profil/v2/${k}.webp`)
}

await writeFile(
  'lib/moi/bannieres-geometrie.ts',
  `// GÉNÉRÉ par scripts/profil-ecusson.mjs — ne pas modifier à la main.
// L'intérieur de chaque bannière (en % de son image).

export type GeometrieBanniere = {
  /** largeur / hauteur de l'image */
  ratio: number
  gauche: number
  haut: number
  largeur: number
  hauteur: number
}

export const GEOMETRIE_BANNIERES: Readonly<Record<1 | 2 | 3 | 4 | 5, GeometrieBanniere>> = ${JSON.stringify(geometrie, null, 2)}
`,
)
console.log(geometrie)
