'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { recolterRente as recolter, type Recolte } from '@/lib/studuel-plus/rente-server'
import { estFiliere } from '@/lib/prepa-sup/catalogue'
import { isMissingSchemaObject } from '@/lib/schema-fallback'

// Les gestes de la page Studuel+ (/plus) et de la prépa du supérieur. Aucune
// règle ici : la base décide (580 la rente, 582 l'intérêt pour une filière).
// Une récolte ne revalide rien : le coffre se met à jour sur place et les
// gemmes volent vers le bandeau, qui relit son solde au retour.

export async function recolterRente(): Promise<Recolte> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, raison: 'anonyme' }
  const supabase = await createClient()
  return recolter(supabase)
}

export type BasculeInteret = { ok: true; coche: boolean } | { ok: false; indisponible?: boolean }

export async function basculerInteretPrepa(piste: string): Promise<BasculeInteret> {
  if (!estFiliere(piste)) return { ok: false }
  const user = await getCurrentUser()
  if (!user) return { ok: false }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('prepa_sup_basculer', { p_piste: piste })
  if (error) {
    if (isMissingSchemaObject(error) || error.code === 'PGRST202') return { ok: false, indisponible: true }
    console.error('[prepa-sup] intérêt impossible :', error.message)
    return { ok: false }
  }
  return { ok: true, coche: data === true }
}
