'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BusFront, Zap, ArrowRight, Flame } from 'lucide-react'
import { XP_RULES } from '@/lib/xp'
import { isCommuteNow } from '@/lib/trajet'
import type { CommuteSlot } from '@/lib/types'

// Rappel contextuel de trajet : n'apparaît QUE pendant un créneau de trajet
// de l'élève (heure de Paris). L'idée : transformer un temps mort — le bus,
// le métro, la voiture des parents — en 3 minutes de défi bonus.
// Rendu côté client uniquement (montage + re-test chaque minute), pour ne
// jamais figer un état « en trajet » dans une page mise en cache.
export default function CommuteBanner({
  slots,
  streak = 0,
}: {
  slots: CommuteSlot[]
  streak?: number
}) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (slots.length === 0) return
    const check = () => setActive(isCommuteNow(slots))
    check()
    const id = setInterval(check, 60_000)
    return () => clearInterval(id)
  }, [slots])

  if (!active) return null

  return (
    <Link
      href="/defi"
      className="group flex items-center gap-3 rounded-2xl bg-primary p-3.5 text-primary-foreground shadow-sm transition-transform active:scale-[0.99]"
    >
      <span
        aria-hidden="true"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10"
      >
        <BusFront className="size-6 text-highlight" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-heading block font-bold">
          C&apos;est ton trajet — transforme-le en XP
        </span>
        <span className="block text-sm text-primary-foreground/75">
          3 min de défi maintenant ·{' '}
          <span className="inline-flex items-center gap-0.5 font-semibold text-highlight">
            <Zap className="size-3.5" />+{XP_RULES.commuteBonus} XP bonus
          </span>
          {streak > 0 ? (
            <>
              {' · '}
              <span className="inline-flex items-center gap-0.5 font-semibold">
                <Flame className="size-3.5 text-highlight" />
                {streak} trajet{streak > 1 ? 's' : ''} d&apos;affilée
              </span>
            </>
          ) : null}
        </span>
      </span>
      <ArrowRight className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}
