'use server'

import { refresh } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { StatutDemande } from '@/lib/scolaria/demandes'

const STATUTS: readonly StatutDemande[] = ['nouvelle', 'contactee', 'close']

// Fait avancer une demande de bilan. `scolaria_demande_statut` (592) refuse
// tout autre que l'admin ; la mise en page /admin a déjà fermé la porte.
export async function changerStatutDemandeAction(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'))
  const statut = String(formData.get('statut') ?? '') as StatutDemande
  const noteBrute = formData.get('note')
  if (!Number.isInteger(id) || id <= 0 || !STATUTS.includes(statut)) return
  const supabase = await createClient()
  await supabase.rpc('scolaria_demande_statut', {
    p_id: id,
    p_statut: statut,
    p_note: typeof noteBrute === 'string' ? noteBrute : null,
  })
  refresh()
}
