import type { SupabaseClient } from '@supabase/supabase-js'
import {
  parsePalierStandings,
  type PalierStandings,
} from '@/lib/jeux/palier-standing'
import { isMissingSchemaObject } from '@/lib/schema-fallback'

/**
 * Mes places sur les cinq paliers d'un jeu, en une requête : `palier_temps_etat`
 * (603 — la place ET les caps de rapidité déjà payés), avec repli sur
 * `palier_standings` (313) tant que la 603 n'est pas exécutée.
 *
 * Rend un classement VIDE plutôt qu'une erreur quand la RPC manque ou quand
 * l'élève n'a jamais bouclé un palier : la carte du jeu affiche alors le
 * chrono local sans pourcentage. Un classement est un bonus d'information,
 * jamais une condition d'affichage de l'écran.
 */
export async function fetchPalierStandings(
  supabase: SupabaseClient,
  gameId: string,
): Promise<PalierStandings> {
  const neuf = await supabase.rpc('palier_temps_etat', { p_game_id: gameId })
  if (!neuf.error) return parsePalierStandings(neuf.data)
  if (!isMissingSchemaObject(neuf.error)) return {}
  const { data } = await supabase.rpc('palier_standings', { p_game_id: gameId })
  return parsePalierStandings(data)
}
