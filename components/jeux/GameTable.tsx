'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import ModeStage from '@/components/defi/ModeStage'
import AnswerBoard from '@/components/jeux/AnswerBoard'
import GameHud from '@/components/jeux/GameHud'
import GameOutcome from '@/components/jeux/GameOutcome'
import {
  GameCountdown,
  GameIntro,
  GameQuitLink,
} from '@/components/jeux/GameShell'
import { MECHANIC_ICON } from '@/components/jeux/icons'
import { cn } from '@/lib/utils'
import { gameSfx, sfx, buzz } from '@/lib/sounds'
import { AUTO_ADVANCE_MS } from '@/lib/juice'
import { recordChallenge } from '@/app/defi/actions'
import type { ModeQuestion } from '@/lib/defi-modes'
import type { GameFormat } from '@/lib/jeux/formats'
import {
  answer as applyAnswer,
  globalSeconds,
  globalTimeUp,
  questionSeconds,
  startRun,
  timeout as applyTimeout,
  type GameRun,
} from '@/lib/jeux/run'

type Phase = 'intro' | 'countdown' | 'playing' | 'done'

// Le chrono tourne à 10 Hz : assez fin pour que la jauge glisse, assez lâche
// pour ne pas réveiller le téléphone 60 fois par seconde.
const TICK_MS = 100
// Sous ce seuil (secondes), le chrono d'une question se met à biper.
const URGENT_FROM = 3

function bestKey(id: string) {
  return `studuel-jeu-${id}-best`
}

function readBest(id: string): number {
  try {
    return Number(window.localStorage.getItem(bestKey(id))) || 0
  } catch {
    return 0
  }
}

/**
 * La TABLE DE JEU d'un salon : elle joue le format que `lib/jeux/formats` décrit
 * — sa mécanique, son rythme, sa robe, son timbre — sur la banque de questions
 * du jeu.
 *
 * Avant elle, tous les jeux de salon partageaient un unique duel BO3 : on cliquait
 * sur une illustration de chasse au trésor et on retombait sur la même partie
 * que la veille. Ici, deux jeux ne se jouent, ne se lisent et ne s'entendent
 * jamais pareil, parce que tout vient du format et rien n'est écrit en dur.
 */
export default function GameTable({
  format,
  pool,
  name,
  subject,
  subjectEmoji,
}: {
  format: GameFormat
  pool: ModeQuestion[]
  name: string
  subject: string
  subjectEmoji: string
}) {
  const router = useRouter()
  const audio = useMemo(() => gameSfx(format.timbre), [format.timbre])

  const [phase, setPhase] = useState<Phase>('intro')
  const [count, setCount] = useState(3)
  const [run, setRun] = useState<GameRun>(() => startRun(format))
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [shake, setShake] = useState(0)
  const [best, setBest] = useState(0)
  const [isRecord, setIsRecord] = useState(false)
  const [saved, setSaved] = useState<boolean | null>(null)
  // XP réellement versée, renvoyée par le serveur (null tant qu'il n'a pas répondu).
  const [awardedXp, setAwardedXp] = useState<number | null>(null)
  // Numéro de la partie en cours. Une réponse serveur qui arrive APRÈS le
  // lancement de la partie suivante ne doit pas repeindre son écran de fin.
  const partieRef = useRef(0)
  // Chrono de la question courante et de la course, en secondes (fractionnaires).
  const [questionLeft, setQuestionLeft] = useState<number | null>(null)
  const [globalLeft, setGlobalLeft] = useState<number | null>(null)

  // Miroirs synchrones : les callbacks de chrono ne voient pas les states frais.
  const runRef = useRef(run)
  const askedAtRef = useRef(0)
  const questionLeftRef = useRef<number | null>(null)
  const globalLeftRef = useRef<number | null>(null)
  const lastBipRef = useRef(-1)
  // Verrou anti-double-tap : deux taps rapprochés franchissent sinon la garde
  // `selected` (en retard d'un rendu) et compteraient deux réponses.
  const lockRef = useRef(false)
  const finishedRef = useRef(false)

  useEffect(() => {
    runRef.current = run
  }, [run])

  // Le record se lit APRÈS montage : `localStorage` n'existe pas au rendu
  // serveur, et l'initialiser dans `useState` provoquerait une divergence
  // d'hydratation. Même pattern que les records du Blitz et du Chrono.
  useEffect(() => {
    const load = () => setBest(readBest(format.id))
    load()
  }, [format.id])

  const question = pool.length > 0 ? pool[qIndex % pool.length] : null
  const perQuestion = questionSeconds(format, run)
  // Le chrono global (le sprint en a un, les autres non) : c'est le moteur qui
  // le dit, pour que le composant n'ait aucune règle de jeu en dur.
  const sprintSeconds = globalSeconds(format)

  // Arme le chrono d'une nouvelle question et note l'instant de la pose (c'est
  // lui qui décide du bonus de vitesse). Le chrono se lit sur l'état d'après la
  // réponse : dans un mode à paliers, la question qui ouvre une nouvelle vague
  // doit déjà tourner au rythme de CETTE vague, pas de la précédente.
  const armQuestion = useCallback(
    (next: GameRun) => {
      const seconds = questionSeconds(format, next)
      askedAtRef.current = Date.now()
      lastBipRef.current = -1
      questionLeftRef.current = seconds
      setQuestionLeft(seconds)
    },
    [format],
  )

  // ------------------------------------------------------------- fin de partie
  const finish = useCallback(
    (final: GameRun) => {
      if (finishedRef.current) return
      finishedRef.current = true
      runRef.current = final
      setRun(final)
      setPhase('done')

      const won = final.status === 'won'
      if (won) audio.win()
      else audio.lose()

      const prev = readBest(format.id)
      if (final.score > prev) {
        setIsRecord(true)
        try {
          window.localStorage.setItem(bestKey(format.id), String(final.score))
        } catch {
          // stockage indisponible : tant pis pour le record local
        }
      }
      setBest(Math.max(prev, final.score))

      // L'XP est recalculée côté serveur depuis score/total. Pas de mode passé :
      // les bonus de mode appartiennent à l'Arène, pas aux salons. Et pas de
      // file de révision non plus — un jeu de salon pioche dans sa propre banque
      // (capitales, faux amis…), pas dans le programme de l'élève.
      const partie = partieRef.current
      recordChallenge(final.correct, final.answered)
        .then((r) => {
          if (partie !== partieRef.current) return
          setSaved(r.saved)
          if (r.saved) setAwardedXp(r.xp)
        })
        .catch(() => {
          if (partie === partieRef.current) setSaved(false)
        })
    },
    [audio, format.id],
  )

  // Applique une transition du moteur et enchaîne (ou termine).
  const commit = useCallback(
    (next: GameRun, good: boolean) => {
      const before = runRef.current
      runRef.current = next
      setRun(next)

      const lostLife =
        next.lives !== null && before.lives !== null && next.lives < before.lives
      if (good) audio.correct(next.streak)
      else if (lostLife) audio.lifeLost()
      else audio.wrong()
      if (next.stepJustCleared && next.status === 'playing') audio.stepCleared()
      buzz(good, next.streak)
      if (!good) setShake((n) => n + 1)

      if (next.status !== 'playing') {
        window.setTimeout(() => finish(next), AUTO_ADVANCE_MS)
        return
      }
      window.setTimeout(() => {
        setQIndex((n) => n + 1)
        setSelected(null)
        setRevealed(false)
        armQuestion(next)
        lockRef.current = false
      }, AUTO_ADVANCE_MS)
    },
    [audio, finish, armQuestion],
  )

  const onAnswer = (index: number) => {
    if (!question || phase !== 'playing' || lockRef.current) return
    lockRef.current = true
    setSelected(index)
    setRevealed(true)
    const good = index === question.correctIndex
    commit(
      applyAnswer(format, runRef.current, {
        good,
        elapsedMs: Date.now() - askedAtRef.current,
      }),
      good,
    )
  }

  // ------------------------------------------------------ chronos de la partie
  // Une seule horloge pilote les deux comptes à rebours (question et course) :
  // deux intervalles se désynchronisent et font clignoter les jauges.
  useEffect(() => {
    if (phase !== 'playing') return
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return

      // Course (sprint) : sa fin arrête tout, même en pleine question.
      if (globalLeftRef.current !== null) {
        const left = Math.max(0, globalLeftRef.current - TICK_MS / 1000)
        globalLeftRef.current = left
        setGlobalLeft(left)
        if (left === 0) {
          finish(globalTimeUp(format, runRef.current))
          return
        }
      }

      // Question : le chrono ne court que tant que la réponse n'est pas donnée.
      if (questionLeftRef.current !== null && !lockRef.current) {
        const left = Math.max(0, questionLeftRef.current - TICK_MS / 1000)
        questionLeftRef.current = left
        setQuestionLeft(left)

        // Bip d'urgence : une fois par seconde entière, sur les dernières.
        const whole = Math.ceil(left)
        if (left > 0 && whole <= URGENT_FROM && whole !== lastBipRef.current) {
          lastBipRef.current = whole
          audio.tick(1 - (whole - 1) / URGENT_FROM)
        }

        if (left === 0) {
          lockRef.current = true
          setRevealed(true)
          commit(applyTimeout(format, runRef.current), false)
        }
      }
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [phase, format, audio, commit, finish])

  // ------------------------------------------------------------------ départ
  const launch = useCallback(() => {
    const fresh = startRun(format)
    finishedRef.current = false
    lockRef.current = false
    runRef.current = fresh
    setRun(fresh)
    setSelected(null)
    setRevealed(false)
    setSaved(null)
    setAwardedXp(null)
    partieRef.current += 1
    setIsRecord(false)
    setQIndex((n) => n + 1) // on repart ailleurs dans la banque
    globalLeftRef.current = sprintSeconds
    setGlobalLeft(sprintSeconds)
    armQuestion(fresh)
    setPhase('playing')
  }, [format, sprintSeconds, armQuestion])

  // Décompte 3 · 2 · 1 · GO — la respiration qui sépare « je lis la règle » de
  // « je joue ». Chaque jeu la sonne dans son propre timbre.
  useEffect(() => {
    if (phase !== 'countdown') return
    audio.countdown(count)
    if (count <= 0) {
      const id = window.setTimeout(launch, 350)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setCount((n) => n - 1), 700)
    return () => window.clearTimeout(id)
  }, [phase, count, audio, launch])

  const startCountdown = () => {
    sfx.tap()
    setCount(3)
    setPhase('countdown')
  }

  const exit = () => router.push('/defi')

  // --------------------------------------------------------------------- rendu
  return (
    <ModeStage
      title={name}
      Icon={MECHANIC_ICON[format.params.mechanic]}
      theme={format.theme}
      onExit={exit}
      headerRight={
        <span className="shrink-0 rounded-full bg-[color:var(--jeu-accent)]/12 px-2.5 py-1 text-[11px] font-bold text-[color:var(--jeu-accent)]">
          <span aria-hidden="true">{subjectEmoji}</span> {subject}
        </span>
      }
    >
      <div className="min-h-[70dvh] pt-1 pb-6">
        {phase === 'intro' ? (
          <GameIntro
            format={format}
            best={best}
            empty={pool.length === 0}
            onStart={startCountdown}
            onExit={exit}
          />
        ) : phase === 'countdown' ? (
          <GameCountdown n={count} />
        ) : phase === 'done' ? (
          <GameOutcome
            format={format}
            run={run}
            best={best}
            isRecord={isRecord}
            saved={saved}
            awardedXp={awardedXp}
            onReplay={startCountdown}
            onExit={exit}
          />
        ) : question ? (
          <div key={shake} className={cn(shake > 0 && 'jeu-secousse')}>
            <GameHud
              format={format}
              run={run}
              questionLeft={questionLeft}
              questionTotal={perQuestion}
              globalLeft={globalLeft}
            />

            <p className="mt-5 text-xs font-bold tracking-wide text-[color:var(--jeu-accent)] uppercase">
              {format.lexicon.verb}
            </p>
            <h2 className="font-heading mt-1 mb-4 text-2xl font-extrabold text-balance">
              {question.prompt}
            </h2>

            <AnswerBoard
              options={question.options}
              correctIndex={question.correctIndex}
              selected={selected}
              revealed={revealed}
              layout={format.layout}
              onAnswer={onAnswer}
            />

            {revealed && question.explanation ? (
              <p className="animate-in fade-in mt-3 rounded-2xl bg-card px-4 py-3 text-sm shadow-sm">
                {question.explanation}
              </p>
            ) : null}

            <p role="status" aria-live="polite" className="sr-only">
              {revealed
                ? selected === question.correctIndex
                  ? 'Bonne réponse'
                  : 'Mauvaise réponse'
                : ''}
            </p>

            <GameQuitLink onExit={exit} />
          </div>
        ) : null}
      </div>
    </ModeStage>
  )
}
