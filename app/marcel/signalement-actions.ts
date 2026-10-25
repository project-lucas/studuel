'use server'

import { createClient } from '@/lib/supabase/server'
import { estRaison, messageSignalement } from '@/lib/ia-signalement'

/**
 * Signaler une réponse de Marcel (migration 597). La base revérifie tout
 * (raison, longueurs, 20 par jour) : ici, on ne fait que relayer.
 */
export type ResultatSignalement = { ok: boolean; message: string }

export async function signalerReponseMarcel(
  raison: string,
  question: string,
  reponse: string,
): Promise<ResultatSignalement> {
  if (!estRaison(raison) || reponse.trim().length === 0) {
    return { ok: false, message: messageSignalement('panne') }
  }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('ia_signaler', {
    p_outil: 'marcel',
    p_raison: raison,
    p_question: question.slice(0, 2000),
    p_reponse: reponse.slice(0, 8000),
  })
  if (error) return { ok: false, message: messageSignalement('panne') }
  return { ok: data === 'ok', message: messageSignalement(String(data)) }
}
