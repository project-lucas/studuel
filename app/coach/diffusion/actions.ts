'use server'

import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { messageErreurAnnonce, verifierBrouillon, type Brouillon, type Segment } from '@/lib/annonces/annonces'
import { notifierAnnonce } from '@/lib/annonces/server'
import { lireRolesConsole } from '@/lib/console/server'

/**
 * Publier un message ou un sondage. Vérifié ici (lib/annonces) PUIS en base
 * (`annonce_publier` refuse à un coach un public réservé à l'admin). La
 * notification push part après la réponse.
 */
export async function publierAnnonceAction(b: Brouillon): Promise<{ ok: true; id: string } | { ok: false; erreurs: string[] }> {
  const roles = await lireRolesConsole()
  if (!roles.coach) return { ok: false, erreurs: ['Réservé aux coachs.'] }
  const v = verifierBrouillon(b, roles.admin)
  if (!v.ok) return v
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('annonce_publier', { p: v.payload })
  if (error || typeof data !== 'string') return { ok: false, erreurs: [messageErreurAnnonce(error?.message)] }
  if (v.payload.push) after(() => notifierAnnonce(data).then(() => undefined))
  revalidatePath('/coach/diffusion')
  return { ok: true, id: data }
}

export async function archiverAnnonceAction(id: string): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('annonce_archiver', { p_annonce: id })
  revalidatePath('/coach/diffusion')
  return !error && data === true
}

/** « 1 284 personnes recevront ce message ». */
export async function estimerCibleAction(segment: Segment, groupeId: string | null, classes: string[]): Promise<number> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('annonce_estimer', {
    p_segment: segment,
    p_groupe: segment === 'groupe' ? groupeId : null,
    p_classes: classes.length ? classes : null,
  })
  return error ? 0 : Number(data ?? 0) || 0
}
