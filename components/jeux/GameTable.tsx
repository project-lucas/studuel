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
import type { ModeQuestion } from '@/lib/defi-modes'
import type { GameFormat } from '@/lib/jeux/formats'
import { readGameBest, writeGameBest } from '@/lib/jeux/records'
import { usePalierRun } from '@/lib/jeux/use-palier-run'
import type { PalierRun } from '@/lib/jeux/paliers'
import { hasTimeRecord } from '@/lib/jeux/palier-format'
import { useUltimeRun } from '@/lib/jeux/use-ultime-run'
import { useGameReport } from '@/lib/jeux/use-game-report'
import type { GameGhost } from '@/lib/jeux/ghost-server'
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
  palier,
  pool,
  levels,
  name,
  subject,
  subjectEmoji,
  ghost,
}: {
  format: GameFormat
  /**
   * Palier joué et plancher de classe (lib/jeux/paliers), ou null pour un jeu
   * hors échelle — le « Programme » d'une matière, dont la difficulté est le
   * programme et non un réglage.
   */
  palier: PalierRun | null
  /**
   * La banque de l'ÉPREUVE ULTIME : un paquet de questions PAR NIVEAU
   * (lib/jeux/pools.buildUltimePool). Sa présence fait basculer la table en mode
   * ultime — la difficulté change alors EN COURS DE PARTIE, ce qu'un pool à plat
   * ne sait pas faire.
   */
  levels?: ModeQuestion[][] | null
  pool: ModeQuestion[]
  name: string
  subject: string
  subjectEmoji: string
  /** Meilleur score d'un ami sur ce jeu, à battre (lib/jeux/ghost-server). */
  ghost?: GameGhost | null
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
  // XP, série et trophées : un seul compte rendu partagé par les quatre tables.
  // Les étoiles du palier, rangées dans la progression locale du jeu.
  const {
    outcome: palierOutcome,
    standing: palierStanding,
    record: recordPalier,
    reset: resetPalier,
  } = usePalierRun(format.id, palier)
  // L'épreuve ultime : sa place se calcule côté serveur (une cote n'a de sens
  // que comparée aux autres). Inerte quand la table ne joue pas l'épreuve.
  const isUltime = format.params.mechanic === 'ultime'
  const {
    result: ultimeResult,
    record: recordUltime,
    reset: resetUltime,
  } = useUltimeRun(format.id, isUltime)
  const { saved, gains, trophies, report, reset } = useGameReport(
    subject,
    format.id,
  )
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
  // Le CHRONO DE BOUCLAGE : posé au lancement réel de la partie (après le
  // décompte 3·2·1, qui ne doit compter pour personne) et lu à l'arrivée. C'est
  // lui qui alimente le record de temps et le classement de rapidité du palier.
  const startedAtRef = useRef(0)

  useEffect(() => {
    runRef.current = run
  }, [run])

  // Le record se lit APRÈS montage : `localStorage` n'existe pas au rendu
  // serveur, et l'initialiser dans `useState` provoquerait une divergence
  // d'hydratation. Même pattern que les records du Blitz et du Chrono.
  useEffect(() => {
    const load = () => setBest(readGameBest(format.id))
    load()
  }, [format.id])

  // La question courante. En épreuve ultime, elle se prend dans le paquet du
  // NIVEAU atteint (`run.step`) à l'index des bonnes réponses déjà données dans
  // ce niveau (`run.inWave`) — la moindre erreur arrêtant la partie, les deux se
  // suivent exactement. Passé le dernier paquet préparé, on re-sert le plus dur ;
  // le chrono, lui, continue de fondre.
  const question = levels?.length
    ? (levels[Math.min(run.step, levels.length - 1)]?.[
        run.inWave % Math.max(1, levels[Math.min(run.step, levels.length - 1)].length)
      ] ?? null)
    : pool.length > 0
      ? pool[qIndex % pool.length]
      : null
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

      const prev = readGameBest(format.id)
      if (writeGameBest(format.id, final.score)) setIsRecord(true)
      setBest(Math.max(prev, final.score))

      // Les étoiles se comptent ici, au même endroit que le record : c'est le
      // seul moment où l'on tient la partie TERMINÉE, donc son taux de réussite
      // ET son temps. Un chrono jamais parti (partie quittée avant le GO) vaut
      // null plutôt que la durée écoulée depuis l'époque Unix.
      const elapsed = startedAtRef.current
        ? Date.now() - startedAtRef.current
        : null
      recordPalier(final, hasTimeRecord(format) ? elapsed : null)
      // L'épreuve ultime ne compte pas d'étoiles : elle rend une COTE. Les deux
      // appels coexistent sans se gêner — `recordPalier` est inerte hors
      // échelle, `recordUltime` l'est hors épreuve.
      recordUltime(final, elapsed)

      // Pas de file de révision ici — un jeu de salon pioche dans sa propre
      // banque (capitales, faux amis…), pas dans le programme de l'élève.
      report(final)
    },
    [audio, format, recordPalier, recordUltime, report],
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
    reset()
    resetPalier()
    resetUltime()
    startedAtRef.current = Date.now()
    setIsRecord(false)
    setQIndex((n) => n + 1) // on repart ailleurs dans la banque
    globalLeftRef.current = sprintSeconds
    setGlobalLeft(sprintSeconds)
    armQuestion(fresh)
    setPhase('playing')
  }, [format, sprintSeconds, armQuestion, reset, resetPalier, resetUltime])

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

  // Retour : on remonte d'UN cran, sur la carte des paliers du jeu — c'est de là
  // qu'on est venu. Renvoyer à l'arène faisait retraverser toute la feuille des
  // modes pour rejouer le palier d'à côté. Un jeu hors échelle (le
  // « Programme ») n'a pas de carte : lui rentre bien à l'arène.
  // L'épreuve ultime compte AUSSI : on y arrive par la carte du jeu, même si
  // elle n'appartient pas à l'échelle des paliers.
  const surLaCarte = palier !== null || isUltime
  const backHref = surLaCarte ? `/defi/jeux/${format.id}` : '/defi'
  const exit = () => router.push(backHref)

  // --------------------------------------------------------------------- rendu
  return (
    <ModeStage
      title={name}
      Icon={MECHANIC_ICON[format.params.mechanic]}
      theme={format.theme}
      onExit={exit}
      backLabel={surLaCarte ? 'Retour aux paliers' : undefined}
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
            palier={palier?.level ?? null}
            palierOutcome={palierOutcome}
            palierStanding={palierStanding}
            ultime={ultimeResult}
            run={run}
            best={best}
            isRecord={isRecord}
            saved={saved}
            gains={gains}
            trophies={trophies}
            ghost={ghost}
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
