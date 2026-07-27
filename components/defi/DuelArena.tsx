'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Duel90Mode from '@/components/Duel90Mode'
import { seededRng } from '@/lib/defi-modes'
import type { ModeQuestion } from '@/lib/defi-modes'

// Noms de rivaux. Le duel est asynchrone (personne n'est connecté en face) mais
// il doit se JOUER comme un vrai duel : un adversaire anonyme (« Rival ») retire
// tout l'enjeu, un prénom crédible le rend. Le nom est tiré de la graine du
// duel, donc stable pendant toute la partie.
const RIVAL_NAMES = [
  'Léa',
  'Hugo',
  'Jade',
  'Sacha',
  'Naïm',
  'Manon',
  'Ilyes',
  'Camille',
  'Nour',
  'Théo',
  'Louna',
  'Rayan',
]

/**
 * Coquille client du Duel 90 s : elle tire le rival de la graine et gère la
 * navigation (« Rejouer » recharge la page avec un tour de plus, ce qui change
 * la graine, donc l'adversaire et l'ordre des questions).
 *
 * Toute la logique de jeu vit dans Duel90Mode ; tout le barème dans lib/duel90.
 */
export default function DuelArena({
  pool,
  seed,
  round,
  myLevel,
  myName,
  chapterId,
  chapterTitle,
  reason,
}: {
  pool: ModeQuestion[]
  seed: string
  round: number
  myLevel: number
  myName: string | null
  chapterId?: string
  chapterTitle?: string
  reason?: string
}) {
  const router = useRouter()

  const rival = useMemo(() => {
    const rng = seededRng(`${seed}#rival`)
    const name = RIVAL_NAMES[Math.floor(rng() * RIVAL_NAMES.length) % RIVAL_NAMES.length]
    // Le rival est matché autour du niveau de l'élève (±2) : assez proche pour
    // que la victoire ne soit jamais acquise, jamais assez loin pour décourager.
    const level = Math.max(1, myLevel + Math.round(rng() * 4) - 2)
    // Un homonyme de l'élève casserait l'illusion du face-à-face.
    const first = (myName ?? '').trim().split(' ')[0]
    const safe = name === first ? RIVAL_NAMES[(RIVAL_NAMES.indexOf(name) + 1) % RIVAL_NAMES.length] : name
    return { name: safe, level }
  }, [seed, myLevel, myName])

  return (
    <Duel90Mode
      key={seed}
      pool={pool}
      rivalName={rival.name}
      rivalLevel={rival.level}
      myLevel={myLevel}
      seed={seed}
      chapterId={chapterId}
      chapterTitle={chapterTitle}
      reason={reason}
      onExit={() => router.push('/defi')}
      onReplay={() => router.push(`/defi/duel?n=${round + 1}`)}
    />
  )
}
