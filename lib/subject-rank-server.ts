// Les lectures Supabase du ladder par matière. La logique, elle, est pure et
// vit dans `lib/subject-rank.ts` — ici on ne fait qu'aller chercher.
//
// TOLÉRANT À LA MIGRATION ABSENTE, comme partout ailleurs : tant que la 238
// n'est pas exécutée, `subject_peaks` et `subject_ranked_ghosts` n'existent pas.
// On rend alors du vide, et le ladder retombe sur « pic = compteur du jour » et
// « adversaire calibré » — deux replis déjà prévus dans la logique pure.

import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaObject } from '@/lib/schema-fallback'

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
