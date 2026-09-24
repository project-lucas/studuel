/**
 * Fond animé de l'Arène (onglet Défi) : logique pure de la poussière dorée
 * ambiante (points CSS) qui flotte par-dessus le décor peint. Le composant
 * client vit dans components/background/ ; ici tout est testable.
 *
 * Les feuilles qui tombaient (canvas) et les deux braises dorées ont été
 * retirées le 23/09/2026 (Lucas : « retire les feuilles et les deux flammes
 * jaunes ») : l'arène vivante a ses propres mouvements, et les braises
 * n'éclairaient plus aucune flamme peinte depuis que le décor a changé.
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

/* --- Poussière dorée (CSS) ------------------------------------------------- */

/**
 * Quatorze points aux cycles LONGS (16 à 26 s). Ce qui coûte au fil principal,
 * ce n'est pas un point qui bouge — le compositeur s'en charge —, c'est chaque
 * FIN DE CYCLE, que le navigateur resynchronise sur le fil principal. Trente
 * points aux cycles de 6 à 14 s en faisaient trois par seconde : 4,5 % du fil au
 * processeur ×4, la plus grosse part de l'arène au repos (mesuré le
 * 23/09/2026). Quatorze points lents en font une toutes les 1,5 s.
 */
export const DUST_COUNT = 14
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
    delaySec: round2(-rng() * 26),
    durationSec: round2(16 + rng() * 10),
    peakOpacity: round2(0.3 + rng() * 0.3),
    driftPx: round2((rng() - 0.5) * 36),
  }))
}

/**
 * Le sens de la dérive d'un point, en trois VARIANTES écrites en dur dans le
 * CSS (`.abg-dust[data-derive]`). La dérive exacte de chaque point vivait
 * dans une variable (`var(--dust-drift)`) lue par les images-clés : une
 * animation dont les images-clés lisent une variable tourne sur le fil
 * principal, et trente points recalculaient les styles de l'arène à chaque
 * image (39 % du fil principal au processeur ×4, mesuré le 23/09/2026). Trois
 * sens suffisent à l'œil ; ils laissent le compositeur tout jouer seul.
 */
export type SensDeDerive = 'gauche' | 'aucune' | 'droite'

/** Sous 6 px de dérive, le point monte droit. */
export const DERIVE_MINIMALE_PX = 6

export function sensDeDerive(driftPx: number): SensDeDerive {
  if (driftPx <= -DERIVE_MINIMALE_PX) return 'gauche'
  if (driftPx >= DERIVE_MINIMALE_PX) return 'droite'
  return 'aucune'
}
