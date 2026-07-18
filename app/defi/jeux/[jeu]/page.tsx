import { redirect } from 'next/navigation'
import SalonDuel from '@/components/jeux/SalonDuel'
import { playableSalonGame } from '@/lib/jeux/catalog'
import { buildSalonPool } from '@/lib/jeux/pools'
import { levelFor } from '@/lib/xp'
import { createClient } from '@/lib/supabase/server'
import { nowMs } from '@/lib/defi-modes'
import { activityCutoff } from '@/lib/streak'

export const metadata = { title: 'Salon — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * Route /defi/jeux/[jeu] — une table de jeu de salon : un duel BO3 (DuelMode,
 * rival fantôme) sur la banque de questions du jeu. On y arrive droit depuis la
 * feuille Modes de jeu de l'arène. Tout lien profond est revérifié ici : jeu
 * inconnu ou pas construit, ou visiteur → retour à l'arène. Les jeux construits
 * sont jouables par tous (pas de verrou de maîtrise).
 */
export default async function SalonJeuPage({
  params,
}: {
  params: Promise<{ jeu: string }>
}) {
  const { jeu } = await params
  const found = playableSalonGame(jeu)
  if (!found) redirect('/defi')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/defi')

  // Niveau approché (XP des défis seulement) : il ne sert qu'à calibrer les
  // rivaux d'entraînement de DuelMode, pas à l'affichage du vrai niveau. Borné à
  // la fenêtre d'activité (comme /defi/jouer) : inutile de relire tout
  // l'historique challenge_sessions à chaque ouverture de salon.
  const { data: challenges } = await supabase
    .from('challenge_sessions')
    .select('xp')
    .eq('user_id', user.id)
    .gte('created_at', activityCutoff())
  const xp = (challenges ?? []).reduce((s, c) => s + Number(c.xp ?? 0), 0)

  // Graine par partie : chaque visite est un nouveau tirage, mais le duel en
  // cours reste stable (le pool est figé dans les props du composant client).
  // buildSalonPool renvoie null si aucune banque n'est enregistrée pour cet id
  // (jeu implémenté mais builder oublié — bloqué en amont par pools.test.ts) ;
  // par sûreté au runtime, on retombe alors sur l'arène plutôt que sur un duel vide.
  const pool = buildSalonPool(jeu, `${user.id}:${jeu}:${nowMs()}`)
  if (!pool) redirect('/defi')

  // SalonDuel se joue dans une scène plein cadre (ModeStage) : on le rend nu,
  // sans conteneur qui bornerait sa largeur — la scène gère le plein-cadre et
  // le data-no-swipe.
  return (
    <SalonDuel
      pool={pool}
      myLevel={levelFor(xp).level}
      name={found.game.name}
      emoji={found.game.emoji}
      subject={found.salon.subject}
    />
  )
}
