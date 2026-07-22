import { redirect } from 'next/navigation'
import GameTable from '@/components/jeux/GameTable'
import OrderTable from '@/components/jeux/OrderTable'
import CountdownTable from '@/components/jeux/CountdownTable'
import { playableSalonGame } from '@/lib/jeux/catalog'
import {
  buildCountdownPool,
  buildOrderPool,
  buildSalonPool,
  poolKind,
} from '@/lib/jeux/pools'
import { gameFormat, poolSizeFor } from '@/lib/jeux/formats'
import { createClient } from '@/lib/supabase/server'
import { nowMs } from '@/lib/defi-modes'

export const metadata = { title: 'Salon — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * Route /defi/jeux/[jeu] — la table de jeu d'un salon. Chaque jeu se joue dans
 * SON format (lib/jeux/formats) : sa mécanique, son rythme, sa robe, son timbre.
 * On y arrive droit depuis la feuille Modes de jeu de l'arène.
 *
 * Tout lien profond est revérifié ici : jeu inconnu ou pas construit, format
 * manquant, ou visiteur → retour à l'arène. Les jeux construits sont jouables
 * par tous (pas de verrou de maîtrise).
 */
export default async function SalonJeuPage({
  params,
}: {
  params: Promise<{ jeu: string }>
}) {
  const { jeu } = await params
  const found = playableSalonGame(jeu)
  if (!found) redirect('/defi')

  // Le format est la pièce maîtresse : sans lui on ne saurait pas à quel jeu on
  // joue. La cohérence catalogue ↔ formats est bloquée par formats.test.ts ;
  // ce garde-fou ne sert qu'au runtime, si un id passait entre les mailles.
  const format = gameFormat(jeu)
  if (!format) redirect('/defi')

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/defi')

  // Graine par partie : chaque visite est un nouveau tirage, mais la partie en
  // cours reste stable (le pool est figé dans les props du composant client).
  const seed = `${user.id}:${jeu}:${nowMs()}`
  const size = poolSizeFor(format)

  // La table à monter dépend de la FORME de la banque, pas de la mécanique :
  // « Capitales du monde » et « Le compte est bon » sont deux expéditions, mais
  // l'une sert des QCM et l'autre des tirages de plaques.
  const kind = poolKind(jeu)

  if (kind === 'compte') {
    const puzzles = buildCountdownPool(jeu, seed, size)
    if (!puzzles || puzzles.length === 0) redirect('/defi')
    return (
      <CountdownTable
        format={format}
        puzzles={puzzles}
        name={found.game.name}
        subject={found.salon.subject}
        subjectEmoji={found.salon.emoji}
      />
    )
  }

  // Les jeux de remise en ordre servent des TABLEAUX, pas des QCM.
  if (kind === 'ordre') {
    const boards = buildOrderPool(jeu, seed, size)
    if (!boards || boards.length === 0) redirect('/defi')
    return (
      <OrderTable
        format={format}
        boards={boards}
        name={found.game.name}
        subject={found.salon.subject}
        subjectEmoji={found.salon.emoji}
      />
    )
  }

  // buildSalonPool renvoie null si aucune banque n'est enregistrée pour cet id
  // (jeu implémenté mais builder oublié — bloqué en amont par pools.test.ts) ;
  // par sûreté au runtime, on retombe alors sur l'arène plutôt qu'une table vide.
  const full = buildSalonPool(jeu, seed)
  if (!full) redirect('/defi')

  // On ne sert que ce que le format peut consommer : une expédition de 8 escales
  // n'a pas besoin d'embarquer 60 questions dans le HTML de la page.
  return (
    <GameTable
      format={format}
      pool={full.slice(0, size)}
      name={found.game.name}
      subject={found.salon.subject}
      subjectEmoji={found.salon.emoji}
    />
  )
}
