'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
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
    'New password should be different from the old password.':
      "Le nouveau mot de passe doit être différent de l'ancien.",
  }
  return map[message] ?? message
}

// URL publique de l'app, reconstruite depuis la requête (dev et prod).
async function siteOrigin(): Promise<string> {
  const h = await headers()
  const explicit = h.get('origin')
  if (explicit) return explicit
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  return `${proto}://${host}`
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

// Mot de passe oublié, étape 1 : envoi de l'email de réinitialisation.
// Le lien passe par /auth/callback (échange du code contre une session)
// puis atterrit sur /reset-password pour choisir le nouveau mot de passe.
export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim()
  if (!email) return { error: 'Adresse email requise.' }

  const supabase = await createClient()
  const origin = await siteOrigin()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  })
  // Rate limit Supabase mis à part, on répond pareil que le compte existe ou
  // non : impossible de sonder les emails inscrits depuis ce formulaire.
  if (error && error.status === 429) {
    return {
      error: 'Trop de demandes rapprochées — réessaie dans quelques minutes.',
    }
  }
  return {
    error: null,
    message:
      'Si un compte existe avec cette adresse, un email de réinitialisation vient de partir. Vérifie ta boîte mail (et les spams).',
  }
}

// Mot de passe oublié, étape 2 : nouveau mot de passe (l'élève arrive ici
// connecté par le lien email).
export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')
  if (password.length < 6) {
    return { error: 'Le mot de passe doit contenir au moins 6 caractères.' }
  }
  if (password !== confirm) {
    return { error: 'Les deux mots de passe ne correspondent pas.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return {
      error:
        'Le lien de réinitialisation a expiré — redemande un email depuis « Mot de passe oublié ».',
    }
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: toFrench(error.message) }

  revalidatePath('/', 'layout')
  redirect('/defi')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
