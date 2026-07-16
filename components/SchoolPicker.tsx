'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Search, Plus, Check, School as SchoolIcon, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  searchSchools,
  joinNewSchool,
  setMySchool,
} from '@/app/defi/actions'
import {
  SCHOOL_LEVEL_LABEL,
  type School,
  type SchoolLevel,
} from '@/lib/clan'

// Sélecteur d'école = choix de clan. Recherche dans l'annuaire (par cycle), et
// si l'école manque, l'élève l'ajoute. Réutilisé dans les réglages, l'onboarding
// et le Défi. `onChange` remonte l'école choisie (ou null si quittée).
export default function SchoolPicker({
  level,
  current,
  onChange,
}: {
  level: SchoolLevel
  current: School | null
  onChange?: (school: School | null) => void
}) {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('')
  const [results, setResults] = useState<School[]>([])
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Recherche débouncée à chaque frappe (≥ 2 caractères). La mise à jour d'état
  // passe par le callback du timer (pas de setState direct dans l'effet).
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    const q = query.trim()
    timer.current = setTimeout(
      () => {
        startTransition(async () => {
          setResults(q.length < 2 ? [] : await searchSchools(q, level))
        })
      },
      q.length < 2 ? 0 : 300,
    )
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [query, level])

  const choose = (school: School) => {
    if (pending) return
    sfx.tap()
    setError(false)
    startTransition(async () => {
      const res = await setMySchool(school.id, level)
      if (res.ok) onChange?.(school)
      else setError(true)
    })
  }

  const createAndJoin = () => {
    const name = query.trim()
    if (name.length === 0 || pending) return
    sfx.tap()
    setError(false)
    startTransition(async () => {
      const res = await joinNewSchool(name, city.trim() || null, level)
      if (res.ok && res.school) onChange?.(res.school)
      else setError(true)
    })
  }

  // Une école exactement nommée comme la recherche existe-t-elle déjà ?
  const exactExists = results.some(
    (s) => s.name.toLowerCase() === query.trim().toLowerCase(),
  )

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-muted-foreground">
        Ton {SCHOOL_LEVEL_LABEL[level].toLowerCase()} — c’est ton clan
      </label>
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/40 px-3">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Cherche ton ${SCHOOL_LEVEL_LABEL[level].toLowerCase()}…`}
          aria-label="Chercher mon école"
          maxLength={120}
          className="min-h-11 w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Effacer"
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {/* Résultats de recherche. */}
      {results.length > 0 ? (
        <ul className="mt-2 flex flex-col gap-1.5">
          {results.map((s) => {
            const isCurrent = current?.id === s.id
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => choose(s)}
                  disabled={pending}
                  className="flex w-full items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-left shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  <SchoolIcon className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {s.name}
                    </span>
                    {s.city ? (
                      <span className="block truncate text-xs text-muted-foreground">
                        {s.city}
                      </span>
                    ) : null}
                  </span>
                  {isCurrent ? (
                    <Check className="size-4 shrink-0 text-success" aria-hidden="true" />
                  ) : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}

      {/* Ajout si l'école n'est pas trouvée. */}
      {query.trim().length >= 2 && !exactExists ? (
        <div className="mt-2 rounded-xl bg-primary/5 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Pas dans la liste ? Ajoute «&nbsp;{query.trim()}&nbsp;».
          </p>
          <div className="flex gap-2">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ville (facultatif)"
              aria-label="Ville de l'école"
              maxLength={80}
              className="min-h-10 min-w-0 flex-1 rounded-xl border border-border bg-white px-3 text-sm text-foreground"
            />
            <button
              type="button"
              onClick={createAndJoin}
              disabled={pending}
              className={cn(
                'flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 font-heading text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px',
                pending && 'opacity-60',
              )}
            >
              <Plus className="size-4" strokeWidth={2.8} aria-hidden="true" />
              Ajouter
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="mt-2 text-xs font-semibold text-destructive">
          Impossible pour le moment. Réessaie.
        </p>
      ) : null}
    </div>
  )
}
