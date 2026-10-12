/**
 * L'ARÈNE VIVANTE : le décor horaire de l'onglet Défi qui bouge.
 *
 * Lucas anime une illustration horaire dans son outil de design et l'exporte
 * en « Project HTML » : une scène React redessinée 60 fois par seconde à
 * partir du temps, inutilisable telle quelle sur un fond d'onglet. On en garde
 * LA COMPOSITION, recopiée ici en données pures — la planche (le ciel repeint
 * sans ses nuages), les éléments détourés (nuages, rochers) et leurs
 * mouvements, les lumières (lueur de l'horizon, bougie des fenêtres,
 * lanternes, étoiles), la cascade, la brume — et SES FORMULES : `onde` et
 * `pulsation` sont celles de l'export (`wave` et `pulse`), avec les mêmes
 * fréquences et les mêmes phases.
 *
 * Le navigateur ne calcule rien image par image : chaque mouvement est
 * échantillonné UNE fois en images-clés CSS (`imagesCles`), que
 * `components/defi/ArenaVivante.tsx` injecte, et qui n'animent que
 * l'opacité et la transformation — le compositeur s'en charge, le fil
 * principal est libre. Les mouvements en dents de scie (reflets de la
 * cascade, nappes de brume) restent de simples translations linéaires dans
 * `ArenaVivante.module.css` : échantillonnés, leur retour en haut se verrait.
 *
 * TOUT EST DANS LE REPÈRE DE LA PLANCHE (1080 × 1920, comme les six décors
 * horaires) : le composant convertit en pixels d'écran par une unité CSS
 * (`--u`, un pixel de planche) qui reproduit `background-size: cover`. Les
 * nombres d'ici sont ceux de l'export, relisibles en face.
 *
 * Une scène par PLAGE HORAIRE qui en a une (aujourd'hui l'aube et le soir) ;
 * les autres plages gardent leur image fixe. Pour en animer une autre : même
 * export depuis l'outil, planche et éléments dans
 * `assets-sources/arene-vivante/<plage>/`, `node scripts/arene-vivante.mjs`,
 * et une entrée dans SCENES_VIVANTES.
 */

import type { ArenaPeriod } from './arena-background'
import { SCENES_COUR } from './arena-vivante-cour'

/** Cotes de la planche, le repère de tous les nombres de ce fichier. */
export const PLANCHE_LARGEUR = 1080
export const PLANCHE_HAUTEUR = 1920

/**
 * Durée d'une boucle (secondes). Les exports sont « authored » sur 10 s :
 * chaque mouvement y fait un nombre ENTIER de cycles, la boucle se referme
 * donc sans à-coup.
 */
export const BOUCLE_SECONDES = 10

/** Côté du halo d'une étoile (pixels de planche). */
export const ETOILE_TAILLE = 28
/** Côté du halo d'une lanterne (pixels de planche). */
export const LANTERNE_TAILLE = 90
/** Un rocher flotte de ± 7 px et penche de ± 2,5°. */
export const ROCHER_FLOTTEMENT = 7
export const ROCHER_BASCULE_DEGRES = 2.5
/** Une nappe de brume déborde de 60 px de chaque côté de la planche. */
export const BRUME_DEBORD = 60

const TAU = Math.PI * 2

/** `wave` de l'export : une sinusoïde de `k` cycles par boucle (t ∈ [0, 1]). */
export function onde(t: number, phase = 0, k = 1): number {
  return Math.sin(TAU * (k * t + phase))
}

/** `pulse` de l'export : la même sinusoïde ramenée entre 0 et 1. */
export function pulsation(t: number, phase = 0, k = 1): number {
  return 0.5 + 0.5 * onde(t, phase, k)
}

/** Une pulsation : `k` battements par boucle, décalés de `phase` (0 → 1). */
export interface Pulsation {
  k: number
  phase: number
}

/** Un rectangle dans le repère de la planche. */
export interface Zone {
  x: number
  y: number
  w: number
  h: number
}

/** Un nuage détouré, posé à sa place dans le ciel et balancé autour d'elle. */
export interface NuageVivant extends Zone {
  /** Fichier servi (sous /images/arene/vivante/). */
  src: string
  /** Amplitude du balancement horizontal (pixels de planche). */
  amplitude: number
  phase: number
}

/** Un rocher détouré qui flotte et penche. */
export interface RocherVivant extends Zone {
  src: string
  phase: number
}

/** Une étoile qui scintille : son halo grossit et s'allume `k` fois par boucle. */
export interface EtoileVivante {
  /** Centre de l'étoile peinte (pixels de planche). */
  x: number
  y: number
  phase: number
  k: number
}

/** La lueur de l'horizon, derrière l'académie : elle respire. */
export interface LueurVivante extends Zone {
  /** Couleurs du dégradé radial : au centre, puis à 40 %. */
  centre: string
  halo: string
  /** Opacité = min + amplitude × pulsation. */
  min: number
  amplitude: number
}

/** Un halo qui vacille : base + amplitude × (produit de deux pulsations). */
export interface Vacillement {
  base: number
  amplitude: number
  ondes: readonly [Pulsation, Pulsation]
}

export type BougieVivante = Zone & Vacillement

/** Une lanterne : son centre, et son vacillement propre. */
export interface LanterneVivante extends Vacillement {
  x: number
  y: number
  /** Côté du halo (pixels de planche) ; LANTERNE_TAILLE à défaut. */
  taille?: number
}

/** La colonne de la cascade, où glissent trois reflets. */
export interface CascadeVivante extends Zone {
  /** Passages d'un voile d'eau par boucle (un passage = une colonne). */
  passages: number
  /** Hauteur de la colonne d'eau servie aux voiles (pixels de planche), > h. */
  course: number
  /**
   * Le sens de l'eau : une chute DESCEND (défaut), le jet d'une fontaine
   * MONTE — mêmes voiles, joués à l'envers, et les gouttes retombent de la
   * pointe au lieu de jaillir du pied (12/10/2026, la cour d'honneur).
   */
  sens?: 'descend' | 'monte'
}

/** L'écume au pied de la cascade : elle palpite `k` fois par boucle. */
export interface EcumeVivante extends Zone {
  min: number
  amplitude: number
  k: number
}

/** Une nappe de brume qui traverse toute la largeur en une boucle. */
export interface NappeBrume {
  y: number
  h: number
  phase: number
  /** +1 : vers la droite, −1 : vers la gauche. */
  sens: 1 | -1
  opacite: number
}

export interface SceneVivante {
  period: ArenaPeriod
  /** La planche : l'illustration horaire dont les éléments mobiles ont été gommés. */
  plate: string
  etoiles: readonly EtoileVivante[]
  lueur: LueurVivante
  nuages: readonly NuageVivant[]
  /** Balancement vertical commun aux nuages (pixels de planche). */
  balancementVertical: number
  rochers: readonly RocherVivant[]
  bougie: BougieVivante
  lanternes: readonly LanterneVivante[]
  cascade: CascadeVivante
  ecume: EcumeVivante
  brume: readonly NappeBrume[]
  /** La teinte des nappes de brume, en « r, g, b ». */
  couleurBrume: string
}

const DOSSIER = '/images/arene/vivante'

/**
 * LES SCÈNES : depuis le 12/10/2026, les six plages vivent dans LA COUR
 * D'HONNEUR de l'académie (`lib/arena-vivante-cour.ts`). Les scènes du
 * château sur son île — l'aube et le soir recopiés de l'export de Lucas, les
 * quatre autres du 12/10 au matin — sont dans l'historique git.
 */
export const SCENES_VIVANTES: Partial<Record<ArenaPeriod, SceneVivante>> = SCENES_COUR

/** La scène vivante d'une plage, ou `undefined` si elle garde son image fixe. */
export function sceneVivanteDe(
  period: ArenaPeriod | null | undefined,
): SceneVivante | undefined {
  return period ? SCENES_VIVANTES[period] : undefined
}

/**
 * Les voiles d'eau de la cascade (12/10/2026, `scripts/cascade-texture.mjs`),
 * communs à toutes les scènes : posés par `ArenaVivante.module.css`.
 */
export const FICHIERS_CASCADE = [
  `${DOSSIER}/cascade-eau.webp`,
  `${DOSSIER}/cascade-filets.webp`,
] as const

/**
 * Tout ce qu'une scène fait charger : à précharger d'un bloc quand la plage
 * suivante est vivante, pour que le fondu parte d'un cache chaud (comme
 * `ArenaBackdrop` le fait déjà pour l'image d'une plage fixe).
 */
export function fichiersDeScene(scene: SceneVivante): string[] {
  return [
    scene.plate,
    ...scene.nuages.map((n) => n.src),
    ...scene.rochers.map((r) => r.src),
    ...FICHIERS_CASCADE,
  ]
}

/**
 * Le délai d'animation (secondes, négatif) qui place un mouvement en dents de
 * scie à sa phase : une phase de 0,3 démarre à 30 % du cycle, déjà en route.
 */
export function delaiDePhase(phase: number, cycle = BOUCLE_SECONDES): number {
  return -phase * cycle
}

/* --- Les mouvements, échantillonnés en images-clés ------------------------ */

/**
 * Une image du mouvement : UNIQUEMENT l'opacité et la transformation, les
 * deux propriétés que le compositeur anime sans repeindre. Le type l'impose.
 */
export interface ImageMouvement {
  opacity?: string
  transform?: string
}

/** Un mouvement périodique d'une couche, sur une boucle (t ∈ [0, 1]). */
export interface Mouvement {
  /** Nom des images-clés CSS, unique dans toute l'app. */
  nom: string
  /** L'harmonique la plus haute (cycles par boucle), pour l'échantillonnage. */
  frequence: number
  image: (t: number) => ImageMouvement
}

/** Tous les mouvements échantillonnés d'une scène, couche par couche. */
export interface MouvementsDeScene {
  etoiles: Mouvement[]
  lueur: Mouvement
  nuages: Mouvement[]
  rochers: Mouvement[]
  bougie: Mouvement
  lanternes: Mouvement[]
  ecume: Mouvement
}

/** Échantillons par cycle de l'harmonique la plus haute, et plancher. */
export const PAS_PAR_CYCLE = 8
export const PAS_MIN = 16

const arrondi = (n: number, decimales: number) => {
  const f = 10 ** decimales
  // `+ 0` range le −0 en 0 : sinon « -0 » et « 0 » feraient deux images.
  return Math.round(n * f) / f + 0
}
const opacite = (n: number) => String(arrondi(n, 3))
/**
 * Un déplacement de `n` pixels de planche, en POUR CENT de la taille de la
 * couche qui bouge (`translate` se lit en % de l'élément lui-même). Il était
 * écrit `calc(n * var(--u))` : des images-clés qui lisent une variable ne
 * partent pas au compositeur, et l'arène recalculait ses styles à chaque image
 * sur le fil principal (mesuré le 23/09/2026). Aucune `var()` dans une image.
 */
const pct = (n: number, taille: number) => `${arrondi((100 * n) / taille, 3)}%`

function vacillement(v: Vacillement, t: number): number {
  const [a, b] = v.ondes
  return (
    v.base +
    v.amplitude * pulsation(t, a.phase, a.k) * pulsation(t, b.phase, b.k)
  )
}

/**
 * Les mouvements d'une scène, formule pour formule depuis l'export. Le
 * balancement des nuages perd le `brightness` de l'export (+8 % au plus) : un
 * `filter` animé se repeint à chaque image.
 */
export function mouvementsDeScene(scene: SceneVivante): MouvementsDeScene {
  const nom = (couche: string) => `av-${scene.period}-${couche}`
  return {
    etoiles: scene.etoiles.map((e, i) => ({
      nom: nom(`etoile-${i}`),
      frequence: e.k,
      image: (t) => {
        const a = pulsation(t, e.phase, e.k)
        return { opacity: opacite(a), transform: `scale(${arrondi(0.6 + 0.6 * a, 3)})` }
      },
    })),
    lueur: {
      nom: nom('lueur'),
      frequence: 1,
      image: (t) => ({
        opacity: opacite(scene.lueur.min + scene.lueur.amplitude * pulsation(t)),
      }),
    },
    nuages: scene.nuages.map((n, i) => ({
      nom: nom(`nuage-${i}`),
      frequence: 1,
      image: (t) => ({
        transform: `translate(${pct(n.amplitude * onde(t, n.phase), n.w)}, ${pct(
          scene.balancementVertical * onde(t, n.phase + 0.25),
          n.h,
        )})`,
      }),
    })),
    rochers: scene.rochers.map((r, i) => ({
      nom: nom(`rocher-${i}`),
      frequence: 1,
      image: (t) => ({
        transform: `translateY(${pct(ROCHER_FLOTTEMENT * onde(t, r.phase), r.h)}) rotate(${arrondi(
          ROCHER_BASCULE_DEGRES * onde(t, r.phase + 0.2),
          3,
        )}deg)`,
      }),
    })),
    bougie: {
      nom: nom('bougie'),
      frequence: scene.bougie.ondes[0].k + scene.bougie.ondes[1].k,
      image: (t) => ({ opacity: opacite(vacillement(scene.bougie, t)) }),
    },
    lanternes: scene.lanternes.map((l, i) => ({
      nom: nom(`lanterne-${i}`),
      frequence: l.ondes[0].k + l.ondes[1].k,
      image: (t) => ({ opacity: opacite(vacillement(l, t)) }),
    })),
    ecume: {
      nom: nom('ecume'),
      frequence: scene.ecume.k,
      image: (t) => ({
        opacity: opacite(
          scene.ecume.min + scene.ecume.amplitude * pulsation(t, 0, scene.ecume.k),
        ),
      }),
    },
  }
}

/** La liste à plat, pour écrire la feuille ou tester chaque mouvement. */
export function tousLesMouvements(m: MouvementsDeScene): Mouvement[] {
  return [
    ...m.etoiles,
    m.lueur,
    ...m.nuages,
    ...m.rochers,
    m.bougie,
    ...m.lanternes,
    m.ecume,
  ]
}

/** Le nombre d'intervalles échantillonnés sur une boucle. */
export function pasDe(m: Mouvement): number {
  return Math.max(PAS_MIN, Math.ceil(m.frequence * PAS_PAR_CYCLE))
}

function declarations(image: ImageMouvement): string {
  return Object.entries(image)
    .map(([propriete, valeur]) => `${propriete}:${valeur}`)
    .join(';')
}

/**
 * Les images-clés CSS d'un mouvement, échantillonnées sur une boucle. La
 * dernière image est la première : la boucle se referme au pixel près même
 * quand le sinus de 2π n'est pas tout à fait nul.
 */
export function imagesCles(m: Mouvement): string {
  const n = pasDe(m)
  const etapes: string[] = []
  for (let i = 0; i <= n; i++) {
    const t = i === n ? 0 : i / n
    etapes.push(`${arrondi((100 * i) / n, 3)}%{${declarations(m.image(t))}}`)
  }
  return `@keyframes ${m.nom}{${etapes.join('')}}`
}

/** Toute la feuille d'une scène : les images-clés de chacun de ses mouvements. */
export function feuilleDeScene(scene: SceneVivante): string {
  return tousLesMouvements(mouvementsDeScene(scene)).map(imagesCles).join('\n')
}
