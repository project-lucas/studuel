'use client'

import { useState } from 'react'
import { ArrowLeft, ChevronRight, Swords } from 'lucide-react'
import { BossFace } from '@/components/reviser/BossArena'
import SubjectBossPanel from '@/components/reviser/SubjectBossPanel'
import SubjectGames from '@/components/reviser/SubjectGames'
import TrainingList from '@/components/reviser/TrainingList'
import { sfx } from '@/lib/sounds'
import { bossForSubject } from '@/lib/bosses'
import type { ModeQuestion } from '@/lib/defi-modes'
import type { TrainingRow } from '@/lib/subject-template'

/**
 * L'onglet « Mode de jeu » : tout ce qui se JOUE dans la matière, à un seul
 * endroit — le gardien, les jeux de l'arène, puis chaque chapitre avec ses
 * quatre formats.
 *
 * Le combat de boss prend TOUT le panneau (l'arène remplace la zone crème) :
 * il vit donc dans une sous-vue, ouverte depuis son billet. C'est ce que
 * l'ancien onglet « Boss » lui offrait — un écran à lui — sans lui coûter un
 * septième onglet dans une barre qui débordait déjà.
 */
export default function TrainingPanel({
  subject,
  rows,
  bossPool,
}: {
  subject: { slug: string; name: string }
  rows: TrainingRow[]
  bossPool: ModeQuestion[]
}) {
  const [fighting, setFighting] = useState(false)
  const boss = bossForSubject(subject.slug)

  if (fighting) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            sfx.back()
            setFighting(false)
          }}
          className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-sm font-semibold shadow-sm transition-transform active:scale-95"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Retour aux modes de jeu
        </button>
        <SubjectBossPanel subjectSlug={subject.slug} pool={bossPool} />
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setFighting(true)
        }}
        className="group flex w-full items-center gap-3 rounded-2xl border-b-4 border-b-black/25 bg-gradient-to-r from-primary to-[color-mix(in_oklch,var(--primary),black_18%)] p-3.5 text-left text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-[2px] active:border-b-2"
      >
        <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/15">
          <BossFace boss={boss} px={44} className="size-11" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-heading flex items-center gap-1.5 text-sm leading-tight font-bold">
            <Swords className="size-4 shrink-0" aria-hidden="true" />
            Affronter {boss.name}
          </span>
          <span className="mt-0.5 block text-[11px] font-semibold text-white/75">
            {boss.epithet} · le gardien de {subject.name}
          </span>
        </span>
        <ChevronRight
          className="size-5 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </button>

      <SubjectGames subject={subject} />
      <TrainingList rows={rows} />
    </>
  )
}
