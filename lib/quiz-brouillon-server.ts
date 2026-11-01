// -----------------------------------------------------------------------------
// LA MANCHE INACHEVÉE, CÔTÉ SERVEUR (migration 604, 28/10/2026).
//
// Lectures TOLÉRANTES : table absente (la 604 pas encore exécutée), ligne
// illisible, erreur réseau — tout rend `null`, et l'écran se contente du
// brouillon du navigateur. Chaque `etat` relu repasse par `parserBrouillon` :
// une colonne JSONB n'est pas plus digne de confiance qu'un stockage local.
// -----------------------------------------------------------------------------

import type { SupabaseClient } from '@supabase/supabase-js'
import { BROUILLON_DUREE_MS, parserBrouillon, type BrouillonQuiz } from '@/lib/quiz-brouillon'

type Ligne = { etat: unknown; quiz_id: string }

function relire(ligne: Ligne | null): BrouillonQuiz | null {
  if (!ligne) return null
  const b = parserBrouillon(ligne.etat)
  return b && b.quizId === ligne.quiz_id ? b : null
}

/** La manche gardée d'UN quiz (la page du quiz). */
export async function lireBrouillonDuQuiz(
  supabase: SupabaseClient,
  userId: string,
  quizId: string,
): Promise<BrouillonQuiz | null> {
  try {
    const { data, error } = await supabase
      .from('quiz_brouillons')
      .select('etat, quiz_id')
      .eq('user_id', userId)
      .eq('quiz_id', quizId)
      .maybeSingle<Ligne>()
    if (error) return null
    return relire(data)
  } catch {
    return null
  }
}

/** La manche gardée la plus récente de l'élève, de moins d'un jour (Réviser). */
export async function lireDernierBrouillon(
  supabase: SupabaseClient,
  userId: string,
  maintenant: Date = new Date(),
): Promise<BrouillonQuiz | null> {
  try {
    const depuis = new Date(maintenant.getTime() - BROUILLON_DUREE_MS).toISOString()
    const { data, error } = await supabase
      .from('quiz_brouillons')
      .select('etat, quiz_id')
      .eq('user_id', userId)
      .gte('updated_at', depuis)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle<Ligne>()
    if (error) return null
    return relire(data)
  } catch {
    return null
  }
}
