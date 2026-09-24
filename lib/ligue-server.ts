import type { SupabaseClient } from '@supabase/supabase-js'
import { lireEtatLigue, type EtatLigue } from '@/lib/ligue'
import { isMissingSchemaObject } from '@/lib/schema-fallback'

// -----------------------------------------------------------------------------
// La ligue de la semaine, lue en UN appel (`ligue_etat`, migration 376) : la
// clôture de la semaine passée, l'entrée dans celle-ci, le groupe classé, les
// amis et le bilan en attente. Séparé de lib/ligue.ts, qui reste pur et
// importable par les composants clients.
//
// TOLÉRANT : tant que la 376 n'est pas exécutée, la fonction est absente et on
// rend `null` — l'onglet affiche « La ligue ouvre bientôt », rien ne casse.
// -----------------------------------------------------------------------------

/**
 * Le nombre d'amis acceptés — ce qui règle le multiplicateur d'XP du bandeau
 * (+0,1 par ami, lib/ligue et migration 380). Une requête `head` : rien ne
 * descend que le compte. Filtrée explicitement, jamais confiée à la seule RLS.
 * `null` en cas de panne : le bandeau n'affiche alors pas le multiplicateur.
 */
export async function compterAmis(supabase: SupabaseClient, userId: string): Promise<number | null> {
  const { count, error } = await supabase
    .from('friendships')
    .select('requester_id', { count: 'exact', head: true })
    .eq('status', 'accepted')
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
  if (error || count === null) return null
  return Math.max(0, count)
}

export async function lireLigue(supabase: SupabaseClient): Promise<EtatLigue | null> {
  const { data, error } = await supabase.rpc('ligue_etat')
  if (error) {
    if (!isMissingSchemaObject(error)) console.error('[ligue] état illisible :', error.message)
    return null
  }
  return lireEtatLigue(data)
}
