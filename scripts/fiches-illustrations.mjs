// LES ILLUSTRATIONS DES FICHES DE RÉVISION — la seule part générée par l'IA.
//
// Une scène par fiche, en haut à droite de la page (docs/fiches-revision.md),
// dessinée par Nano Banana 2.1 dans la famille nav (références : l'éclair d'XP
// et le globe des Capitales), sur FOND MAGENTA PUR détouré ici par chroma-key —
// la méthode des lettrages de fin de duel (scripts/duel-titres.mjs).
//
//   node scripts/fiches-illustrations.mjs liste [niveau] [matiere]
//       → les fiches qui ont un prompt et pas encore d'image, en JSON
//         [{ niveau, matiere, slug, prompt }] — à donner au connecteur
//         Higgsfield par lots de 10 (generate_image_batch, 4:3, 1k).
//   node scripts/fiches-illustrations.mjs recevoir <liste.json>
//       → liste.json = [{ niveau, matiere, slug, url }] : télécharge, détoure,
//         recadre, écrit assets-sources/fiches/illustrations/<niveau>/<matiere>/<slug>.webp
//
// Le prompt complet d'une image = STYLE + la scène de la fiche + FOND.

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { listerFiches } from './fiches-rendre.mjs'

const RACINE = path.resolve(import.meta.dirname, '..')
const ILLUSTRATIONS = path.join(RACINE, 'assets-sources', 'fiches', 'illustrations')

export const STYLE =
  'Illustration for a school revision sheet, same art style as the two reference icons (thick dark plum outline, glossy rounded volumes, bold cartoon shading, violet · gold · cream palette, mobile-game object look). Scene: '
export const FOND = ' Playful, clear, no text, no letters, no numbers. Isolated on a flat pure magenta background (#FF00FF), no shadow on the background.'

const LARGEUR = 900

/** Chroma-key magenta → alpha, avec dé-contamination des bords. */
async function detourer(src) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const out = Buffer.alloc(data.length)
  const { width, height, channels } = info
  for (let i = 0; i < width * height; i += 1) {
    const r = data[i * channels]
    const g = data[i * channels + 1]
    const b = data[i * channels + 2]
    const d = Math.sqrt(((255 - r) ** 2 + g ** 2 + (255 - b) ** 2) / 3) / 255
    const a = Math.min(1, Math.max(0, (d - 0.12) / 0.3))
    if (a <= 0) {
      out[i * channels] = 0
      out[i * channels + 1] = 0
      out[i * channels + 2] = 0
      out[i * channels + 3] = 0
      continue
    }
    const k = 1 - a
    out[i * channels] = Math.min(255, Math.max(0, (r - k * 255) / a))
    out[i * channels + 1] = Math.min(255, Math.max(0, g / a))
    out[i * channels + 2] = Math.min(255, Math.max(0, (b - k * 255) / a))
    out[i * channels + 3] = Math.round(a * 255)
  }
  return sharp(out, { raw: { width, height, channels } }).png().toBuffer()
}

function cheminImage({ niveau, matiere, slug }) {
  return path.join(ILLUSTRATIONS, niveau, matiere, `${slug}.webp`)
}

async function liste(niveau, matiere) {
  const manque = []
  for (const f of listerFiches({ niveau, matiere })) {
    const prompt = f.fiche.illustration?.prompt
    if (!prompt) continue
    if (fs.existsSync(cheminImage({ niveau: f.niveau, matiere: f.matiere, slug: f.index.slug }))) continue
    manque.push({ niveau: f.niveau, matiere: f.matiere, slug: f.index.slug, prompt: STYLE + prompt + FOND })
  }
  console.log(JSON.stringify(manque, null, 2))
  console.error(`${manque.length} illustration(s) à générer`)
}

async function recevoir(fichier) {
  const lignes = JSON.parse(fs.readFileSync(fichier, 'utf8'))
  for (const l of lignes) {
    const cible = cheminImage(l)
    fs.mkdirSync(path.dirname(cible), { recursive: true })
    const reponse = await fetch(l.url)
    if (!reponse.ok) throw new Error(`${l.slug} : ${reponse.status}`)
    const brut = Buffer.from(await reponse.arrayBuffer())
    const keyed = await detourer(brut)
    const info = await sharp(keyed).trim({ threshold: 8 }).resize({ width: LARGEUR, withoutEnlargement: true }).webp({ quality: 88 }).toFile(cible)
    console.log(`${path.relative(RACINE, cible)}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} Ko`)
  }
}

const [commande, ...args] = process.argv.slice(2)
if (commande === 'liste') await liste(args[0], args[1])
else if (commande === 'recevoir') await recevoir(args[0])
else {
  console.error('usage : node scripts/fiches-illustrations.mjs liste [niveau] [matiere] | recevoir <liste.json>')
  process.exit(1)
}
