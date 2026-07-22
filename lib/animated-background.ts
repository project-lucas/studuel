/**
 * Fond animé de l'Arène (onglet Défi) : logique pure des particules qui
 * vivent par-dessus le décor peint — feuilles qui tombent (dessinées sur
 * canvas) et poussière dorée ambiante (points CSS). Les composants clients
 * vivent dans components/background/ ; ici tout est testable.
 */

/**
 * Générateur pseudo-aléatoire déterministe (mulberry32) : même graine →
 * même séquence. Indispensable pour la poussière dorée rendue côté serveur :
 * le HTML SSR et l'hydratation doivent produire exactement les mêmes styles
 * inline, sinon React signale un mismatch.
 */
export function createRng(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const round2 = (n: number) => Math.round(n * 100) / 100

/* --- Feuilles (canvas) ----------------------------------------------------- */

/** Palette automnale dorée des feuilles, du plus clair au plus sombre. */
export const LEAF_COLORS = ['#F9B233', '#F87171', '#D97706', '#92400E'] as const

export const LEAF_MIN_COUNT = 15
export const LEAF_MAX_COUNT = 25
/** Marge hors-champ (px) : une feuille naît/meurt toujours hors de l'écran. */
export const LEAF_MARGIN = 30

export interface Leaf {
  /** Position en px dans le repère du canvas. */
  x: number
  y: number
  /** Vitesse de chute (px/s), constante par feuille. */
  vy: number
  /** Déphasage du vent sinusoïdal (rad) : chaque feuille a son propre souffle. */
  windPhase: number
  /** Amplitude du vent (px/s). */
  windAmp: number
  rotation: number
  /** Vitesse de rotation (rad/s), signée — les deux sens existent. */
  rotationSpeed: number
  /** Longueur de la feuille (px). */
  size: number
  opacity: number
  color: string
}

/** Nombre de feuilles selon la largeur d'écran, borné 15–25 (budget perfs). */
export function leafCountFor(width: number): number {
  return Math.min(
    LEAF_MAX_COUNT,
    Math.max(LEAF_MIN_COUNT, Math.round(width / 45)),
  )
}

/**
 * Fabrique une feuille. `scatterY` disperse la feuille sur toute la hauteur —
 * à utiliser au premier remplissage pour que la scène soit déjà habitée au
 * montage (sinon une « vague » de feuilles descend d'un bloc). Les respawns
 * suivants naissent au-dessus du bord haut.
 */
export function spawnLeaf(
  rng: () => number,
  width: number,
  height: number,
  scatterY: boolean,
): Leaf {
  return {
    x: rng() * width,
    y: scatterY ? rng() * height : -LEAF_MARGIN - rng() * height * 0.15,
    vy: 28 + rng() * 34,
    windPhase: rng() * Math.PI * 2,
    windAmp: 14 + rng() * 26,
    rotation: rng() * Math.PI * 2,
    rotationSpeed: (rng() - 0.5) * 2.4,
    size: 10 + rng() * 8,
    opacity: 0.55 + rng() * 0.35,
    color: LEAF_COLORS[Math.floor(rng() * LEAF_COLORS.length)],
  }
}

/**
 * Avance une feuille de `dtMs` millisecondes (immutabilité : retourne une
 * nouvelle feuille). Chute constante + dérive horizontale sinusoïdale (le
 * vent, cadencé par l'horloge globale `timeMs`) + rotation continue. Chaque
 * feuille se recycle indépendamment en sortant par le bas — aucune
 * réinitialisation globale, la boucle est donc invisible.
 */
export function stepLeaf(
  leaf: Leaf,
  dtMs: number,
  timeMs: number,
  width: number,
  height: number,
  rng: () => number,
): Leaf {
  const dt = dtMs / 1000
  const y = leaf.y + leaf.vy * dt
  if (y > height + LEAF_MARGIN) return spawnLeaf(rng, width, height, false)

  let x = leaf.x + Math.sin(timeMs * 0.001 + leaf.windPhase) * leaf.windAmp * dt
  if (x < -LEAF_MARGIN) x = width + LEAF_MARGIN
  else if (x > width + LEAF_MARGIN) x = -LEAF_MARGIN

  return { ...leaf, x, y, rotation: leaf.rotation + leaf.rotationSpeed * dt }
}

/* --- Poussière dorée (CSS) ------------------------------------------------- */

export const DUST_COUNT = 30
/** Graine fixe : le semis de poussière est identique à chaque rendu (SSR). */
export const DUST_SEED = 20260721

export interface DustParticle {
  /** Position de départ, en % du conteneur. */
  leftPct: number
  topPct: number
  /** Diamètre du point (px). */
  size: number
  /** Délai négatif (s) : le point naît déjà au milieu de son cycle. */
  delaySec: number
  durationSec: number
  /** Opacité au pic de la pulsation (0.3–0.6 : lueur, pas projecteur). */
  peakOpacity: number
  /** Dérive horizontale totale sur un cycle (px). */
  driftPx: number
}

/** Semis déterministe de points dorés qui flottent lentement vers le haut. */
export function makeDustParticles(
  count: number = DUST_COUNT,
  seed: number = DUST_SEED,
): DustParticle[] {
  const rng = createRng(seed)
  return Array.from({ length: count }, () => ({
    leftPct: round2(2 + rng() * 96),
    topPct: round2(30 + rng() * 65),
    size: round2(2 + rng() * 2.5),
    delaySec: round2(-rng() * 12),
    durationSec: round2(6 + rng() * 8),
    peakOpacity: round2(0.3 + rng() * 0.3),
    driftPx: round2((rng() - 0.5) * 36),
  }))
}
