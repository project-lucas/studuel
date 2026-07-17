import { describe, expect, it } from 'vitest'
import {
  computeTrajectoire,
  monthLabelFr,
  trajectoireTarget,
} from './trajectoire'

describe('trajectoireTarget', () => {
  it('vise le 15 juin de l’année scolaire en cours', () => {
    // En janvier → juin de la même année ; en septembre → juin suivant.
    expect(trajectoireTarget('3e', '2027-01-10').dateKey).toBe('2027-06-15')
    expect(trajectoireTarget('3e', '2026-09-01').dateKey).toBe('2027-06-15')
    // L'été appartient à l'année qui démarre (juillet → juin suivant).
    expect(trajectoireTarget('3e', '2026-07-17').dateKey).toBe('2027-06-15')
    // Jusqu'à fin juin, on reste sur l'échéance courante.
    expect(trajectoireTarget('3e', '2027-06-20').dateKey).toBe('2027-06-15')
  })

  it('nomme l’examen des classes à examen, sinon la fin d’année', () => {
    expect(trajectoireTarget('3e', '2026-09-01')).toMatchObject({
      label: 'le brevet',
      isExam: true,
    })
    expect(trajectoireTarget('1re', '2026-09-01').label).toBe(
      'le bac de français',
    )
    expect(trajectoireTarget('Tle', '2026-09-01').label).toBe('le bac')
    expect(trajectoireTarget('5e', '2026-09-01')).toMatchObject({
      label: "la fin d'année",
      isExam: false,
    })
  })
})

describe('computeTrajectoire', () => {
  const base = {
    grade: '3e',
    todayKey: '2026-11-16', // lundi de novembre, année scolaire 2026-27
    firstActivityKey: '2026-09-07', // 10 semaines plus tôt
  }

  it('calcule préparation, validés et rythme moyen', () => {
    // 10 chapitres : 5 validés (≥ 0.8), 5 à zéro → préparation 0.45.
    const t = computeTrajectoire({
      ...base,
      masteryValues: [1, 0.8, 0.9, 0.8, 1, 0, 0, 0, 0, 0],
    })
    expect(t.chaptersDone).toBe(5)
    expect(t.chaptersTotal).toBe(10)
    expect(t.readiness).toBeCloseTo(0.45)
    expect(t.perWeek).toBeCloseTo(0.5, 1) // 5 chapitres en 10 semaines
    // 5 restants à 0.5/sem → ~10 semaines → fin janvier, avant le brevet.
    expect(t.projectedKey).toBe('2027-01-25')
    expect(t.onTrack).toBe(true)
  })

  it('détecte le retard sur l’échéance', () => {
    // 1 validé en 10 semaines, 39 restants → ~390 semaines : hors délai.
    const t = computeTrajectoire({
      ...base,
      masteryValues: [1, ...Array.from({ length: 39 }, () => 0)],
    })
    expect(t.onTrack).toBe(false)
  })

  it('sans historique ni validation : pas de projection, pas de fausse promesse', () => {
    const t = computeTrajectoire({
      ...base,
      firstActivityKey: null,
      masteryValues: [0.3, 0.1, 0],
    })
    expect(t.perWeek).toBeNull()
    expect(t.projectedKey).toBeNull()
    expect(t.onTrack).toBeNull()
  })

  it('tout validé → prêt aujourd’hui', () => {
    const t = computeTrajectoire({ ...base, masteryValues: [1, 0.9, 0.85] })
    expect(t.projectedKey).toBe(base.todayKey)
    expect(t.onTrack).toBe(true)
    expect(t.readiness).toBeGreaterThan(0.9)
  })

  it('zéro chapitre suivi → trajectoire vide sûre', () => {
    const t = computeTrajectoire({ ...base, masteryValues: [] })
    expect(t.readiness).toBe(0)
    expect(t.chaptersTotal).toBe(0)
    expect(t.projectedKey).toBeNull()
  })
})

describe('monthLabelFr', () => {
  it('formate le mois en français', () => {
    expect(monthLabelFr('2027-04-03')).toBe('avril 2027')
    expect(monthLabelFr('2027-01-25')).toBe('janvier 2027')
  })
})
