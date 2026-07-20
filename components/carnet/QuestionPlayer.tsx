'use client'

import { useState } from 'react'
import { Check, RotateCw, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  gradeLibre,
  gradeQcm,
  gradeTrous,
  gradeVraiFaux,
  parseTrous,
  trousAnswers,
  type CourseQuestionType,
  type FlashcardContent,
  type LibreContent,
  type QcmContent,
  type QuestionContent,
  type TrousContent,
  type VraiFauxContent,
} from '@/lib/carnet-cours'

export type PlayerResult = { correct: boolean; given: unknown }

type PlayerProps = {
  type: CourseQuestionType
  content: QuestionContent
  /** Appelé une seule fois, quand l'élève a répondu (feedback déjà affiché). */
  onAnswered: (result: PlayerResult) => void
}

const LANG_LABEL: Record<string, string> = {
  fr: 'Français',
  en: 'Anglais',
  es: 'Espagnol',
  de: 'Allemand',
  it: 'Italien',
  la: 'Latin',
}

// Bandeau de verdict + feedback, commun à tous les types.
function Verdict({
  correct,
  feedback,
  expected,
}: {
  correct: boolean
  feedback?: string | null
  expected?: string | null
}) {
  return (
    <div
      role="status"
      className={cn(
        'mt-3 rounded-2xl px-3.5 py-3',
        correct ? 'bg-primary/10' : 'bg-destructive/10',
      )}
    >
      <p
        className={cn(
          'font-heading flex items-center gap-1.5 text-sm font-extrabold',
          correct ? 'text-primary' : 'text-destructive',
        )}
      >
        {correct ? (
          <>
            <Check className="size-4" strokeWidth={3} aria-hidden="true" />
            Bonne réponse !
          </>
        ) : (
          <>
            <X className="size-4" strokeWidth={3} aria-hidden="true" />
            Pas tout à fait…
          </>
        )}
      </p>
      {!correct && expected ? (
        <p className="mt-1 text-[13px] font-semibold text-foreground">
          Réponse attendue : {expected}
        </p>
      ) : null}
      {feedback ? (
        <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">
          {feedback}
        </p>
      ) : null}
    </div>
  )
}

function QcmPlayer({
  content,
  onAnswered,
}: {
  content: QcmContent
  onAnswered: (r: PlayerResult) => void
}) {
  const [selected, setSelected] = useState<number[]>([])
  const [done, setDone] = useState(false)
  const multi = content.choix.filter((c) => c.correct).length > 1
  const correct = done ? gradeQcm(content, selected) : false

  const toggle = (i: number) => {
    if (done) return
    sfx.tap()
    setSelected((prev) =>
      multi
        ? prev.includes(i)
          ? prev.filter((x) => x !== i)
          : [...prev, i]
        : [i],
    )
  }

  const validate = () => {
    if (done || selected.length === 0) return
    const isCorrect = gradeQcm(content, selected)
    setDone(true)
    if (isCorrect) sfx.correct()
    else sfx.wrong()
    onAnswered({ correct: isCorrect, given: { selected } })
  }

  return (
    <div>
      <p className="font-heading text-base leading-snug font-extrabold text-foreground">
        {content.enonce}
      </p>
      {multi ? (
        <p className="mt-1 text-[11px] font-bold text-muted-foreground">
          Plusieurs bonnes réponses possibles.
        </p>
      ) : null}
      <ul className="mt-3 flex flex-col gap-2">
        {content.choix.map((choice, i) => {
          const isSelected = selected.includes(i)
          return (
            <li key={i}>
              <button
                type="button"
                disabled={done}
                aria-pressed={isSelected}
                onClick={() => toggle(i)}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2.5 rounded-2xl border-2 px-3.5 py-3 text-left text-sm font-semibold transition',
                  done && choice.correct
                    ? 'border-primary bg-primary/10 text-foreground'
                    : done && isSelected && !choice.correct
                      ? 'border-destructive bg-destructive/10 text-foreground'
                      : isSelected
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-black/10 bg-white text-foreground hover:border-primary/40',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center border-2',
                    multi ? 'rounded-md' : 'rounded-full',
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : 'border-black/20 bg-white',
                  )}
                >
                  {isSelected ? (
                    <Check className="size-3.5" strokeWidth={3.5} />
                  ) : null}
                </span>
                {choice.texte}
              </button>
            </li>
          )
        })}
      </ul>
      {!done ? (
        <button
          type="button"
          disabled={selected.length === 0}
          onClick={validate}
          className="font-heading mt-3 w-full cursor-pointer rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-50"
        >
          Valider
        </button>
      ) : (
        <Verdict correct={correct} feedback={content.feedback} />
      )}
    </div>
  )
}

function FlashcardPlayer({
  content,
  onAnswered,
}: {
  content: FlashcardContent
  onAnswered: (r: PlayerResult) => void
}) {
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)

  const face = flipped ? content.verso : content.recto
  const lang = flipped ? content.langue_verso : content.langue_recto

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          sfx.flip()
          setFlipped((v) => !v)
        }}
        aria-label={
          flipped ? 'Revenir au recto de la carte' : 'Retourner la carte'
        }
        className="flex min-h-44 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-3xl border-2 border-primary/20 bg-primary/5 px-4 py-6 transition active:scale-[0.99]"
      >
        {lang ? (
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-muted-foreground uppercase">
            {LANG_LABEL[lang] ?? lang}
          </span>
        ) : null}
        <span className="font-heading text-center text-lg leading-snug font-extrabold whitespace-pre-wrap text-foreground">
          {face}
        </span>
        <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
          <RotateCw className="size-3.5" aria-hidden="true" />
          {flipped ? 'Verso — touche pour revenir' : 'Touche pour retourner'}
        </span>
      </button>

      {/* Auto-évaluation, une fois le verso vu. */}
      {flipped && !done ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setDone(true)
              onAnswered({ correct: false, given: { selfEval: 'a-revoir' } })
            }}
            className="font-heading cursor-pointer rounded-2xl bg-destructive/10 px-3 py-3 text-sm font-extrabold text-destructive transition active:translate-y-px"
          >
            À revoir
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setDone(true)
              onAnswered({ correct: true, given: { selfEval: 'je-savais' } })
            }}
            className="font-heading cursor-pointer rounded-2xl bg-primary px-3 py-3 text-sm font-extrabold text-primary-foreground transition active:translate-y-px"
          >
            Je savais !
          </button>
        </div>
      ) : null}
      {done ? (
        <p className="mt-3 text-center text-[12px] font-semibold text-muted-foreground">
          C’est noté !
        </p>
      ) : null}
    </div>
  )
}

function VraiFauxPlayer({
  content,
  onAnswered,
}: {
  content: VraiFauxContent
  onAnswered: (r: PlayerResult) => void
}) {
  const [answer, setAnswer] = useState<boolean | null>(null)
  const done = answer !== null
  const correct = done ? gradeVraiFaux(content, answer) : false

  const pick = (value: boolean) => {
    if (done) return
    const isCorrect = gradeVraiFaux(content, value)
    if (isCorrect) sfx.correct()
    else sfx.wrong()
    setAnswer(value)
    onAnswered({ correct: isCorrect, given: { value } })
  }

  return (
    <div>
      <p className="font-heading text-base leading-snug font-extrabold text-foreground">
        {content.enonce}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(
          [
            [true, 'Vrai'],
            [false, 'Faux'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={label}
            type="button"
            disabled={done}
            onClick={() => pick(value)}
            className={cn(
              'font-heading cursor-pointer rounded-2xl border-2 px-3 py-3.5 text-sm font-extrabold transition',
              done && content.reponse === value
                ? 'border-primary bg-primary/10 text-primary'
                : done && answer === value
                  ? 'border-destructive bg-destructive/10 text-destructive'
                  : 'border-black/10 bg-white text-foreground hover:border-primary/40',
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {done ? (
        <Verdict
          correct={correct}
          feedback={content.feedback}
          expected={correct ? null : content.reponse ? 'Vrai' : 'Faux'}
        />
      ) : null}
    </div>
  )
}

function TrousPlayer({
  content,
  onAnswered,
}: {
  content: TrousContent
  onAnswered: (r: PlayerResult) => void
}) {
  const segments = parseTrous(content.texte)
  const holes = segments.filter((s) => s.type === 'trou').length
  const [values, setValues] = useState<string[]>(Array(holes).fill(''))
  const [done, setDone] = useState(false)
  const correct = done ? gradeTrous(content, values) : false

  const validate = () => {
    if (done || values.some((v) => v.trim().length === 0)) return
    const isCorrect = gradeTrous(content, values)
    setDone(true)
    if (isCorrect) sfx.correct()
    else sfx.wrong()
    onAnswered({ correct: isCorrect, given: { values } })
  }

  // Chaque segment porte son index de trou (-1 pour le texte), calculé avant
  // le rendu — pas de compteur réassigné dans le JSX.
  const indexed = segments.reduce<
    { seg: (typeof segments)[number]; idx: number }[]
  >((acc, seg) => {
    const holesSoFar = acc.filter((s) => s.idx >= 0).length
    acc.push({ seg, idx: seg.type === 'trou' ? holesSoFar : -1 })
    return acc
  }, [])

  return (
    <div>
      <p className="text-base leading-loose font-semibold text-foreground">
        {indexed.map(({ seg, idx }, i) => {
          if (seg.type === 'texte') {
            return <span key={i}>{seg.valeur}</span>
          }
          return (
            <input
              key={i}
              value={values[idx] ?? ''}
              disabled={done}
              onChange={(e) =>
                setValues((prev) =>
                  prev.map((v, j) => (j === idx ? e.target.value : v)),
                )
              }
              aria-label={`Trou ${idx + 1}`}
              size={Math.max(4, seg.valeur.length)}
              className={cn(
                'mx-1 inline-block rounded-lg border-b-2 bg-muted/40 px-2 py-0.5 text-center text-sm font-bold focus:outline-none',
                done
                  ? gradeTrous(
                      { texte: `[${seg.valeur}]` },
                      [values[idx] ?? ''],
                    )
                    ? 'border-primary text-primary'
                    : 'border-destructive text-destructive'
                  : 'border-primary/40 text-foreground focus:border-primary',
              )}
            />
          )
        })}
      </p>
      {!done ? (
        <button
          type="button"
          disabled={values.some((v) => v.trim().length === 0)}
          onClick={validate}
          className="font-heading mt-3 w-full cursor-pointer rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-50"
        >
          Valider
        </button>
      ) : (
        <Verdict
          correct={correct}
          expected={correct ? null : trousAnswers(content.texte).join(', ')}
        />
      )}
    </div>
  )
}

function LibrePlayer({
  content,
  onAnswered,
}: {
  content: LibreContent
  onAnswered: (r: PlayerResult) => void
}) {
  const [value, setValue] = useState('')
  const [done, setDone] = useState(false)
  const correct = done ? gradeLibre(content, value) : false

  const validate = () => {
    if (done || value.trim().length === 0) return
    const isCorrect = gradeLibre(content, value)
    setDone(true)
    if (isCorrect) sfx.correct()
    else sfx.wrong()
    onAnswered({ correct: isCorrect, given: { value } })
  }

  return (
    <div>
      <p className="font-heading text-base leading-snug font-extrabold text-foreground">
        {content.enonce}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          validate()
        }}
      >
        <input
          value={value}
          disabled={done}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ta réponse…"
          aria-label="Ta réponse"
          className="mt-3 w-full rounded-2xl border border-black/10 bg-white px-3.5 py-3 text-sm font-semibold text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
        />
        {!done ? (
          <button
            type="submit"
            disabled={value.trim().length === 0}
            className="font-heading mt-3 w-full cursor-pointer rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-50"
          >
            Valider
          </button>
        ) : null}
      </form>
      {done ? (
        <Verdict
          correct={correct}
          expected={correct ? null : content.reponses[0] ?? null}
        />
      ) : null}
    </div>
  )
}

/**
 * Joue UNE question (tous types) : réponse, correction immédiate, feedback.
 * Utilisé par le mode révision et par l'aperçu de l'éditeur.
 */
export default function QuestionPlayer({ type, content, onAnswered }: PlayerProps) {
  if (type === 'qcm') {
    return <QcmPlayer content={content as QcmContent} onAnswered={onAnswered} />
  }
  if (type === 'flashcard') {
    return (
      <FlashcardPlayer
        content={content as FlashcardContent}
        onAnswered={onAnswered}
      />
    )
  }
  if (type === 'vrai_faux') {
    return (
      <VraiFauxPlayer
        content={content as VraiFauxContent}
        onAnswered={onAnswered}
      />
    )
  }
  if (type === 'texte_a_trous') {
    return (
      <TrousPlayer content={content as TrousContent} onAnswered={onAnswered} />
    )
  }
  return <LibrePlayer content={content as LibreContent} onAnswered={onAnswered} />
}
