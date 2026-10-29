import { GOAL_POINTS } from '@/lib/duel/course'
import type { CinematiqueVictoire, Heros } from './catalogue'

// LE COMBAT DES HÉROS — la PEAU de la course classée (docs/CADRAGE-DUEL-POKEMON.md).
//
// Le moteur ne change pas : deux compteurs montent à 1 000 points. La peau les
// lit autrement — mes points sont les dégâts que l'autre a encaissés, mes PV
// sont ce qui manque à SA barre. Une bonne réponse est une attaque, la dorée un
// coup critique, une barre pleine un K.O. Rien ici ne décide d'un point.

export const PV_MAX = GOAL_POINTS

/** Sous cette part de PV, la barre passe à l'orange. */
export const SEUIL_ENTAME = 0.5
/** Sous cette part, au rouge — il ne reste qu'un ou deux coups. */
export const SEUIL_CRITIQUE = 0.2

/** Les PV d'un camp : ce que l'adversaire n'a pas encore marqué. */
export function pvRestants(scoreAdverse: number): number {
  if (!Number.isFinite(scoreAdverse) || scoreAdverse <= 0) return PV_MAX
  return Math.max(0, PV_MAX - Math.floor(scoreAdverse))
}

/** La part de la barre de PV encore pleine (0..1). */
export function partPv(pv: number): number {
  if (!Number.isFinite(pv) || pv <= 0) return 0
  return Math.min(1, pv / PV_MAX)
}

export type TonPv = 'plein' | 'entame' | 'critique'

/** La couleur de la barre, façon feu tricolore. */
export function tonPv(part: number): TonPv {
  if (part > SEUIL_ENTAME) return 'plein'
  if (part > SEUIL_CRITIQUE) return 'entame'
  return 'critique'
}

export function estKo(pv: number): boolean {
  return Number.isFinite(pv) && pv <= 0
}

export type Coup = {
  /** Clé d'animation : chaque coup rejoue son attaque. */
  id: number
  /** Le camp qui FRAPPE. */
  camp: 'moi' | 'rival'
  degats: number
  critique: boolean
}

/**
 * Le coup porté par une réponse. Une erreur ne frappe pas (null). Les dégâts
 * sont plafonnés aux PV qui restent : le chiffre qui vole est celui que la
 * barre perd vraiment.
 */
export function coupDeReponse(input: {
  id: number
  camp: 'moi' | 'rival'
  points: number
  golden: boolean
  pvCible: number
}): Coup | null {
  const points = Number.isFinite(input.points) ? Math.floor(input.points) : 0
  if (points <= 0) return null
  const pv = Math.max(0, Math.floor(input.pvCible))
  return {
    id: input.id,
    camp: input.camp,
    degats: Math.min(points, pv),
    critique: input.golden,
  }
}

/** La cinématique de victoire par défaut d'un héros (la première, offerte). */
export function victoireParDefaut(heros: Heros): CinematiqueVictoire {
  return heros.victoires[0]
}

/** L'élève peut-il jouer cette cinématique ? Offerte, ou achetée. */
export function victoireDisponible(
  victoire: CinematiqueVictoire,
  possedees: readonly string[],
): boolean {
  return victoire.prixGemmes === 0 || possedees.includes(victoire.id)
}

/**
 * La cinématique qui se joue à la victoire : celle que l'élève a choisie si
 * elle lui appartient, sinon celle par défaut. Un choix périmé (cinématique
 * retirée du catalogue, achat non confirmé) ne laisse jamais l'écran vide.
 */
export function victoireJouee(
  heros: Heros,
  choisie: string | null,
  possedees: readonly string[],
): CinematiqueVictoire {
  const trouvee = choisie ? heros.victoires.find((v) => v.id === choisie) : undefined
  if (trouvee && victoireDisponible(trouvee, possedees)) return trouvee
  return victoireParDefaut(heros)
}
