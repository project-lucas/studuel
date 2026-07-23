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
  searchParams: Promise<{ apercu?: string; finish?: string; erreur?: string }>
}) {
  const { apercu, finish, erreur } = await searchParams
  const preview = apercu === '1'
  const isFinish = finish === '1'
  // `startOAuth` redirige ici avec ?erreur=oauth quand le fournisseur ne
  // démarre pas. Ce paramètre n'était lu nulle part : l'élève retombait sur
  // l'intro, sans message, et recommençait tout.
  const oauthFailed = erreur === 'oauth'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Un compte connecté est renvoyé au geste quotidien — sauf en prévisualisation
  // ou au retour OAuth (où il doit finir son onboarding sur l'écran « plan »).
  // …et sauf après un échec OAuth : l'élève n'est justement PAS connecté, mais
  // s'il l'était par ailleurs on ne veut pas l'expédier avant d'avoir expliqué.
  if (user && !preview && !isFinish && !oauthFailed) redirect('/defi')

  const subjects = await getSubjectsCached()

  return (
    <WelcomeFlow
      subjects={subjects}
      finish={isFinish}
      oauthFailed={oauthFailed}
    />
  )
}
