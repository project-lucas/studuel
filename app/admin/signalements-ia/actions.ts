'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// Les policies de 597 ne laissent passer que l'admin ; la mise en page /admin
// a déjà fermé la porte aux autres.
export async function marquerTraiteAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id) || id <= 0) return
  const supabase = await createClient()
  await supabase.from('ia_signalements').update({ traite_le: new Date().toISOString() }).eq('id', id)
  revalidatePath('/admin/signalements-ia')
}

export async function supprimerSignalementAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  if (!Number.isInteger(id) || id <= 0) return
  const supabase = await createClient()
  await supabase.from('ia_signalements').delete().eq('id', id)
  revalidatePath('/admin/signalements-ia')
}
