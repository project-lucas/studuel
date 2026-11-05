/**
 * LA FENÊTRE VIVANTE — le fond de l'arène vu depuis la fenêtre de la chambre.
 *
 * Une seule peinture (l'école vue d'en haut, encadrée par l'arche de pierre et
 * son lierre) découpée en PLANS, pour qu'elle ait de la profondeur :
 *
 *   1. LA VUE, au fond : une plaque fixe et nette, où seules les zones qui
 *      vivent (élèves de la cour, duel, pont, dragon, chouette, moulin) sont
 *      prises à une vidéo en boucle ; par-dessus, la vie légère en CSS (nuages
 *      qui dérivent, oiseaux, éclats de la rivière, cascade, fumée) ;
 *   2. LE CADRE, au milieu : la pierre et le lierre détourés, immobiles, avec
 *      l'ombre du mur cuite dans l'image ;
 *   3. LE PROCHE, devant : le rai de lumière et la poussière qui flotte.
 *
 * LA VUE EST FIXE (Lucas, 05/11/2026). Une première version la faisait glisser
 * lentement sous le cadre et suivre la souris ou l'inclinaison du téléphone :
 * il l'a lue comme une image qui tremble (« ce n'est pas fixe, on dirait »).
 * La profondeur vient de ce qui vit DANS la vue et devant elle, jamais d'un
 * déplacement de l'image entière. Ne pas remettre de dérive ni de parallaxe.
 *
 * Ce module ne porte que la GÉOMÉTRIE et les données, pures et testées. Le
 * rendu est dans components/defi/FenetreVivante.tsx et son module CSS ; les
 * images viennent du pipeline décrit dans docs/journal/arene.md.
 *
 * TOUT EST EN PIXELS DE PLANCHE (768 × 1376, la peinture d'origine).
 */

export const FENETRE = {
  largeur: 768,
  hauteur: 1376,
  /** L'ouverture de l'arche : ce qu'on voit de la vue quand rien ne bouge. */
  ouverture: { gauche: 68, droite: 700, sommet: 112, appui: 1137 },
  /** Le haut du linteau : la ligne qui se cale sous le bandeau du haut. */
  linteau: 20,
  /** La boîte de la vue (vidéo, affiche) : l'ouverture et 28 px cachés sous la pierre. */
  vue: { x: 40, y: 84, l: 688, h: 1080 },
} as const

// « -2 » : la vue SANS la chouette, devenue un personnage qui vole (HIBOU).
// Une image redessinée se sert sous une nouvelle adresse : le navigateur
// resservirait l'ancienne, et l'on verrait deux chouettes.
export const FICHIERS_FENETRE = {
  affiche: '/images/arene/fenetre/vue-jour-2.webp',
  video: '/images/arene/fenetre/vue-jour-2.mp4',
  cadre: '/images/arene/fenetre/cadre.webp',
} as const

/** Un rectangle de la planche, en pourcentages de la planche (pour le CSS). */
export function enPourcentDePlanche(zone: { x: number; y: number; l: number; h: number }) {
  return {
    left: `${(zone.x / FENETRE.largeur) * 100}%`,
    top: `${(zone.y / FENETRE.hauteur) * 100}%`,
    width: `${(zone.l / FENETRE.largeur) * 100}%`,
    height: `${(zone.h / FENETRE.hauteur) * 100}%`,
  }
}

// --- Quand jouer la vidéo ----------------------------------------------------

/**
 * La vidéo de la vue (≈ 1,7 Mo) ne se charge que si elle a un sens : pas en
 * « mouvement réduit », pas en économie de données, pas sur un réseau lent.
 * Sans elle, l'affiche (la même image, fixe) reste — et la vie légère en CSS
 * continue, sauf en mouvement réduit.
 */
export function doitJouerLaVideo(c: {
  mouvementReduit: boolean
  economieDeDonnees: boolean
  /** `navigator.connection.effectiveType`, quand le navigateur le donne. */
  reseau?: string
}) {
  if (c.mouvementReduit || c.economieDeDonnees) return false
  return c.reseau !== 'slow-2g' && c.reseau !== '2g'
}

// --- La vie légère, posée sur la vue (pourcentages de la VUE) ----------------

export type Nuage = {
  src: string
  /** Largeur en % de la vue, et rapport hauteur / largeur de l'image. */
  largeur: number
  rapport: number
  /** Haut du couloir, en % de la vue. */
  haut: number
  /** Durée d'une traversée (s) et avance prise au départ (s, négative). */
  duree: number
  retard: number
  /** Retourné : le même dessin se lit comme un autre nuage. */
  miroir?: boolean
}

/**
 * Trois nuages peints dans le style du ciel, qui traversent l'ouverture de
 * gauche à droite. Les deux grands partagent un couloir et une vitesse, à une
 * demi-traversée d'écart : ils ne se rattrapent jamais.
 */
export const NUAGES: readonly Nuage[] = [
  { src: '/images/arene/fenetre/nuage-1.webp', largeur: 34, rapport: 257 / 640, haut: 12, duree: 170, retard: -20 },
  { src: '/images/arene/fenetre/nuage-2.webp', largeur: 19, rapport: 275 / 400, haut: 13.5, duree: 170, retard: -105, miroir: true },
  { src: '/images/arene/fenetre/nuage-3.webp', largeur: 13, rapport: 222 / 260, haut: 4.5, duree: 120, retard: -52 },
]

export type Eclat = { x: number; y: number; taille: number; duree: number; retard: number }

/** Les éclats de soleil sur la rivière (taille en % de la largeur de la vue). */
export const ECLATS: readonly Eclat[] = [
  { x: 63, y: 67.2, taille: 1.5, duree: 2.6, retard: 0 },
  { x: 68.5, y: 69, taille: 1.2, duree: 3.4, retard: -1.1 },
  { x: 73.5, y: 65.8, taille: 1.6, duree: 2.9, retard: -2.0 },
  { x: 83, y: 66.5, taille: 1.3, duree: 3.1, retard: -0.6 },
  { x: 88, y: 69, taille: 1.7, duree: 2.4, retard: -1.7 },
  { x: 94, y: 66.8, taille: 1.2, duree: 3.6, retard: -2.6 },
  { x: 45.5, y: 55.2, taille: 1.1, duree: 3.0, retard: -0.9 },
  { x: 42, y: 58.2, taille: 1.3, duree: 2.7, retard: -2.2 },
  { x: 52.5, y: 61.5, taille: 1.2, duree: 3.3, retard: -1.4 },
  { x: 56.5, y: 62.4, taille: 1.0, duree: 2.5, retard: -0.3 },
]

/** La cascade : la boîte où glissent les filets blancs, et l'écume à son pied. */
export const CASCADE = {
  boite: { x: 39.7, y: 45.4, l: 3.5, h: 6.1 },
  ecume: { x: 41.6, y: 51.6, taille: 4.2 },
} as const

/** La cheminée du village : d'où montent les volutes. */
export const FUMEE = { x: 61.4, y: 52.3, taille: 1.9 } as const

/** Le vol d'oiseaux qui traverse le ciel : place de chacun dans la bande (%). */
export const OISEAUX: readonly { x: number; y: number; retard: number }[] = [
  { x: 6, y: 40, retard: 0 },
  { x: 3.4, y: 18, retard: -0.21 },
  { x: 3.1, y: 66, retard: -0.34 },
  { x: 0.6, y: 2, retard: -0.12 },
  { x: 0.2, y: 88, retard: -0.42 },
]

/**
 * LA CHOUETTE AU COURRIER (Lucas, 05/11/2026 : « dommage que le hibou ne bouge
 * pas plus »). Elle était peinte dans le ciel et battait des ailes sur place,
 * dans la vidéo. Elle est maintenant un PERSONNAGE : effacée de la vue,
 * détourée pose par pose dans la prise vidéo (16 poses, un battement complet),
 * et elle fait sa tournée, une boucle de 44 s où on la voit presque tout le
 * temps : elle part de sa place, traverse le ciel vers la gauche sous le
 * dragon, file derrière le lierre (sa seule sortie, deux secondes), revient
 * par la gauche, monte au milieu du ciel, plane en haut devant les nuages et
 * redescend se poser. Une première tournée la cachait derrière l'arche la
 * moitié du temps : ne pas rallonger ses sorties. Le trajet est écrit en
 * images-clés dans le module CSS (`hibou-x`, `hibou-y`, `hibou-allure`),
 * valeurs littérales.
 */
export const HIBOU = {
  src: '/images/arene/fenetre/hibou.webp',
  /** Le nombre de poses de la bande, une case par pose. */
  poses: 16,
  /** La case d'une pose, en pixels de la bande. */
  caseL: 138,
  caseH: 104,
  /** La largeur d'une case en % de la vue (138 px sur les 974 de la boucle). */
  largeur: 14.17,
  /** Là où elle était peinte — le centre de sa case, en % de la vue. */
  repos: { x: 74.7, y: 31.5 },
  /** Durée d'un battement d'ailes complet (s). */
  battement: 1.1,
} as const

// --- Le plan proche (pourcentages de la PLANCHE) -----------------------------

export type Poussiere = {
  x: number
  y: number
  /** Diamètre en pixels de planche. */
  taille: number
  duree: number
  retard: number
  /** Laquelle des trois trajectoires du module CSS. */
  trajet: 1 | 2 | 3
}

/** La poussière dorée, surtout dans le rai de lumière qui descend de la gauche. */
export const POUSSIERES: readonly Poussiere[] = [
  { x: 16, y: 22, taille: 11, duree: 13, retard: 0, trajet: 1 },
  { x: 27, y: 31, taille: 8, duree: 16, retard: -4, trajet: 2 },
  { x: 38, y: 40, taille: 12, duree: 12, retard: -7, trajet: 3 },
  { x: 47, y: 52, taille: 8, duree: 17, retard: -2, trajet: 1 },
  { x: 58, y: 61, taille: 9, duree: 14, retard: -9, trajet: 2 },
  { x: 66, y: 72, taille: 14, duree: 15, retard: -5, trajet: 3 },
  { x: 75, y: 80, taille: 8, duree: 13, retard: -11, trajet: 1 },
  { x: 22, y: 47, taille: 6, duree: 18, retard: -6, trajet: 3 },
  { x: 84, y: 35, taille: 6, duree: 19, retard: -13, trajet: 2 },
  { x: 52, y: 86, taille: 11, duree: 16, retard: -3, trajet: 1 },
  { x: 34, y: 68, taille: 8, duree: 14, retard: -8, trajet: 2 },
  { x: 70, y: 48, taille: 6, duree: 17, retard: -10, trajet: 3 },
]
