import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/supabase/user'
import { getProfileData } from '@/app/defi/profile-actions'
import { createClient } from '@/lib/supabase/server'
import { isPremiumTier } from '@/lib/gems'
import type { Tier } from '@/lib/subscription'
import AvatarStudio from '@/components/avatar/AvatarStudio'

export const metadata = { title: 'Mon vestiaire — Studuel' }
export const dynamic = 'force-dynamic'

// Le vestiaire (/moi/avatar) : on y arrive en touchant SA PHOTO dans le carnet
// de Moi (Lucas, 05/10/2026 : « en cliquant sur la photo de l'avatar, on tombe
// directement sur ça »). Trois onglets :
//   · Portrait — les treize avatars libres ;
//   · Badges — tous les badges, gagnés ou en ombre, et les trois mis en avant ;
//   · Personnages — les personnages historiques, débloqués au niveau.
// Le pseudo se change en haut, sous la photo. Objets et bannières sont partis
// (Lucas : « à la place d'Objet, les badges ; oublie les bannières, place les
// personnages »).
export default async function AvatarStudioPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  // Une seule porte, celle de la carte de joueur : pseudo, badges (réclamés
  // au passage), niveau du portefeuille.
  const supabase = await createClient()
  const [profil, { data: abonnement }] = await Promise.all([
    getProfileData(),
    // L'atelier de Marcel (avatar dessiné) est réservé à Studuel+ (378).
    supabase.from('profiles').select('subscription_tier').eq('id', user.id).maybeSingle(),
  ])
  if (!profil) redirect('/moi')

  return (
    <AvatarStudio
      initialConfig={profil.avatar}
      name={profil.displayName}
      gamertag={profil.gamertag}
      niveau={profil.summary.level}
      rang={profil.summary.rank ?? null}
      levelLabel={`Niveau ${profil.summary.level}`}
      badges={profil.badges}
      initialEquipped={profil.equippedBadgeIds}
      abonne={isPremiumTier((abonnement?.subscription_tier ?? 'free') as Tier)}
    />
  )
}
