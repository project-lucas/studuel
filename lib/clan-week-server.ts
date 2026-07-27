import type { SupabaseClient } from '@supabase/supabase-js'
import {
  normalizeClanWeekBoard,
  weekKeyOf,
  type ClanEvent,
  type ClanWeekBoard,
} from '@/lib/clan-week'
import { toDayKey } from '@/lib/streak'

// Accès serveur au clan hebdomadaire (migration 204).
//
// Le barème vit CÔTÉ SQL : on envoie un nom d'événement, jamais un nombre de
// points. `lib/clan-week.ts` en tient le miroir pur et testé pour l'affichage.
// Comme lib/wallet-server, ce module tolère une base sans la migration : la
// contribution échoue en silence journalisé plutôt que de casser la partie.

/**
 * Verse la contribution d'un événement au clan de l'élève.
 * Renvoie les points RÉELLEMENT crédités (0 si plafond quotidien atteint,
 * si l'élève n'a pas d'école, ou si la migration n'est pas passée).
 */
export async function contributeToClan(
  supabase: SupabaseClient,
  event: ClanEvent,
): Promise<number> {
  const { data, error } = await supabase.rpc('clan_week_contribute', {
    p_event: event,
  })
  if (error) {
    console.error('[clan] contribution non enregistrée:', error.message)
    return 0
  }
  return Math.max(0, Number(data) || 0)
}

/** Le tableau de la semaine (en cours par défaut). Null si la migration n'est
 *  pas passée — l'appelant masque alors simplement la carte. */
export async function fetchClanWeekBoard(
  supabase: SupabaseClient,
  weekKey?: string,
): Promise<ClanWeekBoard | null> {
  const today = toDayKey(new Date())
  const { data, error } = await supabase.rpc('clan_week_board', {
    p_week: weekKey ?? null,
  })
  if (error || data === null) {
    if (error) console.error('[clan] semaine non lue:', error.message)
    return null
  }
  return normalizeClanWeekBoard(data, today)
}

/** Le coffre de cette semaine a-t-il déjà été ouvert ? Sans cette vérification,
 *  l'arène proposerait un bouton « Ouvrir le coffre » qui ne ferait rien (la RPC
 *  refuse un second versement) — la pire des promesses. */
export async function hasClaimedClanWeek(
  supabase: SupabaseClient,
  userId: string,
  weekKey: string,
): Promise<boolean> {
  const { data } = await supabase
    .from('clan_week_claims')
    .select('week_key')
    .eq('user_id', userId)
    .eq('week_key', weekKey)
    .maybeSingle()
  return data !== null
}

/** La semaine PRÉCÉDENTE — celle dont le coffre est réclamable. */
export function lastWeekKey(today: string = toDayKey(new Date())): string {
  const monday = Date.parse(`${weekKeyOf(today)}T00:00:00Z`)
  if (Number.isNaN(monday)) return weekKeyOf(today)
  return new Date(monday - 7 * 86_400_000).toISOString().slice(0, 10)
}
