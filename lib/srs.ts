// LA REVANCHE — le cahier d'erreurs, et la file « À revoir » qu'il alimente.
//
// CE FICHIER A CHANGÉ DE MÉTIER. Il tenait AUSSI son propre barème de
// répétition espacée (une série de succès → un intervalle J+1…J+35, une DATE de
// prochaine révision). Ce barème vit désormais dans `lib/questions/engine` :
// boîtes de Leitner, échéance HORODATÉE, compteurs de passages. Ce qui reste
// ici, c'est ce que le moteur ne fait pas — la Revanche (le deck des erreurs à
// venger, par matière) et la lecture de la file du jour.
//
// POURQUOI IL FALLAIT LES SÉPARER. Les deux systèmes écrivaient la même ligne
// de `review_items` avec deux barèmes différents : celui d'ici sur `due_date`
// (au jour), celui du moteur sur `due_at` (à l'heure). Deux écrivains sur une
// même échéance finissent toujours par s'effacer l'un l'autre — c'est
// exactement le piège que la Route des trophées a documenté sur
// `profiles.trophies`. Il n'y a plus qu'un barème, et il est dans le moteur.
//
// Les fonctions exportées gardent leurs noms et leurs formes : les pages qui
// lisent la file (`/reviser`, `/reviser/revoir`, la matière du moment) n'ont
// rien à changer.

import type { SupabaseClient } from '@supabase/supabase-js'
import {
  applyAnswer,
  BOX_INTERVAL_DAYS,
  MIN_BOX,
  type QuestionState,
} from '@/lib/questions/engine'

/**
 * Les intervalles, en jours. Réexportés depuis le moteur plutôt que redéclarés :
 * la valeur était écrite ici ET dans le moteur, et deux tables d'intervalles
 * auraient dérivé au premier réglage pédagogique.
 *
 * L'échelle a changé au passage (J+16/J+35 → J+14/J+30) : le moteur compte en
 * boîtes de Leitner, et ces paliers-là sont ceux de la méthode.
 */
export const SRS_INTERVALS = BOX_INTERVAL_DAYS

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

/**
 * L'état d'un item tel qu'il est relu en base avant d'appliquer une réponse,
 * puis réécrit. Il porte MAINTENANT les colonnes du moteur (migration 239) :
 * la boîte de Leitner, l'échéance à l'heure, les compteurs de passages.
 *
 * `due_date` n'y est plus : le trigger de la 239 la dérive de `due_at`. Elle
 * reste lisible partout, elle n'est simplement plus ÉCRITE ici — un seul
 * écrivain par valeur.
 */
export type ReviewState = {
  box: number
  streak: number
  lapses: number
  times_seen: number
  times_correct: number
  times_wrong: number
  due_at: string
  last_seen_at: string | null
  in_revanche: boolean
}

/** Les colonnes à relire pour appliquer une réponse. */
export const REVIEW_STATE_COLUMNS =
  'box, streak, lapses, times_seen, times_correct, times_wrong, due_at, last_seen_at, in_revanche'

function toEngineState(prev: ReviewState | null, id: string): QuestionState | null {
  if (!prev) return null
  return {
    questionId: id,
    chapterId: null,
    subjectId: null,
    level: null,
    lastSeenAt: prev.last_seen_at ? Date.parse(prev.last_seen_at) : null,
    timesSeen: prev.times_seen ?? 0,
    timesCorrect: prev.times_correct ?? 0,
    timesWrong: prev.times_wrong ?? 0,
    consecutiveCorrect: prev.streak ?? 0,
    box: prev.box ?? MIN_BOX,
    dueAt: prev.due_at ? Date.parse(prev.due_at) : 0,
  }
}

/**
 * Nouvel état d'un item après une réponse. `prev` absent = premier passage.
 *
 * LE BARÈME N'EST PLUS ICI : il est appliqué par `engine.applyAnswer`, y
 * compris sa garde anti-bachotage (un succès ne fait monter la boîte que si
 * l'item était réellement dû). Cette fonction ne fait que traduire, dans les
 * deux sens, entre la ligne `review_items` et l'objet du moteur — et ajouter
 * la seule chose que le moteur ne connaît pas : la Revanche.
 *
 * LA REVANCHE, justement. Une erreur y entre l'item, une bonne réponse l'en
 * sort — et cette sortie-là ne demande PAS que l'item soit dû. C'est la
 * différence de nature entre les deux systèmes : la boîte de Leitner mesure la
 * mémoire à long terme (donc l'espacement compte), la Revanche est un cahier
 * d'erreurs qu'on vient rayer (donc réussir suffit).
 */
export function reviewAfterAnswer(
  prev: ReviewState | null,
  good: boolean,
  now: number = Date.now(),
): ReviewState {
  // L'identifiant n'a aucune importance pour le barème : il ne sert qu'à
  // remplir la forme attendue par le moteur.
  const next = applyAnswer(toEngineState(prev, 'item'), {
    questionId: 'item',
    chapterId: null,
    subjectId: null,
    level: null,
  }, good, now)

  return {
    box: next.box,
    streak: next.consecutiveCorrect,
    lapses: next.timesWrong,
    times_seen: next.timesSeen,
    times_correct: next.timesCorrect,
    times_wrong: next.timesWrong,
    due_at: new Date(next.dueAt).toISOString(),
    last_seen_at: new Date(next.lastSeenAt ?? now).toISOString(),
    in_revanche: !good,
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
