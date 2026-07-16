'use client'

import { useRouter } from 'next/navigation'
import LiveDuelMode, { type LiveDuelAutoStart } from '@/components/LiveDuelMode'
import type { ModeQuestion } from '@/lib/defi-modes'

type Props = {
  userId: string
  /** Questions de l'hôte (vide côté rival : il les charge par question_ids). */
  pool: ModeQuestion[]
  subject: string | null
  /** Id de session scanné (?rejoindre=…) — null quand on est l'hôte. */
  joinId: string | null
}

/**
 * Partie rapide par QR code (route /defi/duel-rapide) : enrobe le duel en
 * temps réel existant en sautant le lobby — l'hôte crée sa session dès
 * l'arrivée (et montre son QR), le rival scanné rejoint immédiatement.
 */
export default function QuickMatch({ userId, pool, subject, joinId }: Props) {
  const router = useRouter()
  const auto: LiveDuelAutoStart = joinId
    ? { kind: 'join', duelId: joinId }
    : { kind: 'create' }

  return (
    <LiveDuelMode
      userId={userId}
      pool={pool}
      subject={subject}
      auto={auto}
      onExit={() => router.push('/defi')}
    />
  )
}
