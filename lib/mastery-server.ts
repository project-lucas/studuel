import type { SupabaseClient } from '@supabase/supabase-js'
import {
  getQuizLessonPairsCached,
  getLessonChapterPairsCached,
} from '@/lib/catalog'
import { masteryInputs } from '@/lib/mastery-inputs'
import { assembleMastery, type ChapterMastery } from '@/lib/mastery'

// LA LECTURE de la maîtrise par chapitre — côté serveur uniquement. Les règles
// (seuils, rangs, assemblage) restent dans `lib/mastery.ts`, pur et importable
// par les composants client sans embarquer le client Supabase.

export async function getChapterMastery(
  supabase: SupabaseClient,
  userId: string,
): Promise<ChapterMastery> {
  const mastery: ChapterMastery = new Map()

  // UNE SEULE VAGUE : l'historique personnel de l'élève et la charpente du
  // catalogue partent ensemble. Cette dernière est en cache serveur (identique
  // pour tous), là où la fonction enchaînait autrefois trois allers-retours en
  // série — les quiz joués, puis leurs leçons, puis leurs chapitres — au beau
  // milieu du chargement de Réviser et du Défi.
  //
  // ET L'HISTORIQUE S'AGRÈGE EN BASE (migration 321). C'était la lecture la
  // plus coûteuse du projet : `test_sessions` SANS LIMITE — une ligne par
  // session jouée depuis l'inscription — pour n'en tirer qu'un `max` par quiz.
  // Le détail du pourquoi est dans `lib/mastery-inputs.ts` ; ce qu'il faut
  // savoir ici, c'est que le repli sur l'ancienne lecture y est assuré tant que
  // la 321 n'est pas exécutée, et que la RLS reste seule maîtresse du
  // périmètre (la RPC est SECURITY INVOKER).
  const [inputs, quizLessonPairs, lessonChapterPairs] = await Promise.all([
    masteryInputs(supabase, userId),
    getQuizLessonPairsCached(),
    getLessonChapterPairsCached(),
  ])

  const bestByQuiz = inputs.bestByQuiz

  // Quiz → leçon → chapitre, lus dans la charpente déjà en main.
  let quizLessons = new Map(quizLessonPairs)
  let chapterByLesson = new Map(lessonChapterPairs)
  const completedLessons = inputs.completedLessons

  if (bestByQuiz.size === 0 && completedLessons.size === 0) return mastery

  // Repli : catalogue en cache froid, ou migration 026 (lecture anon) pas
  // exécutée. On retombe sur les lectures ciblées d'avant plutôt que de rendre
  // une maîtrise vide — qui ferait retomber les couronnes de l'élève à zéro.
  if (quizLessons.size === 0 || chapterByLesson.size === 0) {
    const { data: quizzes } = await supabase
      .from('quizzes')
      .select('id, lesson_id')
      .in('id', [...bestByQuiz.keys()])
      .returns<{ id: string; lesson_id: string | null }[]>()
    quizLessons = new Map(
      (quizzes ?? []).flatMap((q) => (q.lesson_id ? [[q.id, q.lesson_id]] : [])),
    )
    const lessonIds = [
      ...new Set([...quizLessons.values(), ...completedLessons]),
    ]
    if (lessonIds.length === 0) return mastery
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, chapter_id')
      .in('id', lessonIds)
      .returns<{ id: string; chapter_id: string }[]>()
    chapterByLesson = new Map((lessons ?? []).map((l) => [l.id, l.chapter_id]))
  }

  return assembleMastery(bestByQuiz, completedLessons, quizLessons, chapterByLesson)
}
