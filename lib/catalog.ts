import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import {
  CHAPTER_COLUMNS,
  LESSON_COLUMNS,
  type Subject,
  type Chapter,
  type Lesson,
} from '@/lib/types'

// Catalogue en cache serveur : matières, chapitres et leçons sont identiques
// pour tous les élèves d'une même classe — aucune raison de les requêter à
// chaque navigation. Les fonctions ci-dessous sont mémoïsées par Next
// (unstable_cache, TTL 5 min) et utilisent un client Supabase SANS cookies
// (rôle anon) : jamais de donnée personnelle ici.
//
// PRÉREQUIS : migration 026 (lecture anon du catalogue). Tant qu'elle n'est
// pas exécutée, ces fonctions renvoient [] — les pages retombent alors sur
// leur requête authentifiée classique (repli prévu à chaque appel).

const CATALOG_TTL_SECONDS = 300

function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}

// Toutes les matières (la page en filtre par niveau/sélection).
export const getSubjectsCached = unstable_cache(
  async (): Promise<Subject[]> => {
    const { data } = await anonClient()
      .from('subjects')
      .select('*')
      .order('name')
      .returns<Subject[]>()
    return data ?? []
  },
  ['catalog-subjects'],
  { revalidate: CATALOG_TTL_SECONDS, tags: ['catalog'] },
)

// Chapitres d'un niveau, toutes matières (home Réviser).
export const getGradeChaptersCached = unstable_cache(
  async (grade: string): Promise<Chapter[]> => {
    const { data } = await anonClient()
      .from('chapters')
      .select('id, subject_id, level, title, position')
      .eq('level', grade)
      .order('position', { ascending: true })
      .returns<Chapter[]>()
    return data ?? []
  },
  ['catalog-grade-chapters'],
  { revalidate: CATALOG_TTL_SECONDS, tags: ['catalog'] },
)

// Couples (matière, niveau) ayant AU MOINS un chapitre — sur tous les niveaux.
//
// `getGradeChaptersCached` ne voit que le niveau de l'élève, ce qui suffit à
// l'affichage mais PAS à décider qu'une matière est vide : une matière
// hors-niveau (`fixed_level = 'tous'` — la culture générale) range son contenu
// ailleurs et paraîtrait vide partout. Quelques dizaines de paires, identiques
// pour tous les élèves, d'où le cache. Tableau de paires (et non `Set`) : le
// cache de Next sérialise ce qu'il stocke.
export const getSubjectLevelsCached = unstable_cache(
  async (): Promise<[string, string][]> => {
    const { data } = await anonClient()
      .from('chapters')
      .select('subject_id, level')
      .returns<{ subject_id: string; level: string }[]>()
    const seen = new Set<string>()
    const pairs: [string, string][] = []
    for (const row of data ?? []) {
      const key = `${row.subject_id}|${row.level}`
      if (seen.has(key)) continue
      seen.add(key)
      pairs.push([row.subject_id, row.level])
    }
    return pairs
  },
  ['catalog-subject-levels'],
  { revalidate: CATALOG_TTL_SECONDS, tags: ['catalog'] },
)

// Rattachements quiz → leçon → chapitre. C'est la charpente du catalogue :
// quelques centaines de lignes de deux colonnes, RIGOUREUSEMENT identiques pour
// tous les élèves. Elles étaient pourtant relues à chaque calcul de maîtrise,
// et surtout EN SÉRIE (les quiz joués, puis leurs leçons, puis leurs chapitres) :
// trois allers-retours enchaînés au cœur du chargement de Réviser et du Défi.
//
// Mises en cache ici, le calcul de maîtrise n'a plus qu'à lire l'historique de
// l'élève — une seule vague. Tableaux de paires (et non `Map`) : le cache de
// Next sérialise ce qu'il stocke.
export const getQuizLessonPairsCached = unstable_cache(
  async (): Promise<[string, string][]> => {
    const { data } = await anonClient()
      .from('quizzes')
      .select('id, lesson_id')
      .returns<{ id: string; lesson_id: string | null }[]>()
    return (data ?? []).flatMap((q) => (q.lesson_id ? [[q.id, q.lesson_id]] : []))
  },
  ['catalog-quiz-lesson'],
  { revalidate: CATALOG_TTL_SECONDS, tags: ['catalog'] },
)

export const getLessonChapterPairsCached = unstable_cache(
  async (): Promise<[string, string][]> => {
    const { data } = await anonClient()
      .from('lessons')
      .select('id, chapter_id')
      .returns<{ id: string; chapter_id: string | null }[]>()
    return (data ?? []).flatMap((l) =>
      l.chapter_id ? [[l.id, l.chapter_id]] : [],
    )
  },
  ['catalog-lesson-chapter'],
  { revalidate: CATALOG_TTL_SECONDS, tags: ['catalog'] },
)

// Titre de chaque chapitre, et nombre de questions de chaque quiz. Deux autres
// faits de catalogue que le choix du « chapitre du jour » relisait en série à
// chaque ouverture du Défi. Le comptage se fait ICI, côté serveur : le cache ne
// stocke qu'une paire par quiz (quelques centaines), jamais les ~2 900 lignes
// de `quiz_questions`.
export const getChapterTitlesCached = unstable_cache(
  async (): Promise<[string, string][]> => {
    const { data } = await anonClient()
      .from('chapters')
      .select('id, title')
      .returns<{ id: string; title: string }[]>()
    return (data ?? []).map((c) => [String(c.id), String(c.title)])
  },
  ['catalog-chapter-titles'],
  { revalidate: CATALOG_TTL_SECONDS, tags: ['catalog'] },
)

export const getQuizQuestionCountsCached = unstable_cache(
  async (): Promise<[string, number][]> => {
    const { data } = await anonClient()
      .from('quiz_questions')
      .select('quiz_id')
      .returns<{ quiz_id: string }[]>()
    const counts = new Map<string, number>()
    for (const row of data ?? []) {
      const id = String(row.quiz_id)
      counts.set(id, (counts.get(id) ?? 0) + 1)
    }
    return [...counts]
  },
  ['catalog-quiz-question-counts'],
  { revalidate: CATALOG_TTL_SECONDS, tags: ['catalog'] },
)

// Quiz jouables d'une classe (le vivier du Défi) — catalogue, donc identique
// pour tous les élèves de ce niveau.
export const getGradeQuizzesCached = unstable_cache(
  async (
    grade: string,
    horsNiveau: string,
  ): Promise<{ id: string; subject: string; lesson_id: string | null }[]> => {
    const { data } = await anonClient()
      .from('quizzes')
      .select('id, subject, lesson_id')
      .in('grade_level', [grade, horsNiveau])
      .returns<{ id: string; subject: string; lesson_id: string | null }[]>()
    return data ?? []
  },
  ['catalog-grade-quizzes'],
  { revalidate: CATALOG_TTL_SECONDS, tags: ['catalog'] },
)

// Programme complet d'une matière pour un niveau : chapitres → leçons → quiz
// rattachés. C'est LA structure de la page matière (template structure des
// cours). select('*') sur les leçons : tolère une base sans la migration 025.
// Colonnes explicites sur les chapitres en revanche : `*` ramènerait le JSONB
// COMPLET de chaque carte mentale — payant, et inutile ici (voir CHAPTER_COLUMNS).
export type CatalogChapter = Chapter & {
  lessons: (Lesson & { quizzes: { id: string }[] })[]
}

export const getProgrammeCached = unstable_cache(
  async (subjectId: string, grade: string): Promise<CatalogChapter[]> => {
    const { data } = await anonClient()
      .from('chapters')
      .select(`${CHAPTER_COLUMNS}, lessons(${LESSON_COLUMNS}, quizzes(id))`)
      .eq('subject_id', subjectId)
      .eq('level', grade)
      .order('position', { ascending: true })
      .order('position', { ascending: true, referencedTable: 'lessons' })
      .returns<CatalogChapter[]>()
    return data ?? []
  },
  ['catalog-programme'],
  { revalidate: CATALOG_TTL_SECONDS, tags: ['catalog'] },
)
