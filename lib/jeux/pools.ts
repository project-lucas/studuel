// Le registre des banques de questions des jeux de salon : id du jeu → builder
// de pool. Vit dans lib/ (pur, sans dépendance serveur) pour que la page
// /defi/jeux/[jeu] ne fasse qu'orchestrer, et surtout pour que la cohérence
// « tout jeu implémenté a bien un builder » soit TESTABLE (pools.test.ts).
import type { ModeQuestion } from '@/lib/defi-modes'
import { buildCapitalesPool } from '@/lib/jeux/capitales'
import { buildOrthographePool } from '@/lib/jeux/orthographe'
import { buildConjugaisonPool } from '@/lib/jeux/conjugaison-eclair'
import { buildChasseFautePool } from '@/lib/jeux/chasse-faute'
import { buildCalculMentalPool } from '@/lib/jeux/calcul-mental'
import { buildSuiteLogiquePool } from '@/lib/jeux/suite-logique'
import { buildTraductionFlashPool } from '@/lib/jeux/traduction-flash'
import { buildFauxAmisPool } from '@/lib/jeux/faux-amis'
import { buildTraduccionFlashPool } from '@/lib/jeux/traduccion-flash'
import { buildFalsosAmigosPool } from '@/lib/jeux/falsos-amigos'
import { buildClasseMoiCaPool } from '@/lib/jeux/classe-moi-ca'
import { buildChasseElementsPool } from '@/lib/jeux/chasse-elements'
import { buildBonneUnitePool } from '@/lib/jeux/bonne-unite'
import { buildFrisePool } from '@/lib/jeux/frise-folle'
import { buildPhrasePool } from '@/lib/jeux/phrase-en-vrac'
import type { OrderBoard } from '@/lib/jeux/ordering'
import {
  buildComptePool,
  type CountdownPuzzle,
} from '@/lib/jeux/compte-est-bon'

// Chaque id doit être marqué `implemented: true` dans le catalogue ET présent
// ici OU dans ORDER_BUILDERS. La divergence est bloquée par pools.test.ts
// (aucun jeu jouable sans banque, aucune banque orpheline).
export const POOL_BUILDERS: Record<string, (seed: string) => ModeQuestion[]> = {
  capitales: (seed) => buildCapitalesPool(seed),
  orthographe: (seed) => buildOrthographePool(seed),
  'conjugaison-eclair': (seed) => buildConjugaisonPool(seed),
  'chasse-faute': (seed) => buildChasseFautePool(seed),
  'calcul-mental': (seed) => buildCalculMentalPool(seed),
  'suite-logique': (seed) => buildSuiteLogiquePool(seed),
  'traduction-flash': (seed) => buildTraductionFlashPool(seed),
  'faux-amis': (seed) => buildFauxAmisPool(seed),
  'traduccion-flash': (seed) => buildTraduccionFlashPool(seed),
  'falsos-amigos': (seed) => buildFalsosAmigosPool(seed),
  'classe-moi-ca': (seed) => buildClasseMoiCaPool(seed),
  'chasse-elements': (seed) => buildChasseElementsPool(seed),
  'bonne-unite': (seed) => buildBonneUnitePool(seed),
}

// Le pool d'un jeu par id, ou null si aucune banque n'est enregistrée.
export function buildSalonPool(id: string, seed: string): ModeQuestion[] | null {
  const builder = POOL_BUILDERS[id]
  return builder ? builder(seed) : null
}

// ------------------------------------------------------- jeux de remise en ordre
// Les jeux à tableaux (Frise folle, Phrase en vrac) ne servent pas des QCM mais
// des TABLEAUX d'éléments à remettre dans l'ordre : leur banque a une autre
// forme, donc son propre registre. Un jeu appartient à l'un OU à l'autre, jamais
// aux deux — c'est vérifié par pools.test.ts.
export const ORDER_BUILDERS: Record<
  string,
  (seed: string, count: number) => OrderBoard[]
> = {
  'frise-folle': (seed, count) => buildFrisePool(seed, count),
  'phrase-en-vrac': (seed, count) => buildPhrasePool(seed, count),
}

/** Les tableaux d'un jeu d'ordre, ou null si aucune banque n'est enregistrée. */
export function buildOrderPool(
  id: string,
  seed: string,
  count: number,
): OrderBoard[] | null {
  const builder = ORDER_BUILDERS[id]
  return builder ? builder(seed, count) : null
}

// ------------------------------------------------------------ le compte est bon
// Troisième forme de banque : des TIRAGES (six plaques + une cible), ni QCM ni
// tableaux. Un seul jeu s'en sert, mais il passe par un registre comme les
// autres pour que le garde-fou « tout jeu jouable a une banque » reste vrai.
export const COUNTDOWN_BUILDERS: Record<
  string,
  (seed: string, count: number) => CountdownPuzzle[]
> = {
  'compte-est-bon': (seed, count) => buildComptePool(seed, count),
}

/** Les tirages d'un jeu de compte, ou null si aucune banque n'est enregistrée. */
export function buildCountdownPool(
  id: string,
  seed: string,
  count: number,
): CountdownPuzzle[] | null {
  const builder = COUNTDOWN_BUILDERS[id]
  return builder ? builder(seed, count) : null
}

/**
 * La FORME de banque d'un jeu — c'est elle qui décide de la table de jeu à
 * monter, pas la mécanique : « Capitales du monde » et « Le compte est bon »
 * partagent la mécanique `expedition` mais ne servent pas du tout la même
 * matière (des QCM d'un côté, des tirages de plaques de l'autre).
 */
export type PoolKind = 'qcm' | 'ordre' | 'compte'

export function poolKind(id: string): PoolKind | null {
  if (POOL_BUILDERS[id]) return 'qcm'
  if (ORDER_BUILDERS[id]) return 'ordre'
  if (COUNTDOWN_BUILDERS[id]) return 'compte'
  return null
}

/** Tous les ids ayant une banque, quelle qu'en soit la forme. */
export function idsWithPool(): string[] {
  return [
    ...Object.keys(POOL_BUILDERS),
    ...Object.keys(ORDER_BUILDERS),
    ...Object.keys(COUNTDOWN_BUILDERS),
  ]
}
