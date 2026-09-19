import type { SupabaseClient } from '@supabase/supabase-js'
import { joursDeLaSemaine, lundiDe, normalizePlan, type Plan, type SessionJouee } from '@/lib/carnet/planning'

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

/**
 * Les sessions du carnet jouées CETTE SEMAINE (lundi → dimanche de `today`),
 * réduites à ce qu'il faut pour dire si un plan a été tenu. Une session
 * commencée compte : on ne demande pas qu'elle soit finie — tenir son
 * rendez-vous, c'est s'y présenter.
 */
export async function fetchSessionsSemaine(
  supabase: SupabaseClient,
  userId: string,
  today: string,
): Promise<SessionJouee[]> {
  const jours = joursDeLaSemaine(lundiDe(today))
  const debut = `${jours[0]}T00:00:00Z`
  const fin = `${jours[6]}T23:59:59Z`
  const { data } = await supabase
    .from('carnet_review_sessions')
    .select('course_id, chapter_id, started_at')
    .eq('user_id', userId)
    .gte('started_at', debut)
    .lte('started_at', fin)
    .limit(500)
  return (Array.isArray(data) ? data : []).flatMap((r) => {
    const started = typeof r.started_at === 'string' ? r.started_at : null
    if (!started) return []
    return [
      {
        courseId: typeof r.course_id === 'string' ? r.course_id : null,
        chapterId: typeof r.chapter_id === 'string' ? r.chapter_id : null,
        dayKey: started.slice(0, 10),
      },
    ]
  })
}
