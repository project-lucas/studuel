'use client'

import { Gamepad2 } from 'lucide-react'
import ModeStage from '@/components/defi/ModeStage'
import GameOutcome from '@/components/jeux/GameOutcome'
import type { GameFormat } from '@/lib/jeux/formats'
import type { GameRun } from '@/lib/jeux/run'
import type { BilanPartie } from '@/lib/palmares/bilan'
import { isJeuId } from '@/lib/palmares/epreuves'

export type EtatApercu = 'bilan' | 'gain' | 'perte' | 'trophees' | 'attente' | 'visiteur'

const RUN: GameRun = {
  status: 'lost',
  score: 100,
  streak: 0,
  bestStreak: 1,
  correct: 1,
  answered: 6,
  lives: 0,
  step: 5,
  inWave: 0,
  stepJustCleared: false,
}

function bilanDe(format: GameFormat, extra: Partial<BilanPartie>): BilanPartie | null {
  if (!isJeuId(format.id)) return null
  return {
    mode: format.id,
    score: 100,
    plays: 1,
    last: null,
    bestBefore: null,
    best: 100,
    weekKey: '2026-W39',
    weekBestBefore: null,
    weekBest: 100,
    weekRankBefore: null,
    weekTotalBefore: null,
    weekRank: 1,
    weekTotal: 1,
    allRank: 1,
    allTotal: 1,
    grade: '5e',
    next: null,
    leader: { name: 'Toi', score: 100, isMe: true },
    ...extra,
  }
}

/** L'écran de fin d'un jeu de salon, dans sa scène, avec un bilan de démonstration. */
export default function ApercuFinSalon({
  etat,
  format,
  name,
  subject,
  scene,
}: {
  etat: EtatApercu
  format: GameFormat
  name: string
  subject: string
  scene: string | null
}) {
  const trophies =
    etat === 'bilan'
      ? { before: 0, after: 0, delta: 0, best: 0, total: 0 }
      : etat === 'gain' || etat === 'trophees'
        ? { before: 34, after: 42, delta: 8, best: 42, total: 42 }
        : etat === 'perte'
          ? { before: 250, after: 248, delta: -2, best: 260, total: 248 }
          : null
  const bilan =
    etat === 'bilan'
      ? bilanDe(format, {})
      : etat === 'gain'
        ? bilanDe(format, {
            score: 620,
            last: 410,
            bestBefore: 540,
            best: 620,
            weekBest: 620,
            weekRank: 3,
            weekTotal: 23,
            next: { name: 'Léa', avatar: null, score: 700 },
            leader: { name: 'Sami', score: 910, isMe: false },
          })
        : etat === 'perte'
          ? bilanDe(format, {
              score: 380,
              last: 410,
              bestBefore: 540,
              best: 540,
              weekBest: 540,
              weekRank: 7,
              weekTotal: 23,
              next: { name: 'Léa', avatar: null, score: 560 },
              leader: { name: 'Sami', score: 910, isMe: false },
            })
          : null
  const saved = etat === 'attente' ? null : etat !== 'visiteur'

  return (
    <ModeStage
      title={name}
      Icon={Gamepad2}
      theme={format.theme}
      scene={scene}
      onExit={() => window.history.back()}
      headerRight={
        <span className="shrink-0 rounded-full bg-[color:var(--jeu-accent)]/12 px-2.5 py-1 text-[11px] font-bold text-[color:var(--jeu-accent)]">
          {subject}
        </span>
      }
    >
      <GameOutcome
        format={format}
        palier={1}
        palierOutcome={null}
        palierStanding={null}
        run={RUN}
        best={100}
        isRecord={false}
        saved={saved}
        gains={[]}
        trophies={trophies}
        bilan={bilan}
        ghost={null}
        onReplay={() => window.location.reload()}
      />
    </ModeStage>
  )
}
