'use client'

import { useRouter } from 'next/navigation'
import DuelMode from '@/components/DuelMode'
import type { ModeQuestion } from '@/lib/defi-modes'

// Un jeu de salon = un duel BO3 (DuelMode) sur une banque de questions
// dédiée, hors SRS. Ce wrapper ne fait que la bannière du jeu et la sortie
// vers l'espace Jeux — toute la mécanique vit dans DuelMode.
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
  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-4 py-1.5 backdrop-blur-sm">
        <span className="text-base leading-none" aria-hidden="true">
          {emoji}
        </span>
        <span className="font-heading text-sm font-extrabold text-white">
          {name}
        </span>
        <span className="text-xs font-bold text-white/60">
          · Salon {subject}
        </span>
      </div>
      {/* Les cartes de DuelMode sont claires : on les pose sur un panneau
          crème pour rester lisible sur le fond d'arène sombre. */}
      <div className="rounded-3xl bg-background p-4 shadow-lg">
        <DuelMode
          pool={pool}
          myLevel={myLevel}
          srs={false}
          onExit={() => router.push('/defi/jeux')}
        />
      </div>
    </div>
  )
}
