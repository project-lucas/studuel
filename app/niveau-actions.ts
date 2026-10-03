'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { estPalier } from '@/lib/niveaux'

export type OuverturePalier =
  | { ok: true; gemmes: number }
  | { ok: false; raison: 'anonyme' | 'pas_un_palier' | 'pas_atteint' | 'deja_ouvert' | 'bientot' | 'erreur' }

/**
 * Ouvre le coffre de palier d'un niveau (tous les 5 niveaux, migration 556).
 * Le serveur vérifie que l'élève a atteint ce niveau et ne paie qu'une fois.
 * Sans la migration, « bientot » : l'écran le dit, rien ne casse.
 */
export async function ouvrirPalierNiveau(niveau: number): Promise<OuverturePalier> {
  if (!estPalier(niveau)) return { ok: false, raison: 'pas_un_palier' }
  const user = await getCurrentUser()
  if (!user) return { ok: false, raison: 'anonyme' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('niveau_palier_reclamer', { p_niveau: niveau })
  if (error) {
    if (error.code === 'PGRST202' || error.code === '42883') return { ok: false, raison: 'bientot' }
    console.error('[niveau] coffre de palier :', error.message)
    return { ok: false, raison: 'erreur' }
  }
  const r = (data ?? {}) as { ok?: boolean; gemmes?: number; raison?: string }
  if (r.ok === true) return { ok: true, gemmes: Math.max(0, Number(r.gemmes) || 0) }
  const raison = r.raison
  return {
    ok: false,
    raison: raison === 'anonyme' || raison === 'pas_un_palier' || raison === 'pas_atteint' || raison === 'deja_ouvert' ? raison : 'erreur',
  }
}
