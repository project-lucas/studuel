import { redirect } from 'next/navigation'
import SalonDuel from '@/components/jeux/SalonDuel'
import { playableSalonGame } from '@/lib/jeux/catalog'
import { buildCapitalesPool } from '@/lib/jeux/capitales'
import { buildOrthographePool } from '@/lib/jeux/orthographe'
import { levelFor } from '@/lib/xp'
import { createClient } from '@/lib/supabase/server'
import { nowMs, type ModeQuestion } from '@/lib/defi-modes'
import { getSalonBoard } from '../salons-data'

export const metadata = { title: 'Salon — Studuel' }
export const dynamic = 'force-dynamic'

// Chaque jeu jouable fabrique son pool depuis sa banque dédiée (lib/jeux).
const POOL_BUILDERS: Record<string, (seed: string) => ModeQuestion[]> = {
  capitales: (seed) => buildCapitalesPool(seed),
  orthographe: (seed) => buildOrthographePool(seed),
}

/**
 * Route /defi/jeux/[jeu] — une table de jeu de salon : un duel BO3 (DuelMode,
 * rival fantôme) sur la banque de questions du jeu. Tout lien profond est
 * revérifié ici : jeu inconnu ou pas construit, visiteur, classe absente ou
 * salon encore fermé → retour à l'espace Jeux.
 */
export default async function SalonJeuPage({
  params,
}: {
  params: Promise<{ jeu: string }>
}) {
  const { jeu } = await params
  const found = playableSalonGame(jeu)
  const buildPool = POOL_BUILDERS[jeu]
  if (!found || !buildPool) redirect('/defi/jeux')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/defi/jeux')

  const { data: profile } = await supabase
    .from('profiles')
    .select('grade_level')
    .eq('id', user.id)
    .maybeSingle()
  if (!profile?.grade_level) redirect('/defi/jeux')

  // Le salon doit être ouvert — la maîtrise se vérifie côté serveur.
  const board = await getSalonBoard(supabase, user.id, profile.grade_level)
  if (!board.get(found.salon.subject)?.unlocked) redirect('/defi/jeux')

  // Niveau approché (XP des défis seulement) : il ne sert qu'à calibrer les
  // rivaux d'entraînement de DuelMode, pas à l'affichage du vrai niveau.
  const { data: challenges } = await supabase
    .from('challenge_sessions')
    .select('xp')
    .eq('user_id', user.id)
  const xp = (challenges ?? []).reduce((s, c) => s + Number(c.xp ?? 0), 0)

  // Graine par partie : chaque visite est un nouveau tirage, mais le duel en
  // cours reste stable (le pool est figé dans les props du composant client).
  const pool = buildPool(`${user.id}:${jeu}:${nowMs()}`)

  return (
    // data-no-swipe : un balayage pendant le duel du salon ne doit pas changer
    // d'onglet et perdre la partie (voir SwipeTabs).
    <div data-no-swipe className="mx-auto w-full max-w-xl pb-8">
      <SalonDuel
        pool={pool}
        myLevel={levelFor(xp).level}
        name={found.game.name}
        emoji={found.game.emoji}
        subject={found.salon.subject}
      />
    </div>
  )
}
