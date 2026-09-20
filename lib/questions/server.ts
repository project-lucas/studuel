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

  // PAR PAQUETS (19/09/2026). Le filtre `.in()` voyage dans l'URL d'un GET :
  // 600 identifiants font ~23 Ko d'URL, au-delà de ce que la passerelle de
  // Supabase accepte — la lecture échouait alors en entier, en silence, et le
  // tirage perdait toutes les échéances de l'élève. Des paquets de 150 (~6 Ko)
  // partent en parallèle ; un paquet refusé n'emporte que lui.
  const ids = [...questionIds].slice(0, MAX_POOL)
  const paquets: string[][] = []
  for (let i = 0; i < ids.length; i += IDS_PAR_REQUETE) {
    paquets.push(ids.slice(i, i + IDS_PAR_REQUETE))
  }
  const reponses = await Promise.all(
    paquets.map((paquet) =>
      supabase
        .from('review_items')
        .select(REVIEW_COLUMNS)
        .eq('user_id', userId)
        .eq('item_kind', QUESTION_KIND)
        .in('item_id', paquet)
        .returns<ReviewRow[]>(),
    ),
  )

  const states = new Map<string, QuestionState>()
  for (const { data, error } of reponses) {
    if (error) {
      if (!isMissingSchemaObject(error)) {
        console.error('[questions] états indisponibles:', error.message)
      }
      continue
    }
    for (const row of data ?? []) states.set(row.item_id, rowToState(row))
  }
  return states
}

/** Identifiants par requête pour un filtre `.in()` (taille d'URL, cf. plus haut). */
const IDS_PAR_REQUETE = 150

