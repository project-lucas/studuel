'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { codeValide, normaliserCode } from '@/lib/coach/code'

/** « Mon coach », dans Mon compte : rejoindre un groupe par son code, ou le quitter. */
export type ResultatRattachement =
  | { ok: true }
  | { ok: false; erreur: string }

export async function rejoindreGroupe(formData: FormData): Promise<ResultatRattachement> {
  const code = normaliserCode(String(formData.get('code') ?? ''))
  if (!codeValide(code)) return { ok: false, erreur: 'Un code fait 8 lettres et chiffres.' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('rattachement_par_code', { p_code: code })
  if (error) return { ok: false, erreur: 'Impossible pour le moment.' }
  if (data === 'introuvable') return { ok: false, erreur: 'Code inconnu — vérifie-le avec ton coach.' }
  if (data === 'coach') return { ok: false, erreur: 'Ce compte ne peut pas rejoindre un groupe.' }
  revalidatePath('/compte')
  return { ok: true }
}

export async function quitterGroupe(): Promise<ResultatRattachement> {
  const supabase = await createClient()
  const { error } = await supabase.rpc('rattachement_quitter')
  if (error) return { ok: false, erreur: 'Impossible pour le moment.' }
  revalidatePath('/compte')
  return { ok: true }
}
