/**
 * LE DÉ QUI ROULE : l'icône du bouton « Modes de jeu » de l'arène.
 *
 * Lucas l'a animé dans son outil de design (scène « Dé animé », export
 * Project HTML du 23/09/2026, `dice-roll.jsx`) : le dé violet à pastilles d'or
 * roule quatre fois vers l'avant (faces 1, 2, 6, 5), puis tourne quatre fois
 * sur le côté (faces 1, 3, 6, 4), en boucle. Chaque pas est une courte pose
 * puis un roulé qui prend son élan et dépasse un peu (`easeInOutBack`), le dé
 * saute pendant le roulé (demi-sinus) et s'écrase en arrivant (sinus amorti) ;
 * une lumière venue d'en haut à gauche assombrit chaque face selon son
 * orientation.
 *
 * L'export recalcule une projection 3D à chaque image. On en garde les
 * NOMBRES et les FORMULES, recopiés ici (`etatDuDe`, `ombreDeFace`), et c'est
 * le navigateur qui fait la 3D : un vrai cube CSS (`preserve-3d`, SANS
 * perspective — l'export projette à plat), dont les faces sont placées par
 * leur repère (U, V, N) tel quel. La rotation, le saut, l'écrasement, l'ombre
 * au sol et l'ombrage de chaque face sont échantillonnés UNE fois en
 * images-clés (`feuilleDuDe`), comme l'arène vivante (lib/arena-vivante.ts) :
 * transform et opacité seulement, le compositeur joue tout, le fil principal
 * est libre.
 *
 * TOUT EST DANS LE REPÈRE DE L'EXPORT : une scène de 512 × 512, un cube de
 * 210 de côté. Le composant (components/defi/DeAnime.tsx) convertit en pixels
 * d'écran par une unité CSS (`--u`, un pixel de scène).
 */

/** La scène de l'export, carrée : le repère de tous les nombres d'ici. */
export const SCENE_DE = 512
/** Le côté du cube. */
export const COTE_DE = 210
const DEMI = COTE_DE / 2
/** Le centre du dé au repos : 10 px au-dessus du milieu de la scène. */
export const CENTRE_DE = { x: SCENE_DE / 2, y: SCENE_DE / 2 - 10 } as const
/**
 * Le noyau : un cube d'encre un peu plus petit, derrière les faces. Leurs
 * coins sont arrondis ; c'est lui qu'on voit aux sommets, qui paraissent
 * ainsi arrondis et cernés.
 */
export const RETRAIT_NOYAU = 10

/** Un pas : une pose, puis le roulé (secondes). */
export const PAS_DE = 0.8
export const ROULE_DE = 0.55
/** Quatre roulés vers l'avant, puis quatre sur le côté. */
export const ROULES_PAR_PHASE = 4
/** Une phase (« RoulerAvant », puis « RoulerCote ») : 3,2 s. */
export const PHASE_DE = ROULES_PAR_PHASE * PAS_DE
/** La boucle entière : 6,4 s. */
export const BOUCLE_DE = 2 * PHASE_DE

/** La hauteur du saut au milieu d'un roulé (px de scène). */
export const SAUT_DE = 60
/** L'écrasement à l'arrivée, au plus fort (6 %). */
export const ECRASEMENT_DE = 0.06
/** La vue : le dé penché de 24° vers nous, tourné de 38°. */
export const VUE_DE = { x: -24, y: 38 } as const
/** L'ombre d'une face tournée dos à la lumière (opacité du voile d'encre). */
export const OMBRE_MAX = 0.4
/** L'ombre au sol : une ellipse qui rapetisse et pâlit quand le dé saute. */
export const SOL_DE = { x: SCENE_DE / 2 - 130, y: 410, w: 260, h: 50 } as const

type Vec = readonly [number, number, number]

export type NumeroFace = 1 | 2 | 3 | 4 | 5 | 6

/**
 * Une face : son numéro, sa normale N et son repère (U, V) — l'axe des x et
 * celui des y du carré de la face —, dans le repère de l'écran (x à droite,
 * y vers le bas, z vers nous). Les nombres de l'export, tels quels.
 */
export interface FaceDe {
  n: NumeroFace
  N: Vec
  U: Vec
  V: Vec
}

export const FACES_DE: readonly FaceDe[] = [
  { n: 1, N: [0, 0, 1], U: [1, 0, 0], V: [0, 1, 0] },
  { n: 6, N: [0, 0, -1], U: [-1, 0, 0], V: [0, 1, 0] },
  { n: 3, N: [1, 0, 0], U: [0, 0, -1], V: [0, 1, 0] },
  { n: 4, N: [-1, 0, 0], U: [0, 0, 1], V: [0, 1, 0] },
  { n: 2, N: [0, -1, 0], U: [1, 0, 0], V: [0, 0, 1] },
  { n: 5, N: [0, 1, 0], U: [1, 0, 0], V: [0, 0, -1] },
]

/** Les pastilles de chaque face, en colonne × ligne sur une grille de 3 × 3. */
export const POINTS_DE: Readonly<Record<NumeroFace, readonly (readonly [number, number])[]>> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [2, 0], [0, 2], [2, 2]],
  5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
  6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
}

/** Une pastille : 38 × 42, sur une grille de pas 57 qui démarre à 40. */
export const POINT_DE = { w: 38, h: 42, depart: 40, pas: 57 } as const

/** Le coin haut-gauche d'une pastille dans le carré de sa face. */
export function placePoint([colonne, ligne]: readonly [number, number]): {
  x: number
  y: number
} {
  return {
    x: POINT_DE.depart + colonne * POINT_DE.pas - POINT_DE.w / 2,
    y: POINT_DE.depart + ligne * POINT_DE.pas - POINT_DE.h / 2,
  }
}

/* --- Les formules de l'export -------------------------------------------- */

const RAD = Math.PI / 180

export function rotX(a: number, [x, y, z]: Vec): Vec {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [x, y * c - z * s, y * s + z * c]
}

export function rotY(a: number, [x, y, z]: Vec): Vec {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [x * c + z * s, y, -x * s + z * c]
}

/** La lumière, d'en haut à gauche et un peu de face, normée. */
export const LUMIERE_DE: Vec = (() => {
  const l = [-0.35, -0.8, 0.5] as const
  const m = Math.hypot(...l)
  return [l[0] / m, l[1] / m, l[2] / m]
})()

/** L'élan, puis le dépassement : l'`easeInOutBack` de l'export. */
export function roule(p: number): number {
  const c1 = 1.70158
  const c2 = c1 * 1.525
  return p < 0.5
    ? ((2 * p) ** 2 * ((c2 + 1) * 2 * p - c2)) / 2
    : ((2 * p - 2) ** 2 * ((c2 + 1) * (p * 2 - 2) + c2) + 2) / 2
}

/** Le saut, un demi-sinus sur la durée du roulé. */
export function saute(p: number): number {
  return Math.sin(Math.PI * p)
}

/** L'arrivée : deux rebonds amortis, sur une demi-seconde. */
export function rebondit(p: number): number {
  return Math.exp(-6 * p) * Math.sin(p * Math.PI * 4)
}

const borne = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

interface Phase {
  tours: number
  saut: number
  rebond: number
}

/** `stepState` de l'export : où en est une phase de quatre roulés. */
function phase(t: number, debut: number): Phase {
  const local = t - debut
  let tours = 0
  let saut = 0
  let rebond = 0
  for (let i = 0; i < ROULES_PAR_PHASE; i++) {
    const depart = i * PAS_DE + (PAS_DE - ROULE_DE)
    const p = borne((local - depart) / ROULE_DE, 0, 1)
    tours += roule(p)
    if (p > 0 && p < 1) saut = saute(p)
    const apres = local - (depart + ROULE_DE)
    if (apres >= 0 && apres < PAS_DE) rebond = rebondit(borne(apres / 0.5, 0, 1))
  }
  return { tours, saut, rebond }
}

/** L'état du dé à un instant de la boucle. */
export interface EtatDe {
  /** Le roulé vers l'avant, en degrés (0 → 360 sur la première phase). */
  rx: number
  /** Le tour sur le côté, en degrés (0 → 360 sur la seconde phase). */
  ry: number
  /** Le saut, de 0 (posé) à 1 (au plus haut). */
  saut: number
  /** Le rebond de l'arrivée, signé (écrasé > 0, étiré < 0). */
  rebond: number
}

/**
 * L'état du dé à l'instant `t` ∈ [0, BOUCLE_DE] — la fonction `Die` de
 * l'export, sans le dessin. `t` n'est PAS ramené dans la boucle : à
 * `BOUCLE_DE`, le dé a fait ses deux tours complets (rx = ry = 360), la même
 * pose qu'à 0 mais pas les mêmes angles — c'est ce qui laisse l'échantillon
 * final s'interpoler depuis l'avant-dernier sans refaire un tour à l'envers.
 */
export function etatDuDe(t: number): EtatDe {
  const avant = phase(t, 0)
  const cote = phase(t, PHASE_DE)
  const surLeCote = t >= PHASE_DE
  return {
    rx: 90 * Math.min(avant.tours, ROULES_PAR_PHASE),
    ry: surLeCote ? 90 * cote.tours : 0,
    saut: surLeCote ? cote.saut : avant.saut,
    rebond: surLeCote ? cote.rebond : avant.rebond,
  }
}

/** Où pointe la normale d'une face, vue de l'écran (la fonction `R`). */
export function normaleVue(face: FaceDe, etat: EtatDe): Vec {
  return rotX(
    VUE_DE.x * RAD,
    rotY(VUE_DE.y * RAD, rotY(etat.ry * RAD, rotX(etat.rx * RAD, face.N))),
  )
}

/** Une face tournée vers nous (celles que l'export dessine). */
export function faceVisible(normale: Vec): boolean {
  return normale[2] > 0.001
}

/** L'opacité du voile d'encre sur une face : 0 en pleine lumière, 0,4 dos à elle. */
export function ombreDeFace(normale: Vec): number {
  const eclairage =
    normale[0] * LUMIERE_DE[0] + normale[1] * LUMIERE_DE[1] + normale[2] * LUMIERE_DE[2]
  return OMBRE_MAX * (1 - Math.max(0, eclairage))
}

/* --- Le placement CSS ----------------------------------------------------- */

const nombre = (n: number, decimales: number) => {
  const f = 10 ** decimales
  // `+ 0` range le −0 en 0.
  return String(Math.round(n * f) / f + 0)
}

/**
 * Le placement d'un carré sur le cube : ses axes deviennent U, V et N (un
 * `matrix3d` de rotation pure — le repère de l'export écrit tel quel, aucun
 * angle à retrouver, aucun signe à deviner), puis il avance de `distance`
 * le long de sa propre normale. `distance` est en pixels de scène, convertis
 * par `--u` : c'est pour cela qu'elle vit dans un `translateZ` à part,
 * `matrix3d` n'acceptant que des nombres.
 */
export function placementFace(face: FaceDe, distance: number): string {
  const [u, v, n] = [face.U, face.V, face.N]
  // `matrix3d` se lit par colonnes : l'image de x, celle de y, celle de z,
  // puis la translation (nulle).
  const rotation = [...u, 0, ...v, 0, ...n, 0, 0, 0, 0, 1].join(',')
  return `matrix3d(${rotation}) translateZ(calc(${nombre(distance, 2)} * var(--u)))`
}

/** Le placement d'une face peinte (au bord du cube). */
export const placementPeinte = (face: FaceDe) => placementFace(face, DEMI)
/** Le placement d'une face du noyau d'encre. */
export const placementNoyau = (face: FaceDe) => placementFace(face, DEMI - RETRAIT_NOYAU)

/* --- Les images-clés ------------------------------------------------------ */

/**
 * Le pas d'échantillonnage (secondes) : 160 échantillons sur la boucle, 14
 * par roulé. Entre deux, le navigateur interpole en ligne droite : l'angle
 * s'écarte de la courbe de moins de 2° au plus vif du roulé, moins d'un pixel
 * au coin d'un dé de 50 px.
 */
export const PAS_ECHANTILLON = 0.04

/**
 * Une piste : une propriété animée d'un élément du dé. `valeurs` donne les
 * nombres à l'instant t (ce que l'on compare pour alléger la piste), `image`
 * les écrit en CSS — transform et opacité seulement, le type l'impose.
 */
export interface PisteDe {
  nom: string
  /** Écart toléré, dans l'unité de chaque valeur, quand on retire un échantillon. */
  tolerance: number
  valeurs: (etat: EtatDe) => number[]
  image: (valeurs: readonly number[]) => { transform?: string; opacity?: string }
}

/** La rotation du cube : la vue, puis le tour sur le côté, puis le roulé. */
export const PISTE_CUBE: PisteDe = {
  nom: 'de-cube',
  tolerance: 0.4,
  valeurs: (e) => [e.ry, e.rx],
  image: ([ry, rx]) => ({
    // rotY(38°)·rotY(ry) = rotY(38° + ry) : la vue et le tour se composent.
    transform: `rotateX(${VUE_DE.x}deg) rotateY(${nombre(VUE_DE.y + ry, 2)}deg) rotateX(${nombre(rx, 2)}deg)`,
  }),
}

/**
 * Le corps : le saut, puis l'écrasement de l'arrivée. L'export écrasait
 * chaque face autour de son propre centre (les arêtes s'entrouvraient d'un
 * pixel) ; ici tout le dé s'écrase autour de son centre, du même 6 %. Le
 * corps couvre la scène : sa levée s'écrit en pour cent de sa hauteur.
 */
export const PISTE_CORPS: PisteDe = {
  nom: 'de-corps',
  // La levée en px de scène, l'écrasement en pour cent : une tolérance de
  // 0,5 reste sous le quart de pixel d'écran pour l'une comme pour l'autre.
  tolerance: 0.5,
  valeurs: (e) => [SAUT_DE * e.saut, 100 * ECRASEMENT_DE * e.rebond],
  image: ([leve, ecrase]) => ({
    transform: `translateY(${nombre((-100 * leve) / SCENE_DE, 2)}%) scale(${nombre(1 + ecrase / 100, 4)},${nombre(1 - ecrase / 100, 4)})`,
  }),
}

/** L'ombre au sol, qui rapetisse et pâlit pendant le saut. */
export const PISTE_SOL: PisteDe = {
  nom: 'de-sol',
  tolerance: 0.01,
  valeurs: (e) => [1 - 0.35 * e.saut, 1 - 0.4 * e.saut],
  image: ([echelle, opacite]) => ({
    transform: `scale(${nombre(echelle, 3)})`,
    opacity: nombre(opacite, 3),
  }),
}

/** Le voile d'encre d'une face, selon son orientation sous la lumière. */
export function pisteOmbre(face: FaceDe): PisteDe {
  return {
    nom: `de-ombre-${face.n}`,
    tolerance: 0.004,
    valeurs: (e) => [ombreDeFace(normaleVue(face, e))],
    image: ([ombre]) => ({ opacity: nombre(ombre, 3) }),
  }
}

/** Le voile de chaque face, dans l'ordre de FACES_DE. */
export const PISTES_OMBRE: readonly PisteDe[] = FACES_DE.map(pisteOmbre)

export const PISTES_DE: readonly PisteDe[] = [PISTE_CUBE, PISTE_CORPS, PISTE_SOL, ...PISTES_OMBRE]

/** Les instants échantillonnés, de 0 à BOUCLE_DE compris. */
export function instantsDuDe(): number[] {
  const n = Math.round(BOUCLE_DE / PAS_ECHANTILLON)
  return Array.from({ length: n + 1 }, (_, i) => (i * BOUCLE_DE) / n)
}

/**
 * Allège une piste : on retire tout échantillon que la ligne droite entre ses
 * voisins gardés reproduit à `tolerance` près — les poses deviennent deux
 * images au lieu de sept, la face qui ne bouge pas une seule. Renvoie les
 * indices gardés (le premier et le dernier toujours).
 */
export function echantillonsGardes(
  instants: readonly number[],
  valeurs: readonly (readonly number[])[],
  tolerance: number,
): number[] {
  const gardes = [0]
  let ancre = 0
  for (let j = 2; j < instants.length; j++) {
    // Peut-on aller en ligne droite de l'ancre à j sans trahir un point ?
    const tient = valeurs.slice(ancre + 1, j).every((v, k) => {
      const i = ancre + 1 + k
      const f = (instants[i] - instants[ancre]) / (instants[j] - instants[ancre])
      return v.every(
        (x, d) =>
          Math.abs(valeurs[ancre][d] + f * (valeurs[j][d] - valeurs[ancre][d]) - x) <= tolerance,
      )
    })
    if (!tient) {
      ancre = j - 1
      gardes.push(ancre)
    }
  }
  gardes.push(instants.length - 1)
  return gardes
}

function declarations(image: { transform?: string; opacity?: string }): string {
  return Object.entries(image)
    .map(([propriete, valeur]) => `${propriete}:${valeur}`)
    .join(';')
}

/** Les images-clés CSS d'une piste, sur toute la boucle. */
export function imagesClesDe(piste: PisteDe): string {
  const instants = instantsDuDe()
  const valeurs = instants.map((t) => piste.valeurs(etatDuDe(t)))
  const etapes = echantillonsGardes(instants, valeurs, piste.tolerance).map(
    (i) =>
      `${nombre((100 * instants[i]) / BOUCLE_DE, 3)}%{${declarations(piste.image(valeurs[i]))}}`,
  )
  return `@keyframes ${piste.nom}{${etapes.join('')}}`
}

/** Toute la feuille du dé : les images-clés de chacune de ses pistes. */
export function feuilleDuDe(): string {
  return PISTES_DE.map(imagesClesDe).join('\n')
}

/** L'image de départ d'une piste (le dé figé est l'instant zéro). */
export function imageDeDepart(piste: PisteDe): { transform?: string; opacity?: string } {
  return piste.image(piste.valeurs(etatDuDe(0)))
}
