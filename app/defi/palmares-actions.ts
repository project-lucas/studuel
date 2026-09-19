'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { parseBilan, type BilanPartie } from '@/lib/palmares/bilan'
import { parseEchelle, type LigneEchelle, type Periode } from '@/lib/palmares/echelle'
import { isEpreuveId, scorePlausible } from '@/lib/palmares/epreuves'

/**
 * Enregistre le SCORE d'une partie d'un mode de l'Arène et rend son bilan en
 * un seul aller-retour (migration 352) : la dernière fois, le record, la place
 * sur l'échelle de la semaine avant et après, la prochaine marche. L'écran de
 * fin a besoin de tout au même instant — c'est ce bilan qui fait rejouer.
 *
 * Rend `null` sans bruit quand il n'y a rien à dire : visiteur, mode inconnu,
 * score invraisemblable (la RPC re-vérifie de son côté), ou migration 352 pas
 * encore exécutée. L'écran affiche alors le score et le record local, sans
 * échelle. Rien n'est inventé.
 */
export async function recordModeScore(
  mode: string,
  score: number,
  elapsedMs: number,
): Promise<BilanPartie | null> {
  if (!isEpreuveId(mode)) return null
  const cleanScore = Math.round(score)
  const cleanMs = Math.round(elapsedMs)
  if (!scorePlausible(mode, cleanScore, cleanMs)) return null

  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('record_mode_score', {
    p_mode_id: mode,
    p_score: cleanScore,
    p_ms: cleanMs,
  })

  if (error || !data) {
    if (error) {
      console.error('[defi] score de mode non enregistré:', error.message)
    }
    return null
  }
  return parseBilan(data)
}

/**
 * L'échelle d'un mode : les dix premiers de ma classe plus ma ligne, cette
 * semaine ou de toujours. Vide (jamais une erreur) quand la RPC manque ou
 * que personne n'a joué.
 */
export async function fetchModeLadder(
  mode: string,
  periode: Periode,
): Promise<LigneEchelle[]> {
  if (!isEpreuveId(mode)) return []
  const user = await getCurrentUser()
  if (!user) return []

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('mode_ladder', {
    p_mode_id: mode,
    p_period: periode === 'toujours' ? 'toujours' : 'semaine',
    p_limit: 10,
  })
  if (error) {
    console.error('[defi] échelle non lue:', error.message)
    return []
  }
  return parseEchelle(data)
}
