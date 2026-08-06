import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase/user'

export const dynamic = 'force-dynamic'

// Racine = point d'entrée de l'app installée (start_url du manifest).
// Connecté → l'ARÈNE (Défi). C'était Réviser, c'est-à-dire un sommaire : on
// ouvrait l'app sur une liste de matières et de tâches, et il fallait décider
// avant de jouer. L'arène, elle, arrive avec UNE action évidente (le Duel 90 s)
// et tout ce qui réclame — quêtes, coffre, saison, gardiens — déjà à l'écran.
// C'est la porte d'un jeu, pas celle d'un cahier de textes ; Réviser reste à un
// tap dans la barre d'onglets.
// Sinon → l'accueil « façon Duolingo » qui fait vivre le parcours avant de
// demander un compte.
export default async function Home() {
  const user = await getCurrentUser()

  // Le cas du compte PARENT (qui n'a pas de classe et n'a rien à faire dans
  // l'arène) reste traité par les pages elles-mêmes, où le profil est déjà
  // chargé : le router ici coûterait une requête de plus à chaque lancement de
  // l'app, pour tous les élèves, au bénéfice d'une poignée de parents.
  redirect(user ? '/defi' : '/bienvenue')
}
