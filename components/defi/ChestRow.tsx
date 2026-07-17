'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Chest } from '@/lib/defi/types'
import ChestOpenModal from './ChestOpenModal'
import { LockIcon } from './icons'

interface ChestRowProps {
  chests: Chest[]
  // true = coffres de démonstration (rien n'est crédité) : la rangée porte un
  // badge « Aperçu » et le modal le redit — jamais de fausse récompense.
  demo?: boolean
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
export default function ChestRow({ chests, demo = false }: ChestRowProps) {
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
      {demo ? (
        <p className="mb-1 flex justify-end">
          <span className="rounded-full bg-highlight/25 px-2 py-0.5 text-[10px] font-extrabold text-white/85">
            Aperçu
          </span>
        </p>
      ) : null}
      <div className="grid grid-cols-4 gap-2.5">
        {slots.map((chest) => (
          <ChestSlot key={chest.id} chest={chest} onOpen={handleOpen} />
        ))}
      </div>
      <ChestOpenModal chest={openChest} demo={demo} onClose={handleClose} />
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
  // Minuterie décrémentée chaque seconde pour les coffres verrouillés.
  const [remaining, setRemaining] = useState(chest.unlocksInSeconds ?? 0)
  useEffect(() => {
    if (chest.state !== 'locked') return
    const id = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [chest.state])

  // Emplacement vide : silhouette de coffre fantôme (pointillés crème), effacée.
  if (chest.state === 'empty') {
    return (
      <div
        className="relative flex aspect-square flex-col items-center justify-end rounded-2xl border-2 border-dashed border-[#faf6ef]/40 pb-1.5 opacity-50"
        aria-label="Emplacement de coffre vide"
      >
        <span className="text-[0.58rem] font-bold text-[#faf6ef]/60">Vide</span>
      </div>
    )
  }

  // Coffre verrouillé : coffre marbre, couvercle neutre, serrure gemme, timer.
  if (chest.state === 'locked') {
    return (
      <div
        className="olympe-chest olympe-marble olympe-chest--locked flex aspect-square flex-col items-center justify-end pb-1.5"
        aria-label={`Coffre verrouillé, ouvre dans ${formatCountdown(remaining)}`}
      >
        <div className="olympe-chest-lid" aria-hidden="true" />
        <div className="olympe-chest-lock" aria-hidden="true" />
        <span className="relative z-[1] flex items-center gap-0.5 rounded-full bg-[color:var(--foreground)]/75 px-1.5 py-0.5 text-[0.52rem] leading-none font-bold text-white">
          <LockIcon className="size-2.5" />
          {formatCountdown(remaining)}
        </span>
      </div>
    )
  }

  // state === 'ready' (ou 'opening') : coffre doré prêt à ouvrir. Halo doré
  // pulsé DERRIÈRE le coffre (moment de récompense, la richesse est justifiée).
  return (
    <div className="relative aspect-square">
      <div className="olympe-chest-glow animate-pulse" aria-hidden="true" />
      <button
        type="button"
        onClick={() => onOpen(chest)}
        className="olympe-chest olympe-marble olympe-press relative flex size-full flex-col items-center justify-end pb-1.5 focus-visible:ring-4 focus-visible:ring-highlight/50 focus-visible:outline-none"
        aria-label="Coffre prêt — ouvrir"
      >
        <div className="olympe-chest-lid" aria-hidden="true" />
        <div className="olympe-chest-lock" aria-hidden="true" />
        <span className="relative z-[1] rounded-full border border-[color:var(--foreground)] bg-gradient-to-b from-[#fcd34d] to-[#f9b233] px-2 py-0.5 text-[0.54rem] font-extrabold text-[color:var(--foreground)]">
          Ouvrir
        </span>
      </button>
    </div>
  )
}
