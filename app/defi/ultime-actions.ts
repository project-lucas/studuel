'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  parseUltimeStanding,
  type UltimeStanding,
} from '@/lib/jeux/ultime-standing'
import { ULTIME_MAX_LEVEL, hasUltime } from '@/lib/jeux/ultime'

/**
 * Enregistre une partie d'ÉPREUVE ULTIME et rend la place qu'elle donne : la
 * cote, le rang mondial, et le rang dans la classe — en un aller-retour, parce
 * que l'écran de fin a besoin des trois au même instant.
 *
 * Rend `null` sans bruit dans tous les cas où il n'y a rien à dire : visiteur,
 * jeu sans épreuve ultime, niveau hors bornes, ou migration 314 pas encore
 * exécutée. L'écran affiche alors le niveau atteint, seul — ce qui reste vrai.
 */
export async function recordUltimeRun(
  gameId: string,
  level: number,
  elapsedMs: number,
): Promise<UltimeStanding | null> {
  if (!hasUltime(gameId)) return null
  if (!Number.isFinite(level) || level < 0 || level > ULTIME_MAX_LEVEL) return null
  if (!Number.isFinite(elapsedMs) || elapsedMs <= 0) return null

  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('record_ultime_run', {
    p_game_id: gameId,
    p_level: Math.round(level),
    p_ms: Math.round(elapsedMs),
  })

  if (error || !data) {
    // Un refus (durée invraisemblable, jeu hors catalogue) n'est pas une panne :
    // on ne journalise que l'échec technique.
    if (error) {
      console.error('[defi] partie ultime non enregistrée:', error.message)
    }
    return null
  }

  return parseUltimeStanding(data)
}
