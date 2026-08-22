import type { SupabaseClient } from '@supabase/supabase-js'
import {
  parseUltimeStanding,
  type UltimeStanding,
} from '@/lib/jeux/ultime-standing'

/**
 * Ma cote et mes rangs sur l'épreuve ultime d'un jeu (migration 314).
 *
 * Rend `null` plutôt qu'une erreur quand la RPC manque (migration pas encore
 * exécutée) ou quand l'épreuve n'a jamais été jouée : la carte affiche alors le
 * barreau sans cote, ce qui est exactement la vérité.
 */
export async function fetchUltimeStanding(
  supabase: SupabaseClient,
  gameId: string,
): Promise<UltimeStanding | null> {
  const { data } = await supabase.rpc('ultime_standing', { p_game_id: gameId })
  return parseUltimeStanding(data)
}
