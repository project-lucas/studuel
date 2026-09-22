import { notFound } from 'next/navigation'
import { gameFormat } from '@/lib/jeux/formats'
import { playableSalonGame } from '@/lib/jeux/catalog'
import { gameScene, vignetteMatiere } from '@/lib/defi/modes-catalog'
import { modeScene, type GameModeId } from '@/lib/defi-modes'
import ApercuPiece from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA PIÈCE D'UN JEU — en développement seulement.
//
// La pièce (`.jeu-monde`, posée par ModeStage) ne se voit qu'autour de la
// table, sur un écran large, ou le temps du chargement : cette page rend une
// scène de mode avec son bandeau d'ambiance et quelques cartes, sans base ni
// compte, pour la relire à toute largeur.
//
//   /dev/piece?jeu=calcul-mental   la carte d'un jeu de salon, dans sa pièce
//   /dev/piece?mode=blitz          l'accueil d'un mode de l'Arène
//                                  (blitz, chrono, survie, boss, duel)
const MODES: Record<string, { id: GameModeId; theme: string; titre: string }> = {
  blitz: { id: 'blitz', theme: 'eclair', titre: 'Blitz 60s' },
  chrono: { id: 'chrono', theme: 'sablier', titre: 'Contre-la-montre' },
  survie: { id: 'survie', theme: 'abysse', titre: 'Survie' },
  boss: { id: 'boss', theme: 'couronne', titre: 'Boss' },
  duel: { id: 'duel', theme: 'fantome', titre: 'Duel fantôme' },
}

export default async function ApercuPiecePage({
  searchParams,
}: {
  searchParams: Promise<{ jeu?: string; mode?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { jeu = 'calcul-mental', mode } = await searchParams

  if (mode) {
    const m = MODES[mode]
    if (!m) notFound()
    return (
      <ApercuPiece
        titre={m.titre}
        theme={m.theme}
        scene={modeScene(m.id) ?? null}
        matiere={null}
      />
    )
  }

  const found = playableSalonGame(jeu)
  const format = gameFormat(jeu)
  if (!found || !format) notFound()
  return (
    <ApercuPiece
      titre={found.game.name}
      sousTitre={found.game.tagline}
      theme={format.theme}
      scene={gameScene(jeu) ?? null}
      matiere={{ nom: found.salon.subject, vignette: vignetteMatiere(found.salon.subject) }}
    />
  )
}
