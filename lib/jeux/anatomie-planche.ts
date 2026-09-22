// -----------------------------------------------------------------------------
// LA PLANCHE D'ANATOMIE — le dessin, en coordonnées pures.
//
// Une vraie planche, comme celle du manuel de SVT : un corps de face vu de la
// tête à mi-cuisse, et DEDANS les organes dessinés, sans étiquette. Ce n'est
// plus une silhouette vague avec des disques invisibles : l'élève voit le
// foie, sa forme, sa place sous les côtes, et c'est SUR LE FOIE qu'il touche.
// La zone de clic est le contour de l'organe, au trait près.
//
// Tout est ici en unités du viewBox (100 × 156), hors de tout composant, pour
// que des tests vérifient ce qu'un œil ne voit pas : qu'une zone ne se cache
// pas sous une autre, qu'elle reste assez grande pour un doigt, qu'elle tient
// dans le corps.
//
// Le côté est celui de la PLANCHE, donc inversé par rapport au corps de
// l'élève (le foie est à gauche du dessin) — c'est la convention de toutes
// les planches d'anatomie, et c'est ainsi qu'on les lit en classe.
// -----------------------------------------------------------------------------

/** Dimensions du viewBox. Toute zone doit tenir dedans. */
export const PLANCHE_LARGEUR = 100
export const PLANCHE_HAUTEUR = 148

/** Un tracé de la silhouette : un point d'arrivée, et ses deux contrôles s'il est courbe. */
type Trait = { c?: readonly [number, number, number, number]; p: readonly [number, number] }

/**
 * La MOITIÉ GAUCHE du corps, du sommet du crâne à l'entrejambe, dans l'ordre
 * du tracé : tempe, mâchoire, cou, épaule, bras (extérieur, main, intérieur),
 * flanc, hanche, cuisse. La moitié droite en est le miroir exact : un corps
 * dessiné à la main n'est jamais symétrique, et ça se voit tout de suite.
 */
const DEMI_CORPS: readonly Trait[] = [
  { c: [44, 2.5, 39.5, 8], p: [39.5, 15] }, // tempe
  { c: [39.5, 21.5, 42.5, 26.5], p: [46, 28] }, // mâchoire, jusqu'au menton
  { c: [45.5, 30, 45, 32.5], p: [45, 34.5] }, // cou
  { c: [38, 35.5, 27, 36], p: [21, 39] }, // trapèze, jusqu'à l'épaule
  { c: [17, 41, 14.5, 45], p: [13.5, 50] }, // rond de l'épaule
  { c: [12.5, 60, 11.5, 70], p: [11, 81] }, // bras, jusqu'au coude
  { c: [10.5, 92, 10, 103], p: [9.5, 114] }, // avant-bras, jusqu'au poignet
  { c: [8.5, 119, 8.2, 126], p: [9.5, 129.5] }, // main, bord extérieur
  { c: [10.5, 132.5, 15.5, 132.5], p: [16.5, 129.5] }, // bout des doigts
  { c: [17, 124, 16.8, 118], p: [16.3, 114] }, // main, bord intérieur
  { c: [17, 103, 18, 92], p: [18.8, 81] }, // avant-bras intérieur
  { c: [19.5, 71, 20.5, 62], p: [21.5, 53] }, // bras intérieur, jusqu'à l'aisselle
  { c: [21.5, 66, 22.5, 80], p: [24, 92] }, // flanc, jusqu'à la taille
  { c: [25, 102, 22, 111], p: [22, 120] }, // hanche
  { c: [22, 130, 24.5, 140], p: [26, 148] }, // cuisse, bord extérieur
  { p: [46.5, 148] }, // bas de la cuisse (la planche s'estompe là)
  { c: [46.8, 144, 47.5, 140], p: [50, 136] }, // cuisse intérieure, jusqu'à l'entrejambe
]

const SOMMET: readonly [number, number] = [50, 2.5]

const n = (v: number) => String(Math.round(v * 100) / 100)

/**
 * Le chemin fermé du corps entier : la moitié gauche, puis son miroir parcouru
 * à rebours (chaque courbe reprise de l'arrivée au départ, contrôles inversés
 * et reflétés sur l'axe x = 50).
 */
function corpsEnMiroir(demi: readonly Trait[], sommet: readonly [number, number]): string {
  const morceaux: string[] = [`M${n(sommet[0])} ${n(sommet[1])}`]
  for (const t of demi) {
    morceaux.push(
      t.c
        ? `C${n(t.c[0])} ${n(t.c[1])} ${n(t.c[2])} ${n(t.c[3])} ${n(t.p[0])} ${n(t.p[1])}`
        : `L${n(t.p[0])} ${n(t.p[1])}`,
    )
  }
  const m = (x: number) => PLANCHE_LARGEUR - x
  for (let i = demi.length - 1; i >= 0; i--) {
    const t = demi[i]
    const depart = i === 0 ? sommet : demi[i - 1].p
    morceaux.push(
      t.c
        ? `C${n(m(t.c[2]))} ${n(t.c[3])} ${n(m(t.c[0]))} ${n(t.c[1])} ${n(m(depart[0]))} ${n(depart[1])}`
        : `L${n(m(depart[0]))} ${n(depart[1])}`,
    )
  }
  morceaux.push('Z')
  return morceaux.join(' ')
}

/** Le contour du corps, prêt pour un attribut `d`. */
export const CORPS_D = corpsEnMiroir(DEMI_CORPS, SOMMET)

/** Hauteur à partir de laquelle les cuisses s'estompent, jusqu'au bas de la planche. */
export const FONDU_DEPUIS = 134

/**
 * Une zone de la planche : un organe dessiné, qu'on touche.
 *
 * - `plein` : une forme fermée (un ou plusieurs sous-chemins ; deux sous-chemins
 *   disjoints, comme les deux poumons, font UNE zone) ;
 * - `tube` : un tracé OUVERT tiré en trait épais (la trachée, le côlon, le
 *   diaphragme) — la zone est tout ce qui est à moins d'une demi-largeur de
 *   l'axe. Un organe étroit dessiné en forme fermée aurait deux bords à
 *   quelques dixièmes l'un de l'autre, pénibles à écrire et à retoucher.
 *
 * `halo` élargit la zone au-delà du trait, mais seulement sur du VIDE (là où
 * aucun organe n'est dessiné) : c'est ce qui rend un tube de 5 unités
 * touchable au doigt sans le dessiner gros comme un bras.
 *
 * `ancre` est le point qui représente la zone : il sert au nom de la zone pour
 * le clavier (sa position, jamais son nom) et aux tests (il doit désigner la
 * zone elle-même, sinon elle est cachée sous une autre).
 */
export type ZonePlanche = {
  id: string
  /** Le nom de ce qu'on a touché (« le pancréas »), pour le dire à la correction. */
  nom: string
  forme: { type: 'plein'; d: string } | { type: 'tube'; d: string; largeur: number }
  halo: number
  ancre: readonly [number, number]
  /** Traits intérieurs, décoratifs (scissures, plis, anses) — jamais touchables. */
  details?: readonly string[]
  /** Position dite au clavier, quand le calcul depuis l'ancre serait trompeur. */
  repere?: string
}

/**
 * Les zones, dans l'ORDRE DU DESSIN : la première est dessinée en dessous de
 * toutes les autres, la dernière au-dessus. Un point touché appartient à la
 * zone la plus haute qui le contient — les reins, dessinés en premier, ne sont
 * touchables que là où le foie et le côlon ne les recouvrent pas, exactement
 * comme sur la planche.
 */
export const ZONES: readonly ZonePlanche[] = [
  {
    id: 'reins',
    nom: 'un rein',
    forme: {
      type: 'plein',
      d:
        'M32 93.5 C36 93.5 37.5 96.5 37 99.5 C36.5 101 35.5 101.5 35.5 102 C35.5 102.5 36.5 103 36.8 104.5 C37.3 107.5 35.5 109 32 109 C28.3 109 27.1 105 27.5 101.5 C27.9 97.5 28.3 93.5 32 93.5 Z ' +
        'M68 93.5 C64 93.5 62.5 96.5 63 99.5 C63.5 101 64.5 101.5 64.5 102 C64.5 102.5 63.5 103 63.2 104.5 C62.7 107.5 64.5 109 68 109 C71.7 109 72.9 105 72.5 101.5 C72.1 97.5 71.7 93.5 68 93.5 Z',
    },
    halo: 0,
    ancre: [31.5, 100],
    details: ['M35 98 C34 99.5 34 102.5 35 104', 'M65 98 C66 99.5 66 102.5 65 104'],
    repere: 'de chaque côté du milieu du tronc',
  },
  {
    id: 'pancreas',
    nom: 'le pancréas',
    forme: {
      type: 'plein',
      d: 'M40.5 98.5 C45 97 51 97.5 56 98 C59 98.3 61 97.8 62.5 96.5 C63 98.5 61.5 101 58.5 101.5 C53 102.5 46.5 103 42 102.5 C40 102 39.8 100 40.5 98.5 Z',
    },
    halo: 2.5,
    ancre: [50, 100.2],
    details: ['M43 100.5 C48 100 54 100 59.5 99'],
  },
  {
    id: 'rate',
    nom: 'la rate',
    forme: {
      type: 'plein',
      d: 'M70.5 80.5 C73.5 79.5 75.8 82.5 75.5 87 C75.2 91.5 73 94.5 70.5 93.8 C68.8 93.3 68.2 90 68.2 86.5 C68.2 83.5 69 81 70.5 80.5 Z',
    },
    halo: 2.5,
    ancre: [72, 87],
  },
  {
    id: 'foie',
    nom: 'le foie',
    forme: {
      type: 'plein',
      d: 'M25.5 81.5 C33 79.5 45 80 53 81.5 C56.5 82 58 84 57 87 C55.5 90 50 91.2 44.5 92.3 C38.5 93.5 32.5 96 28.5 95.5 C25.5 95 24.5 89.5 25.5 81.5 Z',
    },
    halo: 0,
    ancre: [38, 87],
    details: ['M44 82 C45 85 45.5 88 46 91.5'],
  },
  {
    id: 'estomac',
    nom: 'l’estomac',
    forme: {
      type: 'plein',
      d: 'M56 83 C58 80 63.5 79.5 66 82.5 C68.5 86 68 91 65.5 94.5 C62.5 97.5 57 98.5 53 96 C50.5 94.5 50.5 91.5 52.5 90.5 C54.5 89.5 57 89.5 58 87 C58.5 85.5 55 85.5 56 83 Z',
    },
    halo: 0,
    ancre: [63, 88],
    details: ['M60 84 C62.5 85.5 63.5 89 61.5 92', 'M63 83.5 C65.5 86 65 90.5 63 93.5'],
  },
  {
    id: 'gros-intestin',
    nom: 'le gros intestin',
    forme: {
      type: 'tube',
      d: 'M32 121 L32 109 C32 106.5 34 105.5 37 105.5 C42 107 48 109 50 109 C52 109 58 107 63 105.5 C66 105.5 68 106.5 68 109 L68 120.5 C68 125 64.5 127.5 61 126',
      largeur: 7,
    },
    halo: 1.5,
    ancre: [32, 116],
    details: [
      'M29 113 L35 113', 'M29 118 L35 118', 'M65 113 L71 113', 'M65 118 L71 118',
      'M42 104 L42 110.5', 'M50 105.5 L50 112.5', 'M58 104 L58 110.5',
    ],
  },
  {
    id: 'intestin-grele',
    nom: 'l’intestin grêle',
    forme: {
      type: 'plein',
      d: 'M40 115 C45 113 55 113 60 115 C63.5 117 63.5 122.5 60 125 C55 127 45 127 40 125 C36.5 122.5 36.5 117 40 115 Z',
    },
    halo: 0,
    ancre: [50, 120],
    details: [
      'M39 118 C43 115.5 46 120.5 50 118 C54 115.5 57 120.5 61 118',
      'M39 122 C43 119.5 46 124.5 50 122 C54 119.5 57 124.5 61 122',
    ],
  },
  {
    id: 'vessie',
    nom: 'la vessie',
    forme: {
      type: 'plein',
      d: 'M43 128 C44 124.5 56 124.5 57 128 C58 131.5 54.5 134 50 134 C45.5 134 42 131.5 43 128 Z',
    },
    halo: 2,
    ancre: [50, 129.5],
  },
  {
    id: 'trachee',
    nom: 'la trachée',
    forme: {
      type: 'tube',
      d: 'M50 29 L50 46 M50 46 L45.5 50.5 M50 46 L54.5 50.5',
      largeur: 4.6,
    },
    halo: 3.5,
    ancre: [50, 38],
    details: ['M48 32.5 L52 32.5', 'M48 35.5 L52 35.5', 'M48 38.5 L52 38.5', 'M48 41.5 L52 41.5', 'M48 44.5 L52 44.5'],
  },
  {
    id: 'poumons',
    nom: 'un poumon',
    forme: {
      type: 'plein',
      d:
        'M37 39.5 C41 39 44.5 40.5 44.5 43.5 L44.5 54 C43.5 60 41 66 40 72 C36 73 30 72.5 27 70.5 C24.5 62 25 50 28 44.5 C30 41 33.5 39.7 37 39.5 Z ' +
        'M63 39.5 C59 39 55.5 40.5 55.5 43.5 L55.5 50 C61 52.5 67.5 57.5 69 63 C70 67 69.5 70.5 69 72 C71 72.5 73.5 72 75 70.5 C76.5 62 75.5 50 72 44.5 C70 41 66.5 39.7 63 39.5 Z',
    },
    halo: 0,
    ancre: [34, 57],
    details: ['M27.5 58 C33 56 39 54 44 50', 'M26 66 L41 63.5', 'M74.5 58 C69 56 63 54 57.5 50.5'],
    repere: 'de chaque côté du haut du tronc',
  },
  {
    id: 'coeur',
    nom: 'le cœur',
    forme: {
      type: 'plein',
      // Deux lobes en haut, une pointe en bas à droite de la planche (la
      // gauche du corps) : la forme que tout le monde reconnaît, à sa vraie
      // place — au centre, un peu à gauche du corps, entre les deux poumons.
      d: 'M47.5 57.5 C46.5 53 51 51.5 54 55.5 C56.5 52 61 53 61.5 57.5 C63 62.5 63 67 62 72 C57.5 71.5 51.5 69 48 65 C46 62 46.3 59.5 47.5 57.5 Z',
    },
    halo: 0,
    ancre: [54.5, 62],
    details: ['M54 56.5 C55.5 60 57.5 64.5 60.5 69.5'],
  },
  {
    id: 'diaphragme',
    nom: 'le diaphragme',
    forme: {
      type: 'tube',
      d: 'M23.5 78 C30 74 40 74 46 76.5 C49 77.5 51 77.5 54 76.5 C60 74 70 74 76.5 78',
      largeur: 2.4,
    },
    halo: 3,
    ancre: [29, 75.7],
    repere: 'en travers du tronc, sous les côtes',
  },
  {
    id: 'cerveau',
    nom: 'le cerveau',
    forme: {
      type: 'plein',
      d: 'M50 5 C55 5 58.5 9 58.5 13.5 C58.5 17 56.5 19.5 53 19.5 C51.5 19.5 50.5 19 50 18.5 C49.5 19 48.5 19.5 47 19.5 C43.5 19.5 41.5 17 41.5 13.5 C41.5 9 45 5 50 5 Z',
    },
    halo: 0,
    ancre: [50, 12],
    details: [
      'M50 6.5 L50 18',
      'M44 10 C46 8 48 9.5 47 12.5',
      'M53 9 C55.5 8.5 56.5 11 54.5 13.5',
      'M44.5 15.5 C46.5 14 48 16.5 47 18.5',
      'M52.5 15.5 C54.5 14 56 16 55 18.5',
    ],
  },
]

export function zonePlanche(id: string): ZonePlanche | undefined {
  return ZONES.find((z) => z.id === id)
}
