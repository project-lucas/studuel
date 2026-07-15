'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Chest } from '@/lib/defi/types'
import ChestOpenModal from './ChestOpenModal'
import { GiftIcon, LockIcon } from './icons'

interface ChestRowProps {
  chests: Chest[]
}

function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}min`
  if (m > 0) return `${m}min ${String(sec).padStart(2, '0')}s`
  return `${sec}s`
}

/**
 * Rangée de 4 coffres. Le coffre prêt scintille (Framer) et ouvre le modal de
 * révélation au tap ; les coffres verrouillés égrènent leur minuterie ; les
 * emplacements vides invitent à jouer.
 */
export default function ChestRow({ chests }: ChestRowProps) {
  // État local : permet de « vider » un coffre après ouverture (mock).
  const [slots, setSlots] = useState<Chest[]>(chests)
  const [openChest, setOpenChest] = useState<Chest | null>(null)

  const handleOpen = useCallback((chest: Chest) => {
    setOpenChest(chest)
  }, [])

  const handleClose = useCallback(() => {
    setOpenChest((current) => {
      if (current) {
        setSlots((prev) =>
          prev.map((c) =>
            c.id === current.id ? { ...c, state: 'empty', rewards: [] } : c,
          ),
        )
      }
      return null
    })
  }, [])

  return (
    <section aria-label="Tes coffres">
      <div className="grid grid-cols-4 gap-2.5">
        {slots.map((chest) => (
          <ChestSlot key={chest.id} chest={chest} onOpen={handleOpen} />
        ))}
      </div>
      <ChestOpenModal chest={openChest} onClose={handleClose} />
    </section>
  )
}

function ChestSlot({
  chest,
  onOpen,
}: {
  chest: Chest
  onOpen: (chest: Chest) => void
}) {
  const reduce = useReducedMotion()

  // Minuterie décrémentée chaque seconde pour les coffres verrouillés.
  const [remaining, setRemaining] = useState(chest.unlocksInSeconds ?? 0)
  useEffect(() => {
    if (chest.state !== 'locked') return
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [chest.state])

  if (chest.state === 'empty') {
    return (
      <div
        className="defi2-chest-empty flex aspect-square flex-col items-center justify-center text-center"
        aria-label="Emplacement de coffre vide"
      >
        <GiftIcon className="size-6 text-white/20" />
        <span className="mt-1 text-[0.6rem] font-bold text-white/35">Vide</span>
      </div>
    )
  }

  if (chest.state === 'locked') {
    return (
      <div
        className="defi2-chest-slot flex aspect-square flex-col items-center justify-center px-1 text-center"
        aria-label={`Coffre verrouillé, ouvre dans ${formatCountdown(remaining)}`}
      >
        <GiftIcon className="size-7 text-white/45" />
        <span className="mt-1 flex items-center gap-0.5 text-[0.58rem] leading-tight font-bold text-white/55">
          <LockIcon className="size-2.5" />
          {formatCountdown(remaining)}
        </span>
      </div>
    )
  }

  // state === 'ready' (ou 'opening') : coffre scintillant et cliquable.
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(chest)}
      className="defi2-chest-ready flex aspect-square flex-col items-center justify-center rounded-[18px] px-1 text-center focus-visible:ring-4 focus-visible:ring-highlight/50 focus-visible:outline-none"
      aria-label="Coffre prêt — ouvrir"
      animate={
        reduce
          ? undefined
          : {
              scale: [1, 1.06, 1],
              boxShadow: [
                '0 0 0px 0px color-mix(in oklch, var(--highlight), transparent 25%)',
                '0 0 20px 5px color-mix(in oklch, var(--highlight), transparent 25%)',
                '0 0 0px 0px color-mix(in oklch, var(--highlight), transparent 25%)',
              ],
            }
      }
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      whileTap={{ scale: 0.92 }}
    >
      <GiftIcon className="size-8 text-[oklch(0.26_0.06_70)]" />
      <span className="mt-0.5 text-[0.58rem] font-extrabold text-[oklch(0.26_0.06_70)]">
        Ouvrir
      </span>
    </motion.button>
  )
}
