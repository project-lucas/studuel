// Le registre des banques de questions des jeux de salon : id du jeu → builder
// de pool. Vit dans lib/ (pur, sans dépendance serveur) pour que la page
// /defi/jeux/[jeu] ne fasse qu'orchestrer, et surtout pour que la cohérence
// « tout jeu implémenté a bien un builder » soit TESTABLE (pools.test.ts).
import type { ModeQuestion } from '@/lib/defi-modes'
import { DEFAULT_PALIER } from '@/lib/jeux/paliers'
import {
  ULTIME,
  ULTIME_PREPARED_LEVELS,
  bankTierFor,
} from '@/lib/jeux/ultime'
import { buildCapitalesPool } from '@/lib/jeux/capitales'
import { buildConjugaisonPool } from '@/lib/jeux/conjugaison-eclair'
import { buildChasseFautePool } from '@/lib/jeux/chasse-faute'
import { buildCalculMentalPool } from '@/lib/jeux/calcul-mental'
import { buildTraductionFlashPool } from '@/lib/jeux/traduction-flash'
import { buildTraduccionFlashPool } from '@/lib/jeux/traduccion-flash'
import { buildFalsosAmigosPool } from '@/lib/jeux/falsos-amigos'
import { buildClasseMoiCaPool } from '@/lib/jeux/classe-moi-ca'
import { buildChasseElementsPool } from '@/lib/jeux/chasse-elements'
import { buildBonneUnitePool } from '@/lib/jeux/bonne-unite'
import { buildFrisePool } from '@/lib/jeux/frise-folle'
import { buildPhrasePool } from '@/lib/jeux/phrase-en-vrac'
import type { OrderBoard } from '@/lib/jeux/ordering'
import { buildAnatomiePool, type OrganRound } from '@/lib/jeux/anatomie'

// Chaque id marqué `implemented: true` au catalogue doit figurer dans EXACTEMENT
// un des quatre registres de ce fichier : QCM (ici), ordre, compte, zones. La
// divergence est bloquée par pools.test.ts (aucun jeu jouable sans banque,
// aucune banque orpheline, jamais deux registres pour un même jeu).
// La taille demandée est TRANSMISE au builder, comme dans les trois registres
// ci-dessous. Sans elle, chaque builder retombait sur son propre défaut interne
// (20 pour la suite logique, 30 ailleurs) — parfois plus petit que ce que la
// mécanique consomme réellement. Le `.slice()` de l'appelant ne pouvait alors
// que raccourcir, jamais compléter, et la table rebouclait sur `pool[i % n]` :
// la même question, avec les mêmes options dans le même ordre, re-servie en
// pleine partie. C'est exactement ce que `formats.ts` interdit.
export const POOL_BUILDERS: Record<
  string,
  (seed: string, count: number, tier: number) => ModeQuestion[]
> = {
  capitales: (seed, count) => buildCapitalesPool(seed, count),
  'conjugaison-eclair': (seed, count, tier) =>
    buildConjugaisonPool(seed, count, tier),
  'chasse-faute': (seed, count) => buildChasseFautePool(seed, count),
  'calcul-mental': (seed, count, tier) =>
    buildCalculMentalPool(seed, count, tier),
  'traduction-flash': (seed, count) => buildTraductionFlashPool(seed, count),
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
  tier: number = DEFAULT_PALIER,
): ModeQuestion[] | null {
  const builder = POOL_BUILDERS[id]
  return builder ? builder(seed, count, tier) : null
}

/**
 * La banque de l'ÉPREUVE ULTIME : un paquet de questions PAR NIVEAU, chacun à sa
 * difficulté (lib/jeux/ultime).
 *
 * Une épreuve sans fin ne peut pas se servir d'un pool à plat : la difficulté y
 * change EN COURS DE PARTIE, et le navigateur ne peut pas fabriquer la suite
 * (les banques sont déterministes mais tirées côté serveur). On prépare donc
 * d'avance les trente premiers niveaux ; au-delà, la table re-sert le dernier
 * paquet pendant que le chrono, lui, continue de fondre.
 *
 * Renvoie null si le jeu n'a pas de banque générative — c'est exactement la
 * raison pour laquelle tous les jeux n'ont pas d'épreuve ultime.
 */
export function buildUltimePool(
  id: string,
  seed: string,
  levels: number = ULTIME_PREPARED_LEVELS,
): ModeQuestion[][] | null {
  const builder = POOL_BUILDERS[id]
  if (!builder) return null
  const paquets: ModeQuestion[][] = []
  for (let level = 0; level < levels; level++) {
    // Une question de marge par niveau : une réponse en retard ne doit jamais
    // tomber sur un paquet vide.
    const questions = builder(
      `${seed}:n${level}`,
      ULTIME.perLevel + 1,
      bankTierFor(level),
    )
    if (questions.length === 0) return null
    paquets.push(questions)
  }
  return paquets
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

// --------------------------------------------------------------- anatomie
// Quatrième forme : des ZONES à désigner sur un schéma, ni QCM, ni tableaux,
// ni tirages.
// Le palier est transmis comme aux QCM : la planche montre toujours tout, mais
// la QUESTION monte avec lui (trachée, diaphragme, pancréas, rate…).
export const ZONE_BUILDERS: Record<
  string,
  (seed: string, count: number, tier: number) => OrganRound[]
> = {
  'anatomie-express': (seed, count, tier) => buildAnatomiePool(seed, count, tier),
}

/** Les manches d'un jeu de désignation, ou null si aucune banque enregistrée. */
export function buildZonePool(
  id: string,
  seed: string,
  count: number,
  tier: number = DEFAULT_PALIER,
): OrganRound[] | null {
  const builder = ZONE_BUILDERS[id]
  return builder ? builder(seed, count, tier) : null
}

/**
 * La FORME de banque d'un jeu — c'est elle qui décide de la table de jeu à
 * monter, pas la mécanique : « Capitales du monde » et « Le compte est bon »
 * partagent la mécanique `expedition` mais ne servent pas du tout la même
 * matière (des QCM d'un côté, des tirages de plaques de l'autre).
 */
export type PoolKind = 'qcm' | 'ordre' | 'zones'

export function poolKind(id: string): PoolKind | null {
  if (POOL_BUILDERS[id]) return 'qcm'
  if (ORDER_BUILDERS[id]) return 'ordre'
  if (ZONE_BUILDERS[id]) return 'zones'
  return null
}

/** Tous les ids ayant une banque, quelle qu'en soit la forme. */
export function idsWithPool(): string[] {
  return [
    ...Object.keys(POOL_BUILDERS),
    ...Object.keys(ORDER_BUILDERS),
    ...Object.keys(ZONE_BUILDERS),
  ]
}
