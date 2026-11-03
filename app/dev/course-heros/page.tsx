import { notFound } from 'next/navigation'
import DuelCourse from '@/components/duel/DuelCourse'
import { DEFAULT_AVATAR } from '@/lib/avatar'
import { avatarAffiche } from '@/lib/avatar-affiche'
import { herosDuPortrait, herosDuRival } from '@/lib/combat/combattants'
import { botOpponent } from '@/lib/duel/opponent'
import { isHerosKey } from '@/lib/heros/eleves'
import { QUESTIONS_DEMO } from '../duel-heros/questions'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA VRAIE COURSE CLASSÉE EN COMBAT DE HÉROS (02/11/2026) — le
// composant de production (`DuelCourse` + `useCourse`) contre un robot, sur
// les questions de démo. Seul l'envoi final échoue sans compte (« Réessayer ») :
// la peau se juge ici, le verdict sur /dev/duel.
//
//   /dev/course-heros?heros=orc-chien&bot=malo
export default async function ApercuCourseHeros({
  searchParams,
}: {
  searchParams: Promise<{ heros?: string; bot?: string }>
}) {
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview') notFound()
  const { heros: herosParam, bot = 'malo' } = await searchParams
  const opponent = botOpponent(bot, 80) ?? botOpponent('malo', 80)
  if (!opponent) notFound()
  const monHeros = herosDuPortrait(isHerosKey(herosParam) ? herosParam : null)
  const rival = opponent.identity
  return (
    <DuelCourse
      pool={[...QUESTIONS_DEMO]}
      subject="Histoire-Géo"
      subjectSlug="histoire-geo"
      subjectEmoji="🏛️"
      seed={`apercu#${bot}`}
      opponent={opponent}
      me={{ name: 'Toi', avatar: DEFAULT_AVATAR, trophies: 80 }}
      hrefs={{ revanche: '/dev/course-heros', nouveau: '/dev/course-heros', arene: '/defi' }}
      heros={{
        moi: {
          heros: monHeros,
          joueur: { nom: 'Toi', photo: avatarAffiche(DEFAULT_AVATAR, 160), rang: null, rangLabel: '80 trophées' },
        },
        rival: {
          heros: herosDuRival(rival.avatar.portrait, `bot:${bot}`, monHeros),
          joueur: {
            nom: rival.name,
            photo: avatarAffiche(rival.avatar, 160),
            rang: null,
            rangLabel: `${rival.trophies} trophées`,
          },
        },
      }}
    />
  )
}
