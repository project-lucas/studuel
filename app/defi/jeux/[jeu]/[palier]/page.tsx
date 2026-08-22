import { redirect } from 'next/navigation'
import GameTable from '@/components/jeux/GameTable'
import OrderTable from '@/components/jeux/OrderTable'
import CountdownTable from '@/components/jeux/CountdownTable'
import AnatomyTable from '@/components/jeux/AnatomyTable'
import { playableSalonGame } from '@/lib/jeux/catalog'
import {
  buildCountdownPool,
  buildOrderPool,
  buildSalonPool,
  buildZonePool,
  poolKind,
} from '@/lib/jeux/pools'
import { gameFormat, poolSizeFor } from '@/lib/jeux/formats'
import { scaleFormat } from '@/lib/jeux/palier-format'
import {
  DEFAULT_PALIER,
  palierFloor,
  palierTitle,
  parsePalier,
} from '@/lib/jeux/paliers'
import { readRowTolerant } from '@/lib/profile-read'
import { getCurrentUser } from '@/lib/supabase/user'
import { createClient } from '@/lib/supabase/server'
import { fetchGameGhost } from '@/lib/jeux/ghost-server'
import { programmeSlug } from '@/lib/jeux/programme'
import { nowMs } from '@/lib/defi-modes'
import type { GradeLevel } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jeu: string; palier: string }>
}) {
  const { jeu, palier } = await params
  const found = playableSalonGame(jeu)
  const level = parsePalier(palier)
  if (!found || !level) return { title: 'Salon — Studuel' }
  return { title: `${found.game.name} · ${palierTitle(level)} — Studuel` }
}

/**
 * Route /defi/jeux/[jeu]/[palier] — la table de jeu d'un salon, réglée sur un
 * PALIER de difficulté. Elle joue le format que `lib/jeux/formats` décrit — sa
 * mécanique, son rythme, sa robe, son timbre — re-réglé par
 * `lib/jeux/palier-format`, sur une banque tirée au même palier.
 *
 * On y arrive par la carte du jeu (/defi/jeux/[jeu]), qui seule connaît les
 * paliers ouverts : la progression vit dans le navigateur, le serveur ne peut
 * donc pas la vérifier ici. Un lien profond vers un palier verrouillé jouera
 * donc quand même — ce n'est pas un accès à protéger, seulement une échelle à
 * gravir, et l'élève qui triche ne triche qu'avec ses propres étoiles.
 *
 * Tout le reste est revérifié : jeu inconnu ou pas construit, palier hors de
 * l'échelle, format manquant, ou visiteur → retour à l'arène.
 */
export default async function SalonPalierPage({
  params,
}: {
  params: Promise<{ jeu: string; palier: string }>
}) {
  const { jeu, palier } = await params
  const found = playableSalonGame(jeu)
  if (!found) redirect('/defi')

  const level = parsePalier(palier)
  if (!level) redirect(`/defi/jeux/${jeu}`)

  // Le format est la pièce maîtresse : sans lui on ne saurait pas à quel jeu on
  // joue. La cohérence catalogue ↔ formats est bloquée par formats.test.ts ;
  // ce garde-fou ne sert qu'au runtime, si un id passait entre les mailles.
  const base = gameFormat(jeu)
  if (!base) redirect('/defi')
  const format = scaleFormat(base, level)

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
  const paliers = {
    level,
    floor: palierFloor((profile.grade_level ?? null) as GradeLevel | null),
  }

  // Le fantôme : le meilleur score d'un ami sur ce jeu, à battre. Uniquement au
  // palier de référence — les scores enregistrés jusqu'ici l'ont tous été à ce
  // réglage-là, et opposer le score d'un ami à une partie jouée deux paliers
  // plus bas ne compare plus rien. (Le jour où le score portera son palier en
  // base, le fantôme reviendra sur toute l'échelle.)
  const ghost =
    level === DEFAULT_PALIER
      ? await fetchGameGhost(supabase, programmeSlug(found.salon.subject), jeu)
      : null

  // Graine par partie : chaque visite est un nouveau tirage, mais la partie en
  // cours reste stable (le pool est figé dans les props du composant client).
  const seed = `${user.id}:${jeu}:${level}:${nowMs()}`
  // La taille se calcule sur le format RE-RÉGLÉ : un palier haut allonge la
  // partie (plus de vagues, plus d'escales), et une banque trop courte ferait
  // reboucler la table sur ses propres questions en pleine partie.
  const size = poolSizeFor(format)

  // La table à monter dépend de la FORME de la banque, pas de la mécanique :
  // « Capitales du monde » et « Le compte est bon » sont deux expéditions, mais
  // l'une sert des QCM et l'autre des tirages de plaques.
  const kind = poolKind(jeu)

  if (kind === 'zones') {
    const zoneRounds = buildZonePool(jeu, seed, size)
    if (!zoneRounds || zoneRounds.length === 0) redirect('/defi')
    return (
      <AnatomyTable
        format={format}
        palier={paliers}
        rounds={zoneRounds}
        name={found.game.name}
        subject={found.salon.subject}
        subjectEmoji={found.salon.emoji}
        ghost={ghost}
      />
    )
  }

  if (kind === 'compte') {
    const puzzles = buildCountdownPool(jeu, seed, size)
    if (!puzzles || puzzles.length === 0) redirect('/defi')
    return (
      <CountdownTable
        format={format}
        palier={paliers}
        puzzles={puzzles}
        name={found.game.name}
        subject={found.salon.subject}
        subjectEmoji={found.salon.emoji}
        ghost={ghost}
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
        palier={paliers}
        boards={boards}
        name={found.game.name}
        subject={found.salon.subject}
        subjectEmoji={found.salon.emoji}
        ghost={ghost}
      />
    )
  }

  // buildSalonPool renvoie null si aucune banque n'est enregistrée pour cet id
  // (jeu implémenté mais builder oublié — bloqué en amont par pools.test.ts) ;
  // par sûreté au runtime, on retombe alors sur l'arène plutôt qu'une table vide.
  const full = buildSalonPool(jeu, seed, size, level)
  if (!full) redirect('/defi')

  return (
    <GameTable
      format={format}
      palier={paliers}
      pool={full}
      name={found.game.name}
      subject={found.salon.subject}
      subjectEmoji={found.salon.emoji}
      ghost={ghost}
    />
  )
}
