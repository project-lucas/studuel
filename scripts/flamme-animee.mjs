/**
 * Fabrique LA FLAMME ANIMÉE DE LA SÉRIE (04/10/2026, Lucas : « il faut
 * l'animer, afin que l'une d'elles puisse remplacer celle-là » — la flamme
 * Flaticon du bandeau et de la carte de série). La flamme des jours faits
 * (scripts/serie-jours.mjs) est animée par un modèle vidéo Higgsfield, la
 * flamme pour PREMIÈRE et DERNIÈRE image : la boucle se referme sans saut.
 *
 *   assets-sources/serie-jours/flamme-animee.mp4   (la vidéo, LOCALE — hors dépôt)
 *     → public/images/serie/flamme-v2.webp         WebP animé, fond transparent
 *     → public/images/serie/flamme-v2-fixe.webp    la première image (mouvement réduit)
 *
 *   node scripts/flamme-animee.mjs [--debut 0] [--duree 5] [--ips 20] [--cote 128]
 *
 * Chaque image est détourée (fond blanc, scripts/lib/fond-peint.mjs) puis
 * TOUTES sont recadrées sur la même boîte — l'union des flammes de la boucle —
 * pour que la flamme ne saute pas d'une image à l'autre. ffmpeg (libwebp_anim)
 * assemble le WebP animé.
 */
import sharp from 'sharp'
import { execFileSync } from 'node:child_process'
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const arg = (nom, defaut) => {
  const i = process.argv.indexOf(`--${nom}`)
  return i > 0 ? process.argv[i + 1] : defaut
}
const SOURCE = arg('source', 'assets-sources/serie-jours/flamme-animee.mp4')
const DEBUT = Number(arg('debut', '0'))
const DUREE = Number(arg('duree', '5'))
const IPS = Number(arg('ips', '20'))
const COTE = Number(arg('cote', '128'))
const SORTIE = arg('sortie', 'public/images/serie/flamme-v2')
const ALPHA = 8
const MARGE = 0.04
// Part minimale d'une tache gardée : 0 garde tout (les étincelles de la flamme d'or).
const PART_MIN = Number(arg('taches', '0.04'))

const tmp = join(tmpdir(), `flamme-${Date.now()}`)
const brutes = join(tmp, 'brutes')
const propres = join(tmp, 'propres')
await mkdir(brutes, { recursive: true })
await mkdir(propres, { recursive: true })

// 1. Les images de la vidéo.
execFileSync('ffmpeg', ['-loglevel', 'error', '-ss', String(DEBUT), '-t', String(DUREE), '-i', SOURCE,
  '-vf', `fps=${IPS}`, join(brutes, '%04d.png')])
const fichiers = (await readdir(brutes)).filter((f) => f.endsWith('.png')).sort()
if (fichiers.length === 0) throw new Error('aucune image extraite')

// 2. Détourage, et la boîte commune (l'union de toutes les flammes).
const detourees = []
let g = Infinity, h = Infinity, d = -1, b = -1
for (const f of fichiers) {
  const { data, info } = await sharp(await detourerFondPeint(join(brutes, f), { silencieux: true }))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  // Les poussières détachées (moins de 4 % de la plus grande tache) partent.
  detourees.push({ data: garderGrandesTaches(data, info.width, info.height, info.channels), info })
  const last = detourees.at(-1)
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (last.data[(y * info.width + x) * info.channels + 3] > ALPHA) {
        g = Math.min(g, x); d = Math.max(d, x); h = Math.min(h, y); b = Math.max(b, y)
      }
}
const l = d - g + 1
const ht = b - h + 1
const interieur = Math.round(COTE * (1 - 2 * MARGE))
const k = interieur / Math.max(l, ht)
const L = Math.round(l * k)
const H = Math.round(ht * k)

// 3. Chaque image au même cadrage, posée en bas (la flamme a un sol).
let i = 0
for (const { data, info } of detourees) {
  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .extract({ left: g, top: h, width: l, height: ht })
    .resize(L, H, { kernel: 'lanczos3' })
    .extend({
      top: COTE - H - Math.round(COTE * MARGE),
      bottom: Math.round(COTE * MARGE),
      left: Math.floor((COTE - L) / 2),
      right: Math.ceil((COTE - L) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(join(propres, `${String(++i).padStart(4, '0')}.png`))
}

// 4. Le WebP animé (boucle infinie) et l'image fixe.
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(IPS), '-i', join(propres, '%04d.png'),
  '-c:v', 'libwebp_anim', '-lossless', '0', '-q:v', String(arg('qualite', '75')), '-compression_level', '6', '-loop', '0',
  '-pix_fmt', 'yuva420p', `${SORTIE}.webp`])
await sharp(join(propres, '0001.png')).webp({ quality: 90, alphaQuality: 100 }).toFile(`${SORTIE}-fixe.webp`)
const poids = (await sharp(`${SORTIE}.webp`, { animated: true }).metadata())
console.log(`${SORTIE}.webp · ${fichiers.length} images à ${IPS} i/s · ${COTE}² · ${poids.pages} pages · ${Math.round((poids.size ?? 0) / 1024)} Ko`)
await writeFile(join(tmp, 'ok'), '1')
await rm(tmp, { recursive: true, force: true })

function garderGrandesTaches(data, w, hh, c) {
  const etiq = new Int32Array(w * hh)
  const tailles = [0]
  const pile = []
  for (let s = 0; s < w * hh; s++) {
    if (etiq[s] || data[s * c + 3] <= ALPHA) continue
    const e = tailles.length
    let n = 0
    etiq[s] = e
    pile.push(s)
    while (pile.length) {
      const p = pile.pop()
      n++
      const x = p % w
      const y = (p - x) / w
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx
        const ny = y + dy
        if (nx < 0 || ny < 0 || nx >= w || ny >= hh) continue
        const q = ny * w + nx
        if (etiq[q] || data[q * c + 3] <= ALPHA) continue
        etiq[q] = e
        pile.push(q)
      }
    }
    tailles.push(n)
  }
  const max = Math.max(...tailles)
  const out = Buffer.from(data)
  for (let p = 0; p < w * hh; p++) if (tailles[etiq[p]] < max * PART_MIN) out[p * c + 3] = 0
  return out
}
