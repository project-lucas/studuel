// LE DÉTOURAGE D'UNE PLANCHE DE HÉROS — fond vert plein (#00FF00) → poses
// séparées, détourées, en WebP à transparence.
//
// Les planches sortent de Google Flow (Nano Banana Pro) : un héros, deux ou
// trois poses côte à côte sur un vert pur. Le vert ne se trouve ni dans
// l'armure, ni dans le surcot, ni dans la croix rouge du Templier : c'est la
// couleur de clé la plus sûre pour cette palette.
//
//   node scripts/heros-detourer.mjs <planche> <dossier> <nom1> [nom2] [nom3] [--cle=magenta] [--hauteur=720] [--qualite=88]
//
// --cle=magenta (02/11/2026) : fond MAGENTA pur (#FF00FF) pour les personnages
// qui portent du vert — le Mage de feu, les orcs, le troll, Grammatork.
//
// Chaque pose est repérée comme une tache connexe, isolée de ses voisines,
// recadrée au plus juste, ramenée à HAUTEUR px de haut.
import sharp from 'sharp'
import path from 'node:path'
import fs from 'node:fs'

const args = process.argv.slice(2)
const CLE = (args.find((a) => a.startsWith("--cle=")) ?? "--cle=vert").slice(6)
const [planche, dossier, ...noms] = args.filter((a) => !a.startsWith("--"))
if (!planche || !dossier || noms.length === 0) {
  console.error('usage : node scripts/heros-detourer.mjs <planche> <dossier> <nom1> [nom2] [nom3]')
  process.exit(1)
}

const option = (nom, defaut) => Number((args.find((a) => a.startsWith(`--${nom}=`)) ?? `=${defaut}`).split("=")[1])
const HAUTEUR = option("hauteur", 720)
const QUALITE = option("qualite", 88)
const MARGE = 12
// Écart de vert (g − max(r, b)) : au-dessus de PLEIN, c'est du fond ; entre
// BORD et PLEIN, un bord adouci (antialiasing du dessin).
const PLEIN = 90
const BORD = 28

const { data, info } = await sharp(planche).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width, height } = info
const px = Buffer.from(data)

for (let i = 0; i < px.length; i += 4) {
  const r = px[i]
  const g = px[i + 1]
  const b = px[i + 2]
  const ecart = CLE === "magenta" ? Math.min(r, b) - g : g - Math.max(r, b)
  if (ecart >= PLEIN) {
    px[i + 3] = 0
    continue
  }
  if (ecart > BORD) {
    px[i + 3] = Math.round(255 * (1 - (ecart - BORD) / (PLEIN - BORD)))
  }
  // Dévertissage : un reflet vert sur l'acier redevient gris (au magenta : le
  // rose des bords redescend vers le vert de la même tache).
  if (ecart > 0) {
    if (CLE === "magenta") {
      px[i] = r - ecart
      px[i + 2] = b - ecart
    } else px[i + 1] = Math.max(r, b)
  }
}

// Les poses = les plus grandes taches connexes (sur une grille réduite, CASE
// px de côté) : une épée peut dépasser au-dessus de la pose voisine, une
// colonne vide n'existe pas toujours. Les petites taches (étoiles du K.O.,
// éclats de lumière) rejoignent la pose la plus proche.
const CASE = 4
const gw = Math.ceil(width / CASE)
const gh = Math.ceil(height / CASE)
const plein = new Uint8Array(gw * gh)
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (px[(y * width + x) * 4 + 3] > 128) plein[Math.floor(y / CASE) * gw + Math.floor(x / CASE)] = 1
  }
}
const etiquette = new Int32Array(gw * gh).fill(-1)
const taches = []
for (let i = 0; i < plein.length; i++) {
  if (!plein[i] || etiquette[i] >= 0) continue
  const id = taches.length
  const pile = [i]
  etiquette[i] = id
  let n = 0
  let sx = 0
  let sy = 0
  while (pile.length) {
    const c = pile.pop()
    const cx = c % gw
    const cy = (c - cx) / gw
    n++
    sx += cx
    sy += cy
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx
      const ny = cy + dy
      if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue
      const v = ny * gw + nx
      if (plein[v] && etiquette[v] < 0) {
        etiquette[v] = id
        pile.push(v)
      }
    }
  }
  taches.push({ id, n, cx: sx / n, cy: sy / n })
}
const grandes = [...taches]
  .sort((a, b) => b.n - a.n)
  .slice(0, noms.length)
  .sort((a, b) => a.cx - b.cx)
if (grandes.length < noms.length) {
  console.error(`${grandes.length} pose(s) trouvée(s) pour ${noms.length} nom(s)`)
  process.exit(1)
}
// À quelle pose appartient chaque tache.
const poseDe = new Map()
// Les poussières (quelques cases : un reste de lettre, un point de bord) ne
// rejoignent personne : elles s'effacent.
const POUSSIERE = 12
for (const t of taches) {
  if (t.n <= POUSSIERE && !grandes.includes(t)) continue
  let meilleure = 0
  let dist = Infinity
  grandes.forEach((g, k) => {
    const d = (g.cx - t.cx) ** 2 + (g.cy - t.cy) ** 2
    if (d < dist) {
      dist = d
      meilleure = k
    }
  })
  poseDe.set(t.id, meilleure)
}

fs.mkdirSync(dossier, { recursive: true })
for (const [k, nom] of noms.entries()) {
  // La pose seule : ce qui n'est pas à elle (la pointe d'une épée voisine) s'efface.
  const seule = Buffer.from(px)
  let x0 = width
  let x1 = 0
  let y0 = height
  let y1 = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      if (seule[i + 3] === 0) continue
      const gx = Math.floor(x / CASE)
      const gy = Math.floor(y / CASE)
      // La case, ou une voisine (bords adoucis hors de la grille pleine).
      let a = -1
      for (let dy = -1; dy <= 1 && a < 0; dy++) {
        for (let dx = -1; dx <= 1 && a < 0; dx++) {
          const nx = gx + dx
          const ny = gy + dy
          if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue
          const e = etiquette[ny * gw + nx]
          if (e >= 0) a = e
        }
      }
      if (a < 0 || poseDe.get(a) !== k) {
        seule[i + 3] = 0
        continue
      }
      if (seule[i + 3] > 24) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  const left = Math.max(0, x0 - MARGE)
  const top = Math.max(0, y0 - MARGE)
  const w = Math.min(width, x1 + MARGE) - left
  const h = Math.min(height, y1 + MARGE) - top
  const sortie = path.join(dossier, `${nom}.webp`)
  await sharp(seule, { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: w, height: h })
    .resize({ height: Math.min(HAUTEUR, h) })
    .webp({ quality: QUALITE, alphaQuality: 90, effort: 6 })
    .toFile(sortie)
  const { size } = fs.statSync(sortie)
  console.log(`${sortie} — ${w}×${h} → ${Math.round(size / 1024)} Ko`)
}
