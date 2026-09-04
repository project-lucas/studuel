'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gameSfx, duelSfx, sfx, buzz } from '@/lib/sounds'
import { nowMs, type ModeQuestion } from '@/lib/defi-modes'
import type { ReviewAnswer } from '@/lib/srs'
import {
  COURSE_MAX_MS,
  courseOutcome,
  fillRatio,
  goldenIndex,
  hasReachedGoal,
  isSprint,
  overtake,
  pointsForAnswer,
  type Camp,
  type CourseOutcome,
  type CourseStats,
} from '@/lib/duel/course'
import {
  rivalFinal,
  rivalScoreAtEnd,
  rivalStateAt,
  type RivalEvent,
  type RivalSnapshot,
  type RivalTimeline,
} from '@/lib/duel/rival'
import { heartbeatIntervalMs } from '@/lib/duel/audio'
import {
  bulleRival,
  commentaire,
  rivalParle,
  type Commentaire,
  type RivalMood,
} from '@/lib/duel/commentaire'
import { stepsFromEvents } from '@/lib/duel/replay'
import { opponentTemperament, opponentTimeline, type Opponent } from '@/lib/duel/opponent'
import {
  recordDuelCourse,
  type DuelCourseOutcome,
  type OpponentClaim,
} from '@/app/defi/duel-course-actions'

// -----------------------------------------------------------------------------
// LE MOTEUR REACT DE LA COURSE — l'horloge, le rival rejoué, les événements.
//
// Tout ce qui est RÈGLE vit dans lib/duel (pur) ; ce hook ne fait que tenir le
// temps et relier : à chaque tic, il lit où en est le rival, compare à l'instant
// d'avant, et en tire les sons, les bulles et les bandeaux. Les composants ne
// font qu'afficher ce qu'il rend.
//
// Les cadences sont celles de l'écran de duel existant : un tic à 100 ms (la
// barre du rival glisse sans réveiller le téléphone 60 fois par seconde), et
// l'arrière-plan est MESURÉ, jamais deviné — cf. le commentaire de Duel90Mode.
// -----------------------------------------------------------------------------

export type Phase = 'vs' | 'countdown' | 'playing' | 'finish' | 'result'

export const VS_MS = 2400
export const COUNTDOWN_STEP_MS = 700
export const TICK_MS = 100
/** Délai avant la question suivante — le même que la révélation du rival. */
export const NEXT_QUESTION_MS = 650
/** Le gel de l'arrivée : la barre pleine se regarde avant le verdict. */
export const FINISH_FREEZE_MS = 1500
export const FLOATER_MS = 900
export const BANDEAU_MS = 1600
export const BULLE_MS = 1500
export const LAST_SECONDS = 10

export type MeState = {
  score: number
  combo: number
  bestCombo: number
  correct: number
  answered: number
  goalAtMs: number | null
}

export type Bulle = { id: number; texte: string; humeur: 'juste' | 'faux' | 'parle' }

export type CourseView = {
  phase: Phase
  count: number
  msLeft: number
  elapsedMs: number
  me: MeState
  rival: RivalSnapshot
  /** Le score du rival à l'arrêt de la course (écran de fin). */
  rivalEndScore: number
  question: ModeQuestion | null
  qIndex: number
  golden: boolean
  selected: number | null
  revealed: boolean
  floater: { id: number; points: number } | null
  bandeau: { id: number; commentaire: Commentaire } | null
  bulle: Bulle | null
  sprint: boolean
  /** Le couloir qui vient de prendre la tête. */
  flash: Camp | null
  /** Compteur de secousses (une erreur = +1) : sert de clé d'animation. */
  shake: number
  outcome: CourseOutcome | null
  server: DuelCourseOutcome | null
  recorded: boolean
  answer: (index: number) => void
}

export function useCourse(input: {
  pool: ModeQuestion[]
  subjectSlug: string
  seed: string
  opponent: Opponent
}): CourseView {
  const { pool, subjectSlug, seed, opponent } = input

  // La course sonne CUIVRE — la fanfare, le seul timbre qui dise « compétition ».
  const audio = useMemo(() => gameSfx('cuivre'), [])
  const duel = useMemo(() => duelSfx(), [])
  const timeline = useMemo<RivalTimeline>(
    () => opponentTimeline(opponent, seed) ?? { events: [], finalScore: 0, goalAtMs: null },
    [opponent, seed],
  )
  const temperament = useMemo(() => opponentTemperament(opponent), [opponent])
  const golden = useMemo(() => goldenIndex(seed), [seed])

  const [phase, setPhase] = useState<Phase>('vs')
  const [count, setCount] = useState(3)
  const [msLeft, setMsLeft] = useState(COURSE_MAX_MS)
  const [elapsedMs, setElapsedMs] = useState(0)
  const [me, setMe] = useState<MeState>({
    score: 0,
    combo: 0,
    bestCombo: 0,
    correct: 0,
    answered: 0,
    goalAtMs: null,
  })
  const [rival, setRival] = useState<RivalSnapshot>(() => rivalStateAt(timeline, 0))
  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [floater, setFloater] = useState<{ id: number; points: number } | null>(null)
  const [bandeau, setBandeau] = useState<{ id: number; commentaire: Commentaire } | null>(null)
  const [bulle, setBulle] = useState<Bulle | null>(null)
  const [sprint, setSprint] = useState(false)
  // Le couloir qui vient de prendre la tête s'allume ; la carte tremble sur une erreur.
  const [flash, setFlash] = useState<{ id: number; camp: Camp } | null>(null)
  const [shake, setShake] = useState(0)
  const [outcome, setOutcome] = useState<CourseOutcome | null>(null)
  const [server, setServer] = useState<DuelCourseOutcome | null>(null)
  const [recorded, setRecorded] = useState(false)

  // Miroirs synchrones : les callbacks d'horloge ne voient pas les states frais.
  const meRef = useRef<MeState>(me)
  const rivalRef = useRef<RivalSnapshot>(rival)
  const startedAtRef = useRef(0)
  const shownAtRef = useRef(0)
  const finishedRef = useRef(false)
  const lockRef = useRef(false)
  const eventsRef = useRef<RivalEvent[]>([])
  const answersRef = useRef<ReviewAnswer[]>([])
  const idRef = useRef(0)
  const sprintRef = useRef(false)
  const lastSecondRef = useRef<number>(Number.POSITIVE_INFINITY)
  const bulleCountRef = useRef<Record<RivalMood, number>>({
    marque: 0,
    rate: 0,
    double: 0,
    'double-par': 0,
    serie: 0,
    arrivee: 0,
  })
  const timersRef = useRef<number[]>([])

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }, [])

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [])

  const nextId = () => {
    idRef.current += 1
    return idRef.current
  }

  const showBandeau = useCallback(
    (c: Commentaire) => {
      const id = nextId()
      setBandeau({ id, commentaire: c })
      later(() => setBandeau((b) => (b?.id === id ? null : b)), BANDEAU_MS)
    },
    [later],
  )

  const showBulle = useCallback(
    (texte: string, humeur: Bulle['humeur']) => {
      const id = nextId()
      setBulle({ id, texte, humeur })
      later(() => setBulle((b) => (b?.id === id ? null : b)), BULLE_MS)
    },
    [later],
  )

  const showFlash = useCallback(
    (camp: Camp) => {
      const id = nextId()
      setFlash({ id, camp })
      later(() => setFlash((f) => (f?.id === id ? null : f)), 750)
    },
    [later],
  )

  const rivalSays = useCallback(
    (mood: RivalMood) => {
      const n = bulleCountRef.current[mood]
      bulleCountRef.current[mood] = n + 1
      if (!rivalParle(mood, n)) return false
      showBulle(bulleRival(seed, temperament, mood, n), 'parle')
      return true
    },
    [seed, temperament, showBulle],
  )

  const rivalName = opponent.identity.name

  // ------------------------------------------------------------------ l'arrivée
  const finish = useCallback(
    (meGoalAtMs: number | null) => {
      if (finishedRef.current) return
      finishedRef.current = true
      lockRef.current = true

      const mine = { ...meRef.current, goalAtMs: meGoalAtMs }
      meRef.current = mine
      setMe(mine)
      const theirs = rivalFinal(timeline)
      const verdict = courseOutcome({ score: mine.score, goalAtMs: mine.goalAtMs }, theirs)
      setOutcome(verdict)
      setPhase('finish')
      duel.finish(verdict !== 'loss')
      if (verdict === 'loss') audio.lose()
      later(() => setPhase('result'), FINISH_FREEZE_MS)

      const stats: CourseStats = {
        score: mine.score,
        correct: mine.correct,
        answered: mine.answered,
        bestCombo: mine.bestCombo,
        goalAtMs: mine.goalAtMs,
      }
      const claim: OpponentClaim =
        opponent.kind === 'bot'
          ? { kind: 'bot', botId: opponent.botId, trophiesRef: opponent.trophiesRef }
          : { kind: 'replay', replayId: opponent.replayId }
      recordDuelCourse({
        subjectSlug,
        seed,
        opponent: claim,
        stats,
        steps: stepsFromEvents(eventsRef.current),
        answers: answersRef.current,
      })
        .then((o) => {
          setServer(o)
          setRecorded(true)
        })
        .catch(() => {
          setServer(null)
          setRecorded(true)
        })
    },
    [audio, duel, later, opponent, seed, subjectSlug, timeline],
  )

  // ------------------------------------------------------------- l'écran VS
  useEffect(() => {
    if (phase !== 'vs') return
    duel.vs()
    const id = window.setTimeout(() => {
      setCount(3)
      setPhase('countdown')
    }, VS_MS)
    return () => window.clearTimeout(id)
  }, [phase, duel])

  // ------------------------------------------------------------ le décompte
  useEffect(() => {
    if (phase !== 'countdown') return
    audio.countdown(count)
    if (count <= 0) {
      const id = window.setTimeout(() => {
        startedAtRef.current = nowMs()
        shownAtRef.current = nowMs()
        lockRef.current = false
        setPhase('playing')
        showBandeau(commentaire('depart', rivalName))
        if (golden === 0) {
          duel.golden()
        }
      }, 350)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setCount((n) => n - 1), COUNTDOWN_STEP_MS)
    return () => window.clearTimeout(id)
  }, [phase, count, audio, duel, golden, rivalName, showBandeau])

  // ------------------------------------------------------------- la course
  useEffect(() => {
    if (phase !== 'playing') return
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return
      if (finishedRef.current) return
      const elapsed = nowMs() - startedAtRef.current
      const left = Math.max(0, COURSE_MAX_MS - elapsed)
      setElapsedMs(elapsed)
      setMsLeft(left)

      // Le rival, à cet instant. Chaque frappe nouvelle depuis le tic précédent
      // se joue : son, bulle, et le dépassement s'il y en a un.
      const before = rivalRef.current
      const snap = rivalStateAt(timeline, elapsed)
      if (snap.answered > before.answered) {
        const fresh = timeline.events.slice(before.answered, snap.answered)
        for (const ev of fresh) {
          if (ev.good) {
            duel.rivalGood()
            if (!rivalSays(snap.combo >= 3 ? 'serie' : 'marque')) showBulle('✓', 'juste')
          } else {
            duel.rivalWrong()
            if (!rivalSays('rate')) showBulle('✗', 'faux')
          }
        }
        const mine = meRef.current.score
        const who = overtake({ me: mine, rival: before.total }, { me: mine, rival: snap.total })
        if (who === 'rival') {
          duel.overtake(false)
          showFlash('rival')
          showBandeau(commentaire('rival-double', rivalName))
          rivalSays('double')
        }
      }
      rivalRef.current = snap
      setRival(snap)

      // Le sprint s'ouvre une seule fois.
      if (!sprintRef.current && isSprint(meRef.current.score, snap.total)) {
        sprintRef.current = true
        setSprint(true)
        duel.sprint()
        showBandeau(commentaire('sprint', rivalName))
      }

      // Les dix dernières secondes s'entendent.
      const sec = Math.ceil(left / 1000)
      if (sec !== lastSecondRef.current) {
        if (sec === LAST_SECONDS) showBandeau(commentaire('dernieres-secondes', rivalName))
        if (sec <= LAST_SECONDS && sec > 0) audio.tick(1 - sec / LAST_SECONDS)
        lastSecondRef.current = sec
      }

      // Le rival vient de finir : la course s'arrête là.
      if (snap.finished) {
        showBandeau(commentaire('rival-arrivee', rivalName))
        rivalSays('arrivee')
        finish(null)
        return
      }
      if (left === 0) finish(null)
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [phase, timeline, audio, duel, finish, rivalName, rivalSays, showBandeau, showBulle, showFlash])

  // Le cœur du sprint : un battement dont le tempo suit la barre la plus avancée.
  useEffect(() => {
    if (phase !== 'playing' || !sprint) return
    let cancelled = false
    let id = 0
    const beat = () => {
      if (cancelled || finishedRef.current) return
      if (document.visibilityState === 'visible') duel.heartbeat()
      const ratio = Math.max(fillRatio(meRef.current.score), fillRatio(rivalRef.current.total))
      id = window.setTimeout(beat, heartbeatIntervalMs(ratio))
    }
    id = window.setTimeout(beat, 200)
    return () => {
      cancelled = true
      window.clearTimeout(id)
    }
  }, [phase, sprint, duel])

  // L'arrière-plan ne consomme pas la course : on mesure l'absence et on décale
  // le coup d'envoi d'autant (même mécanique que le Duel 90 s).
  useEffect(() => {
    if (phase !== 'playing') return
    let hiddenAt = document.visibilityState === 'hidden' ? nowMs() : 0
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt = nowMs()
        return
      }
      if (hiddenAt === 0) return
      const away = nowMs() - hiddenAt
      hiddenAt = 0
      startedAtRef.current += away
      shownAtRef.current += away
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [phase])

  // Une nouvelle question s'affiche : on arme son chrono, et on annonce la dorée.
  useEffect(() => {
    if (phase !== 'playing') return
    shownAtRef.current = nowMs()
    lockRef.current = false
    if (qIndex !== golden || qIndex === 0) return
    // Différé d'un tour : l'annonce est un événement de la course, pas un
    // effet de rendu (react-hooks/set-state-in-effect).
    const id = window.setTimeout(() => {
      duel.golden()
      showBandeau(commentaire('doree', rivalName))
    }, 0)
    return () => window.clearTimeout(id)
  }, [qIndex, phase, golden, duel, rivalName, showBandeau])

  const question = pool.length > 0 ? pool[qIndex % pool.length] : null
  const isGolden = qIndex === golden

  // ------------------------------------------------------------- ma réponse
  const answer = useCallback(
    (i: number) => {
      if (!question || phase !== 'playing' || lockRef.current || finishedRef.current) return
      lockRef.current = true
      setSelected(i)
      setRevealed(true)

      const good = i === question.correctIndex
      const now = nowMs()
      const answerMs = Math.max(0, now - shownAtRef.current)
      const elapsed = now - startedAtRef.current
      const prev = meRef.current
      const points = pointsForAnswer({ good, comboBefore: prev.combo, answerMs, golden: isGolden })
      const combo = good ? prev.combo + 1 : 0
      const next: MeState = {
        score: prev.score + points,
        combo,
        bestCombo: Math.max(prev.bestCombo, combo),
        correct: prev.correct + (good ? 1 : 0),
        answered: prev.answered + 1,
        goalAtMs: prev.goalAtMs,
      }
      meRef.current = next
      setMe(next)
      eventsRef.current.push({ atMs: elapsed, good, answerMs, total: next.score })
      answersRef.current.push({ kind: 'question', id: question.id, subject: subjectSlug, good })

      if (good) {
        audio.correct(combo)
        duel.fill(fillRatio(next.score))
        buzz(true, combo)
        setFloater({ id: nextId(), points })
        later(() => setFloater(null), FLOATER_MS)
        if (combo === 3) showBandeau(commentaire('serie-3', rivalName))
        else if (combo === 6) showBandeau(commentaire('serie-6', rivalName))
      } else {
        if (prev.combo >= 3) {
          audio.lifeLost()
          showBandeau(commentaire('serie-cassee', rivalName))
        } else {
          audio.wrong()
        }
        buzz(false, prev.combo)
        setShake((n) => n + 1)
      }

      // Le dépassement, vu de mon côté.
      const theirs = rivalRef.current.total
      const who = overtake({ me: prev.score, rival: theirs }, { me: next.score, rival: theirs })
      if (who === 'moi') {
        duel.overtake(true)
        showFlash('moi')
        showBandeau(commentaire('me-double', rivalName))
        rivalSays('double-par')
      }

      if (hasReachedGoal(next.score)) {
        showBandeau(commentaire('me-arrivee', rivalName))
        later(() => finish(elapsed), 250)
        return
      }

      later(() => {
        setQIndex((n) => n + 1)
        setSelected(null)
        setRevealed(false)
      }, NEXT_QUESTION_MS)
    },
    [question, phase, isGolden, subjectSlug, audio, duel, later, showBandeau, showFlash, rivalName, rivalSays, finish],
  )

  // Le premier tap sur l'écran VS réveille l'audio (autoplay) : un `sfx.tap`
  // vaut un geste utilisateur pour le navigateur.
  useEffect(() => {
    if (phase !== 'vs') return
    const wake = () => sfx.flip()
    window.addEventListener('pointerdown', wake, { once: true })
    return () => window.removeEventListener('pointerdown', wake)
  }, [phase])

  return {
    phase,
    count,
    msLeft,
    elapsedMs,
    me,
    rival,
    rivalEndScore: rivalScoreAtEnd(timeline, me.goalAtMs),
    question,
    qIndex,
    golden: isGolden,
    selected,
    revealed,
    floater,
    bandeau,
    bulle,
    sprint,
    flash: flash?.camp ?? null,
    shake,
    outcome,
    server,
    recorded,
    answer,
  }
}
