import type { SupabaseClient } from '@supabase/supabase-js'
import { normalizeSeasonState, type CrownEvent, type SeasonState } from '@/lib/saison'
import { toDayKey } from '@/lib/streak'

// Accès serveur à la saison (migration 207).
//
// Le barème vit CÔTÉ SQL : on envoie un nom d'événement, jamais un nombre de
// couronnes. `lib/saison.ts` en tient le miroir pur et testé pour l'affichage.
// Comme lib/wallet-server, ce module tolère une base sans la migration : le gain
// échoue en silence journalisé plutôt que de casser la partie qui l'a déclenché.

/** Verse les couronnes d'un événement. Renvoie ce qui a réellement été crédité
 *  (0 au plafond quotidien, ou si la migration n'est pas passée). */
export async function addCrowns(
  supabase: SupabaseClient,
  event: CrownEvent,
): Promise<number> {
  const { data, error } = await supabase.rpc('season_add_crowns', {
    p_event: event,
  })
  if (error) {
    console.error('[saison] couronnes non versées:', error.message)
    return 0
  }
  return Math.max(0, Number(data) || 0)
}

/** L'état de la saison en cours. Null si la migration n'est pas passée —
 *  l'appelant masque alors simplement la piste. */
export async function fetchSeasonState(
  supabase: SupabaseClient,
  today: string = toDayKey(new Date()),
): Promise<SeasonState | null> {
  const { data, error } = await supabase.rpc('season_state')
  if (error || data === null) {
    if (error) console.error('[saison] état non lu:', error.message)
    return null
  }
  return normalizeSeasonState(data, today)
}
