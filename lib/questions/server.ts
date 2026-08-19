// LA PERSISTANCE DU MOTEUR — les seuls accès Supabase de `lib/questions`.
//
// Trois lectures et une écriture, pas une de plus. Tout ce qui décide vit dans
// `engine.ts` ; ici on ne fait que traduire entre les lignes de `review_items`
// et les objets du moteur.
//
// TOLÉRANT À LA MIGRATION ABSENTE. Tant que la 239 n'est pas exécutée, les
// colonnes `due_at` / `box` n'existent pas et la vue `question_scope` non plus.
// Chaque fonction retombe alors sur un résultat vide plutôt que de faire tomber
// la page — même doctrine que `lib/chapitres-vus.ts`. L'app garde son
// comportement d'avant : les players qui savaient composer leur liste tout
// seuls continuent de le faire.

import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { MIN_BOX, type QuestionRef, type QuestionState } from './engine'

/** Le genre d'item du moteur dans `review_items` (les cartes gardent le leur). */
export const QUESTION_KIND = 'question'

type ScopeRow = {
  question_id: string
  chapter_id: string | null
  subject_slug: string | null
  subject_name: string | null
  level: string | null
  position: number | null
}

type ReviewRow = {
  item_id: string
  subject: string | null
  chapter_id: string | null
  level: string | null
  box: number | null
  times_seen: number | null
  times_correct: number | null
  times_wrong: number | null
  streak: number | null
  due_at: string | null
  last_seen_at: string | null
}

const REVIEW_COLUMNS =
  'item_id, subject, chapter_id, level, box, times_seen, times_correct, times_wrong, streak, due_at, last_seen_at'

/**
 * Combien de questions au maximum composent un vivier. Un chapitre en compte
 * quelques dizaines ; une matière entière peut monter à plusieurs centaines, et
 * c'est encore raisonnable à transférer. Au-delà, ce serait un import de
 * contenu, pas une session.
 */
export const MAX_POOL = 600

function rowToState(row: ReviewRow): QuestionState {
  return {
    questionId: row.item_id,
    chapterId: row.chapter_id,
    subjectId: row.subject,
    level: row.level,
    lastSeenAt: row.last_seen_at ? Date.parse(row.last_seen_at) : null,
    timesSeen: row.times_seen ?? 0,
    timesCorrect: row.times_correct ?? 0,
    timesWrong: row.times_wrong ?? 0,
    consecutiveCorrect: row.streak ?? 0,
    box: row.box ?? MIN_BOX,
    dueAt: row.due_at ? Date.parse(row.due_at) : 0,
  }
}

function scopeToRef(row: ScopeRow): QuestionRef {
  return {
    questionId: row.question_id,
    chapterId: row.chapter_id,
    // La MATIÈRE d'une question est son slug — jamais son nom affiché. C'est
    // déjà la clé du monde des trophées (238) et des URLs du Programme ; deux
    // identités concurrentes finiraient par diverger sur un accent.
    subjectId: row.subject_slug,
    level: row.level,
  }
}

// -------------------------------------------------------------------- lectures

/** Le vivier d'un chapitre : toutes ses questions, dans l'ordre du contenu. */
export async function loadChapterPool(
  supabase: SupabaseClient,
  chapterId: string,
): Promise<QuestionRef[]> {
  const { data, error } = await supabase
    .from('question_scope')
    .select('question_id, chapter_id, subject_slug, subject_name, level, position')
    .eq('chapter_id', chapterId)
    .order('position', { ascending: true })
    .limit(MAX_POOL)
    .returns<ScopeRow[]>()

  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[questions] vivier du chapitre indisponible:', error.message)
    }
    return []
  }
  return (data ?? []).map(scopeToRef)
}

/**
 * Le vivier d'une MATIÈRE pour un niveau donné — ce que consomme le duel classé,
 * qui se joue par matière et non par chapitre.
 */
export async function loadSubjectPool(
  supabase: SupabaseClient,
  subjectSlug: string,
  level: string,
): Promise<QuestionRef[]> {
  const { data, error } = await supabase
    .from('question_scope')
    .select('question_id, chapter_id, subject_slug, subject_name, level, position')
    .eq('subject_slug', subjectSlug)
    .eq('level', level)
    .order('position', { ascending: true })
    .limit(MAX_POOL)
    .returns<ScopeRow[]>()

  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[questions] vivier de la matière indisponible:', error.message)
    }
    return []
  }
  return (data ?? []).map(scopeToRef)
}

/**
 * L'état de l'élève sur des questions données. On interroge PAR IDENTIFIANTS et
 * non par chapitre : `review_items.chapter_id` n'est renseigné que depuis la
 * 239, donc les lignes héritées de la 021 n'y répondraient pas — et perdre
 * l'historique d'un élève assidu au premier tirage serait la pire des
 * régressions.
 */
export async function loadQuestionStates(
  supabase: SupabaseClient,
  userId: string,
  questionIds: readonly string[],
): Promise<Map<string, QuestionState>> {
  if (questionIds.length === 0) return new Map()

  const { data, error } = await supabase
    .from('review_items')
    .select(REVIEW_COLUMNS)
    .eq('user_id', userId)
    .eq('item_kind', QUESTION_KIND)
    .in('item_id', [...questionIds].slice(0, MAX_POOL))
    .returns<ReviewRow[]>()

  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[questions] états indisponibles:', error.message)
    }
    return new Map()
  }

  return new Map((data ?? []).map((row) => [row.item_id, rowToState(row)]))
}

// -------------------------------------------------------------------- écriture

/**
 * Écrit un lot d'états. UN SEUL appel par session : c'est la contrepartie du
 * cache local (cf. `store.ts`), et la raison pour laquelle le moteur encaisse
 * les réponses au lieu de les pousser une par une.
 *
 * `due_date` n'est PAS écrite : le trigger de la 239 la dérive de `due_at`. Deux
 * écrivains sur la même échéance finiraient par diverger, et c'est précisément
 * ce que la migration corrige.
 */
export async function saveQuestionStates(
  supabase: SupabaseClient,
  userId: string,
  states: readonly QuestionState[],
): Promise<boolean> {
  if (states.length === 0) return true

  const rows = states.map((s) => ({
    user_id: userId,
    item_kind: QUESTION_KIND,
    item_id: s.questionId,
    subject: s.subjectId,
    chapter_id: s.chapterId,
    level: s.level,
    box: s.box,
    times_seen: s.timesSeen,
    times_correct: s.timesCorrect,
    times_wrong: s.timesWrong,
    streak: s.consecutiveCorrect,
    lapses: s.timesWrong,
    due_at: new Date(s.dueAt).toISOString(),
    last_seen_at: s.lastSeenAt ? new Date(s.lastSeenAt).toISOString() : null,
    // La Revanche (021) reste branchée sur le même enregistrement : une
    // question ratée y entre, une bonne réponse l'en sort. Le cahier d'erreurs
    // n'a pas d'autre source, et le moteur est désormais le seul écrivain.
    in_revanche: s.consecutiveCorrect === 0 && s.timesWrong > 0,
    updated_at: new Date().toISOString(),
  }))

  const { error } = await supabase
    .from('review_items')
    .upsert(rows, { onConflict: 'user_id,item_kind,item_id' })

  if (error) {
    console.error('[questions] enregistrement impossible:', error.message)
    return false
  }
  return true
}
