import { describe, it, expect } from 'vitest'
import { duelGoal, duelGoalSentence } from './duel-cta'
import { MIN_POINTS_TO_CLAIM } from './clan-week'

// 2026-07-29 est un MERCREDI (lundi = index 0 → il reste 5 jours).
const MERCREDI = '2026-07-29'
const DIMANCHE = '2026-08-02'

describe('duelGoal', () => {
  it("n'invente aucun compteur sans semaine de clan", () => {
    expect(duelGoal(null, MERCREDI)).toBeNull()
  })

  it('écarte une valeur illisible plutôt que d’afficher NaN', () => {
    expect(duelGoal(Number.NaN, MERCREDI)).toBeNull()
  })

  it('vise le seuil qui ouvre le droit au coffre', () => {
    const goal = duelGoal(0, MERCREDI)!
    expect(goal.goal).toBe(MIN_POINTS_TO_CLAIM)
    expect(goal.reached).toBe(false)
    expect(goal.ratio).toBe(0)
    expect(goal.label).toBe(`0/${MIN_POINTS_TO_CLAIM} pts`)
  })

  it('remplit la barre à proportion du seuil', () => {
    const goal = duelGoal(MIN_POINTS_TO_CLAIM / 2, MERCREDI)!
    expect(goal.ratio).toBeCloseTo(0.5)
  })

  it('bascule sur le total une fois le seuil franchi', () => {
    const goal = duelGoal(MIN_POINTS_TO_CLAIM + 70, MERCREDI)!
    expect(goal.reached).toBe(true)
    expect(goal.ratio).toBe(1)
    expect(goal.label).toBe('120 pts')
    expect(goal.label).not.toContain('/')
  })

  it('ne déborde jamais de la barre', () => {
    expect(duelGoal(100_000, MERCREDI)!.ratio).toBe(1)
  })

  it('ramène une contribution négative à zéro', () => {
    expect(duelGoal(-40, MERCREDI)!.current).toBe(0)
  })

  it('porte l’échéance de la semaine de clan', () => {
    expect(duelGoal(10, MERCREDI)!.countdown).toBe('5 jours restants')
    expect(duelGoal(10, DIMANCHE)!.countdown).toBe('Dernier jour !')
  })

  // La ligne du bouton ne fait que ~130 px : tout ce qui s'y écrit doit tenir
  // sans point de suspension — d'où le compteur et l'échéance télégraphiques.
  it('donne une échéance courte pour la ligne du bouton', () => {
    expect(duelGoal(10, MERCREDI)!.deadline).toBe('5 j')
    expect(duelGoal(10, DIMANCHE)!.deadline).toBe('Dernier jour')
  })

  it('garde la ligne du bouton assez courte pour ne jamais être coupée', () => {
    const pire = duelGoal(1200, DIMANCHE)!
    expect(`${pire.label} · ${pire.deadline}`.length).toBeLessThanOrEqual(26)
  })
})

describe('duelGoalSentence', () => {
  it('dit le reste à faire tant que le seuil n’est pas atteint', () => {
    const phrase = duelGoalSentence(duelGoal(10, MERCREDI)!)
    expect(phrase).toContain(`10 points sur ${MIN_POINTS_TO_CLAIM}`)
    expect(phrase).toContain('5 jours restants')
  })

  it('félicite une fois le droit acquis', () => {
    expect(duelGoalSentence(duelGoal(200, MERCREDI)!)).toContain('apporté 200')
  })
})
