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
import { toutLire } from '@/lib/postgrest-pages'

/** Code PostgREST d'une table absente (migration pas encore exécutée). */
const TABLE_ABSENTE = '42P01'

/**
 * Combien d'identifiants au plus dans un `in.(…)`.
 *
 * Un UUID pèse 37 caractères dans l'URL. Les 2 000 d'autrefois faisaient une
 * requête GET de 74 Ko, que le proxy refuse ; et PostgREST n'aurait de toute
 * façon rendu que les 1 000 premières lignes. On coupe, et on pagine.
 */
const IDS_PAR_REQUETE = 200

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

  // Par paquets d'identifiants, et chaque paquet page par page : une carte
  // dont l'état n'est pas lu repart NEUVE, c'est-à-dire due — l'élève revoit
  // une carte acquise, et sa planification recommence à zéro.
  const paquets: string[][] = []
  for (let i = 0; i < questionIds.length; i += IDS_PAR_REQUETE) {
    paquets.push(questionIds.slice(i, i + IDS_PAR_REQUETE))
  }

  const resultats = await Promise.all(
    paquets.map((paquet) =>
      toutLire<EtatRow, { code?: string; message?: string }>((from, to) =>
        supabase
          .from('carnet_question_states')
          .select(COLONNES)
          .eq('user_id', userId)
          .in('question_id', paquet)
          .order('question_id', { ascending: true })
          .range(from, to)
          .returns<EtatRow[]>(),
      ),
    ),
  )

  const erreur = resultats.find((r) => r.error)?.error
  if (erreur && erreur.code !== TABLE_ABSENTE) {
    console.error('[carnet-etats] lecture impossible:', erreur.message)
  }

  for (const { data } of resultats) {
    for (const row of data) etats.set(String(row.question_id), rowToState(row, nowIso))
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
  // Page par page : `.limit(2 000)` ne protégeait de rien — PostgREST plafonne
  // à 1 000 AVANT de regarder la limite demandée, et sans ordre les 1 000
  // retenues n'étaient même pas les mêmes d'un chargement à l'autre.
  const { data, error } = await toutLire<EtatRow, { code?: string; message?: string }>((from, to) =>
    supabase
      .from('carnet_question_states')
      .select(COLONNES)
      .eq('user_id', userId)
      .order('question_id', { ascending: true })
      .range(from, to)
      .returns<EtatRow[]>(),
  )

  if (error && error.code !== TABLE_ABSENTE) {
    console.error('[carnet-etats] lecture globale impossible:', error.message)
  }
  for (const row of data) {
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
