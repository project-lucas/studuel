/**
 * LA COUR D'HONNEUR DE L'ACADÉMIE — les six scènes vivantes de l'arène
 * (12/10/2026). Lucas a préféré la cour à l'île flottante (« le côté cour
 * avec une super animation de fontaine, les nuages, le matin, midi, soir, la
 * lumière des lanternes devant qui change ») : le même château, vu depuis sa
 * cour — la fontaine au centre, deux lanternes devant, le parvis vide pour la
 * rangée de combat. Les six lumières (`public/images/arene/cour-*.webp`,
 * `scripts/arene-cour.mjs`) ont été peintes depuis la même variante en
 * référence : fontaine, lanternes et fenêtres sont à la MÊME PLACE partout, et
 * les cotes ci-dessous (relevées sur le décor du soir, en pixels de planche
 * 1080 × 1920) valent pour les six.
 *
 * Ce qui bouge, plage par plage : les nuages (ceux de l'aube et du soir
 * exportés par Lucas, les blancs de jour et ceux d'encre de la nuit dessinés à
 * part), le soleil ou la lune qui respire (la lueur), le JET de la fontaine
 * qui monte (la « cascade » à l'envers : mêmes voiles d'eau, dans l'autre
 * sens), ses retombées et le bouillonnement du bassin (l'écume), les fenêtres
 * qui vacillent quand elles sont allumées, les deux lanternes du premier plan
 * qui s'allument à l'aube, au soir et la nuit, une brume basse sur le parvis,
 * et la nuit ses étoiles. Les scènes du château (aube et soir de l'export de
 * Lucas, les quatre autres du 12/10 au matin) sont dans l'historique git.
 */

import type {
  BougieVivante,
  CascadeVivante,
  EcumeVivante,
  EtoileVivante,
  LanterneVivante,
  LueurVivante,
  NappeBrume,
  NuageVivant,
  SceneVivante,
} from './arena-vivante'

const DOSSIER = '/images/arene/vivante'
const DECORS = '/images/arene'

/* --- Les nuages, par famille ---------------------------------------------- */

/** Les cinq nuages blancs de jour (720 px de large, rapport largeur/hauteur). */
const JOUR = (n: 1 | 2 | 3 | 4 | 5, x: number, y: number, w: number, amplitude: number, phase: number): NuageVivant => {
  const ratio = [1.79, 1.56, 1.59, 2.01, 1.98][n - 1]
  return { src: `${DOSSIER}/jour-cloud-${n}.webp`, x, y, w, h: Math.round(w / ratio), amplitude, phase }
}
/** Les cinq nuages d'encre de la nuit. */
const NUIT_N = (n: 1 | 2 | 3 | 4 | 5, x: number, y: number, w: number, amplitude: number, phase: number): NuageVivant => {
  const ratio = [1.53, 1.39, 1.75, 2.02, 2.27][n - 1]
  return { src: `${DOSSIER}/nuit-cloud-${n}.webp`, x, y, w, h: Math.round(w / ratio), amplitude, phase }
}
/** Les nuages roses de l'aube (export de Lucas, cotes de l'export). */
const AUBE_N = (n: 1 | 2 | 3 | 4 | 5, x: number, y: number, amplitude: number, phase: number): NuageVivant => {
  const [w, h] = [[390, 230], [420, 120], [380, 230], [215, 95], [230, 107.5]][n - 1]
  return { src: `${DOSSIER}/dawn-cloud-${n}.webp`, x, y, w, h, amplitude, phase }
}
/** Les nuages orangés du soir (export de Lucas). */
const SOIR_N = (n: 'a' | 'b' | 'c' | 'd', x: number, y: number, amplitude: number, phase: number): NuageVivant => {
  const [w, h] = { a: [440, 194], b: [227.5, 106.5], c: [387, 263.5], d: [241.5, 206.5] }[n]
  return { src: `${DOSSIER}/evening-cloud-${n}.webp`, x, y, w, h, amplitude, phase }
}

/* --- Les pièces communes, à la même place sur les six décors --------------- */

/** Le jet de la fontaine : la colonne d'eau, de sa pointe à la vasque haute. Il MONTE. */
const JET: CascadeVivante = { x: 508, y: 855, w: 68, h: 180, passages: 8, course: 260, sens: 'monte' }
/** Le bassin bas, où l'eau retombe et bouillonne. */
const BASSIN: EcumeVivante = { x: 445, y: 1100, w: 195, h: 60, min: 0.12, amplitude: 0.25, k: 3 }
/** Les fenêtres de la façade : éteintes le jour, allumées sinon. */
const FENETRES_ETEINTES: BougieVivante = {
  x: 60, y: 520, w: 960, h: 300, base: 0, amplitude: 0,
  ondes: [{ k: 3, phase: 0.1 }, { k: 5, phase: 0.4 }],
}
const FENETRES_ALLUMEES: BougieVivante = {
  x: 60, y: 520, w: 960, h: 300, base: 0.2, amplitude: 0.2,
  ondes: [{ k: 4, phase: 0.1 }, { k: 6, phase: 0.4 }],
}
/** Les deux lanternes du premier plan (le verre : 120 px de large), à leur rythme. */
const lanternes = (base: number, amplitude: number): readonly LanterneVivante[] =>
  (
    [
      [150, 1000],
      [940, 990],
    ] as const
  ).map(([x, y], i) => ({
    x, y, taille: 220, base, amplitude,
    ondes: [{ k: 6 + i, phase: i * 0.31 }, { k: 9, phase: i * 0.47 }],
  }))
/** Une lueur de 700 px centrée sur le soleil. */
const soleil = (x: number, y: number, centre: string, halo: string, min = 0.35, amplitude = 0.3): LueurVivante => ({
  x: x - 350, y: y - 350, w: 700, h: 700, centre, halo, min, amplitude,
})
/** La brume basse du parvis, entre la fontaine et la rangée de combat. */
const brume = (opacite: number, double = false): readonly NappeBrume[] =>
  double
    ? [
        { y: 1240, h: 140, phase: 0, sens: 1, opacite },
        { y: 1320, h: 110, phase: 0.5, sens: -1, opacite: opacite * 0.85 },
      ]
    : [{ y: 1280, h: 120, phase: 0, sens: 1, opacite }]

/* --- Les six plages --------------------------------------------------------- */

/** L'AUBE (5 h → 8 h) : ciel rose, le soleil derrière l'académie, lanternes encore douces, brume au sol. */
const AUBE: SceneVivante = {
  period: 'dawn',
  plate: `${DECORS}/cour-dawn.webp`,
  etoiles: [],
  lueur: soleil(765, 598, 'rgba(255, 214, 170, 0.55)', 'rgba(255, 190, 160, 0.2)'),
  nuages: [
    AUBE_N(1, 0, 150, 34, 0),
    AUBE_N(2, 560, 40, 46, 0.3),
    AUBE_N(3, 700, 300, 30, 0.55),
    AUBE_N(4, 0, 420, 22, 0.8),
    AUBE_N(5, 850, 470, 24, 0.15),
  ],
  balancementVertical: 3,
  rochers: [],
  bougie: { ...FENETRES_ALLUMEES, base: 0.12, amplitude: 0.12 },
  lanternes: lanternes(0.3, 0.25),
  cascade: JET,
  ecume: BASSIN,
  brume: brume(0.3, true),
  couleurBrume: '250, 236, 246',
}

/** LE MATIN (8 h → 12 h) : ciel bleu, lumière fraîche, lanternes éteintes. */
const MATIN: SceneVivante = {
  period: 'morning',
  plate: `${DECORS}/cour-morning.webp`,
  etoiles: [],
  lueur: soleil(338, 480, 'rgba(255, 250, 230, 0.35)', 'rgba(255, 246, 210, 0.1)', 0.3, 0.25),
  nuages: [
    JOUR(1, 0, 120, 340, 34, 0),
    JOUR(2, 700, 40, 330, 46, 0.3),
    JOUR(4, 760, 330, 320, 30, 0.55),
    JOUR(3, 0, 340, 300, 22, 0.8),
    JOUR(5, 380, 0, 300, 24, 0.15),
  ],
  balancementVertical: 3,
  rochers: [],
  bougie: FENETRES_ETEINTES,
  lanternes: [],
  cascade: JET,
  ecume: BASSIN,
  brume: brume(0.1),
  couleurBrume: '248, 250, 255',
}

/** LE MIDI (12 h → 15 h) : le soleil haut, lumière blanche. */
const MIDI: SceneVivante = {
  period: 'noon',
  plate: `${DECORS}/cour-noon.webp`,
  etoiles: [],
  lueur: soleil(633, 366, 'rgba(255, 255, 235, 0.45)', 'rgba(255, 250, 210, 0.14)'),
  nuages: [
    JOUR(2, 0, 110, 330, 38, 0),
    JOUR(4, 660, 30, 420, 44, 0.35),
    JOUR(1, 790, 330, 290, 30, 0.6),
    JOUR(5, 0, 360, 330, 22, 0.8),
    JOUR(3, 360, 0, 260, 26, 0.2),
  ],
  balancementVertical: 3,
  rochers: [],
  bougie: FENETRES_ETEINTES,
  lanternes: [],
  cascade: JET,
  ecume: BASSIN,
  brume: brume(0.1),
  couleurBrume: '248, 250, 255',
}

/** L'APRÈS-MIDI (15 h → 18 h) : lumière dorée à droite, les fenêtres commencent à luire. */
const APRES_MIDI: SceneVivante = {
  period: 'afternoon',
  plate: `${DECORS}/cour-afternoon.webp`,
  etoiles: [],
  lueur: soleil(960, 580, 'rgba(255, 205, 130, 0.5)', 'rgba(255, 180, 110, 0.18)'),
  nuages: [
    JOUR(4, 0, 90, 400, 40, 0),
    JOUR(3, 700, 110, 300, 32, 0.3),
    JOUR(5, 770, 390, 310, 26, 0.55),
    JOUR(2, 10, 380, 280, 22, 0.8),
    JOUR(1, 400, 0, 260, 28, 0.45),
  ],
  balancementVertical: 3,
  rochers: [],
  bougie: { ...FENETRES_ALLUMEES, base: 0.08, amplitude: 0.08 },
  lanternes: [],
  cascade: JET,
  ecume: BASSIN,
  brume: brume(0.1),
  couleurBrume: '255, 240, 220',
}

/** LE SOIR (18 h → 21 h) : couchant, lanternes allumées, fenêtres chaudes, premières étoiles. */
const SOIR: SceneVivante = {
  period: 'evening',
  plate: `${DECORS}/cour-evening.webp`,
  etoiles: [
    { x: 944, y: 37, phase: 0, k: 2 },
    { x: 207, y: 110, phase: 0.4, k: 3 },
    { x: 858, y: 174, phase: 0.7, k: 2 },
  ],
  lueur: soleil(540, 600, 'rgba(255, 190, 170, 0.5)', 'rgba(230, 160, 190, 0.18)', 0.3, 0.35),
  nuages: [
    SOIR_N('a', 0, 160, 38, 0),
    SOIR_N('c', 693, 60, 34, 0.35),
    SOIR_N('b', 0, 440, 22, 0.6),
    SOIR_N('d', 838, 380, 26, 0.8),
  ],
  balancementVertical: 3,
  rochers: [],
  bougie: FENETRES_ALLUMEES,
  lanternes: lanternes(0.55, 0.45),
  cascade: JET,
  ecume: BASSIN,
  brume: brume(0.14),
  couleurBrume: '255, 230, 220',
}

/** Les dix étoiles de la nuit, relevées sur le décor (hors lune). */
const ETOILES_NUIT: readonly EtoileVivante[] = (
  [
    [944, 37, 0],
    [207, 110, 0.4],
    [415, 169, 0.7],
    [484, 280, 0.2],
    [565, 283, 0.55],
    [376, 30, 0.85],
    [472, 78, 0.3],
    [549, 130, 0.65],
    [858, 174, 0.1],
    [240, 84, 0.45],
  ] as const
).map(([x, y, phase], i) => ({ x, y, phase, k: 2 + (i % 3) }))

/** LA NUIT (21 h → 5 h) : la lune qui respire, les étoiles, lanternes et fenêtres allumées, nuages d'encre. */
const NUIT: SceneVivante = {
  period: 'night',
  plate: `${DECORS}/cour-night.webp`,
  etoiles: ETOILES_NUIT,
  // La lueur est celle de la LUNE (centre relevé en 727 × 258).
  lueur: {
    x: 727 - 240, y: 258 - 240, w: 480, h: 480,
    centre: 'rgba(255, 246, 222, 0.4)', halo: 'rgba(200, 210, 255, 0.12)',
    min: 0.4, amplitude: 0.3,
  },
  nuages: [
    NUIT_N(3, 0, 110, 330, 32, 0),
    NUIT_N(2, 880, 80, 200, 24, 0.35),
    NUIT_N(4, 0, 330, 360, 40, 0.6),
    NUIT_N(1, 820, 380, 260, 26, 0.8),
    NUIT_N(5, 380, 0, 330, 22, 0.2),
  ],
  balancementVertical: 3,
  rochers: [],
  bougie: FENETRES_ALLUMEES,
  lanternes: lanternes(0.55, 0.45),
  cascade: JET,
  ecume: BASSIN,
  brume: brume(0.22, true),
  couleurBrume: '205, 210, 245',
}

/** Les six plages de la cour d'honneur, sous la clé de leur plage. */
export const SCENES_COUR = {
  dawn: AUBE,
  morning: MATIN,
  noon: MIDI,
  afternoon: APRES_MIDI,
  evening: SOIR,
  night: NUIT,
} as const
