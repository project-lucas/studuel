'use client'

import { useRef, useState, useTransition } from 'react'
import { GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { GRADE_LEVELS, type GradeLevel } from '@/lib/types'
import { saveGradeLevel } from '@/app/moi/actions'

// -----------------------------------------------------------------------------
// « Ma classe » : change d'année scolaire (6e → Tle) depuis l'onglet Moi.
// Le niveau pilote le contenu filtré par niveau (Réviser, Défi, examen blanc).
// Sauvegarde immédiate au tap, mise à jour optimiste + repli si l'action échoue.
// -----------------------------------------------------------------------------
export default function GradeSelector({
  current,
}: {
  current: GradeLevel | null
}) {
  const [selected, setSelected] = useState<GradeLevel | null>(current)
  const [syncedCurrent, setSyncedCurrent] = useState(current)
  const [pending, startTransition] = useTransition()
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Le serveur reste la source de vérité : saveGradeLevel revalide la page, qui
  // se re-rend avec un `current` frais. Si l'enregistrement a échoué (RLS, GRANT,
  // contrainte — l'action ne throw pas), `current` reste l'ancien niveau et on
  // réaligne l'affichage optimiste dessus. Sans ça, un échec silencieux
  // laisserait « Ma classe » bloquée sur un niveau jamais enregistré. Pattern
  // React « ajuster l'état pendant le rendu » (pas d'effet → pas de rendu en
  // cascade, et conforme à react-hooks/set-state-in-effect).
  if (current !== syncedCurrent) {
    setSyncedCurrent(current)
    setSelected(current)
  }

  function choose(grade: GradeLevel) {
    if (grade === selected || pending) return
    sfx.tap()
    setSelected(grade) // optimiste ; resynchronisé par l'effet ci-dessus
    startTransition(async () => {
      await saveGradeLevel(grade)
    })
  }

  // Navigation clavier attendue d'un radiogroup : flèches pour changer d'option
  // (un seul arrêt Tab pour le groupe via le tabIndex « roving » plus bas).
  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown'
    const backward = e.key === 'ArrowLeft' || e.key === 'ArrowUp'
    if (!forward && !backward) return
    e.preventDefault()
    const delta = forward ? 1 : -1
    const next = (index + delta + GRADE_LEVELS.length) % GRADE_LEVELS.length
    btnRefs.current[next]?.focus()
    choose(GRADE_LEVELS[next])
  }

  // Index qui reçoit le focus au Tab : la classe sélectionnée, ou la 1re par défaut.
  const focusIndex = selected ? GRADE_LEVELS.indexOf(selected) : 0

  return (
    <section
      aria-label="Ma classe"
      className="moi-card rounded-3xl bg-white px-5 py-4"
    >
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <GraduationCap className="size-5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-heading text-base font-bold text-foreground">
            Ma classe
          </h2>
          <p className="text-xs text-muted-foreground">
            Change d&apos;année pour adapter tout ton contenu.
          </p>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label="Choisir ma classe"
        className="mt-3 flex flex-wrap gap-2"
      >
        {GRADE_LEVELS.map((grade, index) => {
          const active = grade === selected
          return (
            <button
              key={grade}
              ref={(el) => {
                btnRefs.current[index] = el
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={index === focusIndex ? 0 : -1}
              disabled={pending}
              onClick={() => choose(grade)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={cn(
                'min-w-12 rounded-full px-3.5 py-2 text-sm font-bold transition-all active:scale-90 disabled:opacity-60',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {grade}
            </button>
          )
        })}
      </div>
    </section>
  )
}
