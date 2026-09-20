import { unstable_cache } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import { contentLevelFor } from '@/lib/grades'
import { toutLire } from '@/lib/postgrest-pages'
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
//
// LA CLASSE QUI ENTRE N'EST PAS TOUJOURS LE NIVEAU QU'ON INTERROGE. Les
// fonctions ci-dessous reçoivent la CLASSE de l'élève et la replient sur le
// niveau où vit son contenu (`contentLevelFor`) : la voie technologique
// partage le contenu de la voie générale et n'en a pas de copie. Le repli se
// fait ICI, dans le corps de la fonction plutôt que chez l'appelant, parce
// qu'un appelant qui l'oublie ne casse rien de visible — il rend simplement
// une classe entière vide.

const CATALOG_TTL_SECONDS = 300

// ⚠️ TOUTE LECTURE SANS FILTRE PASSE PAR `toutLire` (lib/postgrest-pages).
// PostgREST rend AU PLUS 1 000 lignes par réponse et ne signale pas la coupe :
// le 05/09/2026, avec 2 323 chapitres et 2 340 quiz en base, ces fonctions ne
// voyaient que les 1 000 premières lignes — d'où des matières « Bientôt » alors
// qu'elles étaient pleines, et une maîtrise calculée sur 43 % des quiz. Les
// lectures filtrées par NIVEAU y passent aussi : la 1re compte déjà 676
// chapitres, le seuil n'est pas loin.

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
    const db = anonClient()
    const { data } = await toutLire((from, to) =>
      db
        .from('chapters')
        .select('id, subject_id, level, title, position')
        .eq('level', contentLevelFor(grade))
        .order('position', { ascending: true })
        .order('id', { ascending: true })
        .range(from, to)
        .returns<Chapter[]>(),
    )
    return data
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
    const db = anonClient()
    const { data } = await toutLire((from, to) =>
      db
        .from('chapters')
        .select('subject_id, level')
        .order('id', { ascending: true })
        .range(from, to)
        .returns<{ subject_id: string; level: string }[]>(),
    )
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
    const db = anonClient()
    const { data } = await toutLire((from, to) =>
      db
        .from('quizzes')
        .select('id, lesson_id')
        .order('id', { ascending: true })
        .range(from, to)
        .returns<{ id: string; lesson_id: string | null }[]>(),
    )
    return data.flatMap((q) => (q.lesson_id ? [[q.id, q.lesson_id]] : []))
  },
  ['catalog-quiz-lesson'],
  { revalidate: CATALOG_TTL_SECONDS, tags: ['catalog'] },
)

export const getLessonChapterPairsCached = unstable_cache(
  async (): Promise<[string, string][]> => {
    const db = anonClient()
    const { data } = await toutLire((from, to) =>
      db
        .from('lessons')
        .select('id, chapter_id')
        .order('id', { ascending: true })
        .range(from, to)
        .returns<{ id: string; chapter_id: string | null }[]>(),
    )
    return data.flatMap((l) => (l.chapter_id ? [[l.id, l.chapter_id]] : []))
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
    const db = anonClient()
    const { data } = await toutLire((from, to) =>
      db
        .from('chapters')
        .select('id, title')
        .order('id', { ascending: true })
        .range(from, to)
        .returns<{ id: string; title: string }[]>(),
    )
    return data.map((c) => [String(c.id), String(c.title)])
  },
  ['catalog-chapter-titles'],
  { revalidate: CATALOG_TTL_SECONDS, tags: ['catalog'] },
)

//
// 18 262 questions en base (05/09/2026) : les relire pour les compter, c'est
// 19 pages de 1 000. La migration 354 apporte une RPC qui compte EN BASE
// (`catalog_quiz_question_counts`, une ligne par quiz) ; tant qu'elle n'est pas
// exécutée, on pagine — plus lent, mais JUSTE, là où l'ancienne lecture nue
// s'arrêtait à 1 000 lignes et ne connaissait le compte que d'une centaine de
// quiz.
export const getQuizQuestionCountsCached = unstable_cache(
  async (): Promise<[string, number][]> => {
    const db = anonClient()
    const rpc = await db.rpc('catalog_quiz_question_counts')
    const agreges = rpc.data as { quiz_id: string; n: number }[] | null
    if (!rpc.error && Array.isArray(agreges)) {
      return agreges.map((r) => [String(r.quiz_id), Number(r.n)])
    }
    const { data } = await toutLire((from, to) =>
      db
        .from('quiz_questions')
        .select('quiz_id')
        .order('id', { ascending: true })
        .range(from, to)
        .returns<{ quiz_id: string }[]>(),
    )
    const counts = new Map<string, number>()
    for (const row of data) {
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
    const db = anonClient()
    const { data } = await toutLire((from, to) =>
      db
        .from('quizzes')
        .select('id, subject, lesson_id')
        .in('grade_level', [contentLevelFor(grade), horsNiveau])
        .order('id', { ascending: true })
        .range(from, to)
        .returns<{ id: string; subject: string; lesson_id: string | null }[]>(),
    )
    return data
  },
  ['catalog-grade-quizzes'],
  { revalidate: CATALOG_TTL_SECONDS, tags: ['catalog'] },
)

// Nombre de quiz par matière (colonne `subject`, brute) pour UNE classe, hors
// niveau exclu : le proxy de « cette matière a de quoi servir son Programme »
// (arène, route du duel). L'arène relisait ces quiz à CHAQUE affichage, sans
// cache, alors qu'ils sont les mêmes pour toute la classe (19/09/2026).
export const getQuizCountBySubjectCached = unstable_cache(
  async (grade: string): Promise<[string, number][]> => {
    const db = anonClient()
    const { data } = await toutLire((from, to) =>
      db
        .from('quizzes')
        .select('id, subject')
        .eq('grade_level', contentLevelFor(grade))
        .order('id', { ascending: true })
        .range(from, to)
        .returns<{ id: string; subject: string | null }[]>(),
    )
    const counts = new Map<string, number>()
    for (const row of data) {
      const subject = String(row.subject ?? '')
      if (subject) counts.set(subject, (counts.get(subject) ?? 0) + 1)
    }
    return [...counts]
  },
  ['catalog-quiz-count-by-subject'],
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

/**
 * La lecture du programme, SANS cache.
 *
 * Sert de recours quand on a la PREUVE que le cache est périmé : une migration
 * de contenu vient de passer, et le catalogue de 300 s ne connaît pas les
 * chapitres qui existent maintenant. Voir `catalogIsStale`
 * (lib/subject-template.ts) et son appel dans la page matière — c'est le seul
 * endroit qui doit s'en servir, une lecture non mémoïsée à chaque navigation
 * annulerait tout le bénéfice du cache.
 */
export async function getProgrammeFresh(
  subjectId: string,
  grade: string,
): Promise<CatalogChapter[]> {
  const { data } = await anonClient()
    .from('chapters')
    .select(`${CHAPTER_COLUMNS}, lessons(${LESSON_COLUMNS}, quizzes(id))`)
    .eq('subject_id', subjectId)
    .eq('level', contentLevelFor(grade))
    .order('position', { ascending: true })
    .order('position', { ascending: true, referencedTable: 'lessons' })
    .returns<CatalogChapter[]>()
  return data ?? []
}

export const getProgrammeCached = unstable_cache(getProgrammeFresh, ['catalog-programme'], {
  revalidate: CATALOG_TTL_SECONDS,
  tags: ['catalog'],
})
