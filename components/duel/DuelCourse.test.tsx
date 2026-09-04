import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import type { ModeQuestion } from '@/lib/defi-modes'
import { COURSE_MAX_MS, GOAL_POINTS } from '@/lib/duel/course'
import { botOpponent, opponentTimeline } from '@/lib/duel/opponent'
import { DEFAULT_AVATAR } from '@/lib/avatar'
import {
  COUNTDOWN_STEP_MS,
  FINISH_FREEZE_MS,
  NEXT_QUESTION_MS,
  VS_MS,
} from '@/components/duel/useCourse'

// Test d'ASSEMBLAGE de la course — le duel classé, ce que lance le bouton DUEL.
//
// Trois défauts qu'aucun test de lib/duel ne peut attraper, parce qu'ils
// naissent du câblage (écran ↔ refs ↔ Server Action), pas d'une règle pure :
//   1. le serveur reçoit un décompte différent de celui que l'écran affiche ;
//   2. la course ne s'arrête pas quand le rival remplit sa barre ;
//   3. la course se consomme pendant que l'appli est en arrière-plan.

const recordDuelCourse = vi.fn()

vi.mock('@/lib/sounds', () => ({
  gameSfx: () => ({
    correct: vi.fn(),
    wrong: vi.fn(),
    lifeLost: vi.fn(),
    stepCleared: vi.fn(),
    tick: vi.fn(),
    win: vi.fn(),
    lose: vi.fn(),
    countdown: vi.fn(),
  }),
  duelSfx: () => ({
    rivalGood: vi.fn(),
    rivalWrong: vi.fn(),
    overtake: vi.fn(),
    fill: vi.fn(),
    heartbeat: vi.fn(),
    golden: vi.fn(),
    vs: vi.fn(),
    sprint: vi.fn(),
    finish: vi.fn(),
  }),
  sfx: { flip: vi.fn(), back: vi.fn(), tap: vi.fn() },
  buzz: vi.fn(),
  press: vi.fn(),
}))
vi.mock('@/app/defi/duel-course-actions', () => ({
  recordDuelCourse: (...args: unknown[]) => recordDuelCourse(...args),
}))
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), prefetch: vi.fn() }),
}))
// DiceBear compose un SVG complet par avatar : inutile ici, et lent en jsdom.
vi.mock('@/components/avatar/AvatarRender', () => ({
  default: () => <div data-testid="avatar" />,
}))

import DuelCourse from '@/components/duel/DuelCourse'

// Réponse correcte toujours en position 0 : « Vrai » est toujours bon.
const POOL: ModeQuestion[] = Array.from({ length: 12 }, (_, i) => ({
  id: `q${i}`,
  prompt: `Question ${i} ?`,
  options: ['Vrai', 'Faux'],
  correctIndex: 0,
  explanation: null,
  subject: 'maths',
  kind: 'true_false' as const,
}))

const SEED = 'course-test'

function props(trophiesRef = 0) {
  const opponent = botOpponent('camille', trophiesRef)!
  return {
    pool: POOL,
    subject: 'Maths',
    subjectSlug: 'maths',
    subjectEmoji: '📐',
    seed: SEED,
    opponent,
    me: { name: 'Lucas', avatar: DEFAULT_AVATAR, trophies: trophiesRef },
    hrefs: { revanche: '/r', nouveau: '/n', arene: '/defi' },
  }
}

/** Passe l'écran VS et le décompte : la course démarre. */
async function lancerLaCourse() {
  await act(async () => {
    vi.advanceTimersByTime(VS_MS + 20)
  })
  // Le décompte s'enchaîne d'un minuteur à l'autre, chacun posé APRÈS le rendu
  // du précédent : un seul `advanceTimersByTime` n'en franchirait qu'un, les
  // mises à jour d'état étant flushées à la sortie de `act`.
  for (let i = 0; i < 4; i++) {
    await act(async () => {
      vi.advanceTimersByTime(COUNTDOWN_STEP_MS + 20)
    })
  }
  await act(async () => {
    vi.advanceTimersByTime(400)
  })
}

function setVisibility(state: 'visible' | 'hidden') {
  Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: () => state,
  })
  document.dispatchEvent(new Event('visibilitychange'))
}

describe('la course — l’écran ne ment pas', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-03T18:00:00Z'))
    recordDuelCourse.mockReset()
    recordDuelCourse.mockImplementation(async (input: { stats: { score: number } }) => ({
      saved: true,
      outcome: 'win',
      rival: { score: 200, goalAtMs: null },
      stats: input.stats,
      trophies: { before: 0, after: 10, delta: 10, best: 10, total: 10 },
      clanPoints: 0,
      questsCompleted: [],
      questDayDone: false,
      gains: [],
      replaySaved: true,
    }))
    setVisibility('visible')
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('envoie au serveur exactement le score affiché, et finit quand MA barre est pleine', async () => {
    render(<DuelCourse {...props(0)} />)
    await lancerLaCourse()

    // On répond juste, vite, jusqu'à la barre pleine.
    let clics = 0
    while (clics < 15 && !screen.queryByText('Barre pleine !')) {
      // Un humain lit avant de taper : 300 ms, sinon la trace écarte le pas
      // (lib/duel/replay.MIN_ANSWER_MS) — c'est voulu, pas un défaut.
      await act(async () => {
        vi.advanceTimersByTime(300)
      })
      const vrai = screen.getAllByRole('button', { name: /^Vrai$/ })[0]
      await act(async () => {
        fireEvent.click(vrai)
        vi.advanceTimersByTime(NEXT_QUESTION_MS + 20)
      })
      clics += 1
    }
    expect(screen.getByText('Barre pleine !')).toBeInTheDocument()

    expect(recordDuelCourse).toHaveBeenCalledTimes(1)
    const envoye = recordDuelCourse.mock.calls[0][0]
    expect(envoye.subjectSlug).toBe('maths')
    expect(envoye.seed).toBe(SEED)
    expect(envoye.opponent).toEqual({ kind: 'bot', botId: 'camille', trophiesRef: 0 })
    expect(envoye.stats.answered).toBe(clics)
    expect(envoye.stats.correct).toBe(clics)
    expect(envoye.stats.score).toBeGreaterThanOrEqual(GOAL_POINTS)
    expect(envoye.stats.goalAtMs).not.toBeNull()
    expect(envoye.steps).toHaveLength(clics)
    expect(envoye.answers).toHaveLength(clics)

    // L'écran de fin affiche le score envoyé, et les trophées du SERVEUR.
    await act(async () => {
      vi.advanceTimersByTime(FINISH_FREEZE_MS + 50)
    })
    expect(screen.getByText('Victoire !')).toBeInTheDocument()
    expect(screen.getByText(String(envoye.stats.score))).toBeInTheDocument()
    expect(screen.getByText('+10')).toBeInTheDocument()
  })

  it('la course s’arrête quand le RIVAL remplit sa barre, même si je ne réponds pas', async () => {
    // Un rival réglé sur 900 trophées : vif et précis, il boucle bien avant 90 s.
    const p = props(900)
    const tl = opponentTimeline(p.opponent, SEED)!
    expect(tl.goalAtMs).not.toBeNull()

    render(<DuelCourse {...p} />)
    await lancerLaCourse()

    await act(async () => {
      vi.advanceTimersByTime((tl.goalAtMs ?? 0) + 250)
    })
    expect(screen.getByText('Camille a fini')).toBeInTheDocument()
    expect(recordDuelCourse).toHaveBeenCalledTimes(1)
    expect(recordDuelCourse.mock.calls[0][0].stats.answered).toBe(0)
  })

  it('l’arrière-plan ne consomme pas la course', async () => {
    render(<DuelCourse {...props(0)} />)
    await lancerLaCourse()

    await act(async () => {
      vi.advanceTimersByTime(5_000)
    })
    // Cinq minutes ailleurs : l'horloge avance, les minuteurs non.
    setVisibility('hidden')
    await act(async () => {
      vi.setSystemTime(Date.now() + 300_000)
    })
    setVisibility('visible')
    await act(async () => {
      vi.advanceTimersByTime(1_000)
    })

    // Rien n'a été enregistré : la course n'est pas finie, elle a été suspendue.
    expect(recordDuelCourse).not.toHaveBeenCalled()
    const chrono = screen.getByRole('timer').textContent ?? ''
    // ≈ 90 − 6 s : il reste plus d'une minute vingt.
    const [min, sec] = chrono.split(':').map(Number)
    expect(min * 60 + sec).toBeGreaterThan(80)
    expect(min * 60 + sec).toBeLessThanOrEqual(COURSE_MAX_MS / 1000)
  })
})
