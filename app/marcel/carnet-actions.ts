'use server'

import { refresh } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { normaliserIdentite } from '@/lib/coach/carnet-marcel'

// Le carnet de Marcel (migration 584) : la carte d'identité de la première
// rencontre et l'effacement d'une note. Ce que l'élève écrit n'est jamais cru :
// la carte passe par `normaliserIdentite` ici, puis par la RPC qui refait le
// même tri en base. Seul l'écran du bureau change : `refresh()`.

export type ResultatCarnet = { ok: boolean }

export async function enregistrerIdentite(brut: unknown): Promise<ResultatCarnet> {
  const user = await getCurrentUser()
  if (!user) return { ok: false }
  const supabase = await createClient()
  const { error } = await supabase.rpc('marcel_identite_enregistrer', {
    p_identite: normaliserIdentite(brut),
  })
  if (error) {
    console.error('[marcel] carte d’identité non enregistrée :', error.message)
    return { ok: false }
  }
  refresh()
  return { ok: true }
}

export async function effacerNote(id: string): Promise<ResultatCarnet> {
  const user = await getCurrentUser()
  if (!user || typeof id !== 'string' || id.length > 40) return { ok: false }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('marcel_note_effacer', { p_id: id })
  if (error) {
    console.error('[marcel] note non effacée :', error.message)
    return { ok: false }
  }
  refresh()
  return { ok: data === true }
}
