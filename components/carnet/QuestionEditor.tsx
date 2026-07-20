'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ChevronDown,
  Eye,
  Pencil,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  emptyQuestionContent,
  FLASHCARD_LANGS,
  isQuestionReady,
  QUESTION_TYPES,
  TYPE_LABEL,
  type CourseQuestionType,
  type FlashcardContent,
  type LibreContent,
  type QcmContent,
  type QuestionContent,
  type TrousContent,
  type VraiFauxContent,
} from '@/lib/carnet-cours'
import { saveQuestion } from '@/app/reviser/cours/actions'
import { generateQuestionFeedback } from '@/app/reviser/cours/ai-actions'
import QuestionPlayer from '@/components/carnet/QuestionPlayer'
import { TYPE_ICON } from '@/components/carnet/style'

const LANG_LABEL: Record<string, string> = {
  fr: 'Français',
  en: 'Anglais',
  es: 'Espagnol',
  de: 'Allemand',
  it: 'Italien',
  la: 'Latin',
}

const inputClass =
  'w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none'

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-xs font-bold text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  )
}

// Champ feedback (optionnel) + bouton « Générer un feedback » (IA), partagé
// par le QCM et le Vrai/Faux.
function FeedbackField({
  value,
  onChange,
  enonce,
  bonneReponse,
}: {
  value: string
  onChange: (v: string) => void
  enonce: string
  bonneReponse: string
}) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  const generate = () => {
    if (pending || enonce.trim().length === 0) return
    sfx.tap()
    setMessage(null)
    startTransition(async () => {
      const res = await generateQuestionFeedback(enonce, bonneReponse)
      if (res.ok && res.feedback) onChange(res.feedback)
      else if (res.unavailable) {
        setMessage('Génération indisponible pour le moment (service IA non configuré).')
      } else setMessage('La génération a échoué. Réessaie dans un instant.')
    })
  }

  return (
    <Field label="Feedback (optionnel)" htmlFor="q-feedback">
      <textarea
        id="q-feedback"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder="Explication montrée après la réponse…"
        className={inputClass}
      />
      <button
        type="button"
        disabled={pending || enonce.trim().length === 0}
        onClick={generate}
        className="mt-1.5 flex cursor-pointer items-center gap-1.5 rounded-full bg-highlight/30 px-3 py-1.5 text-[11px] font-extrabold text-foreground transition active:translate-y-px disabled:opacity-50"
      >
        <Sparkles className="size-3.5" aria-hidden="true" />
        {pending ? 'Génération…' : 'Générer un feedback'}
      </button>
      {message ? (
        <p role="alert" className="mt-1 text-[11px] font-semibold text-destructive">
          {message}
        </p>
      ) : null}
    </Field>
  )
}

// ------------------------------------------------------- éditeurs par type ----

function QcmEditor({
  content,
  onChange,
}: {
  content: QcmContent
  onChange: (c: QcmContent) => void
}) {
  const setChoice = (i: number, patch: Partial<QcmContent['choix'][number]>) =>
    onChange({
      ...content,
      choix: content.choix.map((c, j) => (j === i ? { ...c, ...patch } : c)),
    })

  return (
    <div className="flex flex-col gap-3">
      <Field label="Énoncé" htmlFor="q-enonce">
        <textarea
          id="q-enonce"
          value={content.enonce}
          onChange={(e) => onChange({ ...content, enonce: e.target.value })}
          rows={2}
          maxLength={1000}
          placeholder="Ta question…"
          className={inputClass}
        />
      </Field>

      <div>
        <p className="mb-1 text-xs font-bold text-muted-foreground">
          Choix — coche la ou les bonnes réponses
        </p>
        <ul className="flex flex-col gap-2">
          {content.choix.map((choice, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={choice.correct}
                onChange={(e) => setChoice(i, { correct: e.target.checked })}
                aria-label={`Choix ${i + 1} : bonne réponse`}
                className="size-5 shrink-0 cursor-pointer accent-primary"
              />
              <input
                value={choice.texte}
                onChange={(e) => setChoice(i, { texte: e.target.value })}
                maxLength={300}
                placeholder={`Choix ${i + 1}`}
                aria-label={`Texte du choix ${i + 1}`}
                className={cn(inputClass, 'flex-1')}
              />
              <button
                type="button"
                disabled={content.choix.length <= 2}
                onClick={() => {
                  sfx.tap()
                  onChange({
                    ...content,
                    choix: content.choix.filter((_, j) => j !== i),
                  })
                }}
                aria-label={`Supprimer le choix ${i + 1}`}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        {content.choix.length < 6 ? (
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              onChange({
                ...content,
                choix: [...content.choix, { texte: '', correct: false }],
              })
            }}
            className="mt-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[11px] font-extrabold text-foreground"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Ajouter un choix
          </button>
        ) : null}
      </div>

      <FeedbackField
        value={content.feedback ?? ''}
        onChange={(v) =>
          onChange({ ...content, feedback: v.length > 0 ? v : null })
        }
        enonce={content.enonce}
        bonneReponse={content.choix
          .filter((c) => c.correct)
          .map((c) => c.texte)
          .join(' ; ')}
      />
    </div>
  )
}

function FlashcardEditor({
  content,
  onChange,
}: {
  content: FlashcardContent
  onChange: (c: FlashcardContent) => void
}) {
  const langSelect = (
    face: 'langue_recto' | 'langue_verso',
    label: string,
  ) => (
    <select
      value={content[face] ?? ''}
      onChange={(e) =>
        onChange({
          ...content,
          [face]: e.target.value.length > 0 ? e.target.value : null,
        })
      }
      aria-label={label}
      className="rounded-xl border border-black/10 bg-white px-2 py-1.5 text-xs font-bold text-foreground"
    >
      <option value="">Langue (aucune)</option>
      {FLASHCARD_LANGS.map((l) => (
        <option key={l} value={l}>
          {LANG_LABEL[l]}
        </option>
      ))}
    </select>
  )

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="q-recto" className="text-xs font-bold text-muted-foreground">
            Recto
          </label>
          {langSelect('langue_recto', 'Langue du recto')}
        </div>
        <textarea
          id="q-recto"
          value={content.recto}
          onChange={(e) => onChange({ ...content, recto: e.target.value })}
          rows={2}
          maxLength={1000}
          placeholder="Ex. : dog"
          className={inputClass}
        />
      </div>
      <div>
        <div className="mb-1 flex items-center justify-between">
          <label htmlFor="q-verso" className="text-xs font-bold text-muted-foreground">
            Verso
          </label>
          {langSelect('langue_verso', 'Langue du verso')}
        </div>
        <textarea
          id="q-verso"
          value={content.verso}
          onChange={(e) => onChange({ ...content, verso: e.target.value })}
          rows={2}
          maxLength={1000}
          placeholder="Ex. : chien"
          className={inputClass}
        />
      </div>
    </div>
  )
}

function VraiFauxEditor({
  content,
  onChange,
}: {
  content: VraiFauxContent
  onChange: (c: VraiFauxContent) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Field label="Affirmation" htmlFor="q-enonce">
        <textarea
          id="q-enonce"
          value={content.enonce}
          onChange={(e) => onChange({ ...content, enonce: e.target.value })}
          rows={2}
          maxLength={1000}
          placeholder="Ex. : La Seine traverse Lyon."
          className={inputClass}
        />
      </Field>
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-muted-foreground">
          Bonne réponse :
        </span>
        <div role="group" aria-label="Bonne réponse" className="flex gap-1.5">
          {(
            [
              [true, 'Vrai'],
              [false, 'Faux'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={label}
              type="button"
              aria-pressed={content.reponse === value}
              onClick={() => {
                sfx.tap()
                onChange({ ...content, reponse: value })
              }}
              className={cn(
                'font-heading cursor-pointer rounded-full px-4 py-2 text-xs font-extrabold transition-colors',
                content.reponse === value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/60 text-muted-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <FeedbackField
        value={content.feedback ?? ''}
        onChange={(v) =>
          onChange({ ...content, feedback: v.length > 0 ? v : null })
        }
        enonce={content.enonce}
        bonneReponse={content.reponse ? 'Vrai' : 'Faux'}
      />
    </div>
  )
}

function TrousEditor({
  content,
  onChange,
}: {
  content: TrousContent
  onChange: (c: TrousContent) => void
}) {
  return (
    <Field label="Texte — mets chaque mot à trouver [entre crochets]" htmlFor="q-texte">
      <textarea
        id="q-texte"
        value={content.texte}
        onChange={(e) => onChange({ texte: e.target.value })}
        rows={4}
        maxLength={2000}
        placeholder="Ex. : La [Seine] traverse [Paris]."
        className={inputClass}
      />
      <p className="mt-1 text-[11px] font-semibold text-muted-foreground">
        Chaque mot entre crochets devient un trou à compléter.
      </p>
    </Field>
  )
}

function LibreEditor({
  content,
  onChange,
}: {
  content: LibreContent
  onChange: (c: LibreContent) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Field label="Énoncé" htmlFor="q-enonce">
        <textarea
          id="q-enonce"
          value={content.enonce}
          onChange={(e) => onChange({ ...content, enonce: e.target.value })}
          rows={2}
          maxLength={1000}
          placeholder="Ta question…"
          className={inputClass}
        />
      </Field>
      <div>
        <p className="mb-1 text-xs font-bold text-muted-foreground">
          Réponse(s) acceptée(s)
        </p>
        <ul className="flex flex-col gap-2">
          {content.reponses.map((r, i) => (
            <li key={i} className="flex items-center gap-2">
              <input
                value={r}
                onChange={(e) =>
                  onChange({
                    ...content,
                    reponses: content.reponses.map((x, j) =>
                      j === i ? e.target.value : x,
                    ),
                  })
                }
                maxLength={300}
                placeholder={`Réponse ${i + 1}`}
                aria-label={`Réponse acceptée ${i + 1}`}
                className={cn(inputClass, 'flex-1')}
              />
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  onChange({
                    ...content,
                    reponses: content.reponses.filter((_, j) => j !== i),
                  })
                }}
                aria-label={`Supprimer la réponse ${i + 1}`}
                className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
        {content.reponses.length < 8 ? (
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              onChange({ ...content, reponses: [...content.reponses, ''] })
            }}
            className="mt-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-[11px] font-extrabold text-foreground"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Ajouter une réponse
          </button>
        ) : null}
      </div>
    </div>
  )
}

// -------------------------------------------------------------------- écran ----

/**
 * Éditeur d'une question : dropdown de type en haut + bouton « Aperçu »
 * (rendu jouable via QuestionPlayer), éditeur par type, section « Options »
 * repliable, enregistrement via Server Action.
 */
export default function QuestionEditor({
  courseId,
  questionId,
  initialType,
  initialContent,
}: {
  courseId: string
  questionId: string
  initialType: CourseQuestionType
  initialContent: QuestionContent
}) {
  const router = useRouter()
  const [type, setType] = useState<CourseQuestionType>(initialType)
  const [content, setContent] = useState<QuestionContent>(initialContent)
  const [preview, setPreview] = useState(false)
  const [optionsOpen, setOptionsOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [failed, setFailed] = useState(false)

  const TypeIcon = TYPE_ICON[type]
  const ready = isQuestionReady(type, content)

  const changeType = (next: CourseQuestionType) => {
    if (next === type) return
    sfx.tap()
    setType(next)
    setContent(emptyQuestionContent(next))
    setPreview(false)
    setSaved(false)
  }

  const save = () => {
    if (pending) return
    sfx.tap()
    setFailed(false)
    startTransition(async () => {
      const res = await saveQuestion(courseId, questionId, type, content)
      if (res.ok) {
        setSaved(true)
        router.refresh()
      } else setFailed(true)
    })
  }

  return (
    <div className="mx-auto w-full max-w-md pb-24">
      <Link
        href={`/reviser/cours/${courseId}`}
        onClick={() => sfx.tap()}
        className="mb-3 inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Retour au cours
      </Link>

      <div className="rev-card rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        {/* Type + Aperçu. */}
        <div className="mb-4 flex items-center gap-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TypeIcon className="size-4.5" strokeWidth={2.2} aria-hidden="true" />
          </span>
          <select
            value={type}
            onChange={(e) => changeType(e.target.value as CourseQuestionType)}
            aria-label="Type de question"
            className="font-heading min-w-0 flex-1 cursor-pointer rounded-xl border border-black/10 bg-white px-2.5 py-2 text-sm font-extrabold text-foreground"
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABEL[t]}
              </option>
            ))}
          </select>
          <button
            type="button"
            disabled={!ready}
            aria-pressed={preview}
            onClick={() => {
              sfx.tap()
              setPreview((v) => !v)
            }}
            className={cn(
              'flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-extrabold transition-colors disabled:opacity-40',
              preview
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/60 text-foreground hover:bg-muted',
            )}
          >
            {preview ? (
              <Pencil className="size-3.5" aria-hidden="true" />
            ) : (
              <Eye className="size-3.5" aria-hidden="true" />
            )}
            {preview ? 'Éditer' : 'Aperçu'}
          </button>
        </div>

        {preview ? (
          // L'aperçu est jouable : la question telle que l'élève la verra.
          // `key` force un joueur neuf à chaque bascule (réponse remise à zéro).
          <QuestionPlayer
            key={`${type}-${preview}`}
            type={type}
            content={content}
            onAnswered={() => {}}
          />
        ) : (
          <>
            {type === 'qcm' ? (
              <QcmEditor
                content={content as QcmContent}
                onChange={setContent}
              />
            ) : type === 'flashcard' ? (
              <FlashcardEditor
                content={content as FlashcardContent}
                onChange={setContent}
              />
            ) : type === 'vrai_faux' ? (
              <VraiFauxEditor
                content={content as VraiFauxContent}
                onChange={setContent}
              />
            ) : type === 'texte_a_trous' ? (
              <TrousEditor
                content={content as TrousContent}
                onChange={setContent}
              />
            ) : (
              <LibreEditor
                content={content as LibreContent}
                onChange={setContent}
              />
            )}

            {/* Section « Options » repliable — informations secondaires. */}
            <div className="mt-4 border-t border-black/5 pt-3">
              <button
                type="button"
                aria-expanded={optionsOpen}
                onClick={() => {
                  sfx.tap()
                  setOptionsOpen((v) => !v)
                }}
                className="flex w-full cursor-pointer items-center gap-1.5 text-xs font-extrabold text-muted-foreground"
              >
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform',
                    optionsOpen && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
                Options
              </button>
              {optionsOpen ? (
                <div className="mt-2 rounded-2xl bg-muted/40 px-3 py-2.5 text-[12px] leading-relaxed text-muted-foreground">
                  <p>
                    Statut :{' '}
                    <span className="font-bold text-foreground">
                      {ready ? 'complète (révisable)' : 'brouillon'}
                    </span>
                  </p>
                  <p className="mt-1">
                    Les réponses des textes à trous et des réponses libres sont
                    corrigées sans tenir compte des accents ni des majuscules.
                  </p>
                </div>
              ) : null}
            </div>
          </>
        )}

        {failed ? (
          <p
            role="alert"
            className="mt-3 rounded-2xl bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive"
          >
            L’enregistrement a échoué. Réessaie dans un instant.
          </p>
        ) : null}

        <button
          type="button"
          disabled={pending}
          onClick={save}
          className="font-heading mt-4 w-full cursor-pointer rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-60"
        >
          {pending ? 'Enregistrement…' : saved ? 'Enregistré ✓' : 'Enregistrer'}
        </button>
      </div>
    </div>
  )
}
