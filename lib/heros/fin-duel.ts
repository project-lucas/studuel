// LA FIN DU DUEL DES HÉROS — logique pure des deux barres qui montent en direct
// (29/10/2026, Lucas : « il faut la barre de niveau qui monte en direct, et la
// barre de trophées qui monte aussi en direct », comme les récompenses d'un
// quiz). Les jetons volent des cartes de récompense vers les barres ; chaque
// atterrissage ajoute sa part, et la barre se relit depuis le total.

import { jetonsVague, repartir } from '@/lib/gains'
import { BAND_SPAN, trophyBand } from '@/lib/trophy-road'
import { walletLevelInfo, xpForLevel } from '@/lib/wallet'

/** Une barre de progression : où l'on en est dans le pas en cours. */
export type BarreProgres = {
  /** Le niveau (XP) ou le plancher du palier (trophées). */
  cran: number
  fait: number
  pas: number
  /** 0..1, ce que la barre montre. */
  part: number
}

/** La barre de niveau pour un total d'XP — la même que celle du bandeau. */
export function barreXp(xpTotal: number): BarreProgres {
  const info = walletLevelInfo(xpTotal)
  const plancher = xpForLevel(info.level)
  const pas = Math.max(1, info.nextAt - plancher)
  const fait = Math.min(pas, Math.max(0, info.currentXp - plancher))
  return { cran: info.level, fait, pas, part: fait / pas }
}

/**
 * La barre de trophées : la progression dans le palier de cent en cours
 * (lib/trophy-road, une bande = cent trophées). `cran` est le plancher du
 * palier ; la barre est pleine au plancher suivant.
 */
export function barreTrophees(trophees: number): BarreProgres {
  const t = Math.max(0, Math.floor(trophees))
  const bande = trophyBand(t)
  // La dernière bande est ouverte : on continue de la lire par paliers de cent.
  const plancher = bande.ceiling === null ? Math.floor(t / BAND_SPAN) * BAND_SPAN : bande.floor
  const fait = t - plancher
  return { cran: plancher, fait, pas: BAND_SPAN, part: fait / BAND_SPAN }
}

/**
 * Les parts d'une vague de jetons : autant de jetons que la vague des quêtes,
 * jamais plus que le montant — chaque jeton porte au moins une unité, sinon la
 * barre resterait immobile à son atterrissage.
 */
export function partsVague(montant: number): number[] {
  const m = Math.max(0, Math.floor(Number(montant) || 0))
  if (m === 0) return []
  return repartir(m, Math.min(m, jetonsVague(m)))
}
