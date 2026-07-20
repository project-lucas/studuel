'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { sfx } from '@/lib/sounds'
import DialogCloseButton from '@/components/DialogCloseButton'

export type CelebrationEntry = { slug: string; name: string; pct: number }

// Chaque palier n'est fêté qu'une fois par matière (le 100 % refête après
// le 90 %). Mémoire locale : c'est une célébration, pas une donnée de jeu.
const storageKey = (slug: string) => `scolaria-fete-matiere:${slug}`

type Tier = 90 | 100

function pendingTier(entry: CelebrationEntry): Tier | null {
  const tier: Tier | null = entry.pct >= 100 ? 100 : entry.pct >= 90 ? 90 : null
  if (!tier) return null
  const done = Number(window.localStorage.getItem(storageKey(entry.slug)) ?? 0)
  return tier > done ? tier : null
}

// Pluie de confettis en CSS pur — positions/délais dérivés de l'index pour
// rester déterministe (pas de Math.random au rendu).
function ConfettiRain() {
  const colors = ['bg-primary', 'bg-highlight', 'bg-chart-2', 'bg-chart-4']
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          className={`confetti-piece ${colors[i % colors.length]}`}
          style={{
            left: `${(i * 37 + 13) % 100}%`,
            animationDelay: `${(i % 7) * 0.28}s`,
            animationDuration: `${2.4 + (i % 5) * 0.35}s`,
          }}
        />
      ))}
    </div>
  )
}

// Overlay de fête quand une matière atteint le rang Diamant (>= 90 %) ou
// Légendaire (100 %) — même vocabulaire que les rangs de chapitre (lib/mastery).
export default function SubjectMasteryCelebration({
  entries,
}: {
  entries: CelebrationEntry[]
}) {
  const [current, setCurrent] = useState<{
    entry: CelebrationEntry
    tier: Tier
  } | null>(null)

  useEffect(() => {
    // Petit délai : la page s'installe, puis la fête éclate.
    const timer = setTimeout(() => {
      for (const entry of entries) {
        const tier = pendingTier(entry)
        if (tier) {
          setCurrent({ entry, tier })
          sfx.levelUp()
          return
        }
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [entries])

  if (!current) return null

  const { entry, tier } = current
  const legendary = tier === 100

  const dismiss = () => {
    window.localStorage.setItem(storageKey(entry.slug), String(tier))
    sfx.complete()
    // S'il reste une autre matière à fêter, elle passera au prochain montage.
    setCurrent(null)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Matière ${entry.name} maîtrisée`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={dismiss}
    >
      <ConfettiRain />
      <div
        className="pop-in relative w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-xl ring-1 ring-foreground/10"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogCloseButton onClose={dismiss} />
        <span className="float-slow block text-7xl" aria-hidden="true">
          {legendary ? '🏆' : '💎'}
        </span>
        <p className="font-heading mt-3 text-2xl font-extrabold tracking-tight uppercase italic">
          {legendary ? 'Légendaire !' : 'Rang Diamant !'}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {legendary ? (
            <>
              Tu as complété{' '}
              <span className="font-bold text-foreground">{entry.name}</span> à{' '}
              <span className="font-bold text-foreground">100&nbsp;%</span> — du
              premier au dernier chapitre. Chapeau, c&apos;est énorme. 👑
            </>
          ) : (
            <>
              <span className="font-bold text-foreground">{entry.name}</span>{' '}
              est maîtrisée à{' '}
              <span className="font-bold text-foreground">{entry.pct}&nbsp;%</span>{' '}
              — il ne te manque presque rien pour la perfection.
            </>
          )}
        </p>
        <Button onClick={dismiss} className="mt-5 w-full rounded-full">
          {legendary ? 'Trop fort 😎' : 'Je vise le 100 % 🎯'}
        </Button>
      </div>
    </div>
  )
}
