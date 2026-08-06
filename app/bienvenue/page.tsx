import { redirect } from 'next/navigation'
import WelcomeFlow from '@/components/welcome/WelcomeFlow'
import { getSubjectsCached } from '@/lib/catalog'
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

  // Les couples (matière, niveau) ayant du contenu ne sont plus lus ici : le
  // sélecteur propose tout le programme (voir ci-dessous).
  const allSubjects = await getSubjectsCached()
  // LE PROGRAMME ENTIER, contenu ou pas. Le sélecteur ne montrait que les
  // matières ayant des chapitres (`narrowLevelsToContent`), pour qu'un futur 2de
  // ne coche pas « SNT » et ne tombe pas sur une page vide à sa première visite.
  // Décision de Lucas le 02/08 : chaque classe doit voir SON programme complet —
  // ce qui manque se remplit ensuite. Le filtrer ici serait pire qu'inutile : la
  // sélection faite à l'inscription est ce que l'accueil affiche, donc une
  // matière absente du sélecteur resterait invisible sur Réviser même après que
  // son contenu est écrit, jusqu'à ce que l'élève pense à la recocher.
  //
  // Sur Réviser, une matière encore vide porte « Bientôt » : elle est annoncée,
  // pas déguisée en matière prête.
  const subjects = allSubjects

  return (
    <WelcomeFlow
      subjects={subjects}
      finish={isFinish}
      oauthFailed={oauthFailed}
    />
  )
}
