'use client'

import { useState, useTransition } from 'react'
import { BookOpenText, ChevronDown, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  addOralTextAction,
  setOralTextStatusAction,
  removeOralTextAction,
} from '@/app/reviser/actions'
import {
  nextOralStatus,
  oralProgress,
  oralCounts,
  ORAL_STATUS_LABEL,
  type OralText,
  type OralTextStatus,
} from '@/lib/oral-texts'

// Couleur de la pastille de statut, dans les rôles sémantiques du design system
// (jaune = en cours/progression, vert = acquis, neutre = à faire).
const STATUS_CHIP: Record<OralTextStatus, string> = {
  a_faire: 'bg-muted text-muted-foreground',
  en_cours: 'bg-highlight text-foreground',
  maitrise: 'bg-success text-white',
}

// -----------------------------------------------------------------------------
// « Mes textes du bac oral » — le descriptif de l'élève de 1re : la liste des
// textes présentés à l'oral de français, chacun avec un statut qui se change
// d'un tap (À faire → En cours → Maîtrisé). Volet repliable, sous l'objectif
// examen de Réviser. La liste locale se resynchronise sur ce que renvoie chaque
// action serveur (migration 156). Rendu null hors 1re / sans français.
// -----------------------------------------------------------------------------
export default function OralTextsCard({ initial }: { initial: OralText[] }) {
  const [texts, setTexts] = useState<OralText[]>(initial)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [work, setWork] = useState('')
  const [error, setError] = useState(false)
  const [pending, startTransition] = useTransition()

  const counts = oralCounts(texts)
  const pct = Math.round(oralProgress(texts) * 100)

  const add = () => {
    const t = title.trim()
    if (t.length === 0 || pending) return
    sfx.tap()
    setError(false)
    startTransition(async () => {
      const res = await addOralTextAction(t, work.trim() || null)
      if (res.ok) {
        setTexts(res.texts)
        setTitle('')
        setWork('')
      } else {
        setError(true)
      }
    })
  }

  const cycle = (text: OralText) => {
    if (pending) return
    sfx.tap()
    setError(false)
    startTransition(async () => {
      const res = await setOralTextStatusAction(
        text.id,
        nextOralStatus(text.status),
      )
      if (res.ok) setTexts(res.texts)
      else setError(true)
    })
  }

  const remove = (id: string) => {
    if (pending) return
    setError(false)
    startTransition(async () => {
      const res = await removeOralTextAction(id)
      if (res.ok) setTexts(res.texts)
      else setError(true)
    })
  }

  return (
    <section aria-label="Mes textes du bac oral" className="px-1">
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen((v) => !v)
        }}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-full bg-white/70 py-1.5 pr-3 pl-1.5 text-left ring-1 ring-black/5 transition active:scale-[0.99]"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpenText className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span className="font-heading min-w-0 flex-1 truncate text-sm font-bold text-foreground">
          Mes textes du bac oral
        </span>
        <span className="shrink-0 text-xs font-semibold text-muted-foreground tabular-nums">
          {counts.maitrise}/{texts.length}
        </span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="mt-2 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-black/5">
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
            Ton descriptif : la liste des textes que tu présentes à l&apos;oral.
            Touche la pastille pour avancer le statut.
          </p>

          {texts.length > 0 ? (
            <>
              {/* Barre de progression du descriptif. */}
              <div
                className="mb-3 h-2 w-full overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-label="Préparation de l'oral"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
              >
                <div
                  className="bar-fill h-full rounded-full bg-highlight transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <ul className="mb-3 flex flex-col gap-2">
                {texts.map((text) => (
                  <li
                    key={text.id}
                    className="flex items-center gap-2 rounded-xl bg-muted/40 py-1.5 pr-1.5 pl-3"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        {text.title}
                      </span>
                      {text.work ? (
                        <span className="block truncate text-xs text-muted-foreground">
                          {text.work}
                        </span>
                      ) : null}
                    </span>
                    <button
                      type="button"
                      onClick={() => cycle(text)}
                      disabled={pending}
                      aria-label={`Statut : ${ORAL_STATUS_LABEL[text.status]} — toucher pour changer`}
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-1 text-xs font-bold transition active:scale-95',
                        STATUS_CHIP[text.status],
                        pending && 'opacity-60',
                      )}
                    >
                      {ORAL_STATUS_LABEL[text.status]}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(text.id)}
                      disabled={pending}
                      aria-label={`Retirer ${text.title}`}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
                    >
                      <X className="size-4" strokeWidth={2.4} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mb-3 rounded-xl bg-muted/40 px-3 py-2.5 text-center text-xs text-muted-foreground">
              Aucun texte pour l&apos;instant — ajoute ton premier ci-dessous.
            </p>
          )}

          {/* Ajout inline : titre (requis) + œuvre (facultatif). */}
          <div className="flex flex-col gap-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') add()
              }}
              maxLength={200}
              placeholder="Titre du texte (ex. Le Malade imaginaire, I, 5)"
              className="min-h-11 w-full rounded-2xl border border-border bg-muted/40 px-3 text-sm font-medium text-foreground"
            />
            <div className="flex gap-2">
              <input
                value={work}
                onChange={(e) => setWork(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') add()
                }}
                maxLength={200}
                placeholder="Œuvre / auteur (facultatif)"
                className="min-h-11 min-w-0 flex-1 rounded-2xl border border-border bg-muted/40 px-3 text-sm font-medium text-foreground"
              />
              <button
                type="button"
                onClick={add}
                disabled={title.trim().length === 0 || pending}
                aria-label="Ajouter ce texte"
                className={cn(
                  'flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 font-heading text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px',
                  (title.trim().length === 0 || pending) && 'opacity-60',
                )}
              >
                <Plus className="size-4" strokeWidth={2.8} aria-hidden="true" />
                {pending ? '…' : 'Ajouter'}
              </button>
            </div>
          </div>

          {error ? (
            <p
              role="alert"
              className="mt-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
            >
              Impossible d&apos;enregistrer pour le moment. Réessaie.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
