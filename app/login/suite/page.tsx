import { redirect } from 'next/navigation'
import { destinationApresConnexion } from '@/lib/auth-portes'
import { getServerAuth } from '@/lib/supabase/user'

export const dynamic = 'force-dynamic'

// Atterrissage de la connexion Apple / Google lancée depuis /login. Le
// callback OAuth ne connaît que l'URL de retour, pas le profil : c'est ici
// qu'on applique la même règle que `signIn` (parent → /parents, compte jamais
// configuré → onboarding, sinon l'arène). Sans session (lien périmé, refus
// chez le fournisseur), retour à la connexion.
export default async function LoginSuitePage() {
  const { supabase, user } = await getServerAuth()
  if (!user) redirect('/login?error=lien-expire')

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarded, profile_type')
    .eq('id', user.id)
    .maybeSingle<{ onboarded: boolean | null; profile_type: string | null }>()

  redirect(destinationApresConnexion(profile))
}
