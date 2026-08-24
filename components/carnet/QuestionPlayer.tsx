'use client'

import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, RotateCw, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  gradeLibre,
  gradeQcm,
  gradeTrous,
  gradeVraiFaux,
  gradeAppariement,
  gradeOrdre,
  gradeNumerique,
  parseTrous,
  trousAnswers,
  type CourseQuestionType,
  type FlashcardContent,
  type LibreContent,
  type QcmContent,
  type QuestionContent,
  type TrousContent,
  type VraiFauxContent,
  type AppariementContent,
  type OrdreContent,
  type NumeriqueContent,
} from '@/lib/carnet-cours'
import {
  grainDe,
  VERDICT_LABEL,
  type Verdict,
} from '@/lib/carnet/planification'
import Formule from '@/components/carnet/Formule'
import BoutonEcouter from '@/components/carnet/BoutonEcouter'

export type PlayerResult = {
  correct: boolean
  /**
   * Le verdict CHOISI par l'élève — flashcards uniquement, où personne ne peut
   * corriger « te rappelais-tu ce mot ? » à sa place. `null` partout ailleurs :
   * le serveur re-corrige et en déduit le verdict lui-même.
   */
  verdict: Verdict | null
  given: unknown
}

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
    onAnswered({ correct: isCorrect, verdict: null, given: { selected } })
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

/**
 * Les quatre verdicts d'une flashcard, dans l'ordre où on les lit : du plus
 * sévère au plus léger. Les couleurs suivent les rôles de la DA — corail pour
 * l'échec, violet pour l'action ordinaire, jaune pour le gain.
 */
const VERDICTS_JOUABLES: {
  id: Verdict
  aide: string
  classe: string
}[] = [
  {
    id: 'encore',
    aide: 'je ne savais pas',
    classe: 'bg-destructive/10 text-destructive',
  },
  {
    id: 'difficile',
    aide: 'de justesse',
    classe: 'bg-muted text-foreground',
  },
  {
    id: 'bien',
    aide: 'je savais',
    classe: 'bg-primary text-primary-foreground',
  },
  {
    id: 'facile',
    aide: 'les yeux fermés',
    classe: 'bg-highlight text-foreground',
  },
]

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
          <span className="flex items-center gap-1.5">
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-muted-foreground uppercase">
              {LANG_LABEL[lang] ?? lang}
            </span>
          </span>
        ) : null}
        <Formule
          texte={face}
          className="font-heading text-center text-lg leading-snug font-extrabold whitespace-pre-wrap text-foreground"
        />
        <span className="mt-1 flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
          <RotateCw className="size-3.5" aria-hidden="true" />
          {flipped ? 'Verso — touche pour revenir' : 'Touche pour retourner'}
        </span>
      </button>

      {/* L'écoute vit À CÔTÉ de la carte, jamais dedans : un bouton dans un
          bouton n'est ni cliquable au clavier ni annonçable proprement. */}
      {lang ? (
        <div className="mt-2 flex justify-center">
          <BoutonEcouter texte={face} langue={lang} />
        </div>
      ) : null}

      {/* Auto-évaluation à QUATRE verdicts, une fois le verso vu.
          Deux boutons (« À revoir » / « Je savais ») ne disaient au moteur
          qu'un booléen : impossible de distinguer la carte arrachée de justesse
          de celle qu'on récite les yeux fermés. Elles avançaient donc au même
          rythme. Ces quatre-là sont exactement ce que le planificateur attend. */}
      {flipped && !done ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {VERDICTS_JOUABLES.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                sfx.tap()
                setDone(true)
                onAnswered({
                  correct: v.id !== 'encore',
                  verdict: v.id,
                  given: { selfEval: v.id },
                })
              }}
              className={cn(
                'font-heading cursor-pointer rounded-2xl px-3 py-3 text-sm font-extrabold transition active:translate-y-px',
                v.classe,
              )}
            >
              <span className="block">{VERDICT_LABEL[v.id]}</span>
              <span className="block text-[10px] font-bold opacity-70">
                {v.aide}
              </span>
            </button>
          ))}
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
    onAnswered({ correct: isCorrect, verdict: null, given: { value } })
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
    onAnswered({ correct: isCorrect, verdict: null, given: { values } })
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
    onAnswered({ correct: isCorrect, verdict: null, given: { value } })
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
/**
 * Mélange déterministe d'une liste, à partir d'une graine — l'ordre affiché
 * d'un appariement ou d'une remise en ordre ne doit pas changer à chaque rendu
 * de React, sinon les éléments sautent sous le doigt de l'élève.
 */
function ordreMelange(n: number, graine: string): number[] {
  return Array.from({ length: n }, (_, i) => i)
    .map((i) => ({ i, g: grainDe(`${graine}:${i}`) }))
    .sort((a, b) => a.g - b.g)
    .map((x) => x.i)
}

function AppariementPlayer({
  content,
  onAnswered,
}: {
  content: AppariementContent
  onAnswered: (r: PlayerResult) => void
}) {
  const n = content.paires.length
  // La colonne de droite est mélangée : sans ça, « relier » consisterait à
  // suivre les lignes dans l'ordre.
  const [melange] = useState(() =>
    ordreMelange(n, content.paires.map((p) => p.gauche).join('|')),
  )
  const [liens, setLiens] = useState<(number | null)[]>(() =>
    Array.from({ length: n }, () => null),
  )
  const [enCours, setEnCours] = useState<number | null>(null)
  const [done, setDone] = useState(false)

  const complet = liens.every((l) => l !== null)
  const isCorrect = complet && gradeAppariement(content, liens as number[])

  const choisirDroite = (indexOrigine: number) => {
    if (done || enCours === null) return
    sfx.tap()
    // Une droite déjà prise ailleurs est libérée : deux gauches sur la même
    // droite doivent se voir, pas se superposer en silence.
    setLiens((l) =>
      l.map((v, i) =>
        i === enCours ? indexOrigine : v === indexOrigine ? null : v,
      ),
    )
    setEnCours(null)
  }

  return (
    <div>
      {content.enonce.length > 0 ? (
        <Formule
          texte={content.enonce}
          className="font-heading mb-3 block text-base leading-snug font-extrabold whitespace-pre-wrap text-foreground"
        />
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <ul className="flex flex-col gap-1.5">
          {content.paires.map((p, i) => (
            <li key={i}>
              <button
                type="button"
                disabled={done}
                onClick={() => {
                  sfx.tap()
                  setEnCours(enCours === i ? null : i)
                }}
                aria-pressed={enCours === i}
                className={cn(
                  'w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm font-bold transition disabled:cursor-default',
                  enCours === i
                    ? 'bg-primary text-primary-foreground'
                    : liens[i] !== null
                      ? 'bg-primary/10 text-foreground'
                      : 'bg-muted/60 text-foreground',
                )}
              >
                <Formule texte={p.gauche} />
                {liens[i] !== null ? (
                  <span className="mt-0.5 block truncate text-[10px] font-semibold opacity-70">
                    → {content.paires[liens[i] as number].droite}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-1.5">
          {melange.map((indexOrigine) => {
            const pris = liens.includes(indexOrigine)
            return (
              <li key={indexOrigine}>
                <button
                  type="button"
                  disabled={done || enCours === null}
                  onClick={() => choisirDroite(indexOrigine)}
                  className={cn(
                    'w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm font-bold transition disabled:opacity-50',
                    pris
                      ? 'bg-primary/10 text-foreground'
                      : 'bg-muted/60 text-foreground',
                  )}
                >
                  <Formule texte={content.paires[indexOrigine].droite} />
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {!done ? (
        <button
          type="button"
          disabled={!complet}
          onClick={() => {
            setDone(true)
            onAnswered({ correct: isCorrect, verdict: null, given: { liens } })
          }}
          className="font-heading mt-3 w-full cursor-pointer rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground disabled:opacity-50"
        >
          Valider
        </button>
      ) : (
        <Verdict correct={isCorrect} feedback={null} />
      )}
    </div>
  )
}

function OrdrePlayer({
  content,
  onAnswered,
}: {
  content: OrdreContent
  onAnswered: (r: PlayerResult) => void
}) {
  const n = content.elements.length
  const [ordre, setOrdre] = useState<number[]>(() =>
    ordreMelange(n, content.elements.join('|')),
  )
  const [done, setDone] = useState(false)
  const isCorrect = gradeOrdre(content, ordre)

  const deplacer = (i: number, delta: number) => {
    const j = i + delta
    if (done || j < 0 || j >= n) return
    sfx.tap()
    setOrdre((o) => {
      const copie = [...o]
      const tampon = copie[i]
      copie[i] = copie[j]
      copie[j] = tampon
      return copie
    })
  }

  return (
    <div>
      {content.enonce.length > 0 ? (
        <Formule
          texte={content.enonce}
          className="font-heading mb-3 block text-base leading-snug font-extrabold whitespace-pre-wrap text-foreground"
        />
      ) : null}

      <ul className="flex flex-col gap-1.5">
        {ordre.map((indexOrigine, i) => (
          <li
            key={indexOrigine}
            className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2"
          >
            <span className="w-5 shrink-0 text-center text-[11px] font-extrabold text-muted-foreground tabular-nums">
              {i + 1}
            </span>
            <Formule
              texte={content.elements[indexOrigine]}
              className="min-w-0 flex-1 text-sm font-bold text-foreground"
            />
            <span className="flex shrink-0 flex-col">
              <button
                type="button"
                disabled={done || i === 0}
                onClick={() => deplacer(i, -1)}
                aria-label={`Monter l’élément ${i + 1}`}
                className="cursor-pointer px-1 text-muted-foreground disabled:opacity-30"
              >
                <ChevronUp className="size-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                disabled={done || i === n - 1}
                onClick={() => deplacer(i, 1)}
                aria-label={`Descendre l’élément ${i + 1}`}
                className="cursor-pointer px-1 text-muted-foreground disabled:opacity-30"
              >
                <ChevronDown className="size-3.5" aria-hidden="true" />
              </button>
            </span>
          </li>
        ))}
      </ul>

      {!done ? (
        <button
          type="button"
          onClick={() => {
            setDone(true)
            onAnswered({ correct: isCorrect, verdict: null, given: { ordre } })
          }}
          className="font-heading mt-3 w-full cursor-pointer rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground"
        >
          Valider
        </button>
      ) : (
        <Verdict
          correct={isCorrect}
          feedback={null}
          expected={isCorrect ? undefined : content.elements.join(' → ')}
        />
      )}
    </div>
  )
}

function NumeriquePlayer({
  content,
  onAnswered,
}: {
  content: NumeriqueContent
  onAnswered: (r: PlayerResult) => void
}) {
  const [valeur, setValeur] = useState('')
  const [done, setDone] = useState(false)
  // La virgule est ce que tape un élève français, le point ce que comprend
  // JavaScript. Refuser « 3,14 » reviendrait à corriger le clavier.
  const nombre = Number(valeur.replace(',', '.').trim())
  const isCorrect = gradeNumerique(content, nombre)

  const valider = () => {
    if (done || valeur.trim().length === 0) return
    setDone(true)
    onAnswered({ correct: isCorrect, verdict: null, given: { valeur: nombre } })
  }

  return (
    <div>
      <Formule
        texte={content.enonce}
        className="font-heading mb-3 block text-base leading-snug font-extrabold whitespace-pre-wrap text-foreground"
      />
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          value={valeur}
          disabled={done}
          onChange={(e) => setValeur(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') valider()
          }}
          placeholder="Ta réponse"
          aria-label="Réponse chiffrée"
          className="min-h-12 min-w-0 flex-1 rounded-2xl border border-black/10 bg-white px-4 text-base font-semibold text-foreground outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-70"
        />
        {content.unite ? (
          <span className="shrink-0 text-sm font-extrabold text-muted-foreground">
            {content.unite}
          </span>
        ) : null}
      </div>

      {!done ? (
        <button
          type="button"
          disabled={valeur.trim().length === 0}
          onClick={valider}
          className="font-heading mt-3 w-full cursor-pointer rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground disabled:opacity-50"
        >
          Valider
        </button>
      ) : (
        <Verdict
          correct={isCorrect}
          feedback={null}
          expected={
            isCorrect
              ? undefined
              : `${content.valeur}${content.unite ? ` ${content.unite}` : ''}`
          }
        />
      )}
    </div>
  )
}

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
  if (type === 'appariement') {
    return (
      <AppariementPlayer
        content={content as AppariementContent}
        onAnswered={onAnswered}
      />
    )
  }
  if (type === 'remise_en_ordre') {
    return (
      <OrdrePlayer content={content as OrdreContent} onAnswered={onAnswered} />
    )
  }
  if (type === 'numerique') {
    return (
      <NumeriquePlayer
        content={content as NumeriqueContent}
        onAnswered={onAnswered}
      />
    )
  }
  return <LibrePlayer content={content as LibreContent} onAnswered={onAnswered} />
}
