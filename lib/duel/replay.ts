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
 * Écart minimal entre deux réponses, en plus du temps de réflexion de la
 * seconde : après une réponse, la question suivante n'apparaît qu'au bout de
 * la correction (NEXT_QUESTION_MS, 650 ms, components/duel/useCourse). Une
 * trace réellement jouée respecte donc toujours cet écart ; 600 laisse la
 * gigue des minuteurs de côté.
 */
export const MIN_GAP_MS = 600

/**
 * Ramène une trace brute (JSON de la base, ou payload d'un client) à une liste
 * de pas valides : instants croissants et bornés à la course, temps de
 * réflexion bornés, volume plafonné. Une entrée malformée est ÉCARTÉE, jamais
 * réparée en silence — un pas inventé fausserait la course de quelqu'un.
 *
 * UNE TRACE NE VA JAMAIS PLUS VITE QU'UN JOUEUR (19/09/2026). Chaque pas
 * arrive au plus tôt après le précédent + la correction + sa propre
 * réflexion ; un pas trop tôt est RECULÉ à cet instant. Sans cette règle, cinq
 * pas « { at: 0, ms: 250 } » déposés à la main remplissaient la barre à 0 ms :
 * tous ceux qui tombaient sur ce replay perdaient d'office, et le serveur
 * confirmait. Reculer (plutôt qu'écarter) ne touche jamais une vraie course,
 * qui respecte déjà l'écart, et relit TOUTES les traces déjà en base.
 */
export function sanitizeSteps(raw: unknown): ReplayStep[] {
  if (!Array.isArray(raw)) return []
  const steps: ReplayStep[] = []
  // L'ordre se juge sur les instants BRUTS ; la trace rendue, elle, porte les
  // instants reculés (`lastAt`).
  let lastRaw = 0
  let lastAt = 0
  for (const item of raw) {
    if (steps.length >= MAX_REPLAY_STEPS) break
    if (!item || typeof item !== 'object') continue
    const r = item as Record<string, unknown>
    const at = typeof r.at === 'number' && Number.isFinite(r.at) ? Math.round(r.at) : NaN
    const ms = typeof r.ms === 'number' && Number.isFinite(r.ms) ? Math.round(r.ms) : NaN
    if (!Number.isFinite(at) || !Number.isFinite(ms)) continue
    if (typeof r.good !== 'boolean') continue
    if (at < lastRaw || at > COURSE_MAX_MS) continue
    if (ms < MIN_ANSWER_MS || ms > COURSE_MAX_MS) continue
    const auPlusTot = steps.length === 0 ? ms : lastAt + MIN_GAP_MS + ms
    const atJuste = Math.max(at, auPlusTot)
    if (atJuste > COURSE_MAX_MS) break
    steps.push({ at: atJuste, good: r.good, ms })
    lastRaw = at
    lastAt = atJuste
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
