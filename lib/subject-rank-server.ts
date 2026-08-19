// Les lectures Supabase du ladder par matière. La logique, elle, est pure et
// vit dans `lib/subject-rank.ts` — ici on ne fait qu'aller chercher.
//
// TOLÉRANT À LA MIGRATION ABSENTE, comme partout ailleurs : tant que la 238
// n'est pas exécutée, `subject_peaks` et `subject_ranked_ghosts` n'existent pas.
// On rend alors du vide, et le ladder retombe sur « pic = compteur du jour » et
// « adversaire calibré » — deux replis déjà prévus dans la logique pure.

import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import type { MatchCandidate } from '@/lib/defi/matchmaking'

/** Les pics par matière (slug → meilleur total jamais atteint). */
export async function getSubjectPeaks(
  supabase: SupabaseClient,
  userId: string,
): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from('subject_peaks')
    .select('subject_slug, peak')
    .eq('user_id', userId)
    .returns<{ subject_slug: string; peak: number }[]>()

  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[subject-rank] pics indisponibles:', error.message)
    }
    return new Map()
  }

  return new Map((data ?? []).map((row) => [row.subject_slug, Number(row.peak) || 0]))
}

/**
 * Le vivier d'adversaires d'une matière : les élèves du MÊME NIVEAU qui y ont
 * joué. Le choix (fourchette ±150, élargissement, plus proche) se fait ensuite
 * dans `lib/defi/matchmaking` — la base sert le vivier, elle ne décide pas.
 */
export async function getSubjectOpponents(
  supabase: SupabaseClient,
  subjectSlug: string,
): Promise<MatchCandidate[]> {
  const { data, error } = await supabase.rpc('subject_ranked_ghosts', {
    p_subject_slug: subjectSlug,
  })

  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[subject-rank] adversaires indisponibles:', error.message)
    }
    return []
  }

  return (Array.isArray(data) ? data : [])
    .map((row: { user_id: string; name: string; trophies: number; score: number }) => ({
      userId: String(row.user_id),
      // Prénom déjà réduit par la RPC ; on borne quand même la longueur, une
      // carte d'adversaire ne doit pas pouvoir être poussée hors de l'écran.
      name: String(row.name ?? 'Un élève').slice(0, 24),
      trophies: Math.max(0, Math.floor(Number(row.trophies) || 0)),
      score: Math.max(0, Math.floor(Number(row.score) || 0)),
    }))
    .filter((c) => c.score > 0)
}
