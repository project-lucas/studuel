import type { SupabaseClient } from '@supabase/supabase-js'
import { parsePalmares, type LignePalmares } from '@/lib/palmares/palmares'

/**
 * Mon palmarès — toutes mes épreuves d'un coup (migration 352), en une
 * requête. Sert l'onglet Moi et les billets de l'arène.
 *
 * Rend un palmarès VIDE plutôt qu'une erreur quand la RPC manque (migration
 * pas encore exécutée) ou que l'élève n'a jamais joué : l'écran affiche alors
 * les cases vides. Un classement est un bonus d'information, jamais une
 * condition d'affichage.
 */
export async function fetchMyPalmares(supabase: SupabaseClient): Promise<LignePalmares[]> {
  const { data } = await supabase.rpc('my_mode_palmares')
  return parsePalmares(data)
}
