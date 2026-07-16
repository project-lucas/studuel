'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Plus, Trash2, Save, ListChecks } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import BackButton from '@/components/BackButton'
import MindMap from '@/components/MindMap'
import { saveLibraryItem } from '@/app/reviser/bibliotheque/actions'
import {
  KIND_LABEL,
  MAX_QUIZ_QUESTIONS,
  MAX_QUIZ_OPTIONS,
  MIN_QUIZ_OPTIONS,
  MAX_CARTE_BRANCHES,
  type LibraryKind,
  type LibraryContent,
  type FicheContent,
  type QuizContent,
  type CarteContent,
  type LibraryQuizQuestion,
} from '@/lib/library'

const inputCls =
  'min-h-11 w-full rounded-2xl border border-border bg-muted/40 px-3 text-sm font-medium text-foreground'

// Éditeur unifié d'un contenu de la bibliothèque : coquille commune (titre +
// enregistrement) + corps spécifique au type. La normalisation faisant foi est
// côté serveur (saveLibraryItem) ; ici on garde l'ergonomie.
export default function LibraryEditor({
  id,
  kind,
  initialTitle,
  initialContent,
}: {
  id: string
  kind: LibraryKind
  initialTitle: string
  initialContent: LibraryContent
}) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState<LibraryContent>(initialContent)
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle')

  const save = () => {
    if (pending) return
    sfx.tap()
    setStatus('idle')
    startTransition(async () => {
      const res = await saveLibraryItem(id, kind, title, content)
      setStatus(res.ok ? 'ok' : 'err')
      if (res.ok) router.refresh()
    })
  }

  return (
    <div className="mx-auto w-full max-w-xl pb-28">
      <BackButton fallback="/reviser/bibliotheque" label="Ma bibliothèque" />

      <p className="mt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {KIND_LABEL[kind]}
      </p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={120}
        placeholder="Donne un titre…"
        aria-label="Titre"
        className="font-heading mt-1 w-full rounded-2xl border border-transparent bg-transparent text-2xl font-extrabold text-foreground focus:border-border focus:bg-muted/30"
      />

      <div className="mt-4">
        {kind === 'fiche' ? (
          <FicheBody
            content={content as FicheContent}
            onChange={(c) => setContent(c)}
          />
        ) : kind === 'quiz' ? (
          <QuizBody
            content={content as QuizContent}
            onChange={(c) => setContent(c)}
          />
        ) : (
          <CarteBody
            content={content as CarteContent}
            onChange={(c) => setContent(c)}
          />
        )}
      </div>

      {/* Barre d'enregistrement fixée en bas. */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <span
            role="status"
            className={cn(
              'flex-1 text-xs font-semibold',
              status === 'ok' && 'text-primary',
              status === 'err' && 'text-destructive',
              status === 'idle' && 'text-muted-foreground',
            )}
          >
            {status === 'ok'
              ? 'Enregistré ✓'
              : status === 'err'
                ? 'Échec — la bibliothèque n’est peut-être pas encore activée.'
                : 'Pense à enregistrer tes changements.'}
          </span>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className={cn(
              'flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 font-heading text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px',
              pending && 'opacity-60',
            )}
          >
            <Save className="size-4" strokeWidth={2.6} aria-hidden="true" />
            {pending ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Fiche : un simple éditeur de texte (Markdown léger accepté) --------------
function FicheBody({
  content,
  onChange,
}: {
  content: FicheContent
  onChange: (c: FicheContent) => void
}) {
  return (
    <div>
      <textarea
        value={content.markdown}
        onChange={(e) => onChange({ markdown: e.target.value })}
        rows={16}
        placeholder={
          'Écris ta fiche…\n\nAstuce : **gras**, *italique*, listes avec des tirets — la mise en forme Markdown est conservée.'
        }
        className="w-full rounded-2xl border border-border bg-muted/40 p-3 text-sm leading-relaxed text-foreground"
      />
    </div>
  )
}

// --- Quiz : constructeur de questions -----------------------------------------
function QuizBody({
  content,
  onChange,
}: {
  content: QuizContent
  onChange: (c: QuizContent) => void
}) {
  const questions = content.questions
  const setQuestions = (qs: LibraryQuizQuestion[]) => onChange({ questions: qs })

  const patch = (i: number, next: Partial<LibraryQuizQuestion>) =>
    setQuestions(questions.map((q, k) => (k === i ? { ...q, ...next } : q)))

  const addQuestion = () => {
    if (questions.length >= MAX_QUIZ_QUESTIONS) return
    sfx.tap()
    setQuestions([
      ...questions,
      { question: '', options: ['', ''], correct_index: 0, explanation: null },
    ])
  }

  return (
    <div className="flex flex-col gap-3">
      {questions.length === 0 ? (
        <p className="rounded-2xl bg-muted/40 px-3 py-3 text-center text-xs text-muted-foreground">
          Ajoute ta première question — coche la bonne réponse.
        </p>
      ) : null}

      {questions.map((q, i) => (
        <div
          key={i}
          className="rounded-2xl border border-border bg-white p-3 shadow-sm"
        >
          <div className="mb-2 flex items-start gap-2">
            <span className="font-heading mt-2 text-sm font-bold text-muted-foreground">
              {i + 1}.
            </span>
            <textarea
              value={q.question}
              onChange={(e) => patch(i, { question: e.target.value })}
              rows={2}
              placeholder="Ta question…"
              className="w-full rounded-xl border border-border bg-muted/40 p-2 text-sm font-semibold text-foreground"
            />
            <button
              type="button"
              onClick={() => setQuestions(questions.filter((_, k) => k !== i))}
              aria-label={`Supprimer la question ${i + 1}`}
              className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col gap-2 pl-5">
            {q.options.map((opt, j) => (
              <div key={j} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => patch(i, { correct_index: j })}
                  role="radio"
                  aria-checked={q.correct_index === j}
                  aria-label={`Bonne réponse : option ${j + 1}`}
                  className={cn(
                    'flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition',
                    q.correct_index === j
                      ? 'border-success bg-success text-white'
                      : 'border-border bg-white text-transparent',
                  )}
                >
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </button>
                <input
                  value={opt}
                  onChange={(e) =>
                    patch(i, {
                      options: q.options.map((o, k) =>
                        k === j ? e.target.value : o,
                      ),
                    })
                  }
                  placeholder={`Réponse ${j + 1}`}
                  className="min-h-10 min-w-0 flex-1 rounded-xl border border-border bg-muted/40 px-3 text-sm text-foreground"
                />
                {q.options.length > MIN_QUIZ_OPTIONS ? (
                  <button
                    type="button"
                    onClick={() => {
                      const options = q.options.filter((_, k) => k !== j)
                      patch(i, {
                        options,
                        correct_index:
                          q.correct_index >= options.length
                            ? 0
                            : q.correct_index,
                      })
                    }}
                    aria-label={`Retirer la réponse ${j + 1}`}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            ))}
            {q.options.length < MAX_QUIZ_OPTIONS ? (
              <button
                type="button"
                onClick={() => patch(i, { options: [...q.options, ''] })}
                className="self-start text-xs font-semibold text-primary"
              >
                + Ajouter une réponse
              </button>
            ) : null}

            <input
              value={q.explanation ?? ''}
              onChange={(e) =>
                patch(i, { explanation: e.target.value || null })
              }
              placeholder="Explication (facultatif)"
              className="mt-1 min-h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-xs text-muted-foreground"
            />
          </div>
        </div>
      ))}

      {questions.length < MAX_QUIZ_QUESTIONS ? (
        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 py-3 font-heading text-sm font-bold text-primary transition hover:bg-primary/5"
        >
          <ListChecks className="size-4" aria-hidden="true" /> Ajouter une question
        </button>
      ) : null}
    </div>
  )
}

// --- Carte mentale : notion centrale + branches, avec aperçu ------------------
function CarteBody({
  content,
  onChange,
}: {
  content: CarteContent
  onChange: (c: CarteContent) => void
}) {
  const setCentre = (centre: string) => onChange({ ...content, centre })
  const branches = content.branches
  const setBranches = (b: CarteContent['branches']) =>
    onChange({ ...content, branches: b })

  const hasPreview =
    content.centre.trim().length > 0 && branches.some((b) => b.titre.trim())

  return (
    <div className="flex flex-col gap-3">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-muted-foreground">
          Notion centrale
        </span>
        <input
          value={content.centre}
          onChange={(e) => setCentre(e.target.value)}
          placeholder="Ex. La photosynthèse"
          className={inputCls}
        />
      </label>

      {branches.map((b, i) => (
        <div key={i} className="rounded-2xl border border-border bg-white p-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <input
              value={b.titre}
              onChange={(e) =>
                setBranches(
                  branches.map((x, k) =>
                    k === i ? { ...x, titre: e.target.value } : x,
                  ),
                )
              }
              placeholder={`Branche ${i + 1}`}
              className="min-h-10 min-w-0 flex-1 rounded-xl border border-border bg-muted/40 px-3 text-sm font-semibold text-foreground"
            />
            <button
              type="button"
              onClick={() => setBranches(branches.filter((_, k) => k !== i))}
              aria-label={`Supprimer la branche ${i + 1}`}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </div>
          <textarea
            value={b.enfants.join('\n')}
            onChange={(e) =>
              setBranches(
                branches.map((x, k) =>
                  k === i
                    ? { ...x, enfants: e.target.value.split('\n') }
                    : x,
                ),
              )
            }
            rows={3}
            placeholder="Un point par ligne…"
            className="w-full rounded-xl border border-border bg-muted/40 p-2 text-sm text-foreground"
          />
        </div>
      ))}

      {branches.length < MAX_CARTE_BRANCHES ? (
        <button
          type="button"
          onClick={() => setBranches([...branches, { titre: '', enfants: [] }])}
          className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/40 py-3 font-heading text-sm font-bold text-primary transition hover:bg-primary/5"
        >
          <Plus className="size-4" aria-hidden="true" /> Ajouter une branche
        </button>
      ) : null}

      {hasPreview ? (
        <div className="mt-2">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Aperçu</p>
          <div className="rounded-2xl bg-muted/30 p-4">
            <MindMap
              data={{
                centre: content.centre || 'Notion centrale',
                branches: branches
                  .filter((b) => b.titre.trim())
                  .map((b) => ({
                    titre: b.titre,
                    enfants: b.enfants.filter((c) => c.trim()),
                  })),
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
