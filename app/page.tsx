import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Racine = point d'entrée de l'app installée (start_url du manifest).
// Connecté → le Défi (LE geste quotidien). Sinon → l'accueil « façon
// Duolingo » qui fait vivre le parcours avant de demander un compte.
export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  redirect(user ? '/defi' : '/bienvenue')
}
