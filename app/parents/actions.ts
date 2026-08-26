'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { clampParentPrefs } from '@/lib/parents-suivi'

export type ParentPrefsState = {
  error: string | null
  message?: string | null
}

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
  const user = await getCurrentUser()
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
      // `link_child_by_code` renvoie 'not_found' aussi bien pour un code
      // inexistant que pour un parent bloqué par le limiteur horaire (172/169) :
      // le flou est VOLONTAIRE (ne pas offrir d'oracle sur les codes valides).
      // Mais accuser le code envoyait le parent le revérifier en boucle alors
      // qu'il n'y était pour rien — le message couvre désormais les deux causes.
      return {
        error:
          'Impossible de lier ce compte avec ce code. Vérifiez le code affiché dans l’application de votre enfant ; si vous venez d’en essayer plusieurs, patientez quelques minutes avant de réessayer.',
      }
  }
}

// Rompre le lien avec un enfant (côté parent).
//
// Retourne un message d'erreur ou `null` : sans ça, un échec ne produisait
// AUCUN signal — le parent cliquait « Délier », rien ne bougeait à l'écran, et
// il ne pouvait que recommencer sans jamais savoir pourquoi.
export async function unlinkChild(
  _prev: string | null,
  formData: FormData,
): Promise<string | null> {
  const childId = formData.get('childId')
  if (typeof childId !== 'string' || childId.length === 0) {
    return 'Enfant introuvable.'
  }

  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return 'Votre session a expiré — reconnectez-vous.'

  const { error } = await supabase.rpc('unlink_child', { p_child: childId })
  if (error) {
    console.error('unlink_child', error)
    return 'Le lien n’a pas pu être rompu. Réessayez dans un moment.'
  }
  revalidatePath('/parents')
  return null
}

// Enregistrer les réglages du parent pour UN enfant : objectif hebdomadaire et
// seuil d'alerte d'inactivité (migration 319).
//
// Les bornes sont appliquées ici ET dans la RPC : côté serveur d'app pour que
// le parent lise un message en français, côté base parce qu'une Server Action
// n'est pas une frontière de confiance.
export async function saveParentPrefs(
  _prev: ParentPrefsState,
  formData: FormData,
): Promise<ParentPrefsState> {
  const childId = formData.get('childId')
  if (typeof childId !== 'string' || childId.length === 0) {
    return { error: 'Enfant introuvable.' }
  }

  const prefs = clampParentPrefs({
    weeklyGoalMinutes: Number(formData.get('goalMinutes')),
    alertAfterDays: Number(formData.get('alertDays')),
  })

  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return { error: 'Votre session a expiré — reconnectez-vous.' }

  const { data, error } = await supabase.rpc('set_parent_prefs', {
    p_child: childId,
    p_goal_minutes: prefs.weeklyGoalMinutes,
    p_alert_days: prefs.alertAfterDays,
  })
  if (error) {
    // PGRST202 = migration 319 pas encore passée. Le dire plutôt que de laisser
    // le parent croire que ses réglages sont enregistrés alors qu'ils sont
    // perdus à chaque rechargement.
    console.error('set_parent_prefs', error)
    return {
      error:
        error.code === 'PGRST202'
          ? 'Les réglages ne sont pas encore disponibles sur ce compte.'
          : 'Vos réglages n’ont pas pu être enregistrés. Réessayez dans un moment.',
    }
  }
  if (data === false) {
    return { error: 'Ce compte n’est plus lié à votre espace.' }
  }

  revalidatePath('/parents')
  return { error: null, message: 'Réglages enregistrés.' }
}
