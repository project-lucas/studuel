'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { recordTestSession } from '@/app/test/actions'
import { recordReviewAnswers } from '@/app/reviser/actions'
import type { ReviewAnswer } from '@/lib/srs'
import { sfx, buzz } from '@/lib/sounds'
import { bestStreak, COMBO_HOT } from '@/lib/juice'
import { missedQuestions, canRetryMissed } from '@/lib/quiz-retry'
import { verdictFor } from '@/lib/verdict'
import ComboBadge from '@/components/ComboBadge'
import { sessionXp } from '@/lib/xp'
import { SoundToggle } from '@/components/FlashcardPlayer'
import BackButton from '@/components/BackButton'
import QuitGuardButton from '@/components/QuitGuardButton'
import ProgressRing from '@/components/ProgressRing'
import AnswerBoard from '@/components/jeux/AnswerBoard'
import { subjectRobe } from '@/lib/subject-style'
import BossApparition from '@/components/defi/BossApparition'
import QuizFeedbackMascotte from '@/components/QuizFeedbackMascotte'
import { feedbackTitle, reactionSrc } from '@/lib/quiz-feedback'
import type { TraqueApparition } from '@/lib/traque'
import { CircleCheck, CircleX, RotateCcw, ArrowLeft, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { QuizQuestion } from '@/lib/types'

// Session de quiz (template « structure des cours ») : à chaque réponse, l'élève
// voit tout de suite si c'est juste ou faux, la bonne réponse et l'explication,
// puis passe à la suivante d'un tap. Le score + le récap complet restent à la
// fin. (L'examen blanc, lui, garde la correction différée — autre composant.)

// Message de la mascotte selon le score.
export default function QuizPlayer({
  quizId,
  title,
  questions: allQuestions,
  subject = null,
  subjectColor = null,
  backHref = '/reviser',
  record = true,
  gradeLevel = null,
}: {
  quizId: string
  title: string
  questions: QuizQuestion[]
  subject?: string | null
  /**
   * Couleur de la matière (`subjects.color`) — elle donne sa ROBE à la session,
   * comme chaque jeu de salon porte la sienne. Absente (quiz personnel, quiz
   * détaché) : repli sur le violet de l'app.
   */
  subjectColor?: string | null
  backHref?: string
  // `false` pour un quiz PERSONNEL (bibliothèque) : on ne l'enregistre pas comme
  // une session de catalogue (quiz_id absent de `quizzes` → violerait la FK) et
  // il ne doit pas gonfler l'XP / la file « À revoir ».
  record?: boolean
  // Classe du quiz : règle le TON du bilan (« Aïeee… » convient à un 6e, pas à
  // un Terminale qui prépare le bac). Absente pour un quiz personnel.
  gradeLevel?: string | null
}) {
  // LA ROBE DE LA SESSION : la couleur de la matière, posée en variables
  // `--jeu-*` (globals.css). Les mêmes que celles des jeux de salon — c'est ce
  // qui fait qu'un quiz et une partie se ressemblent enfin.
  const robe = subjectRobe(subjectColor)

  // Le paquet EN COURS. Il vaut le quiz complet, sauf après « Revoir mes
  // erreurs », où il ne contient plus que les questions ratées.
  const [questions, setQuestions] = useState<QuizQuestion[]>(allQuestions)
  const [index, setIndex] = useState(0)
  // Choix de l'élève, question par question — la correction se lit dedans.
  const [choices, setChoices] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  // Bonnes réponses d'affilée (remise à zéro à la première erreur).
  const [streak, setStreak] = useState(0)
  // Le miroir : erreurs d'affilée, remises à zéro à la première bonne réponse.
  // C'est ce compteur qui fait tomber les cheveux de la mascotte — et sa remise
  // à zéro qui les fait repousser, ce qui est tout le sel du gag.
  const [missStreak, setMissStreak] = useState(0)
  // Meilleure série de la session : sans elle, un « Inarrêtable ×8 » atteint en
  // cours de route ne laisse aucune trace sur l'écran de fin.
  const [best, setBest] = useState(0)
  const [finished, setFinished] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  // La Traque : ce quiz vient-il de faire sortir un gardien de sa tanière ? Le
  // serveur le dit en enregistrant la session ; le rideau s'ouvre par-dessus
  // l'écran de fin, jamais au milieu d'une question.
  const [apparition, setApparition] = useState<TraqueApparition | null>(null)

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
  // Verrou d'avancement, relâché au changement d'`index` (donc après re-rendu).
  const advancingRef = useRef(false)

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
        .then((r) => {
          setSaved(r.saved)
          setApparition(r.apparition)
        })
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
    setMissStreak(good ? 0 : missStreak + 1)
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
    // Verrou synchrone : `selected` (state) est en retard d'un rendu, donc deux
    // taps rapprochés sur « Continuer » franchissent tous deux la garde. Or
    // `setIndex` est un updater FONCTIONNEL : il s'applique deux fois (index+2)
    // alors qu'une SEULE réponse est poussée dans `choices` — tout le reste de
    // la session lit alors `choices[i]` face à la mauvaise question (score,
    // pastilles de correction et « Revoir mes erreurs » faussés). `choose()` et
    // `finish()` avaient déjà leur verrou, pas celui-ci.
    if (selected === null || advancingRef.current) return
    advancingRef.current = true
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
  useEffect(() => {
    advancingRef.current = false
  }, [index])

  // PLUS D'ENCHAÎNEMENT AUTOMATIQUE. Il existait pour les bonnes réponses sans
  // explication à lire, où le tap « Continuer » ne servait à rien. Il se
  // retourne contre la feuille de la mascotte : elle monterait et repartirait
  // avant d'avoir été vue. La feuille étant désormais servie à TOUTES les
  // matières, il n'y a plus un seul cas où enchaîner seul — le tap EST le
  // rythme (c'est le geste de Duolingo). `autoAdvanceDelay` reste dans
  // `lib/juice.ts`, testé, si on veut le rebrancher un jour.

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
    // Le gardien reste sorti, mais son rideau a déjà été joué : le rejeu ne le
    // rouvre pas (la bannière de l'arène prend le relais pendant l'heure).
    setApparition(null)
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
    const v = verdictFor(ratio, gradeLevel)

    return (
      // `key` explicite : sans elle, le démontage de l'écran de question (et
      // donc de l'état de ComboBadge) ne tient qu'à l'alignement positionnel
      // des deux arbres JSX — une coïncidence qu'un simple <div> ajouté plus
      // tard casserait, en faisant réapparaître un badge fantôme.
      <div key="quiz-fin" className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
        {/* La Traque : si ce quiz a fait déborder la jauge, le gardien surgit
            PAR-DESSUS le score. Il se monte en portail (document.body), donc sa
            position dans cet arbre n'a aucune incidence sur la mise en page. */}
        {apparition ? (
          <BossApparition
            apparition={apparition}
            onClose={() => setApparition(null)}
          />
        ) : null}

        {/* Volet score, dans la robe de la matière — même table que l'écran de
            fin d'un jeu de salon. */}
        <div
          className={cn(
            robe,
            'jeu-table px-4 pt-16 pb-10 text-foreground md:px-8 md:pt-12',
          )}
        >
          <div className="mx-auto w-full max-w-xl">
            <BackButton
              fallback={backHref}
              label="Quitter le quiz"
              className="mb-4"
            >
              <X className="size-5" aria-hidden="true" />
            </BackButton>

            <div className="rounded-3xl bg-card p-6 text-center shadow-sm ring-1 ring-black/5">
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

              {/* `record &&` est essentiel : un quiz PERSONNEL (bibliothèque)
                  n'écrit RIEN — ni session, ni SRS (`finish` sort avant
                  `recordReviewAnswers`). Promettre « tes erreurs sont
                  reprogrammées » y serait donc un mensonge pur. */}
              {isPartial ? (
                <p className="mt-4 text-sm opacity-80">
                  {record
                    ? "Séance d'entraînement : elle ne recompte pas dans ton score du quiz, mais tes erreurs sont bien reprogrammées."
                    : "Séance d'entraînement sur tes erreurs."}
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
  // Série en cours DANS LE SENS de la réponse qu'on vient de donner : c'est elle
  // qui choisit l'illustration et le titre. Les deux compteurs sont déjà à jour
  // ici (`choose` les a posés), et l'un des deux vaut forcément 0.
  const run = isCorrect ? streak : missStreak
  return (
    // data-no-swipe : pendant une question, le balayage d'onglet (SwipeTabs)
    // est neutralisé — sinon un glissé du pouce quitte le quiz sans passer par
    // la garde de sortie et la session est perdue.
    <div
      key="quiz-session"
      data-no-swipe
      className={cn(
        robe,
        'jeu-table -mx-4 -mt-16 flex min-h-svh flex-col px-4 pt-16 pb-24 text-foreground md:-mx-8 md:-mt-10 md:px-8 md:pt-12',
      )}
      // La feuille de la mascotte se pose PAR-DESSUS le bas de l'écran : sans
      // cette marge, la dernière réponse disparaîtrait sous elle. Elle tient
      // compte de la mascotte, qui dépasse du panneau de toute sa moitié haute.
      // En ligne (et non en classe) pour la même raison que dans
      // QuizFeedbackMascotte.
      style={answered ? { paddingBottom: '21rem' } : undefined}
    >
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <div className="flex items-center justify-between">
          <QuitGuardButton
            fallback={backHref}
            label="Quitter le quiz"
            className="shadow-sm"
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
          <ComboBadge streak={streak} variant="clair" />
        </div>

        {/* Anneau de progression : « Question N/10 » */}
        <div className="z-10 -mb-10 flex justify-center">
          <ProgressRing
            value={(index + (selected !== null ? 1 : 0)) / questions.length}
            size={104}
            strokeWidth={7}
            label={`Question ${index + 1} sur ${questions.length}`}
            trackClassName="stroke-black/10"
            fillClassName="stroke-[color:var(--jeu-accent)]"
          >
            <span className="flex size-[82px] flex-col items-center justify-center rounded-full bg-card text-center shadow-sm">
              <span className="text-xs font-medium text-muted-foreground">
                Question
              </span>
              <span className="font-mono text-lg font-bold tabular-nums">
                {index + 1}/{questions.length}
              </span>
            </span>
          </ProgressRing>
        </div>

        {/* La question */}
        <div className="rounded-3xl bg-card px-5 pt-14 pb-8 text-center shadow-md ring-1 ring-black/5">
          <p className="font-heading text-lg font-bold text-balance text-foreground">
            {question.question}
          </p>
          {question.kind === 'true_false' ? (
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              Vrai ou faux ?
            </p>
          ) : null}
        </div>

        {/* LES RÉPONSES — le plateau des jeux de salon, à l'identique.
            Le quiz avait le sien : des pastilles qui viraient à l'APLAT vert ou
            rouge saturé, quand la table de jeu, elle, teinte la bonne réponse et
            la cerne. Deux grammaires du même verdict, dans la même app. C'est
            désormais un seul composant : ce qu'on corrige d'un côté profite à
            l'autre, et un élève n'a plus à réapprendre à lire un écran de
            questions selon la porte par laquelle il est entré. */}
        <div className="mt-5" role="group" aria-label="Réponses">
          <AnswerBoard
            options={question.options}
            correctIndex={question.correct_index}
            selected={selected}
            revealed={answered}
            layout="liste"
            onAnswer={choose}
          />
        </div>

        {/* Feedback + explication + bouton pour continuer. La feuille porte
            désormais TOUT le retour après réponse, pour toutes les matières :
            l'ancien bandeau en ligne (« ✅ Bonne réponse ! ») n'avait plus
            aucun cas d'usage une fois le pilote généralisé. */}
        <QuizFeedbackMascotte
          open={answered}
          good={isCorrect}
          imageSrc={reactionSrc(isCorrect, run)}
          title={feedbackTitle(isCorrect, run, question.id)}
          correctAnswer={question.options[question.correct_index]}
          explanation={question.explanation}
          ctaLabel={isLast ? 'Voir mon score' : 'Continuer'}
          onContinue={advance}
        />
      </div>
    </div>
  )
}
