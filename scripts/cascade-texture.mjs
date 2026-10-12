/**
 * Fabrique LES VOILES D'EAU de la cascade de l'arène vivante (12/10/2026,
 * Lucas : « il faut améliorer le rendu de la rivière qui coule ») :
 *
 *   → public/images/arene/vivante/cascade-eau.webp      (nappes larges et douces)
 *   → public/images/arene/vivante/cascade-filets.webp   (filets fins et brillants)
 *
 *   node scripts/cascade-texture.mjs
 *
 * Deux textures BLANCHES À ALPHA, 256 × 1024, que `ArenaVivante.module.css`
 * fait DESCENDRE en boucle dans la colonne de la cascade (deux copies
 * empilées, `translateY(-50%)` par passage : le raccord est invisible). Elles
 * sont TUILABLES VERTICALEMENT par construction : tout ce qui varie le long de
 * y est une somme de sinusoïdes d'un nombre ENTIER de périodes sur la hauteur
 * — pas de bruit à raccorder, pas de couture.
 *
 * Une nappe : une bande gaussienne autour d'une abscisse qui ondule un peu
 * (sinusoïde entière, donc périodique elle aussi), modulée le long de y pour
 * que l'eau paraisse s'épaissir et s'effiler. Les filets sont les mêmes bandes,
 * fines, et dont la modulation est creusée (puissance) : ils se cassent en
 * traits qui courent, comme les reflets d'une chute.
 *
 * Tiré au sort avec une graine fixe : le fichier est le même à chaque passage.
 */

import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const DEST_DIR = 'public/images/arene/vivante'
const W = 256
const H = 1024
const TAU = Math.PI * 2

/** mulberry32 : un générateur déterministe, pour une texture reproductible. */
function aleatoire(graine) {
  let a = graine >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Une texture : `nappes` bandes de largeur (sigma) entre `sigma[0]` et
 * `sigma[1]`, modulées le long de y par des harmoniques entre `k[0]` et
 * `k[1]`, la modulation creusée par `creux` (1 = douce, > 1 = cassée),
 * l'alpha plafonné à `alphaMax`.
 */
function texture({ nappes, sigma, k, creux, alphaMax, ondulation, graine }) {
  const tirer = aleatoire(graine)
  const entre = (a, b) => a + (b - a) * tirer()
  const bandes = Array.from({ length: nappes }, () => ({
    cx: tirer() * W,
    sigma: entre(sigma[0], sigma[1]),
    amplitude: entre(0.6, 1),
    // L'ondulation latérale : un nombre entier de périodes, donc tuilable.
    kx: Math.round(entre(1, 3)),
    phix: tirer() * TAU,
    // Trois harmoniques entières le long de y, à phases libres.
    harmoniques: Array.from({ length: 3 }, () => ({
      k: Math.round(entre(k[0], k[1])),
      a: entre(0.4, 1),
      phi: tirer() * TAU,
    })),
  }))

  const alpha = new Float32Array(W * H)
  for (const b of bandes) {
    const sommeA = b.harmoniques.reduce((s, h) => s + h.a, 0)
    for (let y = 0; y < H; y++) {
      const t = y / H
      let m = 0
      for (const h of b.harmoniques) m += h.a * Math.sin(TAU * (h.k * t) + h.phi)
      // Modulation entre 0 et 1, puis creusée.
      m = Math.pow(0.5 + (0.5 * m) / sommeA, creux)
      const cx = b.cx + ondulation * Math.sin(TAU * b.kx * t + b.phix)
      const deuxSigma2 = 2 * b.sigma * b.sigma
      for (let x = 0; x < W; x++) {
        // La bande se referme sur les bords horizontaux (le masque CSS fond
        // déjà les bords de la colonne, mais autant ne rien y mettre).
        let dx = x - cx
        if (dx > W / 2) dx -= W
        if (dx < -W / 2) dx += W
        alpha[y * W + x] += b.amplitude * m * Math.exp(-(dx * dx) / deuxSigma2)
      }
    }
  }

  const data = Buffer.alloc(W * H * 4)
  for (let i = 0; i < W * H; i++) {
    const a = Math.min(alphaMax, alpha[i])
    data[i * 4] = 255
    data[i * 4 + 1] = 255
    data[i * 4 + 2] = 255
    data[i * 4 + 3] = Math.round(a * 255)
  }
  return sharp(data, { raw: { width: W, height: H, channels: 4 } })
}

await mkdir(DEST_DIR, { recursive: true })

const TEXTURES = [
  {
    nom: 'cascade-eau',
    flou: 1.6,
    options: { nappes: 7, sigma: [12, 28], k: [1, 5], creux: 1, alphaMax: 0.62, ondulation: 6, graine: 20261012 },
  },
  {
    nom: 'cascade-filets',
    flou: 0.4,
    options: { nappes: 16, sigma: [1.2, 2.6], k: [3, 10], creux: 1.8, alphaMax: 0.95, ondulation: 3, graine: 1012 },
  },
]

for (const { nom, flou, options } of TEXTURES) {
  const dest = path.join(DEST_DIR, `${nom}.webp`)
  const info = await texture(options)
    .blur(flou)
    .webp({ quality: 80, alphaQuality: 90 })
    .toFile(dest)
  console.log(`${nom}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} Ko  →  ${dest}`)
}
