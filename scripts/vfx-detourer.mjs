// LE DÉTOURAGE D'UN EFFET (VFX) — fond NOIR pur → WebP à transparence.
//
// Les effets du combat des héros (boule de feu, explosion, nuée de lettres,
// éclat de coup critique) sortent de Higgsfield sur un noir pur. Une lueur ne
// se détoure pas à la couleur (elle n'a pas de bord) : on la détoure à la
// LUMIÈRE. L'opacité d'un pixel est sa composante la plus vive, et sa couleur
// est « dé-multipliée » (divisée par cette opacité) : posé sur n'importe quel
// fond en mode normal, l'effet rend ce qu'il rendait sur le noir en mode
// « écran » — sans `mix-blend-mode`, qui coûterait un calque de composition à
// chaque image.
//
//   node scripts/vfx-detourer.mjs <source> <sortie.webp> [--cote=512] [--qualite=86]
//
// Le résultat est recadré au plus juste (marge de 8 px) et ramené à `cote` px
// sur son plus grand côté.
import sharp from 'sharp'
import fs from 'node:fs'

const args = process.argv.slice(2)
const [source, sortie] = args.filter((a) => !a.startsWith('--'))
const cote = Number((args.find((a) => a.startsWith('--cote=')) ?? '--cote=512').slice(7))
const qualite = Number((args.find((a) => a.startsWith('--qualite=')) ?? '--qualite=86').slice(10))
if (!source || !sortie) {
  console.error('usage : node scripts/vfx-detourer.mjs <source> <sortie.webp> [--cote=512]')
  process.exit(1)
}

/** Sous ce seuil (sur 255), le pixel est du noir de fond : transparent. */
const NOIR = 10
const MARGE = 8

const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height } = info
const out = Buffer.alloc(width * height * 4)
let x0 = width
let x1 = 0
let y0 = height
let y1 = 0
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 3
    const o = (y * width + x) * 4
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const m = Math.max(r, g, b)
    if (m <= NOIR) continue
    // Le seuil retranché puis l'échelle rétablie : le fond qui n'est pas
    // tout à fait noir (bruit de compression) ne laisse pas de voile.
    const a = Math.min(1, (m - NOIR) / (255 - NOIR))
    out[o] = Math.min(255, Math.round(r / (m / 255)))
    out[o + 1] = Math.min(255, Math.round(g / (m / 255)))
    out[o + 2] = Math.min(255, Math.round(b / (m / 255)))
    out[o + 3] = Math.round(a * 255)
    if (out[o + 3] > 16) {
      if (x < x0) x0 = x
      if (x > x1) x1 = x
      if (y < y0) y0 = y
      if (y > y1) y1 = y
    }
  }
}
if (x1 < x0) {
  console.error('Rien de visible : la source est-elle sur fond noir ?')
  process.exit(1)
}
const left = Math.max(0, x0 - MARGE)
const top = Math.max(0, y0 - MARGE)
const w = Math.min(width, x1 + MARGE + 1) - left
const h = Math.min(height, y1 + MARGE + 1) - top
await sharp(out, { raw: { width, height, channels: 4 } })
  .extract({ left, top, width: w, height: h })
  .resize({ width: w >= h ? Math.min(cote, w) : undefined, height: h > w ? Math.min(cote, h) : undefined })
  .webp({ quality: qualite, alphaQuality: 90, effort: 6 })
  .toFile(sortie)
console.log(`${sortie} — ${w}×${h} → ${Math.round(fs.statSync(sortie).size / 1024)} Ko`)
