import { redirect } from 'next/navigation'
import WelcomeFlow from '@/components/welcome/WelcomeFlow'
import { getSubjectsCached } from '@/lib/catalog'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Bienvenue — Studuel' }
export const dynamic = 'force-dynamic'

// Parcours d'accueil « façon Duolingo » : AVANT la création de compte.
// Public (aucune session) ; les matières sont lues via le catalogue anon.
export default async function BienvenuePage({
  searchParams,
}: {
  searchParams: Promise<{ apercu?: string }>
}) {
  // ?apercu=1 : mode prévisualisation — on affiche le parcours même connecté
  // (pratique pour voir le rendu sans se déconnecter). Sinon, un compte déjà
  // connecté est renvoyé vers le geste quotidien.
  const { apercu } = await searchParams
  const preview = apercu === '1'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user && !preview) redirect('/defi')

  const subjects = await getSubjectsCached()

  return <WelcomeFlow subjects={subjects} />
}
