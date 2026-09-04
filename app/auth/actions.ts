'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { siteOrigin } from '@/lib/supabase/site-origin'
import { cheminInterne, type FournisseurOAuth } from '@/lib/auth-portes'

// Démarre la connexion Apple / Google. Au retour, /auth/callback échange le
// code contre une session puis redirige vers `next` (chemin interne
// uniquement — un `next` forgé par le client retombe sur la racine).
//
// Deux appelants, deux suites :
// - /bienvenue → `/bienvenue?finish=1` : le parcours applique les réponses du
//   brouillon local au profil (applyOnboarding).
// - /login     → `/login/suite` : le compte existe déjà (ou pas), la page
//   décide de la destination d'après le profil, comme `signIn`.
//
// NOTE CONFIG : les fournisseurs doivent être activés dans Supabase
// (Dashboard → Authentication → Providers) avec leurs identifiants OAuth.
// Les boutons ne s'affichent que pour les fournisseurs activés (voir
// `lib/supabase/portes-oauth.ts`) ; s'ils échouent malgré tout, `retour`
// dit où renvoyer l'élève avec le message d'erreur.
export async function startOAuth(
  provider: FournisseurOAuth,
  next: string,
  retour: string,
): Promise<void> {
  const supabase = await createClient()
  const origin = await siteOrigin()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(cheminInterne(next))}`,
    },
  })
  if (error || !data.url) {
    redirect(cheminInterne(retour))
  }
  redirect(data.url)
}
