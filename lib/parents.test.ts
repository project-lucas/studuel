import { describe, expect, it } from 'vitest'
import {
  activityLevel,
  averageDailySeconds,
  formatWorkDuration,
  parentHeadline,
  scorePercent,
  strongestSubject,
  subjectState,
  subjectStateLabel,
  weakestSubjects,
  type SubjectScore,
} from './parents'

const subj = (subject: string, ratio: number, attempts = 3): SubjectScore => ({
  subject,
  ratio,
  attempts,
})

describe('subjectState', () => {
  it('classe selon les seuils de maîtrise (0.5 / 0.8)', () => {
    expect(subjectState(0.9)).toBe('maitrise')
    expect(subjectState(0.8)).toBe('maitrise')
    expect(subjectState(0.6)).toBe('en_cours')
    expect(subjectState(0.5)).toBe('en_cours')
    expect(subjectState(0.4)).toBe('fragile')
    expect(subjectState(0)).toBe('fragile')
  })

  it('donne un libellé français lisible', () => {
    expect(subjectStateLabel(0.9)).toBe('Maîtrisé')
    expect(subjectStateLabel(0.6)).toBe('En progrès')
    expect(subjectStateLabel(0.2)).toBe('À renforcer')
  })
})

describe('scorePercent', () => {
  it('convertit un ratio en pourcentage arrondi', () => {
    expect(scorePercent(0.755)).toBe(76)
    expect(scorePercent(0)).toBe(0)
    expect(scorePercent(1)).toBe(100)
  })

  it('gère null et valeurs non finies', () => {
    expect(scorePercent(null)).toBe(0)
    expect(scorePercent(Number.NaN)).toBe(0)
  })
})

describe('weakestSubjects', () => {
  it('retourne les matières sous le seuil de maîtrise, de la plus faible à la moins faible', () => {
    const data = [
      subj('Maths', 0.3),
      subj('Français', 0.9), // maîtrisé → exclu
      subj('Histoire', 0.55),
      subj('SVT', 0.45),
    ]
    const weak = weakestSubjects(data)
    expect(weak.map((s) => s.subject)).toEqual(['Maths', 'SVT', 'Histoire'])
  })

  it('ignore les matières avec trop peu de tentatives', () => {
    const data = [subj('Maths', 0.2, 1), subj('SVT', 0.4, 2)]
    const weak = weakestSubjects(data)
    expect(weak.map((s) => s.subject)).toEqual(['SVT'])
  })

  it('respecte la limite demandée', () => {
    const data = [
      subj('A', 0.1),
      subj('B', 0.2),
      subj('C', 0.3),
      subj('D', 0.4),
    ]
    expect(weakestSubjects(data, 2).map((s) => s.subject)).toEqual(['A', 'B'])
  })

  it('ne mute pas le tableau source', () => {
    const data = [subj('B', 0.4), subj('A', 0.2)]
    const snapshot = [...data]
    weakestSubjects(data)
    expect(data).toEqual(snapshot)
  })
})

describe('strongestSubject', () => {
  it('retourne la matière la mieux réussie avec assez de tentatives', () => {
    const data = [subj('Maths', 0.4), subj('Français', 0.85), subj('SVT', 0.7)]
    expect(strongestSubject(data)?.subject).toBe('Français')
  })

  it('retourne null si aucune matière éligible', () => {
    expect(strongestSubject([subj('Maths', 0.9, 1)])).toBeNull()
    expect(strongestSubject([])).toBeNull()
  })
})

describe('activityLevel', () => {
  it('classe le rythme de la semaine', () => {
    expect(activityLevel(0)).toBe('inactif')
    expect(activityLevel(2)).toBe('faible')
    expect(activityLevel(5)).toBe('regulier')
    expect(activityLevel(9)).toBe('intense')
  })
})

describe('parentHeadline', () => {
  it('mentionne la série quand elle est notable', () => {
    expect(parentHeadline(5, 4)).toContain("4 jours d'affilée")
  })

  it("ne mentionne pas la série quand elle est faible", () => {
    expect(parentHeadline(5, 1)).not.toContain("d'affilée")
  })

  it("ne se contredit pas : série active sans quiz n'affiche pas « aucune activité »", () => {
    // 5 jours d'affilée (révision/leçon/défi) mais 0 quiz sur 7 jours.
    const msg = parentHeadline(0, 5)
    expect(msg).toContain("5 jours d'affilée")
    expect(msg).not.toContain('Aucune activité')
    expect(msg.toLowerCase()).not.toContain('aucune activité')
  })
})

describe('formatWorkDuration', () => {
  it('formate heures et minutes', () => {
    expect(formatWorkDuration(45 * 60)).toBe('45 min')
    expect(formatWorkDuration(3600)).toBe('1 h')
    expect(formatWorkDuration(3600 + 30 * 60)).toBe('1 h 30')
    expect(formatWorkDuration(0)).toBe('0 min')
  })

  it('borne les valeurs négatives', () => {
    expect(formatWorkDuration(-100)).toBe('0 min')
  })
})

describe('averageDailySeconds', () => {
  it('moyenne sur les jours travaillés de la semaine', () => {
    expect(averageDailySeconds(3600, 3)).toBe(1200)
    expect(averageDailySeconds(45 * 60, 1)).toBe(2700)
  })

  it('retourne 0 sans jour travaillé', () => {
    expect(averageDailySeconds(0, 0)).toBe(0)
    expect(averageDailySeconds(3600, 0)).toBe(0)
  })

  it('borne les valeurs négatives', () => {
    expect(averageDailySeconds(-500, 2)).toBe(0)
  })
})
