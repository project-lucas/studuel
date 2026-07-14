import { describe, it, expect } from 'vitest'
import { examsForProfile } from '@/lib/exams'
import type { Subject, SubjectCategory } from '@/lib/types'

// Fabrique une matière de catalogue minimale pour les tests.
const subj = (
  slug: string,
  name: string,
  category: SubjectCategory = 'college',
  levels: string[] = [],
): Subject => ({
  id: slug,
  slug,
  name,
  icon: '',
  color: 'maths',
  category,
  levels,
})

// Les 5 matières écrites du brevet.
const brevetCatalog: Subject[] = [
  subj('francais', 'Français'),
  subj('maths', 'Maths'),
  subj('histoire-geo', 'Histoire-Géo'),
  subj('svt', 'SVT'),
  subj('physique-chimie', 'Physique-Chimie'),
]

describe('examsForProfile', () => {
  it('aucune épreuve officielle en 6e, 5e, 4e et 2de', () => {
    for (const grade of ['6e', '5e', '4e', '2de']) {
      expect(examsForProfile(grade, null, brevetCatalog)).toEqual([])
    }
  })

  it('3e → le brevet, une épreuve par matière présente au catalogue', () => {
    const exams = examsForProfile('3e', null, brevetCatalog)
    expect(exams).toHaveLength(5)
    expect(exams.map((e) => e.label)).toEqual([
      'Brevet — Français',
      'Brevet — Maths',
      'Brevet — Histoire-Géo',
      'Brevet — Sciences (SVT)',
      'Brevet — Sciences (Physique-Chimie)',
    ])
    // Chaque épreuve pointe vers la matière du catalogue.
    expect(exams[0].subject.slug).toBe('francais')
  })

  it('3e → les matières absentes du catalogue sont ignorées', () => {
    const partial = [subj('francais', 'Français'), subj('maths', 'Maths')]
    const exams = examsForProfile('3e', null, partial)
    expect(exams.map((e) => e.subject.slug)).toEqual(['francais', 'maths'])
  })

  it('3e → le brevet ignore la sélection de matières (toujours toutes les écrites)', () => {
    // Même avec une sélection restrictive, le brevet reste complet.
    expect(examsForProfile('3e', ['maths'], brevetCatalog)).toHaveLength(5)
    expect(examsForProfile('3e', [], brevetCatalog)).toHaveLength(5)
  })

  it('1re → le bac de français si la matière existe, sinon rien', () => {
    const withFr = examsForProfile('1re', null, brevetCatalog)
    expect(withFr).toEqual([
      { label: 'Bac de français — écrit & oral', subject: brevetCatalog[0] },
    ])

    const withoutFr = examsForProfile('1re', null, [subj('maths', 'Maths')])
    expect(withoutFr).toEqual([])
  })

  const tleCatalog: Subject[] = [
    subj('philosophie', 'Philosophie', 'tronc_commun', ['Tle']),
    subj('maths', 'Maths', 'specialite', ['1re', 'Tle']),
    subj('nsi', 'NSI', 'specialite', ['Tle']),
    subj('ses', 'SES', 'specialite', ['1re']), // spé mais pas en Tle → exclue
    subj('latin', 'Latin', 'option', ['Tle']), // option (pas spé) → exclue
  ]

  it('Tle → philosophie (tronc commun) puis les spécialités de Tle', () => {
    const exams = examsForProfile('Tle', null, tleCatalog)
    expect(exams.map((e) => e.label)).toEqual([
      'Bac — Philosophie',
      'Bac — Spécialité Maths',
      'Bac — Spécialité NSI',
    ])
    // La philo passe avant les spécialités.
    expect(exams[0].subject.slug).toBe('philosophie')
  })

  it('Tle → seule une spécialité de niveau Tle et de catégorie specialite est retenue', () => {
    const exams = examsForProfile('Tle', null, tleCatalog)
    const slugs = exams.map((e) => e.subject.slug)
    expect(slugs).not.toContain('ses') // spécialité 1re uniquement
    expect(slugs).not.toContain('latin') // option, pas spécialité
  })

  it('Tle → une sélection restreint les spécialités mais garde la philo', () => {
    const exams = examsForProfile('Tle', ['maths'], tleCatalog)
    expect(exams.map((e) => e.label)).toEqual([
      'Bac — Philosophie',
      'Bac — Spécialité Maths',
    ])
  })

  it('Tle → une sélection vide vaut « toutes les spécialités »', () => {
    // selected = [] est traité comme « pas de filtre » (comme null).
    const exams = examsForProfile('Tle', [], tleCatalog)
    expect(exams).toHaveLength(3)
  })

  it('Tle → sans philosophie au catalogue, seules les spécialités restent', () => {
    const exams = examsForProfile('Tle', null, tleCatalog.slice(1))
    expect(exams.map((e) => e.label)).toEqual([
      'Bac — Spécialité Maths',
      'Bac — Spécialité NSI',
    ])
  })
})
