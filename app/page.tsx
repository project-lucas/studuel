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

  if (!user) redirect('/bienvenue')

  // Un compte parent n'a pas de classe : le renvoyer sur Réviser l'amenait sur
  // « Dis-nous ta classe », un écran d'élève sans issue pour lui. Son espace
  // n'étant listé dans aucune barre de navigation, la racine est justement le
  // point d'entrée de l'app installée (start_url du manifest) — c'est ici que
  // ça se joue.
  const { data: profile } = await supabase
    .from('profiles')
    .select('profile_type')
    .eq('id', user.id)
    .maybeSingle<{ profile_type: string | null }>()

  redirect(profile?.profile_type === 'parent' ? '/parents' : '/reviser')
}
