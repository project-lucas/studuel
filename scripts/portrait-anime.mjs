/**
 * LE PERSONNAGE EN PIED QUI VIT (26/10/2026, Lucas : « je veux qu'il soit animé
 * pour de vrai, qu'il cligne des yeux, qu'il fasse des choses, bref que ce soit
 * vivant — tu avais réussi à le faire sur l'icône de la flamme qui danse »).
 *
 * La même recette que la flamme de série (scripts/flamme-animee.mjs) appliquée
 * à un portrait en pied (public/images/profil/pied/<clé>.webp) : le portrait,
 * posé sur un fond BLANC PUR en 9:16, est donné à un modèle vidéo Higgsfield
 * (FLUX 3 Video) comme PREMIÈRE et DERNIÈRE image — la boucle se referme sans
 * saut —, puis chaque image de la vidéo est détourée du fond blanc
 * (scripts/lib/fond-peint.mjs), toutes sont recadrées sur la même boîte (l'union
 * du personnage sur toute la boucle, pour qu'il ne saute pas), et ffmpeg
 * (libwebp_anim) assemble un WebP animé transparent.
 *
 *   assets-sources/profil-pied/anime/<clé>.mp4      (la vidéo, LOCALE — hors dépôt)
 *     → public/images/profil/pied/anime/<clé>.webp   le WebP animé, fond transparent
 *
 *   node scripts/portrait-anime.mjs --cle 2 [--source …] [--debut 0] [--duree 5]
 *        [--ips 12] [--hauteur 560] [--qualite 72] [--taches 0.01]
 *
 * L'image FIXE reste le portrait en pied d'origine (pied/<clé>.webp) : c'est lui
 * que la page sert sous mouvement réduit et quand le WebP animé manque. Le
 * personnage est posé EN BAS de sa boîte (il a un sol), centré.
 *
 * ffmpeg est installé par winget (Gyan.FFmpeg), dans le PATH de Git Bash.
 */
import sharp from 'sharp'
import { execFileSync } from 'node:child_process'
import { mkdir, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { detourerFondPeint } from './lib/fond-peint.mjs'

const arg = (nom, defaut) => {
  const i = process.argv.indexOf(`--${nom}`)
  return i > 0 ? process.argv[i + 1] : defaut
}
const CLE = arg('cle', '')
if (!/^\d+$/.test(CLE)) {
  console.error('usage : node scripts/portrait-anime.mjs --cle <clé de portrait>')
  process.exit(1)
}
const SOURCE = arg('source', `assets-sources/profil-pied/anime/${CLE}.mp4`)
const DEBUT = Number(arg('debut', '0'))
const DUREE = Number(arg('duree', '5'))
// LES RÉGLAGES PAR DÉFAUT SONT CEUX DU BUDGET (lib/public-poids.test.ts : aucun
// fichier servi au-dessus de 600 Ko). Mesuré sur le portrait 2, 5 s : ce qui
// pèse, c'est le NOMBRE D'IMAGES et la hauteur — la qualité couleur presque
// rien (q 25 ou q 60 : 900 Ko dans les deux cas à 560 px / 12 i/s). 10 i/s,
// 440 px, q 52, alpha 55 → 561 Ko ; 480 px → 596 Ko, sans marge.
const IPS = Number(arg('ips', '10'))
const HAUTEUR = Number(arg('hauteur', '440'))
const QUALITE = arg('qualite', '52')
/** Le réglage de l'encodeur WebP : `drawing` pour un dessin aux aplats cernés. */
const PRESET = arg('preset', 'drawing')
/** Qualité du canal alpha (le détourage) : 100 = sans perte, lourd pour rien sur un cerne net. */
const ALPHA_QUALITE = Number(arg('alpha', '55'))
/**
 * Débruitage TEMPOREL avant l'extraction (filtre ffmpeg) : le modèle vidéo
 * fait frémir chaque pixel d'une image à l'autre. Mesuré : il n'allège presque
 * rien (l'encodeur ne gagne pas sur un corps qui respire en entier), mais il
 * lisse le grain de la vidéo. `--denoise 0` pour s'en passer.
 */
const DENOISE = arg('denoise', 'hqdn3d=2:1.5:8:8')
const SORTIE = arg('sortie', `public/images/profil/pied/anime/${CLE}`)
const ALPHA = 8
/** Marge autour du personnage, en part de la hauteur. */
const MARGE = 0.02
/** Part minimale d'une tache gardée (les poussières du détourage partent). */
const PART_MIN = Number(arg('taches', '0.01'))
/** La dernière image = la première (image de fin) : on la saute, sinon la boucle marque un temps. */
const SAUTER_DERNIERE = arg('derniere', 'saute') === 'saute'

const tmp = join(tmpdir(), `portrait-anime-${CLE}-${Date.now()}`)
const brutes = join(tmp, 'brutes')
const propres = join(tmp, 'propres')
await mkdir(brutes, { recursive: true })
await mkdir(propres, { recursive: true })
await mkdir(SORTIE.replace(/[^/\\]+$/, ''), { recursive: true })

// 1. Les images de la vidéo.
execFileSync('ffmpeg', ['-loglevel', 'error', '-ss', String(DEBUT), '-t', String(DUREE), '-i', SOURCE,
  '-vf', `${DENOISE && DENOISE !== '0' ? `${DENOISE},` : ''}fps=${IPS}`, join(brutes, '%04d.png')])
let fichiers = (await readdir(brutes)).filter((f) => f.endsWith('.png')).sort()
if (fichiers.length === 0) throw new Error('aucune image extraite')
if (SAUTER_DERNIERE && fichiers.length > 2) fichiers = fichiers.slice(0, -1)

// 2. Détourage, et la boîte commune (l'union du personnage sur toute la boucle).
const detourees = []
let g = Infinity, h = Infinity, d = -1, b = -1
for (const f of fichiers) {
  const { data, info } = await sharp(await detourerFondPeint(join(brutes, f), { silencieux: true }))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const propre = garderGrandesTaches(data, info.width, info.height, info.channels)
  detourees.push({ data: propre, info })
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (propre[(y * info.width + x) * info.channels + 3] > ALPHA) {
        g = Math.min(g, x); d = Math.max(d, x); h = Math.min(h, y); b = Math.max(b, y)
      }
}
if (d < 0) throw new Error('rien de détouré : le fond n’est pas uni ?')
const l = d - g + 1
const ht = b - h + 1
const marge = Math.round(HAUTEUR * MARGE)
const interieur = HAUTEUR - 2 * marge
const k = interieur / ht
const L = Math.round(l * k)
const H = interieur
// Largeur paire (yuva420p l'exige), le personnage centré.
const LARGEUR = L + 2 * marge + ((L + 2 * marge) % 2)

// 3. Chaque image au même cadrage, posée en bas.
let i = 0
for (const { data, info } of detourees) {
  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .extract({ left: g, top: h, width: l, height: ht })
    .resize(L, H, { kernel: 'lanczos3' })
    .extend({
      top: HAUTEUR - H - marge,
      bottom: marge,
      left: Math.floor((LARGEUR - L) / 2),
      right: Math.ceil((LARGEUR - L) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(join(propres, `${String(++i).padStart(4, '0')}.png`))
}

// 4. Le WebP animé (boucle infinie) : ffmpeg assemble SANS PERTE, puis libvips
// (sharp) ré-encode en lossy avec `minSize` — il ne garde, d'une image à
// l'autre, que le rectangle qui change (le bras qui salue, les yeux), ce que
// l'encodeur de ffmpeg ne fait pas : trois fois moins lourd à qualité égale.
const sansPerte = join(tmp, 'sans-perte.webp')
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(IPS), '-i', join(propres, '%04d.png'),
  '-c:v', 'libwebp_anim', '-lossless', '1', '-compression_level', '4', '-loop', '0', sansPerte])
await sharp(sansPerte, { animated: true })
  .webp({ quality: Number(QUALITE), alphaQuality: ALPHA_QUALITE, effort: 6, minSize: true, loop: 0, preset: PRESET })
  .toFile(`${SORTIE}.webp`)
const meta = await sharp(`${SORTIE}.webp`, { animated: true }).metadata()
const poids = (await import('node:fs/promises')).stat(`${SORTIE}.webp`).then((s) => s.size)
console.log(
  `${SORTIE}.webp · ${fichiers.length} images à ${IPS} i/s · ${LARGEUR} × ${HAUTEUR} · ${meta.pages} pages · ${Math.round((await poids) / 1024)} Ko`,
)
// Windows garde un moment la main sur le fichier que sharp vient de lire.
await rm(tmp, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 }).catch(() => {})

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
