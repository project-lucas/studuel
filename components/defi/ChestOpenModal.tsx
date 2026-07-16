'use client'

import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from 'framer-motion'
import type { Chest, ChestReward } from '@/lib/defi/types'

interface ChestOpenModalProps {
  chest: Chest | null
  // true = récompenses de démonstration : le modal le dit noir sur blanc au
  // lieu de laisser croire que « +120 XP » a été crédité.
  demo?: boolean
  onClose: () => void
}

const CONFETTI_COLORS = [
  'var(--highlight)',
  'var(--primary)',
  'var(--destructive)',
  'var(--secondary-foreground)',
]

// Cible d'éclat pré-calculée par pièce (déterministe au montage du modal).
interface Confetto {
  dx: number
  dy: number
  rotate: number
  color: string
  delay: number
}

function makeConfetti(count: number): Confetto[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
    const dist = 90 + Math.random() * 130
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 40,
      rotate: Math.random() * 720 - 360,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: Math.random() * 0.12,
    }
  })
}

/**
 * Modal d'ouverture de coffre — LE moment de richesse visuelle : le coffre
 * s'ouvre en spring, les confettis jaillissent du centre, les 3 récompenses se
 * révèlent en cascade. Framer Motion ; s'apaise si l'utilisateur réduit les
 * animations.
 */
export default function ChestOpenModal({
  chest,
  demo = false,
  onClose,
}: ChestOpenModalProps) {
  const reduce = useReducedMotion()

  // Fermeture au clavier (Échap).
  useEffect(() => {
    if (!chest) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [chest, onClose])

  const confetti = useMemo(() => makeConfetti(reduce ? 0 : 18), [reduce])

  // createPortal a besoin du DOM : rien à rendre côté serveur (chest est nul au
  // rendu initial, donc aucune divergence d'hydratation).
  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {chest ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label="Ouverture d'un coffre"
        >
          {/* Voile */}
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-black/70 backdrop-blur-sm"
            aria-label="Fermer"
            onClick={onClose}
          />

          {/* Panneau */}
          <motion.div
            className="defi2-card relative z-10 w-full max-w-sm overflow-hidden p-6 text-center"
            initial={{ scale: reduce ? 1 : 0.8, y: reduce ? 0 : 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: reduce ? 1 : 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
          >
            {/* Confettis (jaillissent du centre haut) */}
            <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center">
              {confetti.map((c, i) => (
                <motion.span
                  key={i}
                  className="absolute block h-2.5 w-2 rounded-[2px]"
                  style={{ backgroundColor: c.color }}
                  initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                  animate={{ x: c.dx, y: c.dy, opacity: 0, rotate: c.rotate }}
                  transition={{
                    duration: 0.9,
                    delay: 0.15 + c.delay,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>

            {/* Coffre qui s'ouvre */}
            <motion.div
              className="relative mx-auto text-7xl"
              initial={{ scale: reduce ? 1 : 0.3, rotate: reduce ? 0 : -12 }}
              animate={
                reduce
                  ? { scale: 1, rotate: 0 }
                  : { scale: [0.3, 1.25, 1], rotate: [-12, 6, 0] }
              }
              transition={{ duration: 0.7, times: [0, 0.6, 1], ease: 'easeOut' }}
              aria-hidden
            >
              🎉
            </motion.div>

            <h2 className="font-heading mt-2 text-2xl font-extrabold text-white">
              Coffre ouvert !
            </h2>
            <p className="mt-0.5 text-sm font-semibold text-white/60">
              {demo
                ? 'Aperçu des récompenses à venir'
                : `Tu remportes ${chest.rewards.length} récompenses`}
            </p>
            {demo ? (
              <p className="mt-1 text-xs font-semibold text-white/45">
                Les vrais coffres arrivent bientôt — rien n&apos;est encore
                crédité sur ton compte.
              </p>
            ) : null}

            {/* Récompenses en cascade */}
            <motion.ul
              className="mt-5 space-y-2.5"
              initial="hidden"
              animate="show"
              variants={listVariants(reduce)}
            >
              {chest.rewards.map((reward) => (
                <RewardRow key={reward.label} reward={reward} reduce={reduce} />
              ))}
            </motion.ul>

            <button
              type="button"
              onClick={onClose}
              className="defi2-press mt-6 w-full cursor-pointer rounded-2xl border border-white/15 bg-primary px-5 py-3 text-base font-extrabold text-primary-foreground shadow-[0_14px_30px_-10px_color-mix(in_oklch,var(--primary),transparent_30%)] focus-visible:ring-4 focus-visible:ring-primary/40 focus-visible:outline-none"
            >
              Génial !
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

function listVariants(reduce: boolean | null): Variants {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.18,
        delayChildren: reduce ? 0 : 0.5,
      },
    },
  }
}

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 380, damping: 22 },
  },
}

function RewardRow({
  reward,
  reduce,
}: {
  reward: ChestReward
  reduce: boolean | null
}) {
  return (
    <motion.li
      variants={reduce ? undefined : ITEM_VARIANTS}
      className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8 px-3 py-2.5 text-left"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-xl leading-none" aria-hidden>
        {reward.icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-heading truncate font-extrabold text-white">
          {reward.label}
        </p>
        {reward.detail ? (
          <p className="truncate text-xs font-semibold text-white/55">
            {reward.detail}
          </p>
        ) : null}
      </div>
    </motion.li>
  )
}
