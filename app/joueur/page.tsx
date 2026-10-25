import { redirect } from 'next/navigation'
import { getProfileData } from '@/app/defi/profile-actions'
import PageJoueur, { type JoueurData } from '@/components/joueur/PageJoueur'
import { avatarAffiche } from '@/lib/avatar-affiche'
import { lireGelsSerie } from '@/lib/boutique/boosts-server'
import { barreNiveau, piedDuPortrait, xpSemaineDepuisClassement } from '@/lib/joueur'
import { fetchJoursActifs } from '@/lib/jours-actifs'
import { compterAmis } from '@/lib/ligue-server'
import { computeStreak } from '@/lib/streak'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { walletLevelInfo } from '@/lib/wallet'

export const metadata = { title: 'Ma page de joueur — Studuel' }
export const dynamic = 'force-dynamic'

// LA PAGE DU JOUEUR (25/10/2026, chantier « le jeu vivant ») : l'écran
// qu'ouvre l'avatar du bandeau du haut. Le héros en pied, son rang, ses
// chiffres, les Paramètres — components/joueur/PageJoueur dessine, ce fichier
// lit.
//
// UNE SEULE VAGUE. Tout part ensemble : le profil de jeu (la même porte que le
// carnet de Moi et le vestiaire — pseudo, avatar, rang de ligue, trophées),
// l'XP du portefeuille (la même source que le bandeau : le niveau affiché ici
// est TOUJOURS celui de la gélule), ma ligne de `classement_amis()` pour l'XP
// de la semaine (558), le compte d'amis (celui du multiplicateur), et les
// journées actives + gels pour la série — la même recette que Réviser et Moi.
export default async function JoueurPage() {
  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])
  if (!user) redirect('/login')

  const [profil, { data: wallet }, { data: classement }, nbAmis, joursActifs, gels] = await Promise.all([
    getProfileData(),
    supabase.from('user_wallet').select('xp').eq('user_id', user.id).maybeSingle(),
    supabase.rpc('classement_amis'),
    compterAmis(supabase, user.id),
    fetchJoursActifs(supabase, user.id),
    lireGelsSerie(supabase, user.id),
  ])
  if (!profil) redirect('/moi')

  // Portefeuille absent (compte sans activité) : l'XP totale du profil, puis 0.
  const xp = Math.max(0, Number(wallet?.xp ?? profil.summary.totalXp ?? 0) || 0)
  const data: JoueurData = {
    nom: profil.displayName,
    classe: profil.gradeLabel,
    pied: piedDuPortrait(profil.avatar.portrait),
    buste: avatarAffiche(profil.avatar, 320),
    rang: profil.summary.rank,
    barre: barreNiveau(walletLevelInfo(xp)),
    serie: computeStreak(joursActifs, new Date(), gels),
    trophees: profil.summary.trophies,
    xpSemaine: xpSemaineDepuisClassement(classement),
    nbAmis,
  }

  return <PageJoueur data={data} />
}
