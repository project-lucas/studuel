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
