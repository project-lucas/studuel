// -----------------------------------------------------------------------------
// L'ADVERSAIRE D'UNE COURSE — ce que la page décide, ce que l'écran affiche, ce
// que le serveur revalide. Un seul objet sérialisable, deux origines :
//
//   · `replay` — un VRAI élève du même niveau, à portée de trophées, dont on
//     rejoue la dernière course sur cette matière. Toujours préféré ;
//   · `bot`    — un robot du banc (lib/duel/bots), marqué comme tel, quand
//     personne n'a encore laissé de trace à portée.
//
// L'objet ne porte JAMAIS de points : la ligne de temps se refabrique à partir
// de la graine du duel et de sa question dorée (`opponentTimeline`), côté écran
// comme côté serveur, avec les mêmes fonctions.
// -----------------------------------------------------------------------------

import type { AvatarConfig } from '@/lib/avatar'
import { botById, temperamentLabel } from '@/lib/duel/bots'
import { goldenIndex } from '@/lib/duel/course'
import {
  buildTimeline,
  timelineFromSteps,
  tuningForTrophies,
  type ReplayStep,
  type RivalTimeline,
  type Temperament,
} from '@/lib/duel/rival'
import { MATCH_RANGE } from '@/lib/defi/matchmaking'

export type OpponentIdentity = {
  /** Prénom seul. */
  name: string
  avatar: AvatarConfig
  /** Ses trophées sur la matière (référence de l'appariement). */
  trophies: number
  isBot: boolean
  /** Ce qu'on affiche sous le nom : tempérament d'un robot, devise… */
  tagline: string
}

export type BotOpponent = {
  kind: 'bot'
  botId: string
  /** Les trophées de l'ÉLÈVE sur la matière — c'est sur eux que le robot se règle. */
  trophiesRef: number
  identity: OpponentIdentity
}

export type ReplayOpponent = {
  kind: 'replay'
  replayId: string
  steps: ReplayStep[]
  /** Écart de trophées avec l'élève, pour la légende (null = appariement ouvert). */
  range: number | null
  identity: OpponentIdentity
}

export type Opponent = BotOpponent | ReplayOpponent

/** Un adversaire robot, prêt à être servi. Null si l'id est inconnu. */
export function botOpponent(botId: string, trophiesRef: number): BotOpponent | null {
  const bot = botById(botId)
  if (!bot) return null
  return {
    kind: 'bot',
    botId,
    trophiesRef: Math.max(0, Math.floor(Number.isFinite(trophiesRef) ? trophiesRef : 0)),
    identity: {
      name: bot.name,
      avatar: bot.avatar,
      trophies: Math.max(0, Math.floor(Number.isFinite(trophiesRef) ? trophiesRef : 0)),
      isBot: true,
      tagline: `${temperamentLabel(bot.temperament)} · ${bot.motto}`,
    },
  }
}

/** Le tempérament affiché du rival (les replays n'en ont pas). */
export function opponentTemperament(opponent: Opponent): Temperament | null {
  if (opponent.kind !== 'bot') return null
  return botById(opponent.botId)?.temperament ?? null
}

/**
 * La ligne de temps du rival pour CE duel. Déterministe : la page et le
 * serveur, avec la même graine, obtiennent le même rival à la milliseconde.
 * Null si un robot inconnu est demandé — jamais un rival inventé.
 */
export function opponentTimeline(
  opponent: Opponent,
  seed: string,
): RivalTimeline | null {
  const golden = goldenIndex(seed)
  if (opponent.kind === 'replay') {
    return timelineFromSteps(opponent.steps, golden)
  }
  const bot = botById(opponent.botId)
  if (!bot) return null
  const tuning = tuningForTrophies(opponent.trophiesRef, bot.strength)
  return buildTimeline(seed, { ...tuning, temperament: bot.temperament }, golden)
}

/** La ligne sous le nom sur l'écran VS : honnête sur ce qu'on a trouvé. */
export function opponentCaption(opponent: Opponent): string {
  if (opponent.kind === 'bot') return 'Rival d’entraînement · robot'
  const t = opponent.identity.trophies
  if (opponent.range === null) return `${t} trophées · appariement ouvert`
  if (opponent.range > MATCH_RANGE) return `${t} trophées · fourchette élargie`
  return `${t} trophées · à ta portée`
}
