'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { recordTestSession } from '@/app/test/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import { sfx, buzz } from '@/lib/sounds'
import { autoAdvanceDelay, bestStreak, COMBO_HOT } from '@/lib/juice'
import { missedQuestions, canRetryMissed } from '@/lib/quiz-retry'
import ComboBadge from '@/components/ComboBadge'
import { sessionXp } from '@/lib/xp'
import { SoundToggle } from '@/components/FlashcardPlayer'
import BackButton from '@/components/BackButton'
import QuitGuardButton from '@/components/QuitGuardButton'
import ProgressRing from '@/components/ProgressRing'
import { CircleCheck, CircleX, RotateCcw, ArrowLeft, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { QuizQuestion } from '@/lib/types'

// Session de quiz (template « structure des cours ») : à chaque réponse, l'élève
// voit tout de suite si c'est juste ou faux, la bonne réponse et l'explication,
// puis passe à la suivante d'un tap. Le score + le récap complet restent à la
// fin. (L'examen blanc, lui, garde la correction différée — autre composant.)

// Message de la mascotte selon le score.
function verdict(ratio: number): { emoji: string; message: string } {
  if (ratio >= 1) return { emoji: '🤩', message: 'Parfait, sans faute ! Tu maîtrises cette leçon.' }
  if (ratio >= 0.8) return { emoji: '😎', message: 'Excellent ! Encore un petit effort pour le sans-faute.' }
  if (ratio >= 0.5) return { emoji: '🙂', message: 'Pas mal ! Relis la correction et retente ta chance.' }
  return { emoji: '😮', message: 'Aïeee… Tu peux faire mieux ! On recommence ?' }
}

export default function QuizPlayer({
  quizId,
  title,
  questions: allQuestions,
  subject = null,
  backHref = '/reviser',
  record = true,
}: {
  quizId: string
  title: string
  questions: QuizQuestion[]
  subject?: string | null
  backHref?: string
  // `false` pour un quiz PERSONNEL (bibliothèque) : on ne l'enregistre pas comme
  // une session de catalogue (quiz_id absent de `quizzes` → violerait la FK) et
  // il ne doit pas gonfler l'XP / la file « À revoir ».
  record?: boolean
}) {
  // Le paquet EN COURS. Il vaut le quiz complet, sauf après « Revoir mes
  // erreurs », où il ne contient plus que les questions ratées.
  const [questions, setQuestions] = useState<QuizQuestion[]>(allQuestions)
  const [index, setIndex] = useState(0)
  // Choix de l'élève, question par question — la correction se lit dedans.
  const [choices, setChoices] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  // Bonnes réponses d'affilée (remise à zéro à la première erreur).
  const [streak, setStreak] = useState(0)
  // Meilleure série de la session : sans elle, un « Inarrêtable ×8 » atteint en
  // cours de route ne laisse aucune trace sur l'écran de fin.
  const [best, setBest] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)

  const question = questions[index]
  // Rejeu partiel : le paquet en cours ne couvre plus tout le quiz.
  const isPartial = questions.length < allQuestions.length

  // Réponses de la session pour la répétition espacée (SRS + Revanche) —
  // envoyées en une fois à la fin, en « fire and forget ».
  const reviewsRef = useRef<ReviewAnswer[]>([])
  // Garde anti-double-soumission : un double-tap rapide sur « Continuer » de la
  // dernière question pourrait franchir le garde `selected` (state périmé) et
  // enregistrer la session deux fois.
  const finishedRef = useRef(false)
  // Verrou synchrone anti double-tap sur une option : `selected` (state) ne se
  // met à jour qu'au prochain rendu ; sans ce ref, deux taps rapprochés
  // pousseraient une réponse en double dans reviewsRef. Relâché à la suivante.
  const lockedRef = useRef(false)

  const finish = (allChoices: number[]) => {
    if (finishedRef.current) return
    finishedRef.current = true
    const score = allChoices.reduce(
      (s, choice, i) => s + (choice === questions[i].correct_index ? 1 : 0),
      0,
    )
    setFinished(true)
    sfx.complete()
    // Quiz personnel (bibliothèque) : on ne persiste rien (ni session, ni SRS).
    if (!record) return

    // ⚠️ Un REJEU DES ERREURS n'est PAS une session de quiz. `lib/mastery.ts`
    // agrège le MEILLEUR RATIO par quiz : enregistrer un 2/2 obtenu sur les
    // seules questions ratées ferait passer le chapitre à 100 % — donc
    // « maîtrisé », couronne comprise — alors que l'élève avait fait 8/10.
    // On garde donc l'entraînement (SRS, ci-dessous) sans la comptabilité.
    if (!isPartial) {
      recordTestSession(quizId, score, questions.length)
        .then((r) => setSaved(r.saved))
        .catch(() => setSaved(false))
    }
    // La file « À revoir » est reprogrammée dans TOUS les cas : elle raisonne
    // par question, pas par session — retravailler une erreur est justement
    // l'information la plus utile qu'on puisse lui donner.
    recordReviewAnswers(reviewsRef.current).catch(() => {})
  }

  // Répondre : on révèle tout de suite le résultat (juste/faux, bonne réponse,
  // explication) et on attend un tap « Continuer » pour avancer.
  const choose = (optionIndex: number) => {
    if (selected !== null || lockedRef.current) return
    lockedRef.current = true
    setSelected(optionIndex)
    const good = optionIndex === question.correct_index
    // Série en cours : la récompense MONTE tant qu'on enchaîne, et retombe net
    // à la première erreur. C'est ce qui donne envie de continuer.
    const nextStreak = good ? streak + 1 : 0
    setStreak(nextStreak)
    setBest((b) => bestStreak(b, nextStreak))
    if (good) sfx.correctCombo(nextStreak)
    else sfx.wrong()
    buzz(good, nextStreak)
    reviewsRef.current.push({
      kind: 'question',
      id: question.id,
      subject,
      good,
    })
  }

  // Passer à la suite (ou terminer) une fois le feedback lu.
  const advance = () => {
    if (selected === null) return
    const next = [...choices, selected]
    setChoices(next)
    setSelected(null)
    if (next.length >= questions.length) finish(next)
    else {
      setIndex((i) => i + 1)
      lockedRef.current = false
    }
  }

  // Toujours la DERNIÈRE version d'`advance` (elle capture `choices`/`selected`).
  // Mise à jour dans un effet, jamais pendant le rendu : écrire un ref pendant
  // le rendu casse les garanties du rendu concurrent de React.
  const advanceRef = useRef(advance)
  useEffect(() => {
    advanceRef.current = advance
  })

  // Enchaînement automatique : sur une bonne réponse sans explication à lire,
  // le tap « Continuer » n'apporte rien et casse le rythme dix fois par
  // session. On enchaîne donc seul — jamais après une erreur ni quand il y a
  // une explication, où la pause sert vraiment à comprendre. Le bouton reste
  // là : un élève qui tape plus vite que le délai garde la main, et le
  // nettoyage évite un double `advance()`.
  useEffect(() => {
    if (selected === null) return
    const good = selected === question.correct_index
    const delay = autoAdvanceDelay(good, Boolean(question.explanation))
    if (delay === null) return
    const t = setTimeout(() => advanceRef.current(), delay)
    // `advance` passe par un ref : le garder hors des deps évite de relancer le
    // minuteur à chaque rendu (ce qui rallongerait le délai indéfiniment).
    return () => clearTimeout(t)
  }, [selected, question])

  // Repart sur un paquet donné (le quiz entier, ou seulement les erreurs).
  const replay = (deck: QuizQuestion[]) => {
    setQuestions(deck)
    setIndex(0)
    setChoices([])
    setSelected(null)
    setStreak(0)
    setBest(0)
    setFinished(false)
    setSaved(null)
    reviewsRef.current = []
    finishedRef.current = false
    lockedRef.current = false
  }

  const restart = () => replay(allQuestions)

  // ---------------------------------------------------------------------------
  // Écran final : score + correction complète, scrollable (template).
  // ---------------------------------------------------------------------------
  if (finished) {
    const score = choices.reduce(
      (s, choice, i) => s + (choice === questions[i].correct_index ? 1 : 0),
      0,
    )
    const ratio = questions.length > 0 ? score / questions.length : 0
    const missed = missedQuestions(questions, choices)
    const v = verdict(ratio)

    return (
      <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
        {/* Volet score, aux couleurs du quiz */}
        <div className="bg-primary px-4 pt-16 pb-10 text-primary-foreground md:px-8 md:pt-12">
          <div className="mx-auto w-full max-w-xl">
            <BackButton
              fallback={backHref}
              label="Quitter le quiz"
              className="mb-4 bg-white/15 text-primary-foreground shadow-none"
            >
              <X className="size-5" aria-hidden="true" />
            </BackButton>

            <div className="rounded-3xl bg-black/15 p-6 text-center">
              <h1 className="font-heading text-xl font-bold">Score du quiz</h1>
              <p className="mt-3 font-mono text-6xl font-bold tabular-nums">
                {score}
                <span className="text-2xl opacity-60"> / {questions.length}</span>
              </p>

              {/* Une pastille par question : vert = juste, rouge = faux */}
              <div
                className="mt-5 flex flex-wrap justify-center gap-1.5"
                aria-label={`${score} bonne${score > 1 ? 's' : ''} réponse${score > 1 ? 's' : ''} sur ${questions.length}`}
              >
                {questions.map((q, i) => (
                  <span
                    key={q.id}
                    aria-hidden="true"
                    className={cn(
                      'h-2.5 w-5 rounded-full',
                      choices[i] === q.correct_index
                        ? 'bg-success'
                        : 'bg-destructive',
                    )}
                  />
                ))}
              </div>

              {/* XP gagnée : la récompense existait déjà (10 XP par bonne
                  réponse + 20 de session) mais n'était affichée NULLE PART —
                  l'élève gagnait sans le savoir. C'est le moment de le dire. */}
              {record && !isPartial ? (
                <p className="font-heading mt-4 text-lg font-extrabold text-highlight">
                  +{sessionXp('quiz', score, questions.length)} XP
                </p>
              ) : null}

              {isPartial ? (
                <p className="mt-4 text-sm opacity-80">
                  Séance d&apos;entraînement : elle ne recompte pas dans ton
                  score du quiz, mais tes erreurs sont bien reprogrammées.
                </p>
              ) : null}

              {best >= COMBO_HOT ? (
                <p className="mt-2 text-sm font-semibold opacity-90">
                  🔥 Meilleure série : {best} d&apos;affilée
                </p>
              ) : null}

              {/* La mascotte réagit au score */}
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/10 p-4 text-left">
                <span className="text-4xl leading-none" aria-hidden="true">
                  {v.emoji}
                </span>
                <p className="text-sm font-semibold">{v.message}</p>
              </div>

              {saved === true ? (
                <p className="mt-3 text-xs opacity-80">
                  ✓ Session enregistrée — ta série continue 🔥
                </p>
              ) : saved === false ? (
                <p className="mt-3 text-xs opacity-80">
                  <Link href="/login" className="underline underline-offset-4">
                    Connecte-toi
                  </Link>{' '}
                  pour sauvegarder ta progression.
                </p>
              ) : null}
            </div>

            {/* « Revoir mes erreurs » d'abord : refaire les 8 questions déjà
                sues pour retravailler les 2 ratées, personne ne le fait — et
                les 2 ratées sont pourtant le seul contenu utile de la session. */}
            {canRetryMissed(questions.length, missed.length) ? (
              <Button
                onClick={() => replay(missed)}
                className="mt-4 w-full rounded-full bg-card text-foreground shadow-md hover:bg-card/90"
                size="lg"
              >
                <RotateCcw className="size-4" /> Revoir mes {missed.length}{' '}
                erreur{missed.length > 1 ? 's' : ''}
              </Button>
            ) : null}

            <Button
              onClick={restart}
              variant={
                canRetryMissed(questions.length, missed.length)
                  ? 'ghost'
                  : 'default'
              }
              className={cn(
                'mt-2 w-full rounded-full',
                canRetryMissed(questions.length, missed.length)
                  ? 'text-primary-foreground hover:bg-white/10'
                  : 'bg-card text-foreground shadow-md hover:bg-card/90',
              )}
              size="lg"
            >
              <RotateCcw className="size-4" />{' '}
              {questions.length === allQuestions.length
                ? 'Recommencer'
                : 'Refaire le quiz entier'}
            </Button>
          </div>
        </div>

        {/* Correction détaillée, scrollable */}
        <div className="relative -mt-4 rounded-t-3xl bg-background">
          <div className="mx-auto w-full max-w-xl px-4 pt-4 pb-24 md:px-8">
            <div
              className="mx-auto h-1.5 w-12 rounded-full bg-muted-foreground/30"
              aria-hidden="true"
            />
            <h2 className="font-heading mt-4 text-center text-2xl font-bold">
              Correction
            </h2>

            <ol className="mt-6 flex flex-col gap-4">
              {questions.map((q, i) => {
                const chosen = choices[i]
                const good = chosen === q.correct_index
                return (
                  <li
                    key={q.id}
                    className="rounded-3xl border bg-card p-5 shadow-sm"
                  >
                    <p className="flex gap-3 font-semibold">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="min-w-0">{q.question}</span>
                    </p>

                    <div className="mt-4 flex flex-col gap-2">
                      {/* La bonne réponse, toujours montrée */}
                      <p className="flex items-center gap-2.5 rounded-2xl bg-success/10 px-4 py-3 text-sm font-medium text-success">
                        <CircleCheck
                          className="size-5 shrink-0 fill-success text-white"
                          aria-hidden="true"
                        />
                        <span className="min-w-0">
                          <span className="sr-only">Bonne réponse : </span>
                          {q.options[q.correct_index]}
                        </span>
                      </p>
                      {/* Le choix de l'élève, seulement s'il était faux */}
                      {!good && chosen !== undefined && q.options[chosen] !== undefined ? (
                        <p className="flex items-center gap-2.5 rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                          <CircleX
                            className="size-5 shrink-0 fill-destructive text-white"
                            aria-hidden="true"
                          />
                          <span className="min-w-0">
                            <span className="sr-only">Ta réponse : </span>
                            {q.options[chosen]}
                          </span>
                        </p>
                      ) : null}
                    </div>

                    {q.explanation ? (
                      <div className="mt-4 border-t border-dashed pt-4">
                        <h3 className="text-sm font-bold">Explication</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {q.explanation}
                        </p>
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ol>

            <Button variant="outline" asChild className="mt-6 w-full rounded-full">
              <Link href={backHref}>
                <ArrowLeft className="size-4" /> Retour aux révisions
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // Écran de question : plein écran, feedback immédiat à la réponse.
  // ---------------------------------------------------------------------------
  const answered = selected !== null
  const isCorrect = selected === question.correct_index
  const isLast = index + 1 >= questions.length
  return (
    // data-no-swipe : pendant une question, le balayage d'onglet (SwipeTabs)
    // est neutralisé — sinon un glissé du pouce quitte le quiz sans passer par
    // la garde de sortie et la session est perdue.
    <div
      data-no-swipe
      className="-mx-4 -mt-16 flex min-h-svh flex-col bg-primary px-4 pt-16 pb-24 text-primary-foreground md:-mx-8 md:-mt-10 md:px-8 md:pt-12"
    >
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <div className="flex items-center justify-between">
          <QuitGuardButton
            fallback={backHref}
            label="Quitter le quiz"
            className="bg-white/15 text-primary-foreground shadow-none"
          >
            <X className="size-5" aria-hidden="true" />
          </QuitGuardButton>
          <span className="sr-only">{title}</span>
          <SoundToggle />
        </div>

        {/* Badge de SÉRIE : n'apparaît qu'à partir de 2 bonnes réponses
            d'affilée, grossit avec le palier, et disparaît net à la première
            erreur. C'est la récompense visible qui accompagne la montée du son. */}
        {/* La région `aria-live` reste TOUJOURS montée : un lecteur d'écran
            n'annonce que les CHANGEMENTS d'une région déjà présente. Si elle
            apparaissait en même temps que son texte, l'annonce serait ratée. */}
        <div className="flex min-h-7 justify-center" aria-live="polite">
          <ComboBadge streak={streak} variant="arene" />
        </div>

        {/* Anneau de progression : « Question N/10 » */}
        <div className="z-10 -mb-10 flex justify-center">
          <ProgressRing
            value={(index + (selected !== null ? 1 : 0)) / questions.length}
            size={104}
            strokeWidth={7}
            label={`Question ${index + 1} sur ${questions.length}`}
            trackClassName="stroke-black/25"
            fillClassName="stroke-highlight"
          >
            <span className="flex size-[82px] flex-col items-center justify-center rounded-full bg-black/20 text-center">
              <span className="text-xs font-medium opacity-80">Question</span>
              <span className="font-mono text-lg font-bold tabular-nums">
                {index + 1}/{questions.length}
              </span>
            </span>
          </ProgressRing>
        </div>

        {/* La question */}
        <div className="rounded-3xl bg-card px-5 pt-14 pb-8 text-center shadow-md">
          <p className="font-heading text-lg font-bold text-balance text-foreground">
            {question.question}
          </p>
          {question.kind === 'true_false' ? (
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              Vrai ou faux ?
            </p>
          ) : null}
        </div>

        {/* Les réponses : au tap, on révèle juste/faux + la bonne réponse. */}
        <div className="mt-5 flex flex-col gap-3" role="group" aria-label="Réponses">
          {question.options.map((option, i) => {
            const isTheAnswer = i === question.correct_index
            const isMyPick = i === selected
            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                disabled={answered}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-2xl px-5 py-4 text-left text-sm font-semibold shadow-md transition-all',
                  !answered &&
                    'bg-card text-foreground hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]',
                  // Après réponse : la bonne en vert, le mauvais choix en rouge.
                  answered && isTheAnswer && 'bg-success text-white',
                  answered && !isTheAnswer && isMyPick && 'bg-destructive text-white',
                  answered && !isTheAnswer && !isMyPick && 'bg-card text-foreground opacity-50',
                )}
              >
                <span className="min-w-0">{option}</span>
                {answered && isTheAnswer ? (
                  <CircleCheck className="size-5 shrink-0" aria-hidden="true" />
                ) : answered && isMyPick ? (
                  <CircleX className="size-5 shrink-0" aria-hidden="true" />
                ) : null}
              </button>
            )
          })}
        </div>

        {/* Feedback + explication + bouton pour continuer. */}
        {answered ? (
          <div className="mt-5">
            <p
              role="status"
              className={cn(
                'font-heading text-center text-lg font-bold',
                isCorrect ? 'text-highlight' : 'text-white',
              )}
            >
              {isCorrect ? '✅ Bonne réponse !' : '❌ Pas tout à fait…'}
            </p>
            {question.explanation ? (
              <p className="mx-auto mt-2 max-w-md rounded-2xl bg-black/20 px-4 py-3 text-center text-sm leading-relaxed text-primary-foreground/90">
                {question.explanation}
              </p>
            ) : null}
            <Button
              onClick={advance}
              size="lg"
              className="mt-5 w-full rounded-full bg-card text-foreground shadow-md hover:bg-card/90"
            >
              {isLast ? 'Voir mon score' : 'Continuer'}
            </Button>
          </div>
        ) : (
          <p className="mt-auto pt-6 text-center text-xs font-medium opacity-70">
            Touche une réponse — le résultat s&apos;affiche aussitôt.
          </p>
        )}
      </div>
    </div>
  )
}
