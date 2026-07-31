import { redirect } from 'next/navigation'
import WelcomeFlow from '@/components/welcome/WelcomeFlow'
import { getSubjectsCached, getSubjectLevelsCached } from '@/lib/catalog'
import { narrowLevelsToContent } from '@/lib/subject-visibility'
import { getCurrentUser } from '@/lib/supabase/user'

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

  const user = await getCurrentUser()

  // Un compte connecté est renvoyé au geste quotidien — sauf en prévisualisation
  // ou au retour OAuth (où il doit finir son onboarding sur l'écran « plan »).
  // …et sauf après un échec OAuth : l'élève n'est justement PAS connecté, mais
  // s'il l'était par ailleurs on ne veut pas l'expédier avant d'avoir expliqué.
  if (user && !preview && !isFinish && !oauthFailed) redirect('/defi')

  const [allSubjects, subjectLevels] = await Promise.all([
    getSubjectsCached(),
    getSubjectLevelsCached(),
  ])
  // Le sélecteur de matières filtre par `levels` sans jamais voir un chapitre :
  // on lui donne donc des matières dont les niveaux DÉCLARÉS sont réduits à ceux
  // qui ont du contenu. Sans ça, un futur 2de pouvait cocher « SNT » ou
  // « Espagnol » à l'inscription — et tomber sur une page vide dès sa première
  // visite, le pire moment possible. Le pré-cochage (`defaultSelectedForGrade`)
  // hérite du même filtre, sans qu'il ait à le savoir.
  const subjects = narrowLevelsToContent(allSubjects, subjectLevels)

  return (
    <WelcomeFlow
      subjects={subjects}
      finish={isFinish}
      oauthFailed={oauthFailed}
    />
  )
}
