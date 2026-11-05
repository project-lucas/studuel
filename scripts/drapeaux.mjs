// LES DRAPEAUX DE « CAPITALES DU MONDE » (05/11/2026).
//
// Le jeu écrivait le drapeau en EMOJI devant la question ; Windows n'a pas
// d'emoji de drapeau et affichait deux lettres (« MG Quelle est la capitale
// de Madagascar ? »). Le drapeau devient une IMAGE, la même sur tous les
// appareils : chaque pays de `lib/jeux/capitales.ts` reçoit
// `public/images/drapeaux/<code>.webp` (320 × 240, rendu à 160 × 120).
//
// Source : flag-icons (licence MIT, crédité dans /mentions-legales), dossier
// `flags/4x3`. Le paquet n'est pas une dépendance de l'app :
//
//   npm pack flag-icons@7.6.0 && tar -xzf flag-icons-7.6.0.tgz
//   node scripts/drapeaux.mjs <chemin>/package
//
// La liste des pays est LUE dans capitales.ts (les paires d'indicateurs
// régionaux de chaque `flag`) : un pays ajouté là demande seulement de
// rejouer ce script.

import { readFile, mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const LARGEUR = 320
const HAUTEUR = 240

const source = process.argv[2]
if (!source) {
  console.error('Usage : node scripts/drapeaux.mjs <dossier du paquet flag-icons>')
  process.exit(1)
}

const racine = path.resolve(import.meta.dirname, '..')
const capitales = await readFile(path.join(racine, 'lib/jeux/capitales.ts'), 'utf8')

const INDICATEUR_A = 0x1f1e6
const codes = [...capitales.matchAll(/flag: '([^']+)'/g)].map(([, emoji]) =>
  [...emoji].map((c) => String.fromCharCode(c.codePointAt(0) - INDICATEUR_A + 97)).join(''),
)
if (codes.length === 0) {
  console.error('Aucun drapeau trouvé dans lib/jeux/capitales.ts')
  process.exit(1)
}

const sortie = path.join(racine, 'public/images/drapeaux')
await mkdir(sortie, { recursive: true })

let total = 0
for (const code of codes) {
  const svg = path.join(source, 'flags/4x3', `${code}.svg`)
  const cible = path.join(sortie, `${code}.webp`)
  await sharp(svg, { density: 300 })
    .resize(LARGEUR, HAUTEUR, { fit: 'fill' })
    .webp({ quality: 88 })
    .toFile(cible)
  total += (await stat(cible)).size
}

console.log(`${codes.length} drapeaux écrits dans public/images/drapeaux (${Math.round(total / 1024)} Ko)`)
