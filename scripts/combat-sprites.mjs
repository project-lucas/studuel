// LES SPRITES DU COMBAT DES HÉROS (02/11/2026) — docs/CADRAGE-COMBAT-HEROS.md.
//
// Chaque personnage du combat (un élève-héros, un prof-boss) a ses PLANCHES
// sources dans assets-sources/heros/combat/<dossier>/ : trois poses côte à côte
// sur un fond uni (vert, ou magenta pour ceux qui portent du vert), sorties de
// Higgsfield (Nano Banana Pro) avec la scène du personnage en référence. Une
// planche abîmée par un débord (les lettres d'une attaque qui tombent sur la
// pose voisine) est GOMMÉE dans la source elle-même, au fond uni : la source
// gardée est toujours la bonne.
//
// Ce script les détoure (scripts/heros-detourer.mjs) vers public/images/combat/,
// au poids du combat — 640 px de haut, qualité 78 : une pose s'affiche au plus
// sur 72 % de l'arène — et passe les effets (fond noir) par
// scripts/vfx-detourer.mjs.
//
//   node scripts/combat-sprites.mjs              tout ce qui manque
//   node scripts/combat-sprites.mjs --force      tout, même l'existant
//   node scripts/combat-sprites.mjs demi-elfe-mage boss-grammatork   ceux-là
//
// Un personnage REDESSINÉ change d'adresse (`version`) : l'optimiseur d'images
// ressert l'ancien dessin sous l'ancienne.
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'assets-sources/heros/combat')
const OUT = path.join(ROOT, 'public/images/combat')

const HAUTEUR = 640
const QUALITE = 78

/** Les deux planches d'un élève-héros : de dos (moi), de face (l'adversaire). */
const HEROS = { 'planche-dos.png': ['dos', 'attaque-dos', 'touche-dos'], 'planche-face.png': ['face', 'attaque-face', 'ko'] }
/** La planche d'un prof-boss : toujours de face. */
const BOSS = { 'planche.png': ['face', 'attaque', 'ko'] }

/**
 * dossier source → { sortie (sous public/images/combat), cle du fond, planches }.
 * La clé vaut pour toutes les planches, ou planche par planche quand une
 * planche refaite est sortie sur l'autre fond (la gobeline de face).
 * L'ordre des poses est celui de la planche, de gauche à droite.
 */
export const PERSONNAGES = {
  'demi-elfe-mage': { sortie: 'heros/demi-elfe-mage', cle: 'magenta', planches: HEROS },
  'elfe-rodeur': { sortie: 'heros/elfe-rodeur', cle: 'magenta', planches: HEROS },
  'nain-forge': { sortie: 'heros/nain-forge', cle: 'vert', planches: HEROS },
  'demi-elfe-orage': { sortie: 'heros/demi-elfe-orage', cle: 'vert', planches: HEROS },
  'elfe-ombre': { sortie: 'heros/elfe-ombre', cle: 'vert', planches: HEROS },
  'elfe-harpon': { sortie: 'heros/elfe-harpon', cle: 'vert', planches: HEROS },
  'troll-pont': { sortie: 'heros/troll-pont', cle: 'magenta', planches: HEROS },
  'orc-classe': { sortie: 'heros/orc-classe', cle: 'magenta', planches: HEROS },
  'orc-chien': { sortie: 'heros/orc-chien', cle: 'magenta', planches: HEROS },
  'gobeline-mur': { sortie: 'heros/gobeline-mur', cle: { 'planche-dos.png': 'magenta', 'planche-face.png': 'vert' }, planches: HEROS },
  'naine-poney': { sortie: 'heros/naine-poney', cle: 'vert', planches: HEROS },
  'elfe-cerf-volant': { sortie: 'heros/elfe-cerf-volant', cle: 'magenta', planches: HEROS },
  'humaine-luth': { sortie: 'heros/humaine-luth', cle: 'vert', planches: HEROS },
  'gobeline-lectrice': { sortie: 'heros/gobeline-lectrice', cle: 'magenta', planches: HEROS },
  'elfe-course': { sortie: 'heros/elfe-course', cle: 'vert', planches: HEROS },
  'boss-grammatork': { sortie: 'boss/grammatork', cle: 'magenta', planches: BOSS },
  'boss-delta': { sortie: 'boss/delta', cle: 'vert', planches: BOSS },
  'boss-imperator': { sortie: 'boss/imperator', cle: 'magenta', planches: BOSS },
  'boss-chronos': { sortie: 'boss/chronos', cle: 'magenta', planches: BOSS },
  'boss-bigben': { sortie: 'boss/bigben', cle: 'vert', planches: BOSS },
  'boss-eltoro': { sortie: 'boss/eltoro', cle: 'vert', planches: BOSS },
  'boss-plasma': { sortie: 'boss/plasma', cle: 'magenta', planches: BOSS },
  'boss-mitochondrix': { sortie: 'boss/mitochondrix', cle: 'magenta', planches: BOSS },
  'boss-bugzilla': { sortie: 'boss/bugzilla', cle: 'magenta', planches: BOSS },
  'boss-mecatron': { sortie: 'boss/mecatron', cle: 'vert', planches: BOSS },
  'boss-krach': { sortie: 'boss/krach', cle: 'magenta', planches: BOSS },
  'boss-sphinx': { sortie: 'boss/sphinx', cle: 'vert', planches: BOSS },
  'boss-nova': { sortie: 'boss/nova', cle: 'vert', planches: BOSS },
  'boss-coach-turbo': { sortie: 'boss/coach-turbo', cle: 'vert', planches: BOSS },
  'boss-kaiser-fang': { sortie: 'boss/kaiser-fang', cle: 'vert', planches: BOSS },
  'boss-fiscus': { sortie: 'boss/fiscus', cle: 'vert', planches: BOSS },
  'boss-proviseur': { sortie: 'boss/proviseur', cle: 'magenta', planches: BOSS },
}

/** Les effets : source sur fond noir → WebP, et le côté maximal servi. */
export const EFFETS = {
  'feu-projectile': 360,
  'feu-impact': 360,
  'lettres-projectile': 360,
  'encre-impact': 360,
  critique: 360,
}

/**
 * LES ATTAQUES FÉTICHES (02/11/2026) — une par personnage, sous vfx/attaques/ :
 *   · <id>.png : une planche sur NOIR, le projectile dans la moitié gauche
 *     (dessiné vers la droite), l'impact dans la moitié droite ;
 *   · <id>-projectile.png : un projectile SOLIDE (pierre, fer, bouclier, cuir)
 *     sur un fond de clé — une lueur se détoure à la lumière, un objet plein
 *     non : ses parties sombres deviendraient transparentes ;
 *     <id>-impact.png : son impact, seul sur noir ;
 *   · une attaque sans projectile (l'attaquant fond sur sa cible) n'a que
 *     <id>-impact.png.
 * Sortie : vfx/attaques/<id>-projectile.webp et <id>-impact.webp.
 */
export const ATTAQUES_NOIR = [
  'elfe-rodeur', 'nain-forge', 'demi-elfe-orage', 'elfe-ombre', 'elfe-harpon', 'orc-classe', 'orc-chien',
  'naine-poney', 'elfe-cerf-volant', 'humaine-luth', 'gobeline-lectrice',
  'delta', 'chronos', 'bigben', 'eltoro', 'plasma', 'mecatron', 'krach', 'sphinx', 'nova', 'kaiser-fang', 'fiscus', 'proviseur',
]
/** Projectile solide → la clé de son fond. */
export const PROJECTILES_SOLIDES = {
  'troll-pont': 'magenta', 'gobeline-mur': 'vert', imperator: 'vert', mitochondrix: 'magenta', bugzilla: 'magenta', 'coach-turbo': 'magenta',
}
export const SANS_PROJECTILE = ['elfe-course']
const COTE_ATTAQUE = 300
const QUALITE_ATTAQUE = 80
/** Un projectile solide est en longueur : sa hauteur suffit à le borner. */
const HAUTEUR_SOLIDE = 200

/** Les cœurs : une planche sur fond vert, quatre pièces. */
const COEURS = { source: 'vfx/coeurs.png', poses: ['plein', 'vide', 'moitie-gauche', 'moitie-droite'], hauteur: 128 }

const args = process.argv.slice(2)
const force = args.includes('--force')
const choisis = args.filter((a) => !a.startsWith('--'))

function lancer(script, params) {
  execFileSync(process.execPath, [path.join(ROOT, 'scripts', script), ...params], { stdio: 'inherit' })
}

for (const [dossier, p] of Object.entries(PERSONNAGES)) {
  if (choisis.length && !choisis.includes(dossier)) continue
  const sortie = path.join(OUT, p.sortie)
  for (const [planche, poses] of Object.entries(p.planches)) {
    const source = path.join(SRC, dossier, planche)
    if (!fs.existsSync(source)) {
      console.warn(`— ${dossier}/${planche} : pas encore de planche`)
      continue
    }
    const faites = poses.every((n) => fs.existsSync(path.join(sortie, `${n}.webp`)))
    if (faites && !force) continue
    const cle = typeof p.cle === 'string' ? p.cle : p.cle[planche]
    lancer('heros-detourer.mjs', [source, sortie, ...poses, `--cle=${cle}`, `--hauteur=${HAUTEUR}`, `--qualite=${QUALITE}`])
  }
}

if (!choisis.length || choisis.includes('vfx')) {
  fs.mkdirSync(path.join(OUT, 'vfx'), { recursive: true })
  for (const [nom, cote] of Object.entries(EFFETS)) {
    const source = path.join(SRC, 'vfx', `${nom}.png`)
    const cible = path.join(OUT, 'vfx', `${nom}.webp`)
    if (!fs.existsSync(source) || (fs.existsSync(cible) && !force)) continue
    lancer('vfx-detourer.mjs', [source, cible, `--cote=${cote}`])
  }
  await attaques()
  const coeurs = path.join(OUT, 'coeurs')
  if (force || !fs.existsSync(path.join(coeurs, 'plein.webp'))) {
    lancer('heros-detourer.mjs', [path.join(SRC, COEURS.source), coeurs, ...COEURS.poses, `--hauteur=${COEURS.hauteur}`, '--qualite=90'])
  }
}

/** Les attaques fétiches : découpe des planches sur noir, détourage des solides. */
async function attaques() {
  const src = path.join(SRC, 'vfx', 'attaques')
  const out = path.join(OUT, 'vfx', 'attaques')
  fs.mkdirSync(out, { recursive: true })
  const cible = (id, quoi) => path.join(out, `${id}-${quoi}.webp`)
  const aFaire = (...c) => force || c.some((f) => !fs.existsSync(f))
  for (const id of ATTAQUES_NOIR) {
    const source = path.join(src, `${id}.png`)
    if (!fs.existsSync(source) || !aFaire(cible(id, 'projectile'), cible(id, 'impact'))) continue
    const { width, height } = await sharp(source).metadata()
    const coupe = await colonneLaPlusVide(source)
    for (const [quoi, left, w] of [['projectile', 0, coupe], ['impact', coupe, width - coupe]]) {
      const tmp = path.join(os.tmpdir(), `attaque-${id}-${quoi}.png`)
      await sharp(source).extract({ left, top: 0, width: w, height }).png().toFile(tmp)
      lancer('vfx-detourer.mjs', [tmp, cible(id, quoi), `--cote=${COTE_ATTAQUE}`, `--qualite=${QUALITE_ATTAQUE}`])
      fs.rmSync(tmp)
    }
  }
  for (const [id, cle] of Object.entries(PROJECTILES_SOLIDES)) {
    const source = path.join(src, `${id}-projectile.png`)
    if (fs.existsSync(source) && aFaire(cible(id, 'projectile'))) {
      lancer('heros-detourer.mjs', [source, out, `${id}-projectile`, `--cle=${cle}`, `--hauteur=${HAUTEUR_SOLIDE}`, `--qualite=${QUALITE_ATTAQUE}`])
    }
  }
  for (const id of [...Object.keys(PROJECTILES_SOLIDES), ...SANS_PROJECTILE]) {
    const source = path.join(src, `${id}-impact.png`)
    if (fs.existsSync(source) && aFaire(cible(id, 'impact'))) lancer('vfx-detourer.mjs', [source, cible(id, 'impact'), `--cote=${COTE_ATTAQUE}`, `--qualite=${QUALITE_ATTAQUE}`])
  }
}

/**
 * Où couper une planche d'attaque : au MILIEU de la bande noire la plus
 * sombre entre 35 et 70 % de la largeur — un loup ou un chien qui bondit
 * dépasse souvent le milieu de l'image.
 */
async function colonneLaPlusVide(source) {
  const { data, info } = await sharp(source).removeAlpha().greyscale().raw().toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const de = Math.floor(width * 0.35)
  const a = Math.floor(width * 0.7)
  const sommes = []
  for (let x = de; x < a; x++) {
    let somme = 0
    for (let y = 0; y < height; y++) somme += data[y * width + x]
    sommes.push(somme)
  }
  const min = Math.min(...sommes)
  // Le bruit de compression : une colonne « vide » vaut quelques unités par pixel.
  const vide = (k) => sommes[k] <= min + height * 3
  const k = sommes.indexOf(min)
  let g = k
  let d = k
  while (g > 0 && vide(g - 1)) g--
  while (d < sommes.length - 1 && vide(d + 1)) d++
  return de + Math.round((g + d) / 2)
}
