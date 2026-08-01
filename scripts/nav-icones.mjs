/**
 * Fabrique LES SIX icônes de la barre d'onglets, toutes sur la même trame, plus
 * le cadre de laurier qui entoure l'avatar :
 *   assets-sources/nav/*.png|webp               (originaux, LOCAUX)
 *   public/images/mascotte/reaction-bonne.webp  (pour Marcel)
 *     → public/images/nav/{amis,reviser,marcel,defi,moi,tresor}.webp  (256x256)
 *     → public/images/nav/cadre-avatar.webp                           (256x256)
 *
 *   node scripts/nav-icones.mjs
 *
 * POURQUOI CE SCRIPT EXISTE
 *
 * Les six dessins viennent de lots différents et n'occupaient pas leur canevas
 * de la même façon : Marcel remplissait 82 % de sa case quand Moi en remplissait
 * 96 %, et la surface d'encre allait du simple au tiers en plus. Posées côte à
 * côte dans la barre, elles semblaient de tailles différentes — ce qu'on lit
 * comme un bug d'alignement, pas comme un parti pris.
 *
 * La mise à taille perçue égale (trame façon keylines Material, puis correction
 * d'encre à moitié, puis plafond dur) vit dans scripts/lib/trame.mjs — elle sert
 * aussi aux vignettes de matières, qui souffraient du même mal. Le raisonnement
 * complet est là-bas ; ici on ne garde que ce qui est propre à la barre : d'où
 * viennent les dessins, comment Marcel est découpé, et comment le cadre de
 * laurier est évidé puis recentré sur son trou.
 */

import sharp from 'sharp'
import { access, mkdir } from 'node:fs/promises'
import { mesurer, echellePour, planDuLot } from './lib/trame.mjs'

const SRC_DIR = 'assets-sources/nav'
const DEST_DIR = 'public/images/nav'

/**
 * Les lots d'illustrations n'arrivent pas tous dans le même format : les
 * premiers étaient des webp, ceux d'août sont des PNG 4000x4000 sortis du
 * générateur. On cherche donc l'original par son NOM D'ONGLET, quelle que soit
 * son extension, plutôt que d'imposer un format au dessinateur.
 */
async function source(nom) {
  for (const ext of ['png', 'webp']) {
    const chemin = `${SRC_DIR}/${nom}.${ext}`
    try {
      await access(chemin)
      return chemin
    } catch {
      /* extension suivante */
    }
  }
  throw new Error(
    `Original introuvable : ${SRC_DIR}/${nom}.{png,webp}. ` +
      `Les originaux sont LOCAUX (assets-sources/ est dans .gitignore) — ` +
      `après un clone, il faut les redéposer avant de relancer ce script.`,
  )
}

/** 256 px = deux fois la taille servie, pour les écrans à densité doublée. */
const SIZE = 256

/**
 * Marcel n'est pas un objet, c'est QUELQU'UN — et son visage existe déjà,
 * peint, dans les réactions de quiz. Le recadrer plutôt que le redessiner est
 * ce qui garantit qu'on reconnaisse la tête vue partout ailleurs dans l'app.
 *
 * Source : la seule pose neutre de la série (bras croisés, sourire en coin).
 * Les autres célèbrent ou se désolent, or un onglet reste impassible.
 * Fenêtre mesurée sur la source 377x560 : la tête occupe x ∈ [55, 330] et
 * y ∈ [20, 300]. Elle est englobée en entier, MENTON COMPRIS — un menton
 * tranché se lit comme un bug à 32 px — et le col du tweed reste visible : c'est
 * lui qui dit « adulte » et non « élève ».
 *
 * Aucune marge n'est ajoutée ici : le cadrage donne la matière, c'est la trame
 * ci-dessous qui décide de la taille finale.
 */
const MARCEL = {
  src: 'public/images/mascotte/reaction-bonne.webp',
  crop: { left: 30, top: 18, width: 340, height: 340 },
}

/**
 * ÉVIDE LE CADRE : le disque intérieur de la couronne de laurier est PEINT en
 * blanc opaque, pas laissé transparent. Tel quel, le cadre posé sur l'avatar le
 * masquerait entièrement — on aurait une pastille blanche à la place du visage.
 *
 * On remplit donc depuis le centre, de proche en proche, tant que le pixel est
 * quasi blanc (les trois canaux au-dessus de BLANC_MIN). Le remplissage
 * s'arrête tout seul sur le trait marine du cerne intérieur, qui est sombre :
 * c'est la frontière naturelle du dessin, on n'a pas de rayon à mesurer ni à
 * tenir à jour si le dessinateur renvoie un cadre un peu différent.
 *
 * Le seuil est volontairement bas (200 et non 250) pour manger aussi le dégradé
 * d'anti-crénelage entre le blanc et le marine : sinon il resterait un liseré
 * clair d'un ou deux pixels, qui se lit comme un halo sale autour du visage.
 *
 * Renvoie le dessin évidé ET la géométrie du trou — c'est elle qui dira à quelle
 * taille l'avatar doit être posé dessous.
 */
const BLANC_MIN = 200

async function evider(chemin) {
  const { data, info } = await sharp(chemin)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const estBlanc = (p) => {
    const i = p * channels
    return (
      data[i + 3] > 128 &&
      data[i] > BLANC_MIN &&
      data[i + 1] > BLANC_MIN &&
      data[i + 2] > BLANC_MIN
    )
  }

  const depart = Math.floor(height / 2) * width + Math.floor(width / 2)
  if (!estBlanc(depart)) {
    throw new Error(
      `Le centre de ${chemin} n'est pas blanc : ce n'est pas un cadre à évider, ` +
        `ou le dessin a été recentré. Vérifier la source avant d'insister.`,
    )
  }

  const vus = new Uint8Array(width * height)
  const pile = [depart]
  vus[depart] = 1
  let x0 = width
  let y0 = height
  let x1 = -1
  let y1 = -1
  let aire = 0

  while (pile.length > 0) {
    const p = pile.pop()
    const x = p % width
    const y = (p - x) / width
    data[p * channels + 3] = 0
    aire++
    if (x < x0) x0 = x
    if (x > x1) x1 = x
    if (y < y0) y0 = y
    if (y > y1) y1 = y

    for (const q of [
      x + 1 < width ? p + 1 : -1,
      x > 0 ? p - 1 : -1,
      y + 1 < height ? p + width : -1,
      y > 0 ? p - width : -1,
    ]) {
      if (q < 0 || vus[q] || !estBlanc(q)) continue
      vus[q] = 1
      pile.push(q)
    }
  }

  return {
    buffer: await sharp(data, { raw: { width, height, channels } }).png().toBuffer(),
    // Le trou n'est pas parfaitement rond — le nœud du laurier mord dedans par
    // le bas, si bien que sa boîte englobante est une douzaine de pixels plus
    // haute que large. Son DIAMÈTRE se déduit donc de l'AIRE, seule mesure qui
    // ne dépende pas du côté qu'on choisit de regarder.
    trou: {
      cx: (x0 + x1) / 2,
      cy: (y0 + y1) / 2,
      diametre: 2 * Math.sqrt(aire / Math.PI),
    },
  }
}

await mkdir(DEST_DIR, { recursive: true })

// Le dessin détouré de chaque onglet, avant toute mise à l'échelle. Marcel est
// découpé à la volée, les cinq autres viennent des originaux locaux.
const marcelSrc = sharp(MARCEL.src)
const { width: mw, height: mh } = await marcelSrc.metadata()
if (
  MARCEL.crop.left + MARCEL.crop.width > mw ||
  MARCEL.crop.top + MARCEL.crop.height > mh
) {
  throw new Error(
    `Fenêtre hors source : ${MARCEL.src} fait ${mw}x${mh}. La source a changé ? ` +
      `Remesurer la tête avant de toucher à MARCEL.crop.`,
  )
}

const dessins = {
  marcel: await sharp(MARCEL.src)
    .extract(MARCEL.crop)
    .trim({ threshold: 2 })
    .png()
    .toBuffer(),
}
for (const nom of ['amis', 'reviser', 'defi', 'moi', 'tresor']) {
  dessins[nom] = await sharp(await source(nom))
    .trim({ threshold: 2 })
    .png()
    .toBuffer()
}

// Trame + correction d'encre pour les six d'un coup (scripts/lib/trame.mjs).
const { cible: encreCible, plan } = await planDuLot(dessins, SIZE)

for (const nom of Object.keys(plan).sort()) {
  const { width, height, encre } = plan[nom]

  await sharp(dessins[nom])
    .resize(width, height)
    .extend({
      // Centrage sur la boîte. Le reste (bas impair, droite impaire) part dans
      // le dernier pixel : invisible, mais il garantit un canevas exact.
      top: Math.floor((SIZE - height) / 2),
      bottom: Math.ceil((SIZE - height) / 2),
      left: Math.floor((SIZE - width) / 2),
      right: Math.ceil((SIZE - width) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .webp({ quality: 92 })
    .toFile(`${DEST_DIR}/${nom}.webp`)

  console.log(
    `${nom.padEnd(8)} ${String(width).padStart(3)}x${String(height).padEnd(3)}` +
      ` · encre ${String(Math.round(encre)).padStart(3)}` +
      ` (cible ${Math.round(encreCible)})`,
  )
}

/* ---------------------------------------------------------------------------
 * LE CADRE DE L'AVATAR
 *
 * L'onglet « Moi » ne porte pas un dessin mais le VISAGE de l'élève. La couronne
 * de laurier vient l'entourer : c'est le seul onglet dont le contenu change d'un
 * élève à l'autre, et le cadre est ce qui lui rend le poids graphique des cinq
 * autres — sans lui, un avatar nu au milieu d'objets peints fait tache.
 *
 * Il ne rejoint PAS la moyenne d'encre calculée plus haut : cette moyenne est
 * l'équilibre de la barre telle qu'elle s'affiche, et `moi` y représente déjà
 * cette case. Le cadre s'y AJUSTE (il est mesuré par la même trame et la même
 * correction) sans la déplacer.
 *
 * Et surtout : on le recentre sur SON TROU, pas sur sa boîte. Le laurier pèse
 * plus lourd en bas qu'en haut, si bien que le trou est légèrement au-dessus du
 * centre du dessin. Corriger ici, une fois, évite un décalage magique à
 * rattraper dans le CSS — l'avatar est simplement un disque centré.
 * ------------------------------------------------------------------------- */

const { buffer: cadreEvide, trou } = await evider(await source('avatar-cadre'))

// `trim` rogne la transparence extérieure : le trou, mesuré sur la source
// entière, se retrouve décalé. Sharp donne exactement de combien
// (`trimOffset*`, négatif), ce qui évite de supposer un rognage symétrique — il
// ne l'est pas, le laurier déborde plus bas que haut.
const { data: cadreRogne, info: infoRogne } = await sharp(cadreEvide)
  .trim({ threshold: 2 })
  .png()
  .toBuffer({ resolveWithObject: true })
const margeX = -infoRogne.trimOffsetLeft
const margeY = -infoRogne.trimOffsetTop
const boiteCadre = await mesurer(cadreEvide)

// Même trame et même correction que les six, mais visant LEUR cible : le cadre
// rejoint l'équilibre de la barre au lieu de le déplacer.
const echelleCadre = echellePour(boiteCadre, encreCible, SIZE)

const largeurCadre = Math.round(boiteCadre.width * echelleCadre)
const hauteurCadre = Math.round(boiteCadre.height * echelleCadre)

// Position du centre du trou une fois le cadre rogné puis mis à l'échelle.
const trouX = (trou.cx - margeX) * echelleCadre
const trouY = (trou.cy - margeY) * echelleCadre

const gauche = Math.round(SIZE / 2 - trouX)
const haut = Math.round(SIZE / 2 - trouY)
if (
  gauche < 0 ||
  haut < 0 ||
  gauche + largeurCadre > SIZE ||
  haut + hauteurCadre > SIZE
) {
  throw new Error(
    `Le cadre recentré sur son trou déborde du canevas ${SIZE}x${SIZE}. ` +
      `Le trou est probablement très excentré dans la source — remesurer avant ` +
      `de relâcher MAX_DIM.`,
  )
}

await sharp(cadreRogne)
  .resize(largeurCadre, hauteurCadre)
  .extend({
    top: haut,
    bottom: SIZE - hauteurCadre - haut,
    left: gauche,
    right: SIZE - largeurCadre - gauche,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .webp({ quality: 92 })
  .toFile(`${DEST_DIR}/cadre-avatar.webp`)

// La part du canevas occupée par le trou : c'est LA constante que le CSS doit
// connaître pour poser l'avatar dessous. On la rappelle ici plutôt que de la
// laisser se deviner — si le dessinateur renvoie un cadre au laurier plus épais,
// ce chiffre bouge et `--nav-cadre-trou` doit bouger avec lui.
const partTrou = (trou.diametre * echelleCadre) / SIZE
console.log(
  `\ncadre    ${largeurCadre}x${hauteurCadre} · trou ${Math.round(partTrou * 1000) / 10} %` +
    ` du canevas  →  --nav-cadre-trou dans globals.css`,
)
