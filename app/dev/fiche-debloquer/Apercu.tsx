'use client'

import UnlockChapterCard from '@/components/UnlockChapterCard'
import type { RouleauFiche } from '@/lib/fiche-ecrin'
import { cn } from '@/lib/utils'

const BARRES = ['w-3/4', 'w-full', 'w-5/6', 'w-2/3', 'w-full', 'w-4/5', 'w-1/2', 'w-full', 'w-3/5', 'w-5/6', 'w-full', 'w-2/3', 'w-4/5', 'w-full']

/** L'écrin de déblocage rejouable (voir page.tsx). */
export default function ApercuFicheDebloquer({
  gemmes,
  refus,
  rouleau,
}: {
  gemmes: number
  refus: boolean
  rouleau: RouleauFiche | null
}) {
  const debloquer = async () => {
    await new Promise((r) => setTimeout(r, 700))
    return refus
      ? { ok: false, message: 'Impossible de débloquer pour le moment. Réessaie.' }
      : { ok: true, message: 'Chapitre débloqué !' }
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col gap-4 px-4 pt-6 pb-10">
      <p className="font-heading text-sm font-extrabold text-muted-foreground">
        Fiche de révision · Maths · 4e · Les fractions
      </p>
      <UnlockChapterCard
        chapterId="00000000-0000-0000-0000-000000000000"
        gems={gemmes}
        titre="Les fractions"
        rouleau={rouleau}
        debloquer={debloquer}
      >
        {/* Le leurre : des barres grises floutées, la silhouette d'une fiche. */}
        <div className="carte flex min-h-[36rem] flex-col gap-3 p-5 blur-[3px] select-none">
          {BARRES.map((width, i) => (
            <span
              key={i}
              className={cn('bg-muted-foreground/25 h-4 rounded-full', width, i % 4 === 0 && 'bg-muted-foreground/40 h-5')}
            />
          ))}
        </div>
      </UnlockChapterCard>
    </div>
  )
}
