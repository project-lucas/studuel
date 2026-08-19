import { describe, expect, it } from 'vitest'
import {
  applyAnswer,
  BOX_INTERVAL_DAYS,
  bucketQuotas,
  chapterMastery,
  drawSession,
  freshnessWeight,
  initialState,
  intervalDaysForBox,
  isDue,
  isUnseen,
  MAX_BOX,
  MIN_BOX,
  pushRecent,
  RECENT_WINDOW,
  WRONG_RETRY_MINUTES,
  type QuestionRef,
  type QuestionState,
} from './engine'

const NOW = Date.UTC(2026, 7, 17, 10, 0, 0)
const DAY = 24 * 60 * 60 * 1000
const MINUTE = 60 * 1000

const CHAPTER = 'chap-1'

function ref(n: number): QuestionRef {
  return {
    questionId: `q${String(n).padStart(3, '0')}`,
    chapterId: CHAPTER,
    subjectId: 'maths',
    level: '3e',
  }
}

function pool(size: number): QuestionRef[] {
  return Array.from({ length: size }, (_, i) => ref(i + 1))
}

/** Un état « vu », réglable : boîte, échéance, dernier passage. */
function state(
  n: number,
  patch: Partial<QuestionState> = {},
): QuestionState {
  return {
    ...ref(n),
    lastSeenAt: NOW - DAY,
    timesSeen: 1,
    timesCorrect: 1,
    timesWrong: 0,
    consecutiveCorrect: 1,
    box: 2,
    dueAt: NOW + DAY,
    ...patch,
  }
}

function statesOf(items: QuestionState[]): Map<string, QuestionState> {
  return new Map(items.map((s) => [s.questionId, s]))
}

// =========================================================== le barème Leitner

describe('barème de Leitner', () => {
  it('donne à chaque boîte son intervalle, et plafonne hors bornes', () => {
    expect(BOX_INTERVAL_DAYS).toEqual([1, 3, 7, 14, 30])
    expect(intervalDaysForBox(1)).toBe(1)
    expect(intervalDaysForBox(5)).toBe(30)
    expect(intervalDaysForBox(0)).toBe(1)
    expect(intervalDaysForBox(99)).toBe(30)
  })

  it('crée une question inédite due tout de suite, en boîte 1', () => {
    const s = initialState(ref(1), NOW)
    expect(s.box).toBe(MIN_BOX)
    expect(s.dueAt).toBe(NOW)
    expect(s.timesSeen).toBe(0)
    expect(isUnseen(s)).toBe(true)
    expect(isDue(s, NOW)).toBe(true)
  })

  it('monte d’une boîte à chaque bonne réponse ÉCHUE et recalcule l’échéance', () => {
    let s = applyAnswer(null, ref(1), true, NOW)
    expect(s.box).toBe(2)
    expect(s.timesSeen).toBe(1)
    expect(s.timesCorrect).toBe(1)
    expect(s.consecutiveCorrect).toBe(1)
    expect(s.dueAt).toBe(NOW + 3 * DAY) // boîte 2 → 3 jours

    // On attend que l'échéance tombe (3 jours) : c'est là que le succès vaut
    // une montée.
    const plusTard = NOW + 3 * DAY
    s = applyAnswer(s, ref(1), true, plusTard)
    expect(s.box).toBe(3)
    expect(s.dueAt).toBe(plusTard + 7 * DAY)
  })

  it('NE monte PAS sur une question pas encore due — la garde anti-bachotage', () => {
    // Le cas réel : l'élève rejoue le même quiz de leçon trois fois dans
    // l'après-midi. Sans la garde, ses questions partiraient en boîte 4 et
    // l'app annoncerait « revu dans 14 jours » sur du tout frais.
    const premier = applyAnswer(null, ref(1), true, NOW)
    const deuxieme = applyAnswer(premier, ref(1), true, NOW + 60 * MINUTE)
    const troisieme = applyAnswer(deuxieme, ref(1), true, NOW + 120 * MINUTE)

    expect(troisieme.box).toBe(2)
    expect(troisieme.dueAt).toBe(premier.dueAt)
    // Le passage n'est pas perdu pour autant : il compte, et la fraîcheur suit.
    expect(troisieme.timesSeen).toBe(3)
    expect(troisieme.timesCorrect).toBe(3)
    expect(troisieme.lastSeenAt).toBe(NOW + 120 * MINUTE)
  })

  it('ne dépasse jamais la boîte 5, mais continue de compter les succès', () => {
    // Chaque passage arrive APRÈS l'échéance : on avance de 40 jours à chaque
    // fois, ce qui dépasse le plus long intervalle (30 j).
    let s: QuestionState | null = null
    for (let i = 0; i < 10; i++) s = applyAnswer(s, ref(1), true, NOW + i * 40 * DAY)
    expect(s!.box).toBe(MAX_BOX)
    expect(s!.consecutiveCorrect).toBe(10)
    expect(s!.dueAt).toBe(NOW + 9 * 40 * DAY + 30 * DAY)
  })

  it('renvoie une erreur en boîte 1, à revoir dans 10 minutes', () => {
    const premier = applyAnswer(null, ref(1), true, NOW)
    const monte = applyAnswer(premier, ref(1), true, NOW + 3 * DAY)
    expect(monte.box).toBe(3)

    const rate = applyAnswer(monte, ref(1), false, NOW + 3 * DAY)
    expect(rate.box).toBe(MIN_BOX)
    expect(rate.consecutiveCorrect).toBe(0)
    expect(rate.timesWrong).toBe(1)
    expect(rate.dueAt).toBe(NOW + 3 * DAY + WRONG_RETRY_MINUTES * MINUTE)
    // Le point qui justifie la migration : l'item revient DANS la session.
    expect(isDue(rate, NOW + 3 * DAY + 11 * MINUTE)).toBe(true)
  })
})

// ================================================================== le tirage

describe('quotas des buckets', () => {
  it('répartit 60 / 30 / 10 sur une session de 10', () => {
    expect(bucketQuotas(10)).toEqual({ a: 6, b: 3, c: 1 })
  })

  it('laisse une place aux inédites même sur une toute petite session', () => {
    // Avec une troncature, le bucket B tomberait à 0 et un débutant ne verrait
    // jamais de nouvelle question.
    expect(bucketQuotas(3).b).toBeGreaterThan(0)
    expect(bucketQuotas(3).a + bucketQuotas(3).b + bucketQuotas(3).c).toBe(3)
  })

  it('somme toujours exactement le nombre demandé', () => {
    for (let n = 0; n <= 40; n++) {
      const q = bucketQuotas(n)
      expect(q.a + q.b + q.c).toBe(n)
      expect(q.c).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('tirage — cas limites du vivier', () => {
  it('rend une session vide quand le vivier est vide', () => {
    expect(
      drawSession({ pool: [], states: new Map(), count: 10, now: NOW, seed: 's' }),
    ).toEqual([])
  })

  it('rend une session vide quand on demande 0 question', () => {
    expect(
      drawSession({ pool: pool(20), states: new Map(), count: 0, now: NOW, seed: 's' }),
    ).toEqual([])
  })

  it('sert quand même N questions quand le vivier est plus petit, les plus anciennes d’abord', () => {
    // 3 questions au vivier, 8 demandées. La réutilisation est autorisée, mais
    // elle suit la fraîcheur : q3 (vue il y a 10 jours) revient avant q1.
    const states = statesOf([
      state(1, { lastSeenAt: NOW - DAY, dueAt: NOW + 5 * DAY }),
      state(2, { lastSeenAt: NOW - 5 * DAY, dueAt: NOW + 5 * DAY }),
      state(3, { lastSeenAt: NOW - 10 * DAY, dueAt: NOW + 5 * DAY }),
    ])
    const got = drawSession({ pool: pool(3), states, count: 8, now: NOW, seed: 's' })

    expect(got).toHaveLength(8)
    // Chaque question du vivier est servie, et les rappels penchent vers les
    // plus anciennes : q3 sort au moins autant que q1.
    const compte = (id: string) => got.filter((x) => x === id).length
    expect(compte('q001')).toBeGreaterThan(0)
    expect(compte('q003')).toBeGreaterThanOrEqual(compte('q001'))
  })

  it('ne répète jamais une question tant que le vivier est assez grand', () => {
    const got = drawSession({
      pool: pool(30),
      states: new Map(),
      count: 10,
      now: NOW,
      seed: 's',
    })
    expect(got).toHaveLength(10)
    expect(new Set(got).size).toBe(10)
  })

  it('donne la même session à graine égale', () => {
    const args = { pool: pool(30), states: new Map(), count: 10, now: NOW, seed: 'x' }
    expect(drawSession(args)).toEqual(drawSession(args))
  })
})

describe('tirage — composition des buckets', () => {
  it('sert 100 % d’échues quand tout est échu (et redistribue les places)', () => {
    const states = statesOf(
      pool(20).map((_, i) => state(i + 1, { dueAt: NOW - (i + 1) * DAY })),
    )
    const got = drawSession({ pool: pool(20), states, count: 10, now: NOW, seed: 's' })

    expect(got).toHaveLength(10)
    expect(new Set(got).size).toBe(10)
    // Aucune inédite, aucune fraîche à servir : les 10 places vont aux échues.
    for (const id of got) expect(states.get(id)!.dueAt).toBeLessThanOrEqual(NOW)
  })

  it('sert les échues les plus en retard en priorité', () => {
    // 20 échues, échéances étalées : la session de 6 doit prendre les 6 plus
    // vieilles (quotas 4 échues + 2 redistribuées, faute d'autres buckets).
    const states = statesOf(
      pool(20).map((_, i) => state(i + 1, { dueAt: NOW - (20 - i) * DAY })),
    )
    const got = drawSession({ pool: pool(20), states, count: 6, now: NOW, seed: 's' })
    // Les plus en retard sont q001..q006 (dueAt le plus ancien).
    expect([...got].sort()).toEqual(['q001', 'q002', 'q003', 'q004', 'q005', 'q006'])
  })

  it('sert 0 % d’échues quand rien n’est dû : inédites puis fraîches', () => {
    // 10 vues et non échues, 10 jamais vues.
    const states = statesOf(
      Array.from({ length: 10 }, (_, i) => state(i + 1, { dueAt: NOW + 30 * DAY })),
    )
    const p = pool(20)
    const got = drawSession({ pool: p, states, count: 10, now: NOW, seed: 's' })

    expect(got).toHaveLength(10)
    const inedites = got.filter((id) => !states.has(id))
    // Quota B = 3, mais le bucket A est vide : ses 6 places sont redistribuées
    // et les inédites, prioritaires après A, en récupèrent l'essentiel.
    expect(inedites.length).toBeGreaterThanOrEqual(3)
    expect(inedites.length).toBeLessThanOrEqual(10)
  })

  it('plafonne les échues à 60 % quand les trois buckets sont fournis', () => {
    const states = statesOf([
      ...Array.from({ length: 10 }, (_, i) => state(i + 1, { dueAt: NOW - DAY })),
      ...Array.from({ length: 10 }, (_, i) =>
        state(i + 11, { dueAt: NOW + 30 * DAY, lastSeenAt: NOW - 20 * DAY }),
      ),
    ])
    const p = pool(40) // q021..q040 jamais vues
    const got = drawSession({ pool: p, states, count: 10, now: NOW, seed: 's' })

    const echues = got.filter((id) => (states.get(id)?.dueAt ?? Infinity) <= NOW)
    expect(echues).toHaveLength(6)
  })

  it('mélange l’ordre final : les buckets ne doivent pas se lire', () => {
    // 6 échues + 4 inédites. Sans mélange, les échues occuperaient les 6
    // premières places à tous les coups.
    const states = statesOf(
      Array.from({ length: 10 }, (_, i) => state(i + 1, { dueAt: NOW - (i + 1) * DAY })),
    )
    const p = pool(30)
    const enTete = new Set<string>()
    for (const seed of ['a', 'b', 'c', 'd', 'e', 'f']) {
      const got = drawSession({ pool: p, states, count: 10, now: NOW, seed })
      enTete.add(got[0])
    }
    // La première question change selon la graine : l'ordre est bien brassé.
    expect(enTete.size).toBeGreaterThan(1)
  })
})

describe('garde-fous anti-répétition', () => {
  it('exclut du tirage aléatoire les questions de la session précédente', () => {
    // Toutes vues, aucune échue : seul le bucket C peut servir.
    const states = statesOf(
      pool(20).map((_, i) =>
        state(i + 1, { dueAt: NOW + 30 * DAY, lastSeenAt: NOW - 3 * DAY }),
      ),
    )
    const lastSession = ['q001', 'q002', 'q003', 'q004', 'q005']
    const got = drawSession({
      pool: pool(20),
      states,
      count: 10,
      now: NOW,
      seed: 's',
      lastSession,
    })

    for (const id of lastSession) expect(got).not.toContain(id)
  })

  it('laisse RESSORTIR une question de la session précédente si elle est échue', () => {
    // q001 a été ratée à la session précédente : elle est due dans 10 min et
    // doit revenir malgré l'exclusion — c'est toute la promesse du bucket A.
    const states = statesOf([
      state(1, { dueAt: NOW - MINUTE, box: 1 }),
      ...Array.from({ length: 19 }, (_, i) =>
        state(i + 2, { dueAt: NOW + 30 * DAY, lastSeenAt: NOW - 3 * DAY }),
      ),
    ])
    const got = drawSession({
      pool: pool(20),
      states,
      count: 10,
      now: NOW,
      seed: 's',
      lastSession: ['q001'],
    })
    expect(got).toContain('q001')
  })

  it('exclut la fenêtre glissante des 20 derniers servis', () => {
    const states = statesOf(
      pool(40).map((_, i) =>
        state(i + 1, { dueAt: NOW + 30 * DAY, lastSeenAt: NOW - 3 * DAY }),
      ),
    )
    const recent = pool(20).map((r) => r.questionId) // q001..q020
    const got = drawSession({
      pool: pool(40),
      states,
      count: 10,
      now: NOW,
      seed: 's',
      recent,
    })
    for (const id of got) expect(recent).not.toContain(id)
  })

  it('ne se répète pas d’une session à l’autre quand le vivier le permet', () => {
    // Scénario de bout en bout : deux sessions de 10 sur un vivier de 40
    // questions toutes vues et non échues. La seconde ne doit rien reprendre.
    const states = statesOf(
      pool(40).map((_, i) =>
        state(i + 1, { dueAt: NOW + 30 * DAY, lastSeenAt: NOW - 3 * DAY }),
      ),
    )

    const session1 = drawSession({
      pool: pool(40),
      states,
      count: 10,
      now: NOW,
      seed: 's1',
    })
    const recent = pushRecent([], session1)
    const session2 = drawSession({
      pool: pool(40),
      states,
      count: 10,
      now: NOW,
      seed: 's2',
      recent,
      lastSession: session1,
    })

    expect(session1).toHaveLength(10)
    expect(session2).toHaveLength(10)
    expect(session2.filter((id) => session1.includes(id))).toEqual([])
  })
})

describe('fenêtre glissante', () => {
  it('empile les derniers servis en tête et se borne à 20', () => {
    const w = pushRecent(['a', 'b'], ['x', 'y'])
    expect(w.slice(0, 2)).toEqual(['x', 'y'])
    expect(w).toHaveLength(4)

    const long = pushRecent(
      Array.from({ length: 30 }, (_, i) => `old${i}`),
      ['neuf'],
    )
    expect(long).toHaveLength(RECENT_WINDOW)
    expect(long[0]).toBe('neuf')
  })

  it('dédoublonne : une question re-servie remonte sans occuper deux places', () => {
    expect(pushRecent(['a', 'b', 'c'], ['b'])).toEqual(['b', 'a', 'c'])
  })
})

describe('poids de fraîcheur', () => {
  it('croît avec l’ancienneté, avec un plancher à 1', () => {
    expect(freshnessWeight(undefined, NOW)).toBe(1)
    expect(freshnessWeight(state(1, { lastSeenAt: NOW - 60 * MINUTE }), NOW)).toBe(1)
    expect(freshnessWeight(state(1, { lastSeenAt: NOW - 10 * DAY }), NOW)).toBe(10)
  })
})

// ================================================================= la maîtrise

describe('maîtrise d’un chapitre', () => {
  it('est nulle sur un vivier vide', () => {
    expect(chapterMastery([], new Map(), NOW)).toEqual({
      pct: 0,
      dueCount: 0,
      unseenCount: 0,
    })
  })

  it('compte les inédites au dénominateur', () => {
    // 1 question au sommet sur 10 : 10 %, pas 100 %.
    const states = statesOf([state(1, { box: 5, dueAt: NOW + 30 * DAY })])
    const m = chapterMastery(pool(10), states, NOW)
    expect(m.pct).toBe(10)
    expect(m.unseenCount).toBe(9)
    expect(m.dueCount).toBe(0)
  })

  it('atteint 100 % quand tout le vivier est en boîte 5', () => {
    const states = statesOf(
      pool(5).map((_, i) => state(i + 1, { box: 5, dueAt: NOW + 30 * DAY })),
    )
    expect(chapterMastery(pool(5), states, NOW).pct).toBe(100)
  })

  it('compte les échues sans les pénaliser : due n’est pas oublié', () => {
    const states = statesOf(
      pool(4).map((_, i) => state(i + 1, { box: 5, dueAt: NOW - DAY })),
    )
    const m = chapterMastery(pool(4), states, NOW)
    expect(m.pct).toBe(100)
    expect(m.dueCount).toBe(4)
  })

  it('donne 0 % à un chapitre entamé mais jamais réussi (tout en boîte 1)', () => {
    const states = statesOf(
      pool(4).map((_, i) =>
        state(i + 1, { box: 1, timesSeen: 3, timesCorrect: 0, timesWrong: 3 }),
      ),
    )
    const m = chapterMastery(pool(4), states, NOW)
    expect(m.pct).toBe(0)
    expect(m.unseenCount).toBe(0)
  })
})
