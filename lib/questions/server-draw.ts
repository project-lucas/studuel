// LE TIRAGE CÔTÉ SERVEUR — la même session, composée pendant le rendu.
//
// `api.ts` fait tourner le moteur dans le navigateur : c'est ce qui lui donne
// le hors ligne et la file d'attente. Mais deux players sont des Server
// Components qui composent leur partie AVANT d'envoyer quoi que ce soit au
// client (le jeu « Programme », le quiz de leçon). Ils ne peuvent pas attendre
// un `localStorage` qui n'existe pas encore.
//
// D'où ce second chemin. Il appelle EXACTEMENT le même `drawSession` — il n'y a
// toujours qu'un seul moteur, c'est la promesse de tout ce dossier. Ce qui
// change, c'est d'où vient la mémoire anti-répétition :
//
//   navigateur → la fenêtre glissante tenue dans l'instantané local
//   serveur    → les questions au `last_seen_at` le plus récent, relues en base
//
// La seconde n'est pas une approximation commode : dans ces deux players, toute
// question SERVIE est répondue (il n'y a pas d'abandon en cours de table), donc
// « les 20 dernières vues » et « les 20 dernières servies » désignent le même
// ensemble. Reconstruire plutôt que stocker évite une table de plus pour une
// donnée qu'on peut perdre sans conséquence.

import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { drawSession, RECENT_WINDOW, type QuestionRef } from './engine'
import {
  loadChapterPool,
  loadQuestionStates,
  loadSubjectPool,
  QUESTION_KIND,
} from './server'

/**
 * Les questions vues le plus récemment sur un périmètre — la fenêtre glissante,
 * reconstruite depuis la base.
 *
 * On demande DEUX fois la fenêtre : `last_seen_at` couvre tous les players, et
 * une partie de ces questions peut venir d'ailleurs (le carnet, un boss). Une
 * marge évite qu'une révision faite entre-temps ne pousse hors de la fenêtre
 * les questions que ce player vient justement de servir.
 */
async function loadRecentlySeen(
  supabase: SupabaseClient,
  userId: string,
  filter: { chapterId?: string; subjectSlug?: string },
): Promise<string[]> {
  let query = supabase
    .from('review_items')
    .select('item_id, last_seen_at')
    .eq('user_id', userId)
    .eq('item_kind', QUESTION_KIND)
    .not('last_seen_at', 'is', null)
    .order('last_seen_at', { ascending: false })
    .limit(RECENT_WINDOW * 2)

  if (filter.chapterId) query = query.eq('chapter_id', filter.chapterId)
  if (filter.subjectSlug) query = query.eq('subject', filter.subjectSlug)

  const { data, error } = await query.returns<{ item_id: string }[]>()
  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[questions] fenêtre glissante indisponible:', error.message)
    }
    return []
  }
  return (data ?? []).map((row) => row.item_id).slice(0, RECENT_WINDOW)
}

async function compose({
  supabase,
  userId,
  pool,
  count,
  recent,
  now,
  seed,
}: {
  supabase: SupabaseClient
  userId: string
  pool: QuestionRef[]
  count: number
  recent: string[]
  now: number
  seed: string
}): Promise<QuestionRef[]> {
  if (pool.length === 0) return []

  const states = await loadQuestionStates(
    supabase,
    userId,
    pool.map((ref) => ref.questionId),
  )
  const ids = drawSession({ pool, states, count, now, recent, seed })

  // On rend les RÉFÉRENCES et non les identifiants : l'appelant a besoin du
  // chapitre et de la matière pour étiqueter les réponses au moment de les
  // enregistrer, et il les aurait sinon rechargés.
  const byId = new Map(pool.map((ref) => [ref.questionId, ref]))
  return ids.flatMap((id) => {
    const ref = byId.get(id)
    return ref ? [ref] : []
  })
}

/** La session d'un chapitre, composée côté serveur. */
export async function drawChapterSession({
  supabase,
  userId,
  chapterId,
  count,
  now = Date.now(),
}: {
  supabase: SupabaseClient
  userId: string
  chapterId: string
  count: number
  now?: number
}): Promise<QuestionRef[]> {
  const [pool, recent] = await Promise.all([
    loadChapterPool(supabase, chapterId),
    loadRecentlySeen(supabase, userId, { chapterId }),
  ])
  return compose({
    supabase,
    userId,
    pool,
    count,
    recent,
    now,
    seed: `chapter:${chapterId}#${now}`,
  })
}

/**
 * La session d'entraînement d'UN QUIZ — le vivier est celui du quiz lui-même.
 *
 * Pourquoi le quiz et non le chapitre, alors que `drawChapterSession` existe
 * juste au-dessus : la maîtrise d'un chapitre s'agrège PAR QUIZ
 * (`lib/mastery`), et le bouton « Quiz » d'une fiche promet les questions de
 * CETTE fiche. Servir sous son nom les questions de la leçon d'à côté
 * fausserait la comptabilité et trahirait ce que l'élève a demandé.
 *
 * Le vivier arrive tout fait par l'appelant : la page a déjà lu les questions
 * du quiz pour composer l'évaluation, et la vue `question_scope` (migration
 * 239) ne sait pas découper par quiz. Une lecture de moins, et surtout un
 * chemin qui reste debout tant que la 239 n'est pas passée.
 *
 * La fenêtre anti-répétition, elle, reste celle du CHAPITRE : une question
 * revue il y a dix minutes dans le jeu « Programme » ne doit pas revenir ici
 * parce qu'on a changé de porte d'entrée.
 */
export async function drawQuizSession({
  supabase,
  userId,
  quizId,
  chapterId,
  pool,
  count,
  now = Date.now(),
}: {
  supabase: SupabaseClient
  userId: string
  quizId: string
  /** Le chapitre du quiz, s'il en a un — sert la fenêtre glissante. */
  chapterId: string | null
  pool: QuestionRef[]
  count: number
  now?: number
}): Promise<QuestionRef[]> {
  const recent = chapterId
    ? await loadRecentlySeen(supabase, userId, { chapterId })
    : []
  return compose({
    supabase,
    userId,
    pool,
    count,
    recent,
    now,
    seed: `quiz:${quizId}#${now}`,
  })
}

/** La session d'une matière entière — ce que sert le jeu « Programme ». */
export async function drawSubjectSession({
  supabase,
  userId,
  subjectSlug,
  level,
  count,
  now = Date.now(),
}: {
  supabase: SupabaseClient
  userId: string
  subjectSlug: string
  level: string
  count: number
  now?: number
}): Promise<QuestionRef[]> {
  const [pool, recent] = await Promise.all([
    loadSubjectPool(supabase, subjectSlug, level),
    loadRecentlySeen(supabase, userId, { subjectSlug }),
  ])
  return compose({
    supabase,
    userId,
    pool,
    count,
    recent,
    now,
    seed: `subject:${subjectSlug}#${now}`,
  })
}
