import type { SupabaseClient } from '@supabase/supabase-js'
import {
  parsePalierStandings,
  type PalierStandings,
} from '@/lib/jeux/palier-standing'

/**
 * Mes places sur les cinq paliers d'un jeu (migration 313), en une requête.
 *
 * Rend un classement VIDE plutôt qu'une erreur quand la RPC manque (migration
 * pas encore exécutée) ou quand l'élève n'a jamais bouclé un palier : la carte
 * du jeu affiche alors le chrono local sans pourcentage. Un classement est un
 * bonus d'information, jamais une condition d'affichage de l'écran.
 */
export async function fetchPalierStandings(
  supabase: SupabaseClient,
  gameId: string,
): Promise<PalierStandings> {
  const { data } = await supabase.rpc('palier_standings', {
    p_game_id: gameId,
  })
  return parsePalierStandings(data)
}
