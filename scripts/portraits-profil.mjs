/**
 * Fabrique LES PORTRAITS DE JOUEUR — les blasons d'avatar que l'élève choisit à
 * l'onboarding (écran « Ton avatar ») et qui trônent sur sa carte de l'onglet
 * Moi :
 *   assets-sources/profil/<n>.png        (originaux 2000×2000, LOCAUX — hors dépôt)
 *     → public/images/profil/<n>.webp    (384×384, fond transparent)
 *
 *   node scripts/portraits-profil.mjs
 *
 * POURQUOI 384 PX. Le blason est affiché au plus grand à 120 px CSS (la carte
 * Moi) et à 84 px dans la grille de l'onboarding : 384 px couvre un écran à
 * densité triplée. Les originaux pèsent 1,2 Mo chacun ; la grille de
 * l'onboarding en charge treize d'un coup, ce qui ferait 15 Mo pour un écran
 * qu'on traverse en dix secondes. En WebP à 384 px, la même grille tient dans
 * quelques centaines de Ko.
 *
 * LA LISTE DES PORTRAITS SERVIS PAR L'APP vit dans lib/portraits.ts
 * (`PORTRAIT_KEYS`) : ce script convertit TOUT ce qu'il trouve dans le dossier
 * source, et signale ce qui manque d'un côté ou de l'autre, pour qu'un blason
 * ajouté ici sans être déclaré là-bas (ou l'inverse) ne passe pas inaperçu.
 */

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'assets-sources/profil'
const OUT = 'public/images/profil'
const SIZE = 384

const files = fs
  .readdirSync(SRC)
  .filter((f) => /^\d+\.png$/.test(f))
  .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))

fs.mkdirSync(OUT, { recursive: true })

for (const f of files) {
  const key = path.basename(f, '.png')
  const out = path.join(OUT, `${key}.webp`)
  const buf = await sharp(path.join(SRC, f))
    .resize(SIZE, SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 84, alphaQuality: 90, effort: 6 })
    .toBuffer()
  fs.writeFileSync(out, buf)
  console.log(`${f} → ${out} (${Math.round(buf.length / 1024)} Ko)`)
}

// Cohérence avec la liste déclarée côté app.
const declared = fs
  .readFileSync('lib/portraits.ts', 'utf8')
  .match(/PORTRAIT_KEYS\s*=\s*\[([^\]]*)\]/)?.[1]
  .match(/'(\d+)'/g)
  ?.map((s) => s.replace(/'/g, ''))
if (declared) {
  const made = new Set(files.map((f) => path.basename(f, '.png')))
  const missingFiles = declared.filter((k) => !made.has(k))
  const undeclared = [...made].filter((k) => !declared.includes(k))
  if (missingFiles.length)
    console.warn(`⚠️ déclarés dans lib/portraits.ts sans source : ${missingFiles.join(', ')}`)
  if (undeclared.length)
    console.warn(`⚠️ sources sans déclaration dans lib/portraits.ts : ${undeclared.join(', ')}`)
}
