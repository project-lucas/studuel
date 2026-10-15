import { notFound } from 'next/navigation'
import GameTable from '@/components/jeux/GameTable'
import { playableSalonGame } from '@/lib/jeux/catalog'
import { gameScene } from '@/lib/defi/modes-catalog'
import { gameFormat, poolSizeFor } from '@/lib/jeux/formats'
import { scaleFormat } from '@/lib/jeux/palier-format'
import { DEFAULT_PALIER, parsePalier } from '@/lib/jeux/paliers'
import { buildSalonPool } from '@/lib/jeux/pools'

export const dynamic = 'force-dynamic'

// L'APERÇU D'UNE TABLE DE JEU DE SALON — en développement seulement.
//
// La vraie page (`/defi/jeux/[jeu]/[palier]`) exige un compte et l'accès au
// jeu ; celle-ci monte la MÊME table (components/jeux/GameTable) avec une
// réserve de questions tirée au palier demandé, pour relire un jeu QCM sans
// base ni compte — Le Musée et ses œuvres d'abord (14/10/2026).
//
//   /dev/jeu?jeu=le-musee                 le palier de référence
//   /dev/jeu?jeu=le-musee&palier=1        le titre donné
//   /dev/jeu?jeu=le-musee&palier=5        tout le musée, leurres voisins
//   &graine=abc                           un autre tirage
//
// Le compte rendu de fin de partie part vers le serveur et y est refusé sans
// session : c'est attendu ici.
export default async function ApercuJeuPage({
  searchParams,
}: {
  searchParams: Promise<{ jeu?: string; palier?: string; graine?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { jeu = 'le-musee', palier, graine = 'apercu' } = await searchParams
  const found = playableSalonGame(jeu)
  const base = gameFormat(jeu)
  if (!found || !base) notFound()
  const level = parsePalier(palier) ?? DEFAULT_PALIER
  const format = scaleFormat(base, level)
  const pool = buildSalonPool(jeu, `${graine}:${level}`, poolSizeFor(format), level)
  if (!pool || pool.length === 0) notFound()
  return (
    <GameTable
      format={format}
      palier={{ level, floor: 1 }}
      pool={pool}
      name={found.game.name}
      subject={found.salon.subject}
      subjectEmoji={found.salon.emoji}
      scene={gameScene(found.game.id) ?? null}
      ghost={null}
    />
  )
}
