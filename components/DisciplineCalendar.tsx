'use client'

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { useDialog } from '@/lib/use-dialog'

export type DayStatus = 'complete' | 'partial' | 'missed' | 'rest'

const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]
const MONTHS_SHORT = [
  'Janv',
  'Févr',
  'Mars',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Août',
  'Sept',
  'Oct',
  'Nov',
  'Déc',
]

const dayKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0)).getUTCDate()

// Index lundi = 0 du 1er du mois.
const firstWeekday = (y: number, m: number) =>
  (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7

// Pastille d'un jour selon son statut — échelle d'intensité « encre » (tokens).
const CELL_STYLE: Record<DayStatus | 'empty', string> = {
  complete: 'bg-primary text-primary-foreground',
  partial: 'bg-primary/25 text-foreground',
  missed: 'bg-muted text-muted-foreground',
  rest: 'border border-border bg-card text-muted-foreground',
  empty: 'border border-border/60 bg-card text-muted-foreground/40',
}

const LEGEND: { status: DayStatus; label: string }[] = [
  { status: 'complete', label: 'Complète' },
  { status: 'partial', label: 'Partielle' },
  { status: 'missed', label: 'Manquée' },
  { status: 'rest', label: 'Repos' },
]

// -----------------------------------------------------------------------------
// « Ma discipline » : modale calendrier (mois / année), ouverte depuis l'icône
// agenda du bloc « Ta série ». Chaque journée est colorée selon la part de
// missions validées ce jour-là. À monter uniquement quand elle est ouverte :
// chaque ouverture repart sur le mois courant, vue Mois.
// -----------------------------------------------------------------------------
export default function DisciplineCalendar({
  dayStatuses,
  today,
  onClose,
}: {
  dayStatuses: Record<string, DayStatus>
  today: string
  onClose: () => void
}) {
  const [view, setView] = useState<'month' | 'year'>('month')
  const todayY = Number(today.slice(0, 4))
  const todayM = Number(today.slice(5, 7)) - 1
  const [year, setYear] = useState(todayY)
  const [month, setMonth] = useState(todayM)

  useDialog(onClose)

  const completeInMonth = (y: number, m: number) => {
    let n = 0
    for (let d = 1; d <= daysInMonth(y, m); d++) {
      if (dayStatuses[dayKey(y, m, d)] === 'complete') n++
    }
    return n
  }

  const monthCount = useMemo(
    () => completeInMonth(year, month),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [year, month, dayStatuses],
  )
  const yearCount = useMemo(
    () =>
      Array.from({ length: 12 }, (_, m) => completeInMonth(year, m)).reduce(
        (a, b) => a + b,
        0,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [year, dayStatuses],
  )

  const atCurrentMonth = year === todayY && month === todayM
  const atCurrentYear = year === todayY

  const goPrev = () => {
    sfx.tap()
    if (view === 'year') {
      setYear((y) => y - 1)
    } else if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
  }

  const goNext = () => {
    sfx.tap()
    if (view === 'year') {
      setYear((y) => y + 1)
    } else if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
  }

  // --------------------------------------------------------------- grille mois
  const blanks = firstWeekday(year, month)
  const nbDays = daysInMonth(year, month)
  const cells: { day: number; status: DayStatus | 'empty'; isToday: boolean }[] = []
  for (let d = 1; d <= nbDays; d++) {
    const key = dayKey(year, month, d)
    cells.push({
      day: d,
      status: key > today ? 'empty' : (dayStatuses[key] ?? 'empty'),
      isToday: key === today,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Ma discipline"
            onClick={(e) => e.stopPropagation()}
            className="pop-in w-full max-w-sm rounded-2xl bg-card p-5 text-foreground shadow-xl"
          >
            {/* header : titre + fermer */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold">Ma discipline</h2>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => {
                  sfx.tap()
                  onClose()
                }}
                className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* toggle Mois / Année */}
            <div className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-muted p-1">
              {(['month', 'year'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => {
                    sfx.tap()
                    setView(v)
                  }}
                  className={cn(
                    'rounded-full py-1.5 text-sm font-semibold transition-all',
                    view === v
                      ? 'bg-card shadow-sm'
                      : 'text-muted-foreground',
                  )}
                >
                  {v === 'month' ? 'Mois' : 'Année'}
                </button>
              ))}
            </div>

            {/* navigation */}
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                aria-label={view === 'month' ? 'Mois précédent' : 'Année précédente'}
                onClick={goPrev}
                className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-muted"
              >
                <ChevronLeft className="size-4" />
              </button>
              <p className="text-sm font-bold capitalize">
                {view === 'month' ? `${MONTHS[month]} ${year}` : year}
              </p>
              <button
                type="button"
                aria-label={view === 'month' ? 'Mois suivant' : 'Année suivante'}
                onClick={goNext}
                disabled={view === 'month' ? atCurrentMonth : atCurrentYear}
                className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-muted disabled:opacity-30"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {view === 'month' ? (
              <>
                {/* grille calendrier */}
                <div className="grid grid-cols-7 gap-1.5">
                  {DAY_LETTERS.map((letter, i) => (
                    <span
                      key={`h${i}`}
                      className="pb-1 text-center text-[11px] font-bold text-muted-foreground"
                    >
                      {letter}
                    </span>
                  ))}
                  {Array.from({ length: blanks }, (_, i) => (
                    <span key={`b${i}`} />
                  ))}
                  {cells.map((cell) => (
                    <span
                      key={cell.day}
                      title={
                        cell.status === 'complete'
                          ? 'Complète'
                          : cell.status === 'partial'
                            ? 'Partielle'
                            : cell.status === 'missed'
                              ? 'Manquée'
                              : 'Repos'
                      }
                      className={cn(
                        'flex aspect-square items-center justify-center rounded-lg text-xs font-semibold tabular-nums',
                        CELL_STYLE[cell.status],
                        cell.isToday &&
                          'ring-2 ring-primary ring-offset-1 ring-offset-card',
                      )}
                    >
                      {cell.day}
                    </span>
                  ))}
                </div>

                {/* compteur */}
                <p className="mt-4 text-center text-sm">
                  <strong className="font-bold text-primary">{monthCount}</strong>{' '}
                  {monthCount > 1 ? 'journées complètes' : 'journée complète'} ce
                  mois-ci
                </p>
              </>
            ) : (
              <>
                {/* vue année : 12 mois, intensité = journées complètes */}
                <div className="grid grid-cols-3 gap-1.5">
                  {MONTHS_SHORT.map((label, m) => {
                    const n = completeInMonth(year, m)
                    const ratio = n / daysInMonth(year, m)
                    const isFuture = year === todayY && m > todayM
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          sfx.tap()
                          setMonth(m)
                          setView('month')
                        }}
                        className={cn(
                          'flex flex-col items-center gap-0.5 rounded-xl border border-transparent py-2 transition-all active:scale-95',
                          isFuture
                            ? 'border-border bg-card text-muted-foreground/40'
                            : ratio >= 0.6
                              ? 'bg-primary text-primary-foreground'
                              : ratio >= 0.2
                                ? 'bg-primary/40 text-foreground'
                                : n > 0
                                  ? 'bg-primary/15 text-foreground'
                                  : 'bg-muted text-muted-foreground',
                          year === todayY &&
                            m === todayM &&
                            'ring-2 ring-primary ring-offset-1 ring-offset-card',
                        )}
                      >
                        <span className="text-xs font-bold">{label}</span>
                        <span className="text-[11px] font-semibold tabular-nums">
                          {isFuture ? '—' : n}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <p className="mt-4 text-center text-sm">
                  <strong className="font-bold text-primary">{yearCount}</strong>{' '}
                  {yearCount > 1 ? 'journées complètes' : 'journée complète'} cette
                  année
                </p>
              </>
            )}

            {/* légende */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t pt-3">
              {LEGEND.map(({ status, label }) => (
                <span
                  key={status}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground"
                >
                  <span className={cn('size-3 rounded', CELL_STYLE[status])} />
                  {label}
                </span>
              ))}
            </div>
          </div>
    </div>
  )
}
