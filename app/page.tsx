import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Racine = point d'entrée de l'app installée (start_url du manifest).
// Connecté → Réviser, l'onglet d'accueil : reprise de la dernière session,
// outils (erreurs, bibliothèque), prochains contrôles et programme par matière.
// Sinon → l'accueil « façon Duolingo » qui fait vivre le parcours avant de
// demander un compte.
export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  redirect(user ? '/reviser' : '/bienvenue')
}
