import { describe, it, expect } from 'vitest'
import {
  SRS_INTERVALS,
  addDays,
  intervalForStreak,
  reviewAfterAnswer,
  reviewQueue,
  countsBySubject,
  sanitizeReviewAnswers,
  type ReviewItem,
  type ReviewAnswer,
} from '@/lib/srs'

const item = (over: Partial<ReviewItem>): ReviewItem => ({
  item_kind: 'question',
  item_id: 'q1',
  subject: 'Maths',
  streak: 0,
  lapses: 0,
  due_date: '2026-07-08',
  in_revanche: false,
  ...over,
})

describe('addDays', () => {
  it('avance dans le mois et passe les fins de mois', () => {
    expect(addDays('2026-07-08', 1)).toBe('2026-07-09')
    expect(addDays('2026-07-30', 3)).toBe('2026-08-02')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })
})

describe('intervalForStreak', () => {
  it('suit les paliers J+1, J+3, J+7, J+16, J+35', () => {
    expect(intervalForStreak(1)).toBe(1)
    expect(intervalForStreak(2)).toBe(3)
    expect(intervalForStreak(3)).toBe(7)
    expect(intervalForStreak(4)).toBe(16)
    expect(intervalForStreak(5)).toBe(35)
  })

  it('plafonne au dernier palier sur les longues séries', () => {
    expect(intervalForStreak(12)).toBe(SRS_INTERVALS[SRS_INTERVALS.length - 1])
  })
})

describe('reviewAfterAnswer', () => {
  const today = '2026-07-08'

  it('premier passage réussi : J+1, hors Revanche', () => {
    expect(reviewAfterAnswer(null, true, today)).toEqual({
      streak: 1,
      lapses: 0,
      due_date: '2026-07-09',
      in_revanche: false,
    })
  })

  it('les succès consécutifs éloignent la prochaine révision', () => {
    // Item bien ÉCHU aujourd'hui : le succès doit faire progresser le barème.
    const after = reviewAfterAnswer(
      { streak: 2, lapses: 1, due_date: today, in_revanche: false },
      true,
      today,
    )
    expect(after.streak).toBe(3)
    expect(after.due_date).toBe(addDays(today, 7))
    expect(after.lapses).toBe(1) // les erreurs passées restent comptées
  })

  it("une erreur réinitialise la série, revient demain et entre dans la Revanche", () => {
    const prev = { streak: 4, lapses: 0, due_date: addDays(today, 30), in_revanche: false }
    expect(reviewAfterAnswer(prev, false, today)).toEqual({
      streak: 0,
      lapses: 1,
      due_date: '2026-07-09',
      in_revanche: true,
    })
  })

  it('une bonne réponse venge une erreur (sortie de la Revanche)', () => {
    const failed = reviewAfterAnswer(null, false, today)
    expect(failed.in_revanche).toBe(true)
    const avenged = reviewAfterAnswer(failed, true, addDays(today, 1))
    expect(avenged.in_revanche).toBe(false)
    expect(avenged.streak).toBe(1)
  })

  it('n’avance PAS le barème sur un succès avant l’échéance', () => {
    // Le bug historique : le même item revenait via plusieurs modes de jeu le
    // même jour (quiz de la leçon, Boss, Chrono, Blitz, Duel…) et chaque bonne
    // réponse allongeait l'intervalle — J+1 à J+35 en une seule session.
    const prev = {
      streak: 1,
      lapses: 0,
      due_date: addDays(today, 1), // pas encore dû
      in_revanche: false,
    }

    expect(reviewAfterAnswer(prev, true, today)).toEqual(prev)
  })

  it('le bachotage d’une journée ne peut plus atteindre le palier maximal', () => {
    // Rejoue 5 succès d'affilée le MÊME jour, comme le ferait un élève qui
    // enchaîne les modes : l'item doit rester à J+1, pas filer à J+35.
    let state = reviewAfterAnswer(null, true, today)
    const apresPremier = { ...state }
    for (let i = 0; i < 4; i++) state = reviewAfterAnswer(state, true, today)

    expect(state).toEqual(apresPremier)
    expect(state.due_date).toBe(addDays(today, 1))
    expect(state.streak).toBe(1)
  })

  it('mais un échec compte TOUJOURS, même avant l’échéance', () => {
    // Oublier est une information : on ne l'ignore pas sous prétexte que
    // l'item n'était pas encore programmé.
    const prev = {
      streak: 4,
      lapses: 0,
      due_date: addDays(today, 30),
      in_revanche: false,
    }

    const after = reviewAfterAnswer(prev, false, today)

    expect(after.streak).toBe(0)
    expect(after.in_revanche).toBe(true)
    expect(after.due_date).toBe(addDays(today, 1))
  })

  it('un item en Revanche reste jouable le jour même', () => {
    // La Revanche est dans la file par construction : la garde d'échéance ne
    // doit pas empêcher de la venger tout de suite.
    const enRevanche = {
      streak: 0,
      lapses: 1,
      due_date: addDays(today, 1),
      in_revanche: true,
    }

    const avenged = reviewAfterAnswer(enRevanche, true, today)

    expect(avenged.in_revanche).toBe(false)
    expect(avenged.streak).toBe(1)
  })
})


describe('reviewQueue', () => {
  const today = '2026-07-08'

  it('retient les items dus (aujourd’hui ou en retard) et la Revanche', () => {
    const items = [
      item({ item_id: 'due', due_date: '2026-07-08' }),
      item({ item_id: 'late', due_date: '2026-07-01' }),
      item({ item_id: 'future', due_date: '2026-07-20' }),
      item({ item_id: 'rev', due_date: '2026-07-20', in_revanche: true }),
    ]
    const ids = reviewQueue(items, today).map((i) => i.item_id)
    expect(ids).toContain('due')
    expect(ids).toContain('late')
    expect(ids).toContain('rev')
    expect(ids).not.toContain('future')
  })

  it('classe la Revanche d’abord, puis les plus en retard', () => {
    const items = [
      item({ item_id: 'due', due_date: '2026-07-08' }),
      item({ item_id: 'late', due_date: '2026-07-01' }),
      item({ item_id: 'rev', due_date: '2026-07-09', in_revanche: true }),
    ]
    expect(reviewQueue(items, today).map((i) => i.item_id)).toEqual([
      'rev',
      'late',
      'due',
    ])
  })
})

describe('countsBySubject', () => {
  it('compte par matière, « Autre » pour les items sans matière', () => {
    const counts = countsBySubject([
      item({ subject: 'Maths' }),
      item({ subject: 'Maths' }),
      item({ subject: 'Anglais' }),
      item({ subject: null }),
    ])
    expect(counts.get('Maths')).toBe(2)
    expect(counts.get('Anglais')).toBe(1)
    expect(counts.get('Autre')).toBe(1)
  })
})

describe('sanitizeReviewAnswers', () => {
  const uuidA = '11111111-1111-4111-8111-111111111111'
  const uuidB = '22222222-2222-4222-8222-222222222222'
  const ans = (over: Partial<ReviewAnswer>): ReviewAnswer => ({
    kind: 'question',
    id: uuidA,
    subject: 'Maths',
    good: true,
    ...over,
  })

  it('dédoublonne par item en gardant la DERNIÈRE réponse', () => {
    const out = sanitizeReviewAnswers([
      ans({ id: uuidA, good: false }),
      ans({ id: uuidA, good: true }), // même item, doit écraser
      ans({ id: uuidB, good: false }),
    ])
    expect(out).toHaveLength(2)
    expect(out.find((a) => a.id === uuidA)?.good).toBe(true)
  })

  it('rejette les entrées à kind inconnu ou UUID invalide', () => {
    const out = sanitizeReviewAnswers([
      ans({ id: 'pas-un-uuid' }),
      ans({ kind: 'bidon' as ReviewAnswer['kind'] }),
      ans({ id: uuidB }),
    ])
    expect(out).toHaveLength(1)
    expect(out[0].id).toBe(uuidB)
  })

  it('normalise good non-booléen à false et borne le sujet à 80 caractères', () => {
    const out = sanitizeReviewAnswers([
      ans({ good: 'oui' as unknown as boolean, subject: 'x'.repeat(200) }),
    ])
    expect(out[0].good).toBe(false)
    expect(out[0].subject).toHaveLength(80)
  })

  it('tolère une entrée non-tableau', () => {
    expect(sanitizeReviewAnswers(null as unknown as ReviewAnswer[])).toEqual([])
  })
})
