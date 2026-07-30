'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ChevronRight, Swords } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { CLOCK_STEP_MS, useClock } from '@/lib/use-clock'
import { apparitionMessage, countdownLabel, type TraqueCard } from '@/lib/traque'

/**
 * LE MESSAGE ÉCLAIR — la trouvaille de 7DS Grand Cross, portée telle quelle :
 * quand un gardien surgit, on ne lit pas une notification enfouie dans un
 * menu, on voit une bannière traverser l'écran (« Delta a surgi de sa
 * tanière ! »). Plus qu'à taper dessus pour l'affronter.
 *
 * Elle vit AU-DESSUS du bloc d'action de l'arène, là où le pouce se trouve
 * déjà, et elle reste tant que la fenêtre d'une heure court : elle N'EST PAS
 * un toast, c'est l'appel au combat. Elle disparaît d'elle-même à la seconde
 * où la fenêtre se referme — proposer un combat que le serveur refuserait
 * serait une promesse en l'air.
 */
export default function BossFlash({ card }: { card: TraqueCard }) {
  const reduce = useReducedMotion()
  const now = useClock(CLOCK_STEP_MS)

  // Le rugissement ne se joue qu'UNE fois par apparition : revenir sur l'onglet
  // Défi dix fois dans l'heure ne doit pas rejouer la fanfare dix fois.
  useEffect(() => {
    if (card.endsAt === null) return
    const key = `studuel-traque-eclair:${card.boss.id}:${card.endsAt}`
    try {
      if (window.sessionStorage.getItem(key)) return
      window.sessionStorage.setItem(key, '1')
    } catch {
      // Stockage bloqué : on joue le son, c'est le moindre mal.
    }
    sfx.battle()
  }, [card.boss.id, card.endsAt])

  const remaining =
    now !== null && card.endsAt !== null
      ? Math.max(0, card.endsAt - now)
      : card.remainingMs
  if (card.endsAt !== null && now !== null && remaining <= 0) return null

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: '-40%', scaleX: 1.15 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, scaleX: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <Link
        href={`/defi/traque/${card.boss.id}`}
        onClick={() => sfx.tap()}
        aria-label={`${apparitionMessage(card.boss, card.attempts)} Il disparaît dans ${countdownLabel(remaining)}. Le défier maintenant.`}
        className="traque-eclair olympe-press flex items-center gap-3 rounded-2xl px-3 py-2 focus-visible:ring-4 focus-visible:ring-highlight/70 focus-visible:outline-none"
      >
        {/* Le gardien enfin À VISAGE DÉCOUVERT : sur la feuille Boss il n'était
            qu'une ombre, ici il est en pleine lumière. C'est la récompense
            visuelle du travail fourni. */}
        <span
          className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-highlight/80 bg-black/30 text-2xl"
          aria-hidden="true"
        >
          {card.boss.image ? (
            <Image
              src={card.boss.image}
              alt=""
              width={44}
              height={44}
              className="size-full scale-110 object-contain object-bottom"
            />
          ) : (
            card.boss.emoji
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="font-heading block truncate text-sm leading-tight font-extrabold text-white">
            {apparitionMessage(card.boss, card.attempts)}
          </span>
          <span className="block truncate text-[0.68rem] font-bold text-highlight">
            {card.subject} · disparaît dans {countdownLabel(remaining)}
          </span>
        </span>

        <span
          className="flex shrink-0 items-center gap-1 rounded-full bg-highlight px-2.5 py-1 font-heading text-[0.7rem] font-extrabold text-foreground"
          aria-hidden="true"
        >
          <Swords className="size-3.5" strokeWidth={2.8} />
          Défier
          <ChevronRight className="-mr-1 size-3.5" strokeWidth={3} />
        </span>
      </Link>
    </motion.div>
  )
}
