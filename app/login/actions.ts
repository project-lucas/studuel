'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type AuthState = {
  error: string | null
  message?: string | null
}

// Messages d'erreur Supabase les plus courants, traduits.
function toFrench(message: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'Email ou mot de passe incorrect.',
    'Email not confirmed':
      'Adresse email non confirmée — vérifie ta boîte mail.',
    'User already registered': 'Un compte existe déjà avec cet email.',
    'Password should be at least 6 characters.':
      'Le mot de passe doit contenir au moins 6 caractères.',
  }
  return map[message] ?? message
}

export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) {
    return { error: 'Email et mot de passe requis.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) return { error: toFrench(error.message) }

  // Première connexion (ou config jamais faite) → onboarding.
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarded')
    .eq('id', data.user.id)
    .maybeSingle()

  revalidatePath('/', 'layout')
  redirect(profile?.onboarded ? '/defi' : '/onboarding')
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const fullName = String(formData.get('full_name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email || !password) {
    return { error: 'Email et mot de passe requis.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // full_name est repris par le trigger handle_new_user → profiles.full_name
    options: { data: { full_name: fullName } },
  })
  if (error) return { error: toFrench(error.message) }

  // Confirmation d'email activée côté Supabase : pas de session immédiate.
  if (!data.session) {
    return {
      error: null,
      message:
        'Compte créé ! Vérifie ta boîte mail pour confirmer ton adresse, puis connecte-toi.',
    }
  }

  revalidatePath('/', 'layout')
  redirect('/onboarding')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
