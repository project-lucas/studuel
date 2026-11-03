/**
 * LES PROFS DU LORE (01/11/2026) — fabrique les trois images servies de chaque
 * boss à partir des sources peintes de `assets-sources/heros/boss/lore/` :
 *
 *   <source>-scene.png    (16:9, la scène du quotidien du prof)
 *     → public/images/boss/<base>-scene.webp   1024×576  (bannière des billets)
 *   <source>-pied.png     (9:16, le prof en pied dans son décor)
 *     → public/images/boss/<base>-pied.webp    720×1290  (apparition, combat)
 *   <source>-detoure.png  (le portrait en pied, fond retiré par Higgsfield)
 *     → public/images/boss/<base>.webp         768×768 RGBA (le buste)
 *
 *   node scripts/boss-profs.mjs
 *
 * Le buste ne garde que la plus grande tache opaque (le détourage laisse parfois
 * des élèves ou des débris), puis cadre la tête et le torse en carré. Les noms
 * `-prof` sont NEUFS : l'optimiseur d'images ressert l'ancien dessin sous une
 * ancienne adresse. Les bases suivent lib/bosses.ts (PORTRAITS_PIED).
 */
import sharp from 'sharp'

const SOURCES = 'assets-sources/heros/boss/lore'
const SORTIE = 'public/images/boss'

// Nom de la source → base servie. Une image REDESSINÉE prend une base neuve
// (-v2…) : l'optimiseur ressert l'ancien dessin sous l'ancienne adresse
// (01/11/2026 soir : huit boss repeints, anciennes sources dans lore/ancien-2026-11-01/).
const BOSS = {
  delta: 'delta-prof-v2',
  grammatork: 'grammatork-prof-v2',
  imperator: 'imperator-prof',
  atlas: 'atlas-prof-v4',
  bigben: 'bigben-prof-v2',
  eltoro: 'eltoro-prof',
  plasma: 'plasma-prof-v2',
  sylvarok: 'sylvarok-prof',
  glitch: 'glitch-prof',
  krach: 'krach-prof-v2',
  nova: 'nova-prof-v2',
  'coach-turbo': 'coach-turbo-prof-v2',
  'kaiser-fang': 'kaiser-fang-prof-v2',
  fiscus: 'fiscus-prof',
  proviseur: 'proviseur-prof',
  socratus: 'socratus-prof',
  mecatron: 'mecatron-prof',
}

// Décalage horizontal du buste, en fraction du côté (négatif = vers la gauche) :
// quand un attribut massif tire le centrage loin du visage (la carapace d'Atlas).
const DECALAGE_BUSTE = {}

const SEUIL_OPAQUE = 24

/** Le masque de la plus grande tache opaque (4-voisinage). */
function plusGrandeTache(alpha, w, h) {
  const etiquette = new Int32Array(w * h)
  const pile = new Int32Array(w * h)
  let meilleure = 0
  let tailleMax = 0
  let courante = 0
  for (let depart = 0; depart < w * h; depart++) {
    if (alpha[depart] < SEUIL_OPAQUE || etiquette[depart]) continue
    courante++
    let taille = 0
    let sommet = 0
    pile[sommet++] = depart
    etiquette[depart] = courante
    while (sommet) {
      const p = pile[--sommet]
      taille++
      const x = p % w
      const voisins = [x > 0 ? p - 1 : -1, x < w - 1 ? p + 1 : -1, p - w, p + w]
      for (const v of voisins) {
        if (v < 0 || v >= w * h || etiquette[v] || alpha[v] < SEUIL_OPAQUE) continue
        etiquette[v] = courante
        pile[sommet++] = v
      }
    }
    if (taille > tailleMax) {
      tailleMax = taille
      meilleure = courante
    }
  }
  return { etiquette, meilleure }
}

async function buste(source, destination, decalage = 0) {
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const alpha = new Uint8Array(w * h)
  for (let i = 0; i < w * h; i++) alpha[i] = data[i * 4 + 3]
  const { etiquette, meilleure } = plusGrandeTache(alpha, w, h)

  // Efface tout ce qui n'est pas le prof, et mesure sa boîte.
  let x0 = w, y0 = h, x1 = 0, y1 = 0
  for (let p = 0; p < w * h; p++) {
    if (etiquette[p] !== meilleure) {
      data[p * 4 + 3] = 0
      continue
    }
    const x = p % w
    const y = (p - x) / w
    if (x < x0) x0 = x
    if (x > x1) x1 = x
    if (y < y0) y0 = y
    if (y > y1) y1 = y
  }

  // La tête et le torse : un carré de 45 % de la hauteur du prof, centré sur
  // la masse du quart haut (la tête), un peu d'air au-dessus.
  const hauteur = y1 - y0
  const cote = Math.round(Math.max(hauteur * 0.45, (x1 - x0) * 0.6))
  let somme = 0
  let poids = 0
  const yTete = y0 + hauteur * 0.25
  for (let y = y0; y < yTete; y++) {
    for (let x = x0; x <= x1; x++) {
      if (etiquette[y * w + x] === meilleure) {
        somme += x
        poids++
      }
    }
  }
  const cx = poids ? somme / poids : (x0 + x1) / 2
  const gauche = Math.round(cx - cote / 2 + decalage * cote)
  const haut = Math.round(y0 - cote * 0.05)

  // Un carré qui peut déborder de l'image : on l'étend de transparent.
  const ext = {
    top: Math.max(0, -haut),
    left: Math.max(0, -gauche),
    bottom: Math.max(0, haut + cote - h),
    right: Math.max(0, gauche + cote - w),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  }
  const nettoye = await sharp(data, { raw: { width: w, height: h, channels: 4 } }).extend(ext).png().toBuffer()
  await sharp(nettoye)
    .extract({ left: gauche + ext.left, top: haut + ext.top, width: cote, height: cote })
    .resize(768, 768)
    .webp({ quality: 78, alphaQuality: 85 })
    .toFile(destination)
}

for (const [source, base] of Object.entries(BOSS)) {
  const scene = await sharp(`${SOURCES}/${source}-scene.png`)
    .resize(1024, 576, { fit: 'cover' })
    .webp({ quality: 80 })
    .toFile(`${SORTIE}/${base}-scene.webp`)
  const pied = await sharp(`${SOURCES}/${source}-pied.png`)
    .resize(720, 1290, { fit: 'cover', position: 'centre' })
    .webp({ quality: 74 })
    .toFile(`${SORTIE}/${base}-pied.webp`)
  await buste(`${SOURCES}/${source}-detoure.png`, `${SORTIE}/${base}.webp`, DECALAGE_BUSTE[source] ?? 0)
  console.log(`${base.padEnd(12)} scène ${Math.round(scene.size / 1024)} Ko · pied ${Math.round(pied.size / 1024)} Ko`)
}
