import { redirect } from 'next/navigation'
import PalierMap from '@/components/jeux/PalierMap'
import { playableSalonGame } from '@/lib/jeux/catalog'
import { gameFormat } from '@/lib/jeux/formats'
import { palierFloor } from '@/lib/jeux/paliers'
import { fetchPalierStandings } from '@/lib/jeux/palier-standing-server'
import { fetchUltimeStanding } from '@/lib/jeux/ultime-server'
import { hasUltime } from '@/lib/jeux/ultime'
import { readRowTolerant } from '@/lib/profile-read'
import { getCurrentUser } from '@/lib/supabase/user'
import { createClient } from '@/lib/supabase/server'
import type { GradeLevel } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jeu: string }>
}) {
  const { jeu } = await params
  const found = playableSalonGame(jeu)
  return { title: found ? `${found.game.name} — Studuel` : 'Salon — Studuel' }
}

/**
 * Route /defi/jeux/[jeu] — LA CARTE DU JEU : les cinq paliers de difficulté et
 * les étoiles décrochées sur chacun. On y choisit son palier, puis la partie se
 * joue sur /defi/jeux/[jeu]/[palier].
 *
 * Avant, ce chemin tombait droit dans la partie, toujours au même réglage. Un
 * même jeu servait donc les mêmes questions à un 6e et à un Terminale.
 *
 * Les étoiles et les records, eux, sont LOCAUX (lib/jeux/paliers). Le serveur
 * n'apporte ici que les deux choses que le navigateur ne peut pas savoir : la
 * CLASSE de l'élève, qui ouvre d'office les premiers paliers, et sa PLACE au
 * chrono parmi tous les joueurs — un classement demande la distribution des
 * autres, elle ne se déduit d'aucun stockage local.
 */
export default async function SalonJeuPage({
  params,
}: {
  params: Promise<{ jeu: string }>
}) {
  const { jeu } = await params
  const found = playableSalonGame(jeu)
  if (!found) redirect('/defi')

  const format = gameFormat(jeu)
  if (!format) redirect('/defi')

  const user = await getCurrentUser()
  if (!user) redirect('/defi')

  const supabase = await createClient()
  const profile = await readRowTolerant<{ grade_level: string | null }>(
    supabase,
    'profiles',
    'id',
    user.id,
    ['grade_level'],
  )

  return (
    <PalierMap
      format={format}
      name={found.game.name}
      subject={found.salon.subject}
      subjectEmoji={found.salon.emoji}
      floor={palierFloor((profile.grade_level ?? null) as GradeLevel | null)}
      standings={await fetchPalierStandings(supabase, jeu)}
      ultime={hasUltime(jeu) ? await fetchUltimeStanding(supabase, jeu) : null}
    />
  )
}
