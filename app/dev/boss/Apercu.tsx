'use client'

import { useState } from 'react'
import BossApparition from '@/components/defi/BossApparition'
import BossMode from '@/components/BossMode'
import SerieCelebration from '@/components/quiz/SerieCelebration'
import { bossById, FALLBACK_BOSS } from '@/lib/bosses'
import type { ModeQuestion } from '@/lib/defi-modes'

const QUESTIONS: ModeQuestion[] = Array.from({ length: 6 }, (_, i) => ({
  id: `apercu-${i}`,
  prompt: `Question d’exemple n° ${i + 1} : quelle est la bonne réponse ?`,
  options: ['La bonne', 'Une autre', 'Encore une autre', 'La dernière'],
  correctIndex: 0,
  explanation: null,
  subject: 'Anglais',
}))

const JOURS = (fait: boolean[]) => fait.map((done, i) => ({ done, isToday: i === 5, isFuture: i > 5 }))

/** L'aperçu client : un écran à la fois, choisi par `?e=` (voir la page). */
export default function Apercu({ ecran, bossId }: { ecran: string; bossId: string }) {
  const boss = bossById(bossId) ?? FALLBACK_BOSS
  const [endsAt] = useState(() => Date.now() + 59 * 60 * 1000)

  if (ecran === 'apparition') {
    return <BossApparition apparition={{ bossId: boss.id, subject: 'Anglais', endsAt }} />
  }
  if (ecran === 'serie') {
    return (
      <SerieCelebration
        celebration={{
          celebrer: true,
          avant: JOURS([false, false, false, true, true, false, false]),
          apres: JOURS([false, false, false, true, true, true, false]),
          serie: 3,
          indexDuJour: 5,
        }}
        onContinue={() => {}}
      />
    )
  }
  // Le combat de La Traque, sur la nuit de l'arène : l'accueil, puis la fin en
  // jouant (la bonne réponse est toujours la première).
  return (
    <div className="min-h-dvh bg-[#140b2e] px-4 py-6">
      <BossMode variant="traque" boss={boss} rank={1} pool={QUESTIONS} canRetry onExit={() => {}} />
    </div>
  )
}
