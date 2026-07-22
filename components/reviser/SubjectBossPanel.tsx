'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Star, Swords } from 'lucide-react'
import { Button } from '@/components/ui/button'
import BossMode from '@/components/BossMode'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  bossForSubject,
  currentBossRank,
  MAX_BOSS_RANK,
  RANK_LABELS,
  RANK_STATS,
  type BossRank,
} from '@/lib/bosses'
import type { ModeQuestion } from '@/lib/defi-modes'

// Onglet « Boss » de la page matière : chaque matière a SON boss, le même de
// la 6e à la Terminale (bossForSubject sur le slug). Présentation du gardien
// + combat avec un pool 100 % matière — mêmes récompenses que l'Arène.
export default function SubjectBossPanel({
  subjectSlug,
  pool,
}: {
  subjectSlug: string
  pool: ModeQuestion[]
}) {
  const boss = useMemo(() => bossForSubject(subjectSlug), [subjectSlug])
  const [fighting, setFighting] = useState(false)

  // Rang lu après montage (localStorage) — même pattern que BossMode, pour
  // éviter tout écart d'hydratation.
  const [rank, setRank] = useState<BossRank>(1)
  useEffect(() => {
    const load = () => setRank(currentBossRank(boss.id))
    if (!fighting) load()
  }, [boss.id, fighting])

  if (fighting) {
    return (
      <BossMode pool={pool} onExit={() => setFighting(false)} variant="subject" />
    )
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 pt-2 text-center">
      {/* Le gardien de la matière, en grand. */}
      <span className="flex size-36 items-center justify-center overflow-hidden rounded-full bg-primary text-7xl shadow-lg shadow-primary/30">
        {boss.image ? (
          <Image
            src={boss.image}
            alt=""
            width={144}
            height={144}
            aria-hidden="true"
            className="size-full scale-110 object-contain object-bottom"
          />
        ) : (
          <span aria-hidden="true">{boss.emoji}</span>
        )}
      </span>

      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-2">
          <h2 className="font-heading text-3xl font-bold">{boss.name}</h2>
          <span
            className="flex items-center gap-0.5"
            aria-label={`${RANK_LABELS[rank]} sur ${MAX_BOSS_RANK}`}
          >
            {Array.from({ length: MAX_BOSS_RANK }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  'size-4',
                  i < rank
                    ? 'fill-highlight text-highlight'
                    : 'fill-transparent text-current opacity-40',
                )}
              />
            ))}
          </span>
        </div>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {boss.epithet} · {RANK_LABELS[rank]}
        </p>
        <p className="font-heading text-lg italic">« {boss.intro} »</p>
      </div>

      <p className="max-w-sm text-sm text-muted-foreground">
        {boss.name} garde cette matière — le même boss de la 6e à la
        Terminale. {RANK_STATS[rank].hp}&nbsp;PV aujourd&apos;hui, et chaque
        victoire le fait revenir plus fort.
      </p>

      <Button
        size="lg"
        className="rounded-full px-8"
        disabled={pool.length === 0}
        onClick={() => {
          sfx.tap()
          setFighting(true)
        }}
      >
        <Swords className="size-4" /> Affronter {boss.name}
      </Button>

      {pool.length === 0 ? (
        <p className="max-w-xs text-sm text-muted-foreground">
          Pas encore de questions dans cette matière — le boss attend son
          premier challenger.
        </p>
      ) : null}
    </div>
  )
}
