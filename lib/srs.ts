// Répétition espacée (SRS) + cahier d'erreurs (« la Revanche »).
// SM-2 allégé : chaque question/carte revue a une date de prochaine révision
// qui s'allonge à chaque succès (J+1, J+3, J+7, J+16, J+35) et se réinitialise
// à l'erreur. Une erreur envoie aussi l'item dans la Revanche — le deck des
// erreurs à venger, par matière ; une bonne réponse l'en sort.
// Logique pure testable ici ; la persistance vit dans review_items (021).

import type { SupabaseClient } from '@supabase/supabase-js'

// Intervalles (en jours) selon la série de succès consécutifs. Au-delà du
// dernier palier, on replafonne à 35 jours — suffisant pour une année scolaire.
export const SRS_INTERVALS = [1, 3, 7, 16, 35] as const

// Pièces versées quand la Revanche est vidée (une fois par jour UTC).
export const REVANCHE_CLEAR_COINS = 40

export type ReviewKind = 'question' | 'card'

export type ReviewItem = {
  item_kind: ReviewKind
  item_id: string
  subject: string | null
  streak: number // succès consécutifs (détermine l'intervalle)
  lapses: number // erreurs cumulées (mesure la difficulté de l'item)
  due_date: string // 'YYYY-MM-DD' — prochaine révision (clé UTC)
  in_revanche: boolean
}

// Réponse d'un joueur sur un item suivi, telle qu'envoyée par les players.
export type ReviewAnswer = {
  kind: ReviewKind
  id: string
  subject: string | null
  good: boolean
}

const REVIEW_UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const REVIEW_KINDS: ReviewKind[] = ['question', 'card']

// Assainit les réponses brutes d'un player avant tout traitement : formes
// valides seulement (kind connu + UUID), dernière réponse conservée par item
// (dédup), volume borné. Le SRS ET le calcul d'XP de session doivent partir de
// CETTE liste — sinon des doublons ou entrées invalides gonfleraient le total
// d'XP sans correspondre aux items réellement suivis.
export function sanitizeReviewAnswers(answers: ReviewAnswer[]): ReviewAnswer[] {
  const byKey = new Map<string, ReviewAnswer>()
  for (const a of (Array.isArray(answers) ? answers : []).slice(0, 120)) {
    if (
      !a ||
      !REVIEW_KINDS.includes(a.kind) ||
      !REVIEW_UUID_RE.test(String(a.id))
    )
      continue
    byKey.set(`${a.kind}:${a.id}`, {
      kind: a.kind,
      id: String(a.id),
      subject: typeof a.subject === 'string' ? a.subject.slice(0, 80) : null,
      good: a.good === true,
    })
  }
  return [...byKey.values()].slice(0, 60)
}

export function addDays(dayKey: string, days: number): string {
  const d = new Date(`${dayKey}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

// Intervalle après une série de `streak` succès (streak ≥ 1).
export function intervalForStreak(streak: number): number {
  const i = Math.max(0, Math.min(streak - 1, SRS_INTERVALS.length - 1))
  return SRS_INTERVALS[i]
}

// État d'un item suivi, tel que relu en base avant d'appliquer une réponse.
type ReviewState = Pick<
  ReviewItem,
  'streak' | 'lapses' | 'due_date' | 'in_revanche'
>

// Un succès ne fait progresser le barème que si l'item était RÉELLEMENT à
// revoir : échu, à venger, ou jamais vu. Sans cette garde, répondre juste
// plusieurs fois le même jour (le même item revient via le quiz de la leçon,
// puis Boss, Chrono, Blitz, Duel…) suffirait à pousser un item de J+1 à J+35
// en une seule session : ce ne serait plus de la répétition ESPACÉE, mais du
// bachotage compté comme tel. Un échec, lui, compte TOUJOURS : oublier est une
// information, quelle que soit l'échéance prévue.
export function isReviewable(prev: ReviewState | null, todayKey: string): boolean {
  if (prev === null) return true
  return prev.in_revanche || prev.due_date <= todayKey
}

// Nouvel état d'un item après une réponse. `prev` absent = premier passage.
export function reviewAfterAnswer(
  prev: ReviewState | null,
  good: boolean,
  todayKey: string,
): ReviewState {
  if (good) {
    // Bonne réponse sur un item pas encore dû : on ne touche à rien. Avancer
    // ici reviendrait à récompenser la répétition immédiate.
    if (!isReviewable(prev, todayKey) && prev !== null) return prev
    const streak = (prev?.streak ?? 0) + 1
    return {
      streak,
      lapses: prev?.lapses ?? 0,
      due_date: addDays(todayKey, intervalForStreak(streak)),
      in_revanche: false, // une bonne réponse venge l'erreur
    }
  }
  return {
    streak: 0,
    lapses: (prev?.lapses ?? 0) + 1,
    due_date: addDays(todayKey, 1), // raté : on revoit dès demain
    in_revanche: true,
  }
}

export function isDue(item: Pick<ReviewItem, 'due_date'>, todayKey: string) {
  return item.due_date <= todayKey
}

// File du jour : les items dus (SRS) et les erreurs à venger (Revanche),
// classés Revanche d'abord (venger paye), puis les plus en retard.
export function reviewQueue(
  items: ReviewItem[],
  todayKey: string,
): ReviewItem[] {
  return items
    .filter((i) => isDue(i, todayKey) || i.in_revanche)
    .sort((a, b) => {
      if (a.in_revanche !== b.in_revanche) return a.in_revanche ? -1 : 1
      return a.due_date.localeCompare(b.due_date)
    })
}

// Comptes par matière pour l'accueil Réviser (« 3 en maths, 2 en anglais »).
export function countsBySubject(items: ReviewItem[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const i of items) {
    const key = i.subject ?? 'Autre'
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

// ------------------------------------------------------------------- serveur
// Items suivis de l'élève (même pattern d'accès que getChapterMastery).

export async function getReviewItems(
  supabase: SupabaseClient,
  userId: string,
): Promise<ReviewItem[]> {
  // Ne rapatrier que la file du jour : items dus (due_date ≤ aujourd'hui) OU en
  // Revanche — exactement ce que `reviewQueue` conserve. Inutile de transférer
  // tout l'historique SRS d'un élève assidu (l'index (user_id, due_date) de 021
  // sert ce filtre). Borné par sûreté : la file du jour n'a jamais besoin de
  // plus. L'erreur est journalisée (une panne ≠ « pas d'items »).
  // Le tri SQL reproduit celui de `reviewQueue` (Revanche d'abord, puis les
  // plus en retard) : sans lui, `limit(300)` tronque un ensemble NON ordonné,
  // et l'élève qui revient après une longue absence (plus de 300 items dus)
  // pourrait voir ses Revanches écartées du lot — alors que la promesse est
  // qu'elles passent en premier. Trier avant de couper garde la file honnête.
  const today = new Date().toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('review_items')
    .select('item_kind, item_id, subject, streak, lapses, due_date, in_revanche')
    .eq('user_id', userId)
    .or(`due_date.lte.${today},in_revanche.eq.true`)
    .order('in_revanche', { ascending: false })
    .order('due_date', { ascending: true })
    .limit(300)
    .returns<ReviewItem[]>()
  if (error) console.error('[srs] file « À revoir » indisponible:', error.message)
  return data ?? []
}
