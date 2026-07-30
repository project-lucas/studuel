'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check, Gift, ScrollText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { questBubbleView, type BubbleStep, type QuestView } from '@/lib/quests'
import SheetShell from './SheetShell'
import { NotificationBadge } from './SculptedPlate'
import DailyQuests from './DailyQuests'

/**
 * LA BULLE DU JOUR — la trouvaille de la bulle « Événement » de Clash Royale,
 * reprise telle quelle : la checklist du jour ne vit plus SEULEMENT derrière la
 * tuile Quêtes et sa feuille, elle se lit à découvert, juste au-dessus du bouton
 * qui la fait avancer, et une flèche la relie physiquement à lui.
 *
 * Pourquoi ça compte : demander d'ouvrir une feuille pour savoir où l'on en est,
 * c'est un geste de trop — et un geste de trop, c'est une visite qui s'arrête là.
 * Ici l'élève voit sa journée sans rien toucher : trois cases pour les trois
 * quêtes, une quatrième pour le coffre de bonus, et le prochain geste écrit à
 * côté.
 *
 * La tuile du rail gauche RESTE : elle est la porte quand la bulle s'efface
 * (message éclair de la traque). Un tap sur la bulle ouvre la même feuille.
 */
export default function QuestBubble({
  views,
  claimedIds,
}: {
  views: QuestView[]
  claimedIds: string[]
}) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  const bubble = questBubbleView(views, claimedIds)
  // Pas de quêtes (migration 205 absente) : pas de bulle. Mieux vaut rien
  // qu'une rangée de cases qui ne se cocheraient jamais.
  if (!bubble) return null

  const dueLabel =
    bubble.claimable > 0
      ? `, ${bubble.claimable} à encaisser`
      : ''

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label={`Quêtes du jour — ${bubble.done} sur ${bubble.total} faites${dueLabel}. ${bubble.headline}`}
        className="bulle-jour olympe-glass olympe-press relative flex w-full cursor-pointer items-center gap-2.5 rounded-2xl px-3 py-2 focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      >
        <span className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          {bubble.steps.map((step) => (
            <StepCase key={step.id} step={step} />
          ))}
        </span>

        <span className="min-w-0 flex-1 text-left">
          <span className="font-heading block truncate text-[0.72rem] leading-tight font-extrabold text-[#faf6ef]">
            {bubble.headline}
          </span>
          <span className="block text-[0.6rem] leading-tight font-bold text-white/65">
            Quêtes du jour · {bubble.done}/{bubble.total}
          </span>
        </span>

        {/* Le dû se voit depuis l'arène : une quête finie et non encaissée ne
            doit jamais attendre qu'on pense à ouvrir la feuille. */}
        {bubble.claimable > 0 ? (
          <NotificationBadge tone="alert" className="absolute -top-1.5 -right-1.5">
            {bubble.claimable}
          </NotificationBadge>
        ) : null}
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <SheetShell
                  label="Quêtes du jour"
                  reduce={reduce}
                  onClose={() => setOpen(false)}
                  header={
                    <>
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/12 bg-white/8"
                        aria-hidden
                      >
                        <ScrollText
                          className="size-[18px] text-[#faf6ef]"
                          strokeWidth={2.2}
                        />
                      </span>
                      <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-extrabold text-white">
                        Quêtes du jour
                      </h2>
                    </>
                  }
                >
                  <div className="p-4">
                    <DailyQuests views={views} claimedIds={claimedIds} />
                  </div>
                </SheetShell>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  )
}

/**
 * Une case de la bulle. Trois états, trois lectures immédiates :
 * à faire (creuse), à encaisser (or plein — c'est un dû), déjà encaissée
 * (éteinte, mais toujours cochée : l'élève garde sous les yeux ce qu'il a fait).
 * La dernière case porte le cadeau du bonus, jamais une coche : elle ne
 * récompense pas une quête mais les trois.
 */
function StepCase({ step }: { step: BubbleStep }) {
  const due = step.done && !step.claimed

  return (
    <span
      className={cn(
        'grid size-6 place-items-center rounded-lg border transition-colors',
        step.done
          ? due
            ? 'border-highlight/80 bg-highlight text-foreground shadow-[0_0_10px_-2px_color-mix(in_oklch,var(--highlight),transparent_40%)]'
            : 'border-white/25 bg-white/12 text-white/55'
          : 'border-white/20 bg-black/30 text-white/40',
      )}
    >
      {step.isBonus ? (
        <Gift className="size-3.5" strokeWidth={2.6} />
      ) : step.done ? (
        <Check className="size-3.5" strokeWidth={3.2} />
      ) : null}
    </span>
  )
}
