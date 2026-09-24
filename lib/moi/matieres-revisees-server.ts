import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { lireRevisionParQuiz, plierSeances, type RevisionQuiz } from '@/lib/moi/matieres-revisees'

// -----------------------------------------------------------------------------
// Les révisions de l'élève, quiz par quiz, pour le récap des matières de
// l'onglet Moi. Séparé de lib/moi/matieres-revisees.ts, qui reste pur.
//
// Agrégées EN BASE par `revision_par_quiz()` (migration 381) : une ligne par
// quiz joué, jamais l'historique entier. Tant que la 381 n'est pas exécutée,
// REPLI sur les 1 000 dernières séances (une seule page PostgREST, deux
// colonnes), pliées ici à l'identique : le récap porte alors sur les séances
// récentes, ce qui reste juste pour presque tous les élèves.
// -----------------------------------------------------------------------------

/** Le repli ne lit jamais plus d'une page. */
const SEANCES_REPLI = 1000

export async function lireRevisionsParQuiz(supabase: SupabaseClient, userId: string): Promise<RevisionQuiz[]> {
  const { data, error } = await supabase.rpc('revision_par_quiz')
  if (!error) return lireRevisionParQuiz(data)
  if (!isMissingSchemaObject(error)) {
    console.error('[moi] révisions par quiz illisibles :', error.message)
    return []
  }
  const repli = await supabase
    .from('test_sessions')
    .select('quiz_id, total')
    .eq('user_id', userId)
    .not('quiz_id', 'is', null)
    .gt('total', 0)
    .order('created_at', { ascending: false })
    .limit(SEANCES_REPLI)
    .returns<{ quiz_id: string | null; total: number | null }[]>()
  if (repli.error) {
    console.error('[moi] séances illisibles :', repli.error.message)
    return []
  }
  return plierSeances(repli.data)
}
