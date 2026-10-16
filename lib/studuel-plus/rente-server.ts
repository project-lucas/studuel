import type { SupabaseClient } from '@supabase/supabase-js'
import { isMissingSchemaObject } from '@/lib/schema-fallback'

// LA RENTE, CÔTÉ SERVEUR (migration 580). La règle est dans ./rente (pure,
// testée contre le SQL) ; ici on ne fait que lire l'état et demander la
// récolte. `null` quand la 580 n'est pas passée : l'écran dit « bientôt ».

export type RenteLue = {
  abonne: boolean
  /** Le point de départ de la rente, en millisecondes. */
  depuisMs: number
  /** L'heure de la BASE au moment de la lecture : l'écran s'y recale. */
  maintenantMs: number
  total: number
}

export async function lireRente(supabase: SupabaseClient): Promise<RenteLue | null> {
  const { data, error } = await supabase.rpc('rente_etat')
  if (error) {
    if (!isMissingSchemaObject(error) && error.code !== 'PGRST202') {
      console.error('[rente] état illisible :', error.message)
    }
    return null
  }
  if (!data || typeof data !== 'object') return null
  const d = data as Record<string, unknown>
  const depuis = Date.parse(String(d.depuis ?? ''))
  const maintenant = Date.parse(String(d.maintenant ?? ''))
  if (!Number.isFinite(depuis) || !Number.isFinite(maintenant)) return null
  return {
    abonne: d.abonne === true,
    depuisMs: depuis,
    maintenantMs: maintenant,
    total: Number(d.total ?? 0) || 0,
  }
}

export type Recolte =
  | { ok: true; gemmes: number; solde: number }
  | { ok: false; raison: 'anonyme' | 'abonnement' | 'vide' | 'indisponible' | 'erreur' }

export async function recolterRente(supabase: SupabaseClient): Promise<Recolte> {
  const { data, error } = await supabase.rpc('rente_recolter')
  if (error) {
    if (isMissingSchemaObject(error) || error.code === 'PGRST202') return { ok: false, raison: 'indisponible' }
    console.error('[rente] récolte impossible :', error.message)
    return { ok: false, raison: 'erreur' }
  }
  const d = (data ?? {}) as Record<string, unknown>
  if (d.ok === true) return { ok: true, gemmes: Number(d.gemmes) || 0, solde: Number(d.solde) || 0 }
  const raison = d.raison
  return {
    ok: false,
    raison: raison === 'anonyme' || raison === 'abonnement' || raison === 'vide' ? raison : 'erreur',
  }
}
