// -----------------------------------------------------------------------------
// LE REPLAY — la trace d'une course, telle qu'on la garde et telle qu'on la relit.
//
// Quand un élève finit une course, on enregistre ses PAS (instant, juste/faux,
// temps de réflexion) — pas son score, qui se recalcule. C'est cette trace qui
// devient le rival de quelqu'un d'autre : un vrai élève, à sa vraie cadence,
// rejoué en face de toi. Personne n'a besoin d'être en ligne en même temps, et
// pourtant on court contre quelqu'un de réel.
//
// Tout ce qui vient de la base passe par `sanitizeSteps` : une trace est une
// donnée écrite par un client, on ne la suppose jamais saine.
// -----------------------------------------------------------------------------

import { COURSE_MAX_MS } from '@/lib/duel/course'
import type { ReplayStep, RivalEvent } from '@/lib/duel/rival'

export type { ReplayStep } from '@/lib/duel/rival'

/** Une course n'a jamais plus de pas que ça — la même borne que le serveur. */
export const MAX_REPLAY_STEPS = 50

/** Sous ce nombre de pas, la trace ne fait pas un rival : trop courte à rejouer. */
export const MIN_REPLAY_STEPS = 3

/** Temps de réflexion minimal crédible sur une question, en ms. */
export const MIN_ANSWER_MS = 250

/**
 * Ramène une trace brute (JSON de la base, ou payload d'un client) à une liste
 * de pas valides : instants croissants et bornés à la course, temps de
 * réflexion bornés, volume plafonné. Une entrée malformée est ÉCARTÉE, jamais
 * réparée en silence — un pas inventé fausserait la course de quelqu'un.
 */
export function sanitizeSteps(raw: unknown): ReplayStep[] {
  if (!Array.isArray(raw)) return []
  const steps: ReplayStep[] = []
  let lastAt = 0
  for (const item of raw) {
    if (steps.length >= MAX_REPLAY_STEPS) break
    if (!item || typeof item !== 'object') continue
    const r = item as Record<string, unknown>
    const at = typeof r.at === 'number' && Number.isFinite(r.at) ? Math.round(r.at) : NaN
    const ms = typeof r.ms === 'number' && Number.isFinite(r.ms) ? Math.round(r.ms) : NaN
    if (!Number.isFinite(at) || !Number.isFinite(ms)) continue
    if (typeof r.good !== 'boolean') continue
    if (at < lastAt || at > COURSE_MAX_MS) continue
    if (ms < MIN_ANSWER_MS || ms > COURSE_MAX_MS) continue
    steps.push({ at, good: r.good, ms })
    lastAt = at
  }
  return steps
}

/** La trace fait-elle un rival jouable ? */
export function isReplayUsable(steps: readonly ReplayStep[]): boolean {
  return steps.length >= MIN_REPLAY_STEPS
}

/** Les pas d'une course jouée, à partir des frappes enregistrées côté client. */
export function stepsFromEvents(events: readonly RivalEvent[]): ReplayStep[] {
  return sanitizeSteps(
    events.map((e) => ({ at: e.atMs, good: e.good, ms: e.answerMs })),
  )
}
