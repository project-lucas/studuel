import { notFound } from 'next/navigation'
import type { JoueurCombat } from '@/components/combat/ArenaCombat'
import { getProfileData } from '@/app/defi/profile-actions'
import { avatarAffiche } from '@/lib/avatar-affiche'
import { COMBATTANTS_BOSS, herosDuPortrait } from '@/lib/combat/combattants'
import { isHerosKey } from '@/lib/heros/eleves'
import { portraitSrc } from '@/lib/portraits'
import { divisionDepuisRomain } from '@/lib/rang-visuel'
import { getCurrentUser } from '@/lib/supabase/user'
import TraqueCombat from '@/components/defi/TraqueCombat'
import { bossById } from '@/lib/bosses'
import { QUESTIONS_GRAMMATORK } from './questions'

export const dynamic = 'force-dynamic'

/** La fenêtre d'une heure de la Traque, ouverte à l'instant de la requête. */
function dansUneHeure(): number {
  return Date.now() + 3_600_000
}

// L'APERÇU DU COMBAT DE GARDIEN (02/11/2026) — docs/CADRAGE-COMBAT-HEROS.md.
// En développement et sur les préversions Vercel, jamais en production.
// LE VRAI COMBAT DE LA TRAQUE (TraqueCombat → BossMode → CombatGardien) avec
// mon héros contre un gardien, sur des questions de démo : l'affiche, « C'est
// parti », l'entrée façon Pokémon, les coups, le K.O., l'écran de fin. Sans
// compte, seule la paie du serveur échoue (rien n'est écrit en base).
//
//   /dev/combat-boss                          Grammatork, rang I
//   /dev/combat-boss?rang=3                   rang III (18 PV, 2 vies)
//   /dev/combat-boss?boss=nox&heros=troll-pont  n'importe quel gardien, n'importe quel héros
export default async function ApercuCombatBoss({
  searchParams,
}: {
  searchParams: Promise<{ rang?: string; boss?: string; heros?: string }>
}) {
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview') notFound()

  const [{ rang: rangParam, boss: bossParam, heros: herosParam }, user] = await Promise.all([
    searchParams,
    getCurrentUser(),
  ])
  const profil = user ? await getProfileData().catch(() => null) : null
  const rang = profil?.summary.rank ?? null
  const moi: JoueurCombat = {
    nom: profil?.displayName ?? 'Toi',
    photo: profil ? avatarAffiche(profil.avatar, 160) : { src: portraitSrc('2'), visage: true },
    rang: rang ? { id: rang.tier.id, division: divisionDepuisRomain(rang.roman) } : { id: 'bronze', division: 2 },
    rangLabel: rang?.label ?? 'Bronze II',
  }
  const rangBoss = rangParam === '2' ? 2 : rangParam === '3' ? 3 : 1
  const bossId = bossParam && COMBATTANTS_BOSS[bossParam] ? bossParam : 'grammatork'
  const herosCle = isHerosKey(herosParam) ? herosDuPortrait(herosParam) : herosDuPortrait(profil?.avatar.portrait)

  const boss = bossById(bossId) ?? bossById('grammatork')
  if (!boss) notFound()
  const finFenetre = dansUneHeure()

  return (
    <div className="traque-salle min-h-dvh px-4 pt-6 pb-24">
      <TraqueCombat
        boss={boss}
        rank={rangBoss}
        subject="Français"
        pool={[...QUESTIONS_GRAMMATORK]}
        endsAt={finFenetre}
        chapter={null}
        heros={{ cle: herosCle, moi }}
      />
    </div>
  )
}
