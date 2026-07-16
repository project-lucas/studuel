'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  isLibraryKind,
  normalizeTitle,
  normalizeContent,
  emptyContent,
  type LibraryKind,
} from '@/lib/library'

// « Ma bibliothèque » — CRUD des contenus créés par l'élève (library_items,
// migration 158). Accès direct à la table sous RLS owner-only : chaque écriture
// est filtrée par user_id (défense en profondeur en plus de la policy). Si 158
// n'est pas passée, les actions renvoient { ok:false } (pas de faux succès).

async function requireUserId(): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string | null
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, userId: user?.id ?? null }
}

// Crée un contenu vide du type demandé, renvoie son id (pour ouvrir l'éditeur).
export async function createLibraryItem(
  kind: string,
): Promise<{ ok: boolean; id: string | null }> {
  const { supabase, userId } = await requireUserId()
  if (!userId || !isLibraryKind(kind)) return { ok: false, id: null }

  const { data, error } = await supabase
    .from('library_items')
    .insert({
      user_id: userId,
      kind,
      title: 'Sans titre',
      content: emptyContent(kind),
    })
    .select('id')
    .single()
  if (error) {
    console.error('[bibliothèque] création impossible:', error.message)
    return { ok: false, id: null }
  }
  revalidatePath('/reviser/bibliotheque')
  return { ok: true, id: String(data.id) }
}

// Enregistre le titre + le contenu (normalisé côté serveur) d'un item.
export async function saveLibraryItem(
  id: string,
  kind: string,
  title: string,
  content: unknown,
): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof id !== 'string' || !isLibraryKind(kind)) {
    return { ok: false }
  }

  const { error } = await supabase
    .from('library_items')
    .update({
      title: normalizeTitle(title),
      content: normalizeContent(kind as LibraryKind, content),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) {
    console.error('[bibliothèque] enregistrement impossible:', error.message)
    return { ok: false }
  }
  revalidatePath('/reviser/bibliotheque')
  revalidatePath(`/reviser/bibliotheque/${id}`)
  return { ok: true }
}

// Supprime un item.
export async function deleteLibraryItem(id: string): Promise<{ ok: boolean }> {
  const { supabase, userId } = await requireUserId()
  if (!userId || typeof id !== 'string' || id.length === 0) {
    return { ok: false }
  }

  const { error } = await supabase
    .from('library_items')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) {
    console.error('[bibliothèque] suppression impossible:', error.message)
    return { ok: false }
  }
  revalidatePath('/reviser/bibliotheque')
  return { ok: true }
}
