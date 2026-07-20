'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Eye, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LessonRichContent from '@/components/LessonRichContent'
import {
  createQuizForLesson,
  deleteQuestion,
  saveLesson,
  saveQuestion,
  saveQuizMeta,
  type QuestionInput,
} from '@/app/admin/actions'
import { cn } from '@/lib/utils'
import type { QuizQuestion } from '@/lib/types'
import { useTablist } from '@/components/useTablist'

// Éditeur admin d'une leçon : onglets Cours / Révision / Studygram / Quiz.
// Les textes utilisent le mini-markdown maison (rendu par LessonRichContent),
// avec aperçu en direct du rendu élève.

type LessonDraft = {
  id: string
  title: string
  content: string
  revision_sheet: string
  studygram_url: string
}

type QuizMeta = { id: string; title: string; is_free: boolean }

// Brouillon local d'une question : id null tant qu'elle n'est pas enregistrée.
type QuestionDraft = Omit<QuizQuestion, 'id' | 'explanation'> & {
  id: string | null
  explanation: string
  key: string // clé React stable, y compris pour les brouillons
}

const TABS = [
  { key: 'cours', label: 'Cours' },
  { key: 'revision', label: 'Révision' },
  { key: 'studygram', label: 'Studygram' },
  { key: 'quiz', label: 'Quiz' },
] as const
type TabKey = (typeof TABS)[number]['key']

const MARKDOWN_HELP =
  '# Partie · ## Sous-titre · - puce · > idée clé · **gras**'

export default function AdminLessonEditor({
  lesson,
  quiz,
  questions,
}: {
  lesson: LessonDraft
  quiz: QuizMeta | null
  questions: QuizQuestion[]
}) {
  const router = useRouter()
  const [tab, setTab] = useState<TabKey>('cours')
  const supportTabs = useTablist(TABS.length, (i) => setTab(TABS[i].key))
  const [draft, setDraft] = useState(lesson)
  const [preview, setPreview] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [saving, startSaving] = useTransition()

  const save = () =>
    startSaving(async () => {
      const result = await saveLesson(lesson.id, {
        title: draft.title,
        content: draft.content,
        revision_sheet: draft.revision_sheet,
        studygram_url: draft.studygram_url,
      })
      setStatus(result.saved ? 'Enregistré ✓' : (result.error ?? 'Erreur'))
      if (result.saved) router.refresh()
    })

  const textField =
    tab === 'cours' ? 'content' : tab === 'revision' ? 'revision_sheet' : null

  return (
    <div className="space-y-4">
      {/* Titre + enregistrement */}
      <div className="flex items-center gap-2">
        <Input
          value={draft.title}
          onChange={(e) => {
            setDraft({ ...draft, title: e.target.value })
            setStatus(null)
          }}
          aria-label="Titre de la leçon"
          className="font-heading min-w-0 flex-1 text-lg font-semibold"
        />
        <Button type="button" onClick={save} disabled={saving}>
          <Check className="size-4" />
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </Button>
      </div>
      {status ? (
        <p
          role="status"
          className={cn(
            'text-sm',
            status.endsWith('✓') ? 'text-primary' : 'text-destructive',
          )}
        >
          {status}
        </p>
      ) : null}

      {/* Onglets des supports */}
      <div
        role="tablist"
        aria-label="Support de la leçon"
        className="flex gap-1 rounded-full border bg-card p-1"
      >
        {TABS.map((t, i) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            id={`lesson-tab-${t.key}`}
            aria-selected={tab === t.key}
            aria-controls="lesson-support-panel"
            {...supportTabs.props(i, tab === t.key)}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
              tab === t.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        id="lesson-support-panel"
        role="tabpanel"
        aria-labelledby={`lesson-tab-${tab}`}
        // `space-y-4` et non `display:contents` : le parent espace ses enfants
        // DIRECTS (`> * + *` suit le DOM, pas la mise en page), donc `contents`
        // aurait aplati l'espacement — et un rôle ARIA sur un `display:contents`
        // a longtemps disparu de l'arbre d'accessibilité.
        className="space-y-4"
      >
      {/* Cours & Révision : texte mini-markdown + aperçu */}
      {textField ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">{MARKDOWN_HELP}</p>
            <Button
              type="button"
              variant={preview ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreview((p) => !p)}
            >
              <Eye className="size-4" /> Aperçu
            </Button>
          </div>
          <div className={cn('grid gap-4', preview && 'lg:grid-cols-2')}>
            <textarea
              value={draft[textField]}
              onChange={(e) => {
                setDraft({ ...draft, [textField]: e.target.value })
                setStatus(null)
              }}
              rows={18}
              aria-label={
                textField === 'content'
                  ? 'Texte du cours'
                  : 'Texte de la fiche de révision'
              }
              placeholder={
                textField === 'content'
                  ? '# Première partie\nExplique la notion…\n\n- point important\n> Idée clé à retenir'
                  : "# L'essentiel à retenir\n- définition clé\n- formule à connaître"
              }
              className="min-h-64 w-full resize-y rounded-2xl border bg-card p-4 font-mono text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {preview ? (
              <div className="rounded-2xl border bg-card p-4">
                <LessonRichContent
                  content={draft[textField] || 'Contenu à venir.'}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Studygram : URL d'image + aperçu */}
      {tab === 'studygram' ? (
        <div className="space-y-3">
          <Input
            value={draft.studygram_url}
            onChange={(e) => {
              setDraft({ ...draft, studygram_url: e.target.value })
              setStatus(null)
            }}
            aria-label="URL de l’image studygram"
            placeholder="https://… (URL de l’image, format 9:16 conseillé)"
          />
          {draft.studygram_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={draft.studygram_url}
              alt="Aperçu du studygram"
              className="max-h-96 rounded-2xl border object-contain"
            />
          ) : (
            <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
              Colle l’URL d’une image (Supabase Storage, Canva…) pour
              l’afficher dans la tuile Studygram.
            </p>
          )}
        </div>
      ) : null}

      {tab === 'quiz' ? (
        <QuizEditor lessonId={lesson.id} quiz={quiz} questions={questions} />
      ) : null}
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// Quiz : métadonnées + liste de questions éditables carte par carte.
// -----------------------------------------------------------------------------

function QuizEditor({
  lessonId,
  quiz,
  questions,
}: {
  lessonId: string
  quiz: QuizMeta | null
  questions: QuizQuestion[]
}) {
  const router = useRouter()
  const [meta, setMeta] = useState(quiz)
  const [items, setItems] = useState<QuestionDraft[]>(
    questions.map((q) => ({ ...q, explanation: q.explanation ?? '', key: q.id })),
  )
  const [error, setError] = useState<string | null>(null)
  const [busy, startBusy] = useTransition()

  if (!meta) {
    return (
      <div className="rounded-2xl border border-dashed p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Cette leçon n’a pas encore de quiz.
        </p>
        <Button
          type="button"
          className="mt-3"
          disabled={busy}
          onClick={() =>
            startBusy(async () => {
              const result = await createQuizForLesson(lessonId)
              if (result.saved && result.id) {
                router.refresh()
              } else {
                setError(result.error ?? 'Création impossible.')
              }
            })
          }
        >
          <Plus className="size-4" /> Créer le quiz
        </Button>
        {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
      </div>
    )
  }

  const addDraft = () =>
    setItems((list) => [
      ...list,
      {
        id: null,
        key: `draft-${crypto.randomUUID()}`,
        quiz_id: meta.id,
        question: '',
        kind: 'mcq',
        options: ['', '', '', ''],
        correct_index: 0,
        explanation: '',
        position: list.length + 1,
      },
    ])

  return (
    <div className="space-y-4">
      {/* Métadonnées du quiz */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border bg-card p-3">
        <Input
          value={meta.title}
          onChange={(e) => setMeta({ ...meta, title: e.target.value })}
          aria-label="Titre du quiz"
          className="min-w-0 flex-1"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={meta.is_free}
            onChange={(e) => setMeta({ ...meta, is_free: e.target.checked })}
            className="size-4 accent-primary"
          />
          Gratuit
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() =>
            startBusy(async () => {
              const result = await saveQuizMeta(meta.id, {
                title: meta.title,
                is_free: meta.is_free,
              })
              setError(result.saved ? null : (result.error ?? 'Erreur'))
            })
          }
        >
          <Check className="size-4" /> Enregistrer
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      {items.map((item, index) => (
        <QuestionCard
          key={item.key}
          item={item}
          index={index}
          onChange={(next) =>
            setItems((list) => list.map((q) => (q.key === item.key ? next : q)))
          }
          onSaved={(id) =>
            setItems((list) =>
              list.map((q) => (q.key === item.key ? { ...q, id } : q)),
            )
          }
          onDeleted={() =>
            setItems((list) => list.filter((q) => q.key !== item.key))
          }
        />
      ))}

      <Button type="button" variant="outline" onClick={addDraft}>
        <Plus className="size-4" /> Ajouter une question
      </Button>
    </div>
  )
}

function QuestionCard({
  item,
  index,
  onChange,
  onSaved,
  onDeleted,
}: {
  item: QuestionDraft
  index: number
  onChange: (next: QuestionDraft) => void
  onSaved: (id: string) => void
  onDeleted: () => void
}) {
  const [status, setStatus] = useState<string | null>(null)
  const [busy, startBusy] = useTransition()

  const set = (patch: Partial<QuestionDraft>) => {
    onChange({ ...item, ...patch })
    setStatus(null)
  }

  const setKind = (kind: 'mcq' | 'true_false') =>
    set({
      kind,
      options: kind === 'true_false' ? ['Vrai', 'Faux'] : ['', '', '', ''],
      correct_index: 0,
    })

  const save = () =>
    startBusy(async () => {
      const payload: QuestionInput = {
        id: item.id,
        quiz_id: item.quiz_id,
        question: item.question,
        kind: item.kind,
        options: item.options,
        correct_index: item.correct_index,
        explanation: item.explanation,
        position: index + 1,
      }
      const result = await saveQuestion(payload)
      if (result.saved && result.id) {
        onSaved(result.id)
        setStatus('Enregistré ✓')
      } else {
        setStatus(result.error ?? 'Erreur')
      }
    })

  const remove = () =>
    startBusy(async () => {
      if (item.id) {
        const result = await deleteQuestion(item.id)
        if (!result.saved) {
          setStatus(result.error ?? 'Suppression impossible.')
          return
        }
      }
      onDeleted()
    })

  return (
    <div className="space-y-3 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="font-heading shrink-0 text-sm font-bold text-muted-foreground">
          Q{index + 1}
        </span>
        <Input
          value={item.question}
          onChange={(e) => set({ question: e.target.value })}
          placeholder="Énoncé de la question…"
          aria-label={`Énoncé de la question ${index + 1}`}
          className="min-w-0 flex-1"
        />
        <select
          value={item.kind}
          onChange={(e) => setKind(e.target.value as 'mcq' | 'true_false')}
          aria-label="Type de question"
          className="h-9 shrink-0 rounded-md border bg-card px-2 text-sm"
        >
          <option value="mcq">QCM</option>
          <option value="true_false">Vrai / Faux</option>
        </select>
      </div>

      {/* Réponses : la radio coche la bonne */}
      <div className="space-y-2">
        {item.options.map((option, i) => (
          <label key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name={`correct-${item.key}`}
              checked={item.correct_index === i}
              onChange={() => set({ correct_index: i })}
              aria-label={`Réponse ${i + 1} correcte`}
              className="size-4 shrink-0 accent-primary"
            />
            {item.kind === 'true_false' ? (
              <span className="text-sm">{option}</span>
            ) : (
              <Input
                value={option}
                onChange={(e) =>
                  set({
                    options: item.options.map((o, j) =>
                      j === i ? e.target.value : o,
                    ),
                  })
                }
                placeholder={`Réponse ${i + 1}${i >= 2 ? ' (optionnelle)' : ''}`}
                aria-label={`Texte de la réponse ${i + 1}`}
                className="min-w-0 flex-1"
              />
            )}
          </label>
        ))}
      </div>

      <Input
        value={item.explanation}
        onChange={(e) => set({ explanation: e.target.value })}
        placeholder="Explication affichée après la réponse (optionnelle)…"
        aria-label="Explication de la question"
      />

      <div className="flex items-center gap-2">
        <Button type="button" size="sm" onClick={save} disabled={busy}>
          <Check className="size-4" /> Enregistrer
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={remove}
          disabled={busy}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" /> Supprimer
        </Button>
        {status ? (
          <span
            role="status"
            className={cn(
              'text-sm',
              status.endsWith('✓') ? 'text-primary' : 'text-destructive',
            )}
          >
            {status}
          </span>
        ) : null}
      </div>
    </div>
  )
}
