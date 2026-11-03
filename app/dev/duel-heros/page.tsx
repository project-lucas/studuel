import { notFound } from 'next/navigation'
import { getProfileData } from '@/app/defi/profile-actions'
import type { JoueurCombat } from '@/components/combat/ArenaCombat'
import { avatarAffiche } from '@/lib/avatar-affiche'
import { vignetteMatiere } from '@/lib/defi/modes-catalog'
import { herosDuPortrait, herosJouables } from '@/lib/combat/combattants'
import { isHerosKey } from '@/lib/heros/eleves'
import { portraitSrc } from '@/lib/portraits'
import { divisionDepuisRomain } from '@/lib/rang-visuel'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import DemoDuelHeros from './DemoDuelHeros'

export const dynamic = 'force-dynamic'

/** La matière du duel de démonstration : ses trophées montent à la fin. */
const MATIERE_DEMO = 'Histoire-Géo'

// L'APERÇU DU DUEL DES HÉROS — en développement et sur les PRÉVERSIONS Vercel
// (pour le juger sur téléphone hors du Wi-Fi), jamais en production.
// Un duel jouable avec le Templier contre un robot : la lice de l'académie,
// l'attaque fétiche, le K.O., la cinématique de victoire, la fin de partie et
// ses récompenses. Rien n'est écrit en base.
//
// Connecté, l'élève se voit LUI-MÊME sur sa plaque (son avatar, son rang de
// ligue) et sa vraie barre de niveau monte à la fin ; sans compte, un élève de
// démonstration.
//
//   /dev/duel-heros                         mon héros = celui de mon avatar
//   /dev/duel-heros?heros=orc-chien          un autre héros
//   /dev/duel-heros?heros=…&rival=elfe-course  et un rival précis
export default async function ApercuDuelHeros({
  searchParams,
}: {
  searchParams: Promise<{ heros?: string; rival?: string }>
}) {
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview') notFound()

  // Une seule vague : le profil de jeu et le portefeuille partent ensemble.
  const [{ heros: herosParam, rival: rivalParam }, supabase, user] = await Promise.all([
    searchParams,
    createClient(),
    getCurrentUser(),
  ])
  const [profil, wallet] = user
    ? await Promise.all([
        getProfileData().catch(() => null),
        supabase.from('user_wallet').select('xp').eq('user_id', user.id).maybeSingle(),
      ])
    : [null, null]
  // Sans compte : à 10 XP du niveau 3, pour voir la barre passer le niveau.
  const xp = profil ? Math.max(0, Number(wallet?.data?.xp ?? profil.summary.totalXp ?? 0) || 0) : 290

  const rang = profil?.summary.rank ?? null
  const moi: JoueurCombat = {
    nom: profil?.displayName ?? 'Toi',
    photo: profil ? avatarAffiche(profil.avatar, 160) : { src: portraitSrc('2'), visage: true },
    rang: rang ? { id: rang.tier.id, division: divisionDepuisRomain(rang.roman) } : { id: 'bronze', division: 2 },
    rangLabel: rang?.label ?? 'Bronze II',
  }
  const herosCle = isHerosKey(herosParam) ? herosDuPortrait(herosParam) : herosDuPortrait(profil?.avatar.portrait)
  // Le robot est réglé sur l'élève : il porte son rang, et un autre héros que
  // le sien — un nouveau à chaque partie.
  const rivaux = isHerosKey(rivalParam) ? [herosDuPortrait(rivalParam)] : herosJouables().filter((h) => h !== herosCle)

  return (
    <DemoDuelHeros
      moi={moi}
      herosCle={herosCle}
      rival={{ heros: rivaux, rang: moi.rang, rangLabel: moi.rangLabel }}
      matiere={{ nom: MATIERE_DEMO, vignette: vignetteMatiere(MATIERE_DEMO) }}
      xpDepart={xp}
    />
  )
}
