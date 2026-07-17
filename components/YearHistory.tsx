'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Flame, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const WEEKS = 53
const MONTHS_FR = [
  'jan',
  'fév',
  'mar',
  'avr',
  'mai',
  'juin',
  'juil',
  'août',
  'sep',
  'oct',
  'nov',
  'déc',
]

function toKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
    d.getUTCDate(),
  ).padStart(2, '0')}`
}

type Cell = { key: string; done: boolean; future: boolean; monthStart: string | null }

// Construit 53 semaines (colonnes) × 7 jours finissant à la semaine courante,
// à partir de la clé du jour (déterministe, pas de new Date() → pas d'écart
// d'hydratation). Chaque colonne = une semaine (lundi en haut).
function buildYear(todayKey: string, active: Set<string>): Cell[][] {
  const [y, m, d] = todayKey.split('-').map(Number)
  const today = new Date(Date.UTC(y, m - 1, d))
  const monday = new Date(today)
  monday.setUTCDate(today.getUTCDate() - ((today.getUTCDay() + 6) % 7))
  const start = new Date(monday)
  start.setUTCDate(monday.getUTCDate() - (WEEKS - 1) * 7)

  const cursor = new Date(start)
  const weeks: Cell[][] = []
  for (let w = 0; w < WEEKS; w++) {
    const col: Cell[] = []
    for (let dow = 0; dow < 7; dow++) {
      const key = toKey(cursor)
      // Étiquette de mois : posée sur la 1re ligne de la 1re semaine du mois.
      const monthStart =
        dow === 0 && cursor.getUTCDate() <= 7 ? MONTHS_FR[cursor.getUTCMonth()] : null
      col.push({ key, done: active.has(key), future: key > todayKey, monthStart })
      cursor.setUTCDate(cursor.getUTCDate() + 1)
    }
    weeks.push(col)
  }
  return weeks
}

/**
 * Historique ANNUEL complet du travail, en grille façon « contributions »
 * (53 semaines × 7 jours). Ouvert en plein écran par l'icône agenda de la
 * barre de semaine.
 */
export default function YearHistory({
  activeDays,
  today,
  onClose,
}: {
  activeDays: string[]
  today: string
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const active = new Set(activeDays)
  const weeks = buildYear(today, active)
  const total = weeks.flat().filter((c) => c.done && !c.future).length

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Historique de travail de l'année"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-t-3xl bg-card p-5 shadow-xl ring-1 ring-black/5 sm:rounded-3xl"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarDays className="size-5" strokeWidth={2.3} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-heading text-lg font-extrabold text-foreground">
              Ton historique
            </h2>
            <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Flame className="size-3.5 text-highlight" aria-hidden="true" />
              {total} jour{total > 1 ? 's' : ''} travaillé{total > 1 ? 's' : ''} sur
              l’année
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* La grille : défile horizontalement si besoin (année entière). */}
        <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
          <div
            className="flex gap-[3px]"
            role="img"
            aria-label={`${total} jours travaillés au cours de l'année écoulée`}
          >
            {weeks.map((col, w) => (
              <div key={w} className="flex flex-col gap-[3px]">
                {/* Étiquette de mois au-dessus de la colonne concernée. */}
                <span className="h-3 text-[8px] leading-3 font-bold text-muted-foreground">
                  {col.find((c) => c.monthStart)?.monthStart ?? ''}
                </span>
                {col.map((c) => (
                  <span
                    key={c.key}
                    title={`${c.key}${c.done ? ' · travaillé' : ''}`}
                    className={cn(
                      'size-2.5 rounded-[2px]',
                      c.future
                        ? 'bg-transparent'
                        : c.done
                          ? 'bg-highlight'
                          : 'bg-foreground/[0.07]',
                      c.key === today && 'ring-1 ring-primary',
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Légende. */}
        <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] font-semibold text-muted-foreground">
          <span>Rien</span>
          <span className="size-2.5 rounded-[2px] bg-foreground/[0.07]" />
          <span className="size-2.5 rounded-[2px] bg-highlight" />
          <span>Travaillé</span>
        </div>
      </div>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(overlay, document.body)
}
