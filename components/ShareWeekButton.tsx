'use client'

import { useState } from 'react'
import { Share2 } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { shareStory, type ShareOutcome } from '@/components/story-share'
import type { WeeklyRecap } from '@/lib/weekly-recap'

// « Partager ma semaine » — la rétro hebdo en story (components/story-share) :
// l'élève montre ses chiffres à ses proches, la boucle virale du dimanche soir.
// Masqué tant que la semaine est vide (rien à frimer).
export default function ShareWeekButton({
  recap,
  streak,
}: {
  recap: WeeklyRecap
  streak: number
}) {
  const [state, setState] = useState<'idle' | 'sharing' | ShareOutcome>('idle')

  if (recap.sessions === 0) return null

  const share = async () => {
    if (state === 'sharing') return
    sfx.tap()
    setState('sharing')
    const days = `${recap.activeDays}/7 jours actifs`
    const sessions = `${recap.sessions} session${recap.sessions > 1 ? 's' : ''}`
    const avg = recap.quizAvg !== null ? ` · ${recap.quizAvg} % aux quiz` : ''
    const outcome = await shareStory(
      {
        title: 'Ma semaine Studuel',
        emoji: streak > 0 ? '🔥' : '📚',
        headline: `${sessions} · ${days}`,
        sub:
          (recap.quizAvg !== null ? `${recap.quizAvg} % de moyenne aux quiz` : '') ||
          (streak > 0 ? `Série de ${streak} jours` : ''),
      },
      `Ma semaine sur Studuel : ${sessions}, ${days}${avg} !`,
    )
    setState(outcome === 'aborted' || outcome === 'shared' ? 'idle' : outcome)
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={share}
        disabled={state === 'sharing'}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-highlight px-4 py-2.5 text-sm font-bold text-foreground shadow-sm transition active:scale-[0.98] disabled:opacity-60"
      >
        <Share2 className="size-4" aria-hidden="true" />
        {state === 'sharing' ? 'Partage…' : 'Partager ma semaine'}
      </button>
      {state === 'copied' ? (
        <p role="status" className="mt-1.5 text-center text-xs font-medium text-muted-foreground">
          Message copié — colle-le où tu veux !
        </p>
      ) : null}
      {state === 'failed' ? (
        <p role="status" className="mt-1.5 text-center text-xs font-medium text-destructive">
          Partage indisponible sur cet appareil.
        </p>
      ) : null}
    </div>
  )
}
