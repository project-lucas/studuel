/**
 * LA TRAME — mettre un lot de dessins à taille PERÇUE égale.
 *
 * Écrit pour la barre d'onglets (scripts/nav-icones.mjs), repris tel quel pour
 * les vignettes de matières (scripts/vignettes-matieres.mjs) : le problème est
 * le même à chaque lot d'illustrations commandé en plusieurs fois. Les dessins
 * n'occupent pas leur canevas de la même façon, et posés côte à côte ils
 * semblent de tailles différentes — ce qu'on lit comme un bug d'alignement, pas
 * comme un parti pris.
 *
 * On ne peut pas régler ça en égalisant les boîtes : l'œil ne compare pas des
 * rectangles, il compare des TACHES. Un dessin large et dense pèse bien plus
 * lourd qu'un dessin ajouré à boîte égale. D'où deux corrections successives,
 * dans cet ordre.
 *
 * 1. LA TRAME (d'après les keylines de Material) : un dessin ne reçoit pas la
 *    même taille selon sa forme. Un carré posé dans un cercle imaginaire déborde
 *    moins qu'un rectangle allongé, donc un carré doit rester PLUS PETIT que la
 *    plus grande dimension d'un rectangle pour paraître de même taille. On
 *    classe donc par proportion et on donne à chaque classe sa cote.
 *
 * 2. LA CORRECTION D'ENCRE, à moitié. Après la trame, on mesure la surface
 *    réellement opaque et on rapproche chacun de la moyenne du lot — mais
 *    seulement à mi-chemin (racine carrée du rapport). Corriger à fond ferait
 *    enfler les dessins ajourés jusqu'à crever la case ; ne pas corriger du tout
 *    laisserait le dessin dense écraser ses voisins. La demi-mesure tient les
 *    deux bouts.
 *
 * Enfin un plafond dur : rien ne dépasse `maxDim`, sinon un dessin très allongé
 * toucherait le bord de sa case et donnerait l'impression de déborder.
 *
 * La cible d'encre est la MOYENNE DU LOT, jamais une valeur inventée : on
 * resserre les dessins les uns sur les autres. Un lot qui change de composition
 * change donc de cible — c'est voulu, l'équilibre est celui de la planche telle
 * qu'elle s'affiche.
 */

import sharp from 'sharp'

/**
 * Réglages par défaut, mesurés à l'œil sur la planche des six onglets. Un lot
 * au dessin très différent peut les surcharger — mais commencer par les
 * reprendre tels quels évite de re-régler six curseurs à chaque fois.
 */
export const REGLAGES = {
  /** Cote du grand côté d'un dessin plus large que haut, en fraction du canevas. */
  keylineLarge: 0.92,
  /** Cote de la hauteur d'un dessin plus haut que large. */
  keylineHaute: 0.92,
  /** Cote du grand côté d'un dessin ~carré : plus courte, cf. keylines Material. */
  keylineCarre: 0.79,
  /** Frontière « large », en proportion largeur/hauteur. */
  ratioLarge: 1.15,
  /** Frontière « haute », en proportion largeur/hauteur. */
  ratioHaute: 0.87,
  /** 0 = trame seule, 1 = surfaces d'encre strictement égales, 0.5 = à moitié. */
  inkCorrection: 0.5,
  /** Plafond dur du grand côté, en fraction du canevas. */
  maxDim: 0.94,
}

/** Boîte du dessin (hors transparence) et surface réellement opaque. */
export async function mesurer(buffer) {
  const { data, info } = await sharp(buffer)
    .trim({ threshold: 2 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  let ink = 0
  for (let i = 3; i < data.length; i += 4) if (data[i] > 128) ink++

  return { width: info.width, height: info.height, ink }
}

/** Facteur d'échelle donné par la trame seule (avant correction d'encre). */
export function echelleTrame(boite, size, reglages = REGLAGES) {
  const ratio = boite.width / boite.height
  if (ratio > reglages.ratioLarge) return (size * reglages.keylineLarge) / boite.width
  if (ratio < reglages.ratioHaute) return (size * reglages.keylineHaute) / boite.height
  return (size * reglages.keylineCarre) / Math.max(boite.width, boite.height)
}

/**
 * Échelle finale d'UN dessin visant une cible d'encre déjà connue : trame,
 * correction d'encre à moitié, puis plafond dur. Sert aux dessins qui
 * REJOIGNENT un lot sans devoir en déplacer l'équilibre (le cadre de l'avatar).
 */
export function echellePour(boite, cible, size, reglages = REGLAGES) {
  const trame = echelleTrame(boite, size, reglages)
  const correction = (cible / (Math.sqrt(boite.ink) * trame)) ** reglages.inkCorrection
  let echelle = trame * correction

  const grandCote = Math.max(boite.width, boite.height) * echelle
  const plafond = size * reglages.maxDim
  if (grandCote > plafond) echelle *= plafond / grandCote

  return echelle
}

/**
 * Le plan de mise à l'échelle de TOUT un lot : mesure chaque dessin, calcule la
 * cible d'encre commune (la moyenne du lot), puis l'échelle de chacun.
 *
 * @param dessins  { nom: Buffer } — dessins déjà détourés
 * @returns { cible, plan: { nom: { boite, echelle, width, height, encre } } }
 */
export async function planDuLot(dessins, size, reglages = REGLAGES) {
  const boites = {}
  for (const [nom, buffer] of Object.entries(dessins)) {
    boites[nom] = await mesurer(buffer)
  }

  const noms = Object.keys(boites)
  const cible =
    noms.reduce(
      (somme, nom) =>
        somme + Math.sqrt(boites[nom].ink) * echelleTrame(boites[nom], size, reglages),
      0,
    ) / noms.length

  const plan = {}
  for (const nom of noms) {
    const boite = boites[nom]
    const echelle = echellePour(boite, cible, size, reglages)
    plan[nom] = {
      boite,
      echelle,
      width: Math.round(boite.width * echelle),
      height: Math.round(boite.height * echelle),
      encre: Math.sqrt(boite.ink) * echelle,
    }
  }

  return { cible, plan }
}
