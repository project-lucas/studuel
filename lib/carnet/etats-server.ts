// -----------------------------------------------------------------------------
// LE PONT entre `carnet_question_states` (migration 315) et le planificateur pur
// (`lib/carnet/planification`). Rien de métier ici : de la lecture, de
// l'écriture, et la traduction ligne ↔ état.
//
// Tant que la 315 n'est pas exécutée, la table est absente : PostgREST répond
// 42P01. On RETOMBE alors sur des états neufs plutôt que de casser le carnet —
// déployer avant d'exécuter la migration ne doit pas priver l'élève de son
// carnet, seulement de la finesse du nouveau moteur. Même parti pris que le
// quota IA face à la 198.
// -----------------------------------------------------------------------------

import type { SupabaseClient } from '@supabase/supabase-js'
import {
  etatInitial,
  type CardState,
  type Phase,
} from '@/lib/carnet/planification'

/** Code PostgREST d'une table absente (migration pas encore exécutée). */
const TABLE_ABSENTE = '42P01'

/** Borne de lecture : au-delà, on ne charge pas tout d'un coup. */
const MAX_ETATS = 2_000

type EtatRow = {
  question_id: string
  phase: string
  step: number
  interval_days: number
  ease: number | string
  streak: number
  reps: number
  lapses: number
  is_leech: boolean
  due_at: string
  last_seen_at: string | null
}

const COLONNES =
  'question_id, phase, step, interval_days, ease, streak, reps, lapses, is_leech, due_at, last_seen_at'

/** Ligne de base → état du planificateur. */
export function rowToState(row: EtatRow, nowIso: string): CardState {
  const vide = etatInitial(nowIso)
  return {
    phase: (row.phase === 'revision' ? 'revision' : 'apprentissage') as Phase,
    step: Number(row.step ?? 0),
    intervalDays: Number(row.interval_days ?? 0),
    // `numeric` revient en CHAÎNE avec le driver PostgREST : sans le Number(),
    // l'aisance devient « 2.50 » et toute multiplication d'intervalle donne
    // NaN — la carte serait alors due pour toujours, en silence.
    ease: Number(row.ease ?? vide.ease),
    streak: Number(row.streak ?? 0),
    reps: Number(row.reps ?? 0),
    lapses: Number(row.lapses ?? 0),
    isLeech: row.is_leech === true,
    dueAt: String(row.due_at ?? nowIso),
    lastSeenAt: row.last_seen_at ? String(row.last_seen_at) : null,
  }
}

/** État du planificateur → ligne à écrire. */
export function stateToRow(
  userId: string,
  questionId: string,
  state: CardState,
): Record<string, unknown> {
  return {
    user_id: userId,
    question_id: questionId,
    phase: state.phase,
    step: state.step,
    interval_days: state.intervalDays,
    // Arrondi au centième : la colonne est NUMERIC(4,2) et un `ease` de
    // 2.6500000000000004 (flottant) y serait tronqué côté base, faisant diverger
    // l'état lu de l'état écrit.
    ease: Math.round(state.ease * 100) / 100,
    streak: state.streak,
    reps: state.reps,
    lapses: state.lapses,
    is_leech: state.isLeech,
    due_at: state.dueAt,
    last_seen_at: state.lastSeenAt,
    updated_at: new Date().toISOString(),
  }
}

/**
 * Les états des questions demandées. Les questions sans ligne (jamais vues)
 * reçoivent un état neuf : l'appelant n'a jamais à gérer l'absence.
 */
export async function chargerEtats(
  supabase: SupabaseClient,
  userId: string,
  questionIds: readonly string[],
  nowIso: string,
): Promise<Map<string, CardState>> {
  const etats = new Map<string, CardState>()
  for (const id of questionIds) etats.set(id, etatInitial(nowIso))
  if (questionIds.length === 0) return etats

  const { data, error } = await supabase
    .from('carnet_question_states')
    .select(COLONNES)
    .eq('user_id', userId)
    .in('question_id', questionIds.slice(0, MAX_ETATS))

  if (error) {
    if (error.code !== TABLE_ABSENTE) {
      console.error('[carnet-etats] lecture impossible:', error.message)
    }
    return etats
  }

  for (const row of (data ?? []) as EtatRow[]) {
    etats.set(String(row.question_id), rowToState(row, nowIso))
  }
  return etats
}

/**
 * TOUS les états de l'élève, indexés par question. Sert les écrans qui comptent
 * ce qui est dû sans connaître d'avance la liste des questions (l'étagère du
 * carnet, le héros « À revoir »).
 */
export async function chargerTousLesEtats(
  supabase: SupabaseClient,
  userId: string,
  nowIso: string,
): Promise<Map<string, CardState>> {
  const etats = new Map<string, CardState>()
  const { data, error } = await supabase
    .from('carnet_question_states')
    .select(COLONNES)
    .eq('user_id', userId)
    .limit(MAX_ETATS)

  if (error) {
    if (error.code !== TABLE_ABSENTE) {
      console.error('[carnet-etats] lecture globale impossible:', error.message)
    }
    return etats
  }
  for (const row of (data ?? []) as EtatRow[]) {
    etats.set(String(row.question_id), rowToState(row, nowIso))
  }
  return etats
}

/**
 * Écrit l'état d'une carte (création ou mise à jour). Renvoie `false` sur échec
 * — l'appelant décide s'il le signale ; une tentative reste enregistrée dans
 * l'historique même si l'état n'a pas pu être écrit.
 */
export async function ecrireEtat(
  supabase: SupabaseClient,
  userId: string,
  questionId: string,
  state: CardState,
): Promise<boolean> {
  const { error } = await supabase
    .from('carnet_question_states')
    .upsert(stateToRow(userId, questionId, state), {
      onConflict: 'user_id,question_id',
    })
  if (error) {
    if (error.code !== TABLE_ABSENTE) {
      console.error('[carnet-etats] écriture impossible:', error.message)
    }
    return false
  }
  return true
}
