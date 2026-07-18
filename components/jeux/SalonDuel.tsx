'use client'

import { useRouter } from 'next/navigation'
import { Swords } from 'lucide-react'
import ModeStage from '@/components/defi/ModeStage'
import DuelMode from '@/components/DuelMode'
import type { ModeQuestion } from '@/lib/defi-modes'

// Un jeu de salon = un duel BO3 (DuelMode) sur une banque de questions dédiée,
// hors SRS. Comme les modes fun de l'Arène, il se joue dans une SCÈNE plein
// cadre et opaque (ModeStage) qui recouvre le décor d'arène — la table de jeu
// remplit tout l'espace, jamais une carte qui flotte sur le colisée. La sortie
// (croix de la scène ou boutons du mode) ramène à l'arène.
export default function SalonDuel({
  pool,
  myLevel,
  name,
  emoji,
  subject,
}: {
  pool: ModeQuestion[]
  myLevel: number
  name: string
  emoji: string
  subject: string
}) {
  const router = useRouter()
  const exit = () => router.push('/defi')
  return (
    <ModeStage
      title={name}
      Icon={Swords}
      onExit={exit}
      headerRight={
        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">
          <span aria-hidden="true">{emoji}</span> {subject}
        </span>
      }
    >
      <DuelMode pool={pool} myLevel={myLevel} srs={false} onExit={exit} />
    </ModeStage>
  )
}
