import type { Metadata } from 'next'
import MatchmakingScreen from '@/components/defi/MatchmakingScreen'

export const metadata: Metadata = { title: 'Recherche d’adversaire — Studuel' }

/** Placeholder de matchmaking (route /defi/matchmaking) : simple écran de
 * recherche d'adversaire avec pulse, en attendant la vraie file d'attente. */
export default function MatchmakingPage() {
  return <MatchmakingScreen />
}
