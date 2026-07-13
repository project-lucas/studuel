'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type LinkChildState = {
  error: string | null
  message?: string | null
}

// Lier un enfant à partir du code affiché dans SON application (le même code
// que le code ami, profiles.friend_code). Le partage du code vaut consentement.
export async function linkChild(
  _prev: LinkChildState,
  formData: FormData,
): Promise<LinkChildState> {
  const raw = formData.get('code')
  const code = typeof raw === 'string' ? raw.trim().toUpperCase() : ''
  if (!/^[A-Z0-9]{6}$/.test(code)) {
    return { error: 'Le code doit contenir 6 caractères (lettres et chiffres).' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Vous devez être connecté.' }

  const { data, error } = await supabase.rpc('link_child_by_code', {
    p_code: code,
  })
  if (error) {
    console.error('link_child_by_code', error)
    return { error: 'Impossible de lier ce compte pour le moment.' }
  }

  switch (data) {
    case 'linked':
      revalidatePath('/parents')
      return { error: null, message: 'Enfant lié avec succès.' }
    case 'already':
      return { error: 'Ce compte est déjà lié à votre espace.' }
    case 'self':
      return { error: 'Vous ne pouvez pas vous lier à votre propre compte.' }
    default:
      return { error: 'Aucun élève ne correspond à ce code.' }
  }
}

// Rompre le lien avec un enfant (côté parent).
export async function unlinkChild(formData: FormData): Promise<void> {
  const childId = formData.get('childId')
  if (typeof childId !== 'string' || childId.length === 0) return

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase.rpc('unlink_child', { p_child: childId })
  if (error) {
    console.error('unlink_child', error)
    return
  }
  revalidatePath('/parents')
}
