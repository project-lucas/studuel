'use client'

import { cn } from '@/lib/utils'
import FriendAddButton from '@/components/FriendAddButton'
import { useDuelLaunch } from '@/components/amis/useDuelLaunch'
import type { Friend } from '@/lib/social'

/**
 * « En ce moment » — la rangée façon stories qui rend l'onglet vivant dès le
 * premier pixel : un rond par ami, anneau flamme = série en cours, point vert
 * = en session en ce moment, un tap = le défier (duel réel, 1/jour). La
 * première pastille invite (même modale que « Ajouter un ami »).
 */
export default function FriendStories({
  friends,
  onlineIds,
  myFriendCode,
  onDuelBlocked,
}: {
  friends: Friend[]
  onlineIds: ReadonlySet<string>
  myFriendCode: string
  onDuelBlocked: () => void
}) {
  const { launch, launching } = useDuelLaunch(onDuelBlocked)

  // Les plus « chauds » d'abord : en ligne, puis série décroissante.
  const sorted = [...friends].sort((a, b) => {
    const aOn = onlineIds.has(a.id) ? 1 : 0
    const bOn = onlineIds.has(b.id) ? 1 : 0
    if (aOn !== bOn) return bOn - aOn
    return (b.streak ?? 0) - (a.streak ?? 0)
  })

  return (
    <section aria-label="En ce moment">
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Inviter, en tête de rangée : là où on voit qu'il manque du monde. */}
        <FriendAddButton myFriendCode={myFriendCode} variant="story" />

        {sorted.map((f) => {
          const online = onlineIds.has(f.id)
          const streak = f.streak ?? 0
          return (
            <button
              key={f.id}
              type="button"
              disabled={launching}
              onClick={() => launch(f.id)}
              aria-label={`Défier ${f.name}${online ? ' (en ligne)' : ''}${streak > 0 ? ` — série de ${streak} jours` : ''}`}
              className="flex w-16 shrink-0 cursor-pointer flex-col items-center gap-1 disabled:opacity-60"
            >
              <span className="relative">
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-13 items-center justify-center rounded-full bg-white text-2xl shadow-sm ring-1 ring-black/5',
                    streak > 0 &&
                      'ring-[3px] ring-orange-400 shadow-[0_0_10px_-2px_rgba(255,140,0,0.55)]',
                  )}
                >
                  {f.emoji}
                </span>
                {online ? (
                  <span
                    role="img"
                    aria-label="En ligne"
                    className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-2 border-background bg-green-500"
                  />
                ) : null}
              </span>
              <span className="max-w-full truncate text-[11px] font-bold text-foreground">
                {f.name}
              </span>
              <span className="-mt-1 text-[10px] font-semibold text-muted-foreground">
                {online ? 'en ligne' : streak > 0 ? `🔥 ${streak} j` : '·'}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
