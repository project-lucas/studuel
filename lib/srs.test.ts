import { describe, it, expect } from 'vitest'
import {
  SRS_INTERVALS,
  addDays,
  reviewAfterAnswer,
  reviewQueue,
  countsBySubject,
  sanitizeReviewAnswers,
  type ReviewItem,
  type ReviewAnswer,
  type ReviewState,
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

describe('SRS_INTERVALS', () => {
  it('suit les paliers de Leitner J+1, J+3, J+7, J+14, J+30', () => {
    // Réexportés depuis le moteur : une seule table d'intervalles dans l'app,
    // sinon la valeur écrite ici dériverait au premier réglage pédagogique.
    expect([...SRS_INTERVALS]).toEqual([1, 3, 7, 14, 30])
  })
})

describe('reviewAfterAnswer', () => {
  // Le barème lui-même est éprouvé dans lib/questions/engine.test.ts (boîtes,
  // intervalles, garde anti-bachotage). Ce qui se teste ICI, c'est la
  // TRADUCTION : la ligne `review_items` dans un sens, l'objet du moteur dans
  // l'autre — et la Revanche, la seule règle que le moteur ne connaît pas.
  const NOW = Date.UTC(2026, 6, 8, 9, 0, 0)
  const DAY = 24 * 60 * 60 * 1000

  const prev = (over: Partial<ReviewState> = {}): ReviewState => ({
    box: 1,
    streak: 0,
    lapses: 0,
    times_seen: 0,
    times_correct: 0,
    times_wrong: 0,
    due_at: new Date(NOW).toISOString(),
    last_seen_at: null,
    in_revanche: false,
    ...over,
  })

  it('premier passage réussi : boîte 2, J+3, hors Revanche', () => {
    const after = reviewAfterAnswer(null, true, NOW)
    expect(after.box).toBe(2)
    expect(after.streak).toBe(1)
    expect(after.times_seen).toBe(1)
    expect(after.times_correct).toBe(1)
    expect(after.in_revanche).toBe(false)
    expect(Date.parse(after.due_at)).toBe(NOW + 3 * DAY)
  })

  it('les succès consécutifs éloignent la prochaine révision', () => {
    // Item bien ÉCHU : le succès doit faire progresser le barème.
    const after = reviewAfterAnswer(
      prev({ box: 2, streak: 2, lapses: 1, times_seen: 3, times_wrong: 1 }),
      true,
      NOW,
    )
    expect(after.box).toBe(3)
    expect(after.streak).toBe(3)
    expect(Date.parse(after.due_at)).toBe(NOW + 7 * DAY)
    expect(after.lapses).toBe(1) // les erreurs passées restent comptées
  })

  it('une erreur renvoie en boîte 1, revient dans 10 min et entre dans la Revanche', () => {
    const after = reviewAfterAnswer(
      prev({ box: 4, streak: 4, due_at: new Date(NOW + 30 * DAY).toISOString() }),
      false,
      NOW,
    )
    expect(after.box).toBe(1)
    expect(after.streak).toBe(0)
    expect(after.lapses).toBe(1)
    expect(after.in_revanche).toBe(true)
    // L'échéance courte que la colonne DATE de la 021 ne savait pas porter.
    expect(Date.parse(after.due_at)).toBe(NOW + 10 * 60 * 1000)
  })

  it('une bonne réponse venge une erreur (sortie de la Revanche)', () => {
    const failed = reviewAfterAnswer(null, false, NOW)
    expect(failed.in_revanche).toBe(true)

    const avenged = reviewAfterAnswer(failed, true, NOW + 11 * 60 * 1000)
    expect(avenged.in_revanche).toBe(false)
    expect(avenged.streak).toBe(1)
    expect(avenged.box).toBe(2)
  })

  it('venge une erreur MÊME avant l’échéance : la Revanche n’est pas la boîte', () => {
    // Différence de nature assumée : la boîte de Leitner mesure la mémoire à
    // long terme (l'espacement compte), la Revanche est un cahier d'erreurs
    // qu'on vient rayer (réussir suffit).
    const enRevanche = prev({
      box: 1,
      lapses: 1,
      times_seen: 1,
      times_wrong: 1,
      in_revanche: true,
      due_at: new Date(NOW + DAY).toISOString(), // pas encore dû
    })

    const avenged = reviewAfterAnswer(enRevanche, true, NOW)
    expect(avenged.in_revanche).toBe(false)
    // La boîte, elle, ne bouge pas : l'échéance n'était pas tombée.
    expect(avenged.box).toBe(1)
  })

  it('n’avance PAS le barème sur un succès avant l’échéance', () => {
    // Le bug historique : le même item revenait via plusieurs modes de jeu le
    // même jour (quiz de la leçon, Boss, Chrono, Blitz, Duel…) et chaque bonne
    // réponse allongeait l'intervalle.
    const pasDu = prev({
      box: 2,
      streak: 1,
      times_seen: 1,
      times_correct: 1,
      due_at: new Date(NOW + DAY).toISOString(),
    })

    const after = reviewAfterAnswer(pasDu, true, NOW)
    expect(after.box).toBe(2)
    expect(after.due_at).toBe(pasDu.due_at)
    // Le passage compte quand même — c'est ce que l'ancienne version perdait.
    expect(after.times_seen).toBe(2)
  })

  it('le bachotage d’une journée ne peut plus atteindre le palier maximal', () => {
    // Rejoue 5 succès d'affilée dans l'heure, comme le ferait un élève qui
    // enchaîne les modes : l'item doit rester en boîte 2.
    let state = reviewAfterAnswer(null, true, NOW)
    const echeance = state.due_at
    for (let i = 1; i <= 4; i++) {
      state = reviewAfterAnswer(state, true, NOW + i * 60_000)
    }

    expect(state.box).toBe(2)
    expect(state.due_at).toBe(echeance)
    expect(state.times_seen).toBe(5)
  })

  it('mais un échec compte TOUJOURS, même avant l’échéance', () => {
    // Oublier est une information : on ne l'ignore pas sous prétexte que
    // l'item n'était pas encore programmé.
    const after = reviewAfterAnswer(
      prev({ box: 5, streak: 4, due_at: new Date(NOW + 30 * DAY).toISOString() }),
      false,
      NOW,
    )
    expect(after.box).toBe(1)
    expect(after.streak).toBe(0)
    expect(after.in_revanche).toBe(true)
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
