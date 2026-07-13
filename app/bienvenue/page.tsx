import { redirect } from 'next/navigation'
import WelcomeFlow from '@/components/welcome/WelcomeFlow'
import { getSubjectsCached } from '@/lib/catalog'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Bienvenue — Studuel' }
export const dynamic = 'force-dynamic'

// Parcours d'accueil « façon Duolingo » : AVANT la création de compte. Public.
// - ?apercu=1 : prévisualisation même connecté (voir le rendu sans se déco).
// - ?finish=1 : retour OAuth (compte fraîchement créé) → on applique les
//   réponses du brouillon local au profil puis on montre le plan final.
export default async function BienvenuePage({
  searchParams,
}: {
  searchParams: Promise<{ apercu?: string; finish?: string }>
}) {
  const { apercu, finish } = await searchParams
  const preview = apercu === '1'
  const isFinish = finish === '1'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Un compte connecté est renvoyé au geste quotidien — sauf en prévisualisation
  // ou au retour OAuth (où il doit finir son onboarding sur l'écran « plan »).
  if (user && !preview && !isFinish) redirect('/defi')

  const subjects = await getSubjectsCached()

  return <WelcomeFlow subjects={subjects} finish={isFinish} />
}
