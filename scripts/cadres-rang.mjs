// LES CADRES DE RANG AUTOUR DE L'AVATAR — un anneau fin par rang de ligue,
// façon League of Legends (15/10/2026, Lucas : « des cadres fins propres autour
// de l'avatar, qui habillent l'avatar ; il doit y avoir les rangs, div 1 2 3,
// puis silver… »). Six anneaux dessinés sur UNE planche Nano Banana 2.1 (le
// blason Or en référence, fond magenta), découpés ici, détourés par chroma-key
// et posés au MÊME cadrage : le trou de chaque anneau est cherché (remplissage
// depuis le centre de sa case) puis centré au même diamètre — d'un rang à
// l'autre, l'avatar ne bouge pas. La division (4, 3, 2, 1) s'écrit par l'app
// sur la plaque du bas.
//
// Puis CHAQUE DIVISION a son anneau (Lucas : « chaque bannière par rang,
// argent 1 2 3, différente du rang d'avant, un léger changement mais un
// changement quand même ») : une planche 2 × 2 par métal, l'anneau du métal en
// référence — IV l'anneau seul, III des rivets, II des lauriers, I des ailes et
// une gemme. Maître, sans division, reste celui de la planche des six.
//
//   node scripts/cadres-rang.mjs
//
// Sources : assets-sources/cadres-rang/planche-a.png (3 × 2 : bronze argent or /
// platine diamant maitre) et div-<rang>.png (2 × 2 : IV III / II I).
// Sortie : public/images/rangs/cadres/<rang>-<division>.webp et maitre.webp,
// 192 × 192, le trou centré au même diamètre (MARGE).

import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const RACINE = path.resolve(import.meta.dirname, '..')
const SOURCES = path.join(RACINE, 'assets-sources', 'cadres-rang')
const SORTIE = path.join(RACINE, 'public', 'images', 'rangs', 'cadres')

const METAUX = ['bronze', 'argent', 'or', 'platine', 'diamant']
const COTE = 192
/** Le carré de sortie fait 1,9 diamètre de trou : la couronne et les lauriers y tiennent. */
const MARGE = 1.9

function alphaMagenta(r, g, b) {
  const d = Math.sqrt(((255 - r) ** 2 + g ** 2 + (255 - b) ** 2) / 3) / 255
  return Math.min(1, Math.max(0, (d - 0.12) / 0.3))
}

async function decouper(source, colonnes, lignes, noms) {
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H, channels: C } = info
  const out = Buffer.alloc(data.length)
  const alpha = new Float32Array(W * H)
  for (let i = 0; i < W * H; i += 1) {
    const r = data[i * C], g = data[i * C + 1], b = data[i * C + 2]
    const a = alphaMagenta(r, g, b)
    alpha[i] = a
    if (a <= 0) continue
    const k = 1 - a
    out[i * C] = Math.min(255, Math.max(0, (r - k * 255) / a))
    out[i * C + 1] = Math.min(255, Math.max(0, g / a))
    out[i * C + 2] = Math.min(255, Math.max(0, (b - k * 255) / a))
    out[i * C + 3] = Math.round(a * 255)
  }

  const cw = Math.floor(W / colonnes)
  const ch = Math.floor(H / lignes)
  for (let k = 0; k < noms.length; k += 1) {
    if (!noms[k]) continue
    const x0 = (k % colonnes) * cw
    const y0 = Math.floor(k / colonnes) * ch
    // Le trou : remplissage des pixels transparents depuis le centre de la case.
    const vu = new Uint8Array(cw * ch)
    const pile = [[Math.floor(cw / 2), Math.floor(ch / 2)]]
    let minX = cw, maxX = 0, minY = ch, maxY = 0
    while (pile.length) {
      const [x, y] = pile.pop()
      if (x < 0 || y < 0 || x >= cw || y >= ch) continue
      const j = y * cw + x
      if (vu[j] || alpha[(y0 + y) * W + x0 + x] > 0.5) continue
      vu[j] = 1
      if (x < minX) minX = x
      if (x > maxX) maxX = x
      if (y < minY) minY = y
      if (y > maxY) maxY = y
      pile.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }
    const cx = x0 + (minX + maxX) / 2
    const cy = y0 + (minY + maxY) / 2
    const diam = (maxX - minX + maxY - minY) / 2
    const demi = Math.round((diam * MARGE) / 2)

    // La case seule (rien de la voisine), agrandie de vide pour cadrer le carré.
    const caseSeule = await sharp(out, { raw: { width: W, height: H, channels: C } })
      .extract({ left: x0, top: y0, width: cw, height: ch })
      .extend({ top: demi, bottom: demi, left: demi, right: demi, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .raw()
      .toBuffer()
    const fichier = path.join(SORTIE, `${noms[k]}.webp`)
    const res = await sharp(caseSeule, { raw: { width: cw + 2 * demi, height: ch + 2 * demi, channels: C } })
      .extract({ left: Math.round(cx - x0 - demi + demi), top: Math.round(cy - y0 - demi + demi), width: 2 * demi, height: 2 * demi })
      .resize(COTE, COTE)
      .webp({ quality: 82, alphaQuality: 90 })
      .toFile(fichier)
    console.log(`${noms[k]}  trou ${Math.round(diam)} px  centre (${Math.round(cx)}, ${Math.round(cy)})  ${Math.round(res.size / 1024)} Ko`)
  }
}

async function main() {
  await mkdir(SORTIE, { recursive: true })
  await decouper(path.join(SOURCES, 'planche-a.png'), 3, 2, [null, null, null, null, null, 'maitre'])
  for (const m of METAUX) {
    await decouper(path.join(SOURCES, `div-${m}.png`), 2, 2, [4, 3, 2, 1].map((d) => `${m}-${d}`))
  }
}

await main()
