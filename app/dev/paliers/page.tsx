import { notFound } from 'next/navigation'
import PalierMap from '@/components/jeux/PalierMap'
import { playableSalonGame } from '@/lib/jeux/catalog'
import { gameFormat } from '@/lib/jeux/formats'
import { programmeSlug } from '@/lib/jeux/programme'
import { gameScene } from '@/lib/defi/modes-catalog'
import { subjectVignette } from '@/lib/subject-style'
import { palierFloor } from '@/lib/jeux/paliers'
import type { PalierStandings } from '@/lib/jeux/palier-standing'
import Semeur from './Semeur'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA CARTE D'UN JEU (les cinq paliers) — en développement seulement.
//
// La vraie carte (/defi/jeux/[jeu]) demande un compte et l'accès au jeu. Celle-
// ci la rend sans base, avec les étoiles posées dans le stockage local :
//
//   /dev/paliers?jeu=capitales           jamais joué
//   /dev/paliers?jeu=capitales&joue=1    un palier fini, un en cours, un entamé,
//                                        avec des places au chrono (barre de rapidité)

/** Des places de démonstration : 3e sur 12 (deux caps), 140e sur 1 250 (trois caps). */
const STANDINGS_DEMO: PalierStandings = {
  1: { level: 1, bestMs: 62_000, rank: 3, total: 12, seuils: [50, 30] },
  2: { level: 2, bestMs: 81_500, rank: 140, total: 1_250, seuils: [50, 30, 15] },
}
export default async function ApercuPaliersPage({
  searchParams,
}: {
  searchParams: Promise<{ jeu?: string; joue?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const q = await searchParams
  const jeu = q.jeu ?? 'capitales'
  const found = playableSalonGame(jeu)
  const format = gameFormat(jeu)
  if (!found || !format) notFound()

  return (
    <Semeur jeu={jeu} joue={q.joue === '1'}>
      <PalierMap
        format={format}
        name={found.game.name}
        tagline={found.game.tagline}
        subject={found.salon.subject}
        subjectEmoji={found.salon.emoji}
        subjectVignette={subjectVignette(programmeSlug(found.salon.subject)) ?? null}
        scene={gameScene(found.game.id) ?? null}
        floor={palierFloor(null)}
        standings={q.joue === '1' ? STANDINGS_DEMO : {}}
        ultime={null}
        etoilesPayees={null}
      />
    </Semeur>
  )
}
