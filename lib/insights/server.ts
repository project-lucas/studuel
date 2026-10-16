import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { aTraiterDepuis, insightsDepuis, usageDepuis, type ATraiter, type Insights, type Usage } from '@/lib/insights/insights'

/** Les lectures des tableaux de bord admin (589, 590) : null si la migration manque. */

export async function lireInsights(jours: number): Promise<Insights | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_insights', { p_jours: jours })
  return error ? null : insightsDepuis(data)
}

export async function lireATraiter(): Promise<ATraiter | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_contenu_a_traiter')
  return error ? null : aTraiterDepuis(data)
}

export async function lireUsage(jours: number): Promise<Usage | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('admin_usage', { p_jours: jours })
  return error ? null : usageDepuis(data)
}

/** `?j=` borné aux périodes proposées. */
export function periodeDepuis(brut: string | undefined, choix: number[], defaut: number): number {
  const n = Number(brut)
  return choix.includes(n) ? n : defaut
}
