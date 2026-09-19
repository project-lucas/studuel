'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { isMissingSchemaObject } from '@/lib/schema-fallback'

// -----------------------------------------------------------------------------
// La vie d'une capsule dans le carnet (migration 366) : la première ouverture
// éteint la pastille du bouton « Mon carnet », le quiz réussi la termine et
// accorde son badge.
// -----------------------------------------------------------------------------

function idValide(id: string): boolean {
  return /^[a-z0-9-]{2,40}$/.test(id)
}

export async function ouvrirCapsule(id: string): Promise<void> {
  if (!idValide(id)) return
  const user = await getCurrentUser()
  if (!user) return
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('ouvrir_capsule', { p_capsule: id })
  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[capsules] ouverture non enregistrée :', error.message)
    }
    return
  }
  // Seule une PREMIÈRE ouverture change la pastille : inutile de rafraîchir
  // le carnet et Réviser à chaque visite.
  if (data === true) {
    revalidatePath('/carnet')
    revalidatePath('/reviser')
  }
}

export async function terminerCapsule(
  id: string,
): Promise<{ ok: true; badge: string | null; nouveau: boolean } | { ok: false }> {
  if (!idValide(id)) return { ok: false }
  const user = await getCurrentUser()
  if (!user) return { ok: false }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('terminer_capsule', { p_capsule: id })
  if (error) {
    if (!isMissingSchemaObject(error)) {
      console.error('[capsules] fin non enregistrée :', error.message)
    }
    return { ok: false }
  }
  const r = (data ?? {}) as { ok?: boolean; badge?: string | null; nouveau?: boolean }
  if (!r.ok) return { ok: false }
  revalidatePath('/carnet')
  revalidatePath('/moi')
  return { ok: true, badge: typeof r.badge === 'string' ? r.badge : null, nouveau: r.nouveau === true }
}
