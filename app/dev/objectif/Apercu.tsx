'use client'

import { useState } from 'react'
import ObjectifQuotidien from '@/components/welcome/ObjectifQuotidien'
import { StepHead } from '@/components/welcome/OnbBits'
import type { DailyGoalMinutes } from '@/lib/welcome'

export default function Apercu({ depart }: { depart: DailyGoalMinutes }) {
  const [choisi, setChoisi] = useState<DailyGoalMinutes>(depart)
  return (
    <div className="onb min-h-dvh px-5 py-6" style={{ background: 'var(--onb-cream)' }}>
      <div className="mx-auto flex max-w-md flex-col">
        <StepHead
          title="Combien de temps par jour ?"
          subtitle="10 minutes chaque jour valent mieux que 2 heures la veille du contrôle."
        />
        <ObjectifQuotidien choisi={choisi} onPick={setChoisi} />
      </div>
    </div>
  )
}
