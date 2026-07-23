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
import { buildAnatomiePool, type OrganRound } from '@/lib/jeux/anatomie'

// Chaque id doit être marqué `implemented: true` dans le catalogue ET présent
// ici OU dans ORDER_BUILDERS. La divergence est bloquée par pools.test.ts
// (aucun jeu jouable sans banque, aucune banque orpheline).
// La taille demandée est TRANSMISE au builder, comme dans les trois registres
// ci-dessous. Sans elle, chaque builder retombait sur son propre défaut interne
// (20 pour la suite logique, 30 ailleurs) — parfois plus petit que ce que la
// mécanique consomme réellement. Le `.slice()` de l'appelant ne pouvait alors
// que raccourcir, jamais compléter, et la table rebouclait sur `pool[i % n]` :
// la même question, avec les mêmes options dans le même ordre, re-servie en
// pleine partie. C'est exactement ce que `formats.ts` interdit.
export const POOL_BUILDERS: Record<
  string,
  (seed: string, count: number) => ModeQuestion[]
> = {
  capitales: (seed, count) => buildCapitalesPool(seed, count),
  orthographe: (seed, count) => buildOrthographePool(seed, count),
  'conjugaison-eclair': (seed, count) => buildConjugaisonPool(seed, count),
  'chasse-faute': (seed, count) => buildChasseFautePool(seed, count),
  'calcul-mental': (seed, count) => buildCalculMentalPool(seed, count),
  'suite-logique': (seed, count) => buildSuiteLogiquePool(seed, count),
  'traduction-flash': (seed, count) => buildTraductionFlashPool(seed, count),
  'faux-amis': (seed, count) => buildFauxAmisPool(seed, count),
  'traduccion-flash': (seed, count) => buildTraduccionFlashPool(seed, count),
  'falsos-amigos': (seed, count) => buildFalsosAmigosPool(seed, count),
  'classe-moi-ca': (seed, count) => buildClasseMoiCaPool(seed, count),
  'chasse-elements': (seed, count) => buildChasseElementsPool(seed, count),
  'bonne-unite': (seed, count) => buildBonneUnitePool(seed, count),
}

/** Le pool d'un jeu par id, ou null si aucune banque n'est enregistrée. */
export function buildSalonPool(
  id: string,
  seed: string,
  count: number,
): ModeQuestion[] | null {
  const builder = POOL_BUILDERS[id]
  return builder ? builder(seed, count) : null
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

// --------------------------------------------------------------- anatomie
// Quatrième forme : des ZONES à désigner sur un schéma, ni QCM, ni tableaux,
// ni tirages.
export const ZONE_BUILDERS: Record<
  string,
  (seed: string, count: number) => OrganRound[]
> = {
  'anatomie-express': (seed, count) => buildAnatomiePool(seed, count),
}

/** Les manches d'un jeu de désignation, ou null si aucune banque enregistrée. */
export function buildZonePool(
  id: string,
  seed: string,
  count: number,
): OrganRound[] | null {
  const builder = ZONE_BUILDERS[id]
  return builder ? builder(seed, count) : null
}

/**
 * La FORME de banque d'un jeu — c'est elle qui décide de la table de jeu à
 * monter, pas la mécanique : « Capitales du monde » et « Le compte est bon »
 * partagent la mécanique `expedition` mais ne servent pas du tout la même
 * matière (des QCM d'un côté, des tirages de plaques de l'autre).
 */
export type PoolKind = 'qcm' | 'ordre' | 'compte' | 'zones'

export function poolKind(id: string): PoolKind | null {
  if (POOL_BUILDERS[id]) return 'qcm'
  if (ORDER_BUILDERS[id]) return 'ordre'
  if (COUNTDOWN_BUILDERS[id]) return 'compte'
  if (ZONE_BUILDERS[id]) return 'zones'
  return null
}

/** Tous les ids ayant une banque, quelle qu'en soit la forme. */
export function idsWithPool(): string[] {
  return [
    ...Object.keys(POOL_BUILDERS),
    ...Object.keys(ORDER_BUILDERS),
    ...Object.keys(COUNTDOWN_BUILDERS),
    ...Object.keys(ZONE_BUILDERS),
  ]
}
