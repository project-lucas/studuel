'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { RankingBoard, RankingEntry, RankingScope } from '@/lib/defi/types'
import { ChevronRightIcon } from './icons'

interface RankingTabsProps {
  boards: Record<RankingScope, RankingBoard>
}

const TABS: { scope: RankingScope; label: string }[] = [
  { scope: 'college', label: 'Collège' },
  { scope: 'national', label: 'National' },
  { scope: 'amis', label: 'Amis' },
]

/**
 * Classements en 3 onglets internes (Collège / National / Amis). Contrôle
 * segmenté restylé au design system ; le contenu glisse en fondu à chaque
 * changement d'onglet (Framer Motion).
 */
export default function RankingTabs({ boards }: RankingTabsProps) {
  const [scope, setScope] = useState<RankingScope>('college')
  const reduce = useReducedMotion()
  const board = boards[scope]

  return (
    <div>
      {/* Contrôle segmenté */}
      <div
        role="tablist"
        aria-label="Portée du classement"
        className="flex gap-1 border-b border-white/10 bg-white/5 p-1.5"
      >
        {TABS.map((tab) => {
          const active = tab.scope === scope
          return (
            <button
              key={tab.scope}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => setScope(tab.scope)}
              className={`flex-1 cursor-pointer rounded-xl py-2 text-sm font-extrabold transition-colors focus-visible:ring-2 focus-visible:ring-highlight/40 focus-visible:outline-none ${
                active
                  ? 'bg-highlight text-[oklch(0.24_0.06_75)] shadow-[0_6px_14px_-6px_color-mix(in_oklch,var(--highlight),transparent_30%)]'
                  : 'text-white/60 hover:text-white/85'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Contenu de l'onglet */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={scope}
            initial={reduce ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="tabpanel"
          >
            {/* Contexte : rang / percentile */}
            <div className="mb-3">
              <p className="font-heading text-lg leading-tight font-extrabold text-white">
                {board.headline}
              </p>
              {board.subline ? (
                <p className="text-sm font-semibold text-white/55">
                  {board.subline}
                </p>
              ) : null}
            </div>

            <ol className="space-y-1.5">
              {board.entries.map((entry) => (
                <EntryRow key={entry.id} entry={entry} />
              ))}
            </ol>

            {board.ctaLabel ? (
              <button
                type="button"
                className="defi2-press mt-3 flex w-full cursor-pointer items-center justify-center gap-1 rounded-2xl border border-white/15 bg-white/8 py-2.5 text-sm font-extrabold text-highlight focus-visible:ring-2 focus-visible:ring-highlight/40 focus-visible:outline-none"
              >
                {board.ctaLabel}
                <ChevronRightIcon className="size-4" />
              </button>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Métal du podium : dégradé + teinte de texte par rang (or / argent / bronze).
const PODIUM: Record<number, { ring: string; text: string }> = {
  1: { ring: 'from-[oklch(0.85_0.16_90)] to-[oklch(0.72_0.15_75)]', text: 'text-[oklch(0.28_0.06_80)]' },
  2: { ring: 'from-[oklch(0.86_0.02_250)] to-[oklch(0.72_0.02_250)]', text: 'text-[oklch(0.3_0.02_250)]' },
  3: { ring: 'from-[oklch(0.74_0.1_55)] to-[oklch(0.6_0.1_45)]', text: 'text-[oklch(0.26_0.05_50)]' },
}

function EntryRow({ entry }: { entry: RankingEntry }) {
  const podium = PODIUM[entry.rank]

  return (
    <li
      className={`flex items-center gap-3 rounded-2xl px-3 py-2 ${
        entry.isMe
          ? 'bg-highlight/15 ring-1 ring-highlight/60'
          : 'bg-white/5'
      }`}
      aria-current={entry.isMe ? 'true' : undefined}
    >
      <span className="grid w-7 shrink-0 place-items-center">
        {podium ? (
          <span
            className={`grid size-6 place-items-center rounded-full bg-gradient-to-b font-heading text-xs font-extrabold ${podium.ring} ${podium.text}`}
          >
            {entry.rank}
          </span>
        ) : (
          <span className="font-heading text-sm font-bold text-white/45">
            {entry.rank}
          </span>
        )}
      </span>
      <span className="text-xl leading-none" aria-hidden>
        {entry.avatar}
      </span>
      <span className="min-w-0 flex-1 truncate font-bold text-white/90">
        {entry.name}
        {entry.isMe ? (
          <span className="ml-1.5 rounded-full bg-highlight px-1.5 py-0.5 text-[0.6rem] font-extrabold text-[oklch(0.24_0.06_75)]">
            TOI
          </span>
        ) : null}
      </span>
      <span className="shrink-0 text-sm font-extrabold text-white tabular-nums">
        {entry.scoreLabel}
      </span>
    </li>
  )
}
