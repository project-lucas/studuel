// Les lectures Supabase de l'appariement de la COURSE. La logique — fourchette,
// élargissement, plus proche — reste pure (lib/defi/matchmaking) ; ici on ne
// fait qu'aller chercher les traces et fabriquer l'adversaire.
//
// TOLÉRANT À LA MIGRATION ABSENTE, comme partout : tant que la 351 n'est pas
// exécutée, `duel_replay_opponents` n'existe pas, le vivier est vide, et la
// course se joue contre un robot du banc. Elle ne cesse jamais de se lancer.

import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { normalizeAvatarConfig } from '@/lib/avatar'
import { pickOpponent, type MatchCandidate } from '@/lib/defi/matchmaking'
import { pickBot } from '@/lib/duel/bots'
import {
  botOpponent,
  type Opponent,
  type ReplayOpponent,
} from '@/lib/duel/opponent'
import { isReplayUsable, sanitizeSteps, type ReplayStep } from '@/lib/duel/replay'

type ReplayRow = {
  replay_id: string
  user_id: string
  name: string
  avatar: unknown
  trophies: number
  score: number
  steps: unknown
}

type ReplayCandidate = MatchCandidate & {
  replayId: string
  avatar: unknown
  steps: ReplayStep[]
}

/** Les traces jouables des élèves du même niveau sur cette matière. */
export async function fetchReplayCandidates(
  supabase: SupabaseClient,
  subjectSlug: string,
): Promise<ReplayCandidate[]> {
  const { data, error } = await supabase.rpc('duel_replay_opponents', {
    p_subject_slug: subjectSlug,
  })
  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[duel] vivier de replays indisponible:', error.message)
    }
    return []
  }
  return (Array.isArray(data) ? (data as ReplayRow[]) : []).flatMap((row) => {
    const steps = sanitizeSteps(row.steps)
    if (!isReplayUsable(steps)) return []
    return [
      {
        replayId: String(row.replay_id),
        userId: String(row.user_id),
        name: String(row.name ?? 'Un élève').slice(0, 24),
        trophies: Math.max(0, Math.floor(Number(row.trophies) || 0)),
        score: Math.max(0, Math.floor(Number(row.score) || 0)),
        avatar: row.avatar,
        steps,
      },
    ]
  })
}

/**
 * L'adversaire d'une course. Un VRAI élève à portée de trophées d'abord
 * (fourchette ±150, élargie par paliers) ; sinon un robot du banc, réglé sur
 * les trophées de l'élève et jamais homonyme.
 */
export async function chooseOpponent(input: {
  supabase: SupabaseClient
  subjectSlug: string
  myTrophies: number
  seed: string
  myName: string | null
  /** Le robot de la course précédente, à ne pas resservir. */
  lastBotId?: string | null
}): Promise<Opponent> {
  const candidates = await fetchReplayCandidates(input.supabase, input.subjectSlug)
  const picked = pickOpponent(candidates, input.myTrophies)
  if (picked && !picked.isBot) {
    const candidate = candidates.find((c) => c.userId === picked.userId)
    if (candidate) {
      const opponent: ReplayOpponent = {
        kind: 'replay',
        replayId: candidate.replayId,
        steps: candidate.steps,
        range: picked.range,
        identity: {
          name: candidate.name,
          avatar: normalizeAvatarConfig(candidate.avatar),
          trophies: candidate.trophies,
          isBot: false,
          tagline: 'A vraiment joué cette matière',
        },
      }
      return opponent
    }
  }
  const bot = pickBot(input.seed, {
    excludeName: input.myName,
    excludeId: input.lastBotId ?? null,
  })
  const fallback = botOpponent(bot.id, input.myTrophies)
  if (fallback) return fallback
  // Impossible par construction (pickBot rend toujours un robot du banc), mais
  // on ne laisse pas une course sans adversaire.
  return botOpponent('nina', input.myTrophies) as Opponent
}

/** La trace d'un replay, pour la revalidation serveur. Null si introuvable. */
export async function fetchReplaySteps(
  supabase: SupabaseClient,
  replayId: string,
): Promise<ReplayStep[] | null> {
  const { data, error } = await supabase.rpc('duel_replay_get', { p_id: replayId })
  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[duel] replay introuvable:', error.message)
    }
    return null
  }
  const row = Array.isArray(data) ? data[0] : null
  if (!row) return null
  const steps = sanitizeSteps((row as { steps: unknown }).steps)
  return isReplayUsable(steps) ? steps : null
}

/** Dépose la trace de la course jouée. Silencieux si la 351 n'est pas passée. */
export async function saveReplay(
  supabase: SupabaseClient,
  input: { subjectSlug: string; score: number; won: boolean; steps: ReplayStep[] },
): Promise<boolean> {
  if (!isReplayUsable(input.steps)) return false
  const { error } = await supabase.rpc('duel_save_replay', {
    p_subject_slug: input.subjectSlug,
    p_score: Math.max(0, Math.floor(input.score)),
    p_won: input.won,
    p_steps: input.steps,
  })
  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[duel] replay non enregistré:', error.message)
    }
    return false
  }
  return true
}
