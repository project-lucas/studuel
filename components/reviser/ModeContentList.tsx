'use client'

import Link from 'next/link'
import { Check, ChevronRight, Search } from 'lucide-react'
import GemIcon from '@/components/ui/GemIcon'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { ModeGroup } from '@/lib/subject-template'

// Vue d'un mode (Quiz / Flashcards / Cartes mentales / Défis) : le contenu du
// mode groupé par chapitre, tous chapitres confondus. Chaque item porte son
// état (« 7/10 », « 12 cartes · 4 à revoir »…) et lance la session du mode.
export default function ModeContentList({
  groups,
  emptyLabel,
}: {
  groups: ModeGroup[]
  emptyLabel: string
}) {
  if (groups.length === 0) {
    return <p className="mt-6 text-sm text-muted-foreground">{emptyLabel}</p>
  }

  return (
    <div className="mt-4 flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.chapterId} aria-labelledby={`mode-${group.chapterId}`}>
          <p className="text-sm font-semibold text-muted-foreground">
            Chapitre {group.position}
          </p>
          <h2
            id={`mode-${group.chapterId}`}
            className="font-heading mt-0.5 text-lg font-bold text-balance"
          >
            {group.chapterTitle}
          </h2>
          <ul className="mt-2.5 flex flex-col gap-3">
            {group.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => sfx.tap()}
                  className="group flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99]"
                >
                  <span className="min-w-0 flex-1 font-semibold text-balance">
                    {item.title}
                  </span>
                  {/* Récompense promise avant de jouer — jaune = XP (design
                      system), versée par la Server Action de fin de session. */}
                  {typeof item.xp === 'number' ? (
                    <span className="bg-highlight/25 inline-flex shrink-0 items-center rounded-full px-2 py-1 text-xs font-bold tabular-nums">
                      +{item.xp} XP
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
                      item.locked || item.done
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {item.locked ? (
                      <GemIcon className="size-3.5" aria-hidden="true" />
                    ) : item.done ? (
                      <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                    ) : null}
                    {item.meta}
                  </span>
                  {item.locked ? (
                    // Loupe : on peut ENTREVOIR la carte avant de la débloquer
                    // (l'écran carte montre l'aperçu + le déblocage à la gemme).
                    <Search
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:scale-110"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronRight
                      className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
