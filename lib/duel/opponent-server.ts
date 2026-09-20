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
  /** Absent tant que la 374 n'est pas passée. */
  created_at?: string | null
  user_id: string
  name: string
  avatar: unknown
  trophies: number
  score: number
  steps: unknown
}

type ReplayCandidate = MatchCandidate & {
  replayId: string
  version: string | null
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
        version: typeof row.created_at === 'string' ? row.created_at : null,
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
  /** Le replay de la course précédente (« Nouvel adversaire »), à ne pas resservir. */
  lastReplayId?: string | null
}): Promise<Opponent> {
  const tous = await fetchReplayCandidates(input.supabase, input.subjectSlug)
  // « Nouvel adversaire » doit en être un : sans cette exclusion, l'appariement
  // (le plus proche en trophées) rendait exactement le même élève.
  const candidates = input.lastReplayId
    ? tous.filter((c) => c.replayId !== input.lastReplayId)
    : tous
  const picked = pickOpponent(candidates, input.myTrophies)
  if (picked && !picked.isBot) {
    const candidate = candidates.find((c) => c.userId === picked.userId)
    if (candidate) {
      const opponent: ReplayOpponent = {
        kind: 'replay',
        replayId: candidate.replayId,
        version: candidate.version,
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

/**
 * La trace d'un replay, pour la revalidation serveur. Null si introuvable.
 *
 * `version` = l'instant de la trace que l'élève a affrontée. Une trace est
 * réécrite à chaque course de son auteur : s'il en a rejoué une PENDANT la
 * mienne, la ligne porte déjà sa nouvelle trace, et la rejouer donnerait un
 * verdict sur une course que je n'ai pas courue. Depuis la 374, la ligne garde
 * aussi la trace précédente ; au-delà, la course est « non vérifiée » (aucun
 * trophée ne bouge) plutôt que jugée sur la mauvaise trace.
 */
export async function fetchReplaySteps(
  supabase: SupabaseClient,
  replayId: string,
  version: string | null = null,
): Promise<ReplayStep[] | null> {
  const { data, error } = await supabase.rpc('duel_replay_get', { p_id: replayId })
  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[duel] replay introuvable:', error.message)
    }
    return null
  }
  const row = (Array.isArray(data) ? data[0] : null) as ReplayGetRow | null
  if (!row) return null
  const brutes = traceDeLaVersion(row, version)
  if (brutes === undefined) return null
  const steps = sanitizeSteps(brutes)
  return isReplayUsable(steps) ? steps : null
}

type ReplayGetRow = {
  steps: unknown
  /** Colonnes de la 374 — absentes avant. */
  created_at?: string | null
  steps_precedents?: unknown
  precedent_le?: string | null
}

/** Même instant, à la milliseconde (les deux lectures formatent pareil, mais on ne le suppose pas). */
function memeInstant(a: string | null | undefined, b: string | null | undefined): boolean {
  if (!a || !b) return false
  const ta = Date.parse(a)
  return Number.isFinite(ta) && ta === Date.parse(b)
}

/**
 * La trace qui correspond à la version affrontée ; `undefined` si aucune ne
 * correspond. Sans version (client d'avant) ou sans la 374 : la trace actuelle,
 * comme avant.
 */
export function traceDeLaVersion(row: ReplayGetRow, version: string | null): unknown {
  if (!version || row.created_at === undefined) return row.steps
  if (memeInstant(row.created_at, version)) return row.steps
  if (memeInstant(row.precedent_le, version)) return row.steps_precedents
  return undefined
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
