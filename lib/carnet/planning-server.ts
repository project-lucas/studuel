import type { SupabaseClient } from '@supabase/supabase-js'
import { normalizePlan, type Plan } from '@/lib/carnet/planning'

/**
 * Les plans de l'élève (migration 353) — tous, ou ceux d'un cours. Vide
 * (jamais une erreur) tant que la migration dort : le bloc « Ma semaine »
 * et l'onglet Planning affichent alors leur état vide.
 */
export async function fetchPlans(
  supabase: SupabaseClient,
  userId: string,
  courseId?: string,
): Promise<Plan[]> {
  let q = supabase
    .from('carnet_plans')
    .select('id, course_id, chapter_id, days, at_time, length, mode')
    .eq('owner_id', userId)
    .order('created_at')
    .limit(200)
  if (courseId) q = q.eq('course_id', courseId)
  const { data } = await q
  return (Array.isArray(data) ? data : []).flatMap((r) => {
    const p = normalizePlan(r)
    return p ? [p] : []
  })
}
