import { describe, expect, it } from 'vitest'
import {
  sectionFor,
  groupShelf,
  relativeLabel,
  previewLines,
  previewMeta,
  PREVIEW_MAX_LINES,
} from '@/lib/library-shelf'

// Un « maintenant » fixe : 17 juillet 2026, 14h00 UTC.
const NOW = new Date('2026-07-17T14:00:00Z')

describe('sectionFor', () => {
  it('classe le même jour UTC dans « Aujourd’hui »', () => {
    expect(sectionFor('2026-07-17T06:00:00Z', NOW)).toBe('today')
  })

  it('classe les 7 derniers jours dans « Cette semaine »', () => {
    expect(sectionFor('2026-07-16T23:00:00Z', NOW)).toBe('week')
    expect(sectionFor('2026-07-10T08:00:00Z', NOW)).toBe('week')
  })

  it('classe le reste (et les dates invalides) dans « Plus ancien »', () => {
    expect(sectionFor('2026-07-01T08:00:00Z', NOW)).toBe('older')
    expect(sectionFor('n’importe quoi', NOW)).toBe('older')
  })
})

describe('groupShelf', () => {
  it('groupe en préservant l’ordre et masque les sections vides', () => {
    const items = [
      { id: 'a', updatedAt: '2026-07-17T13:00:00Z' },
      { id: 'b', updatedAt: '2026-07-17T09:00:00Z' },
      { id: 'c', updatedAt: '2026-07-02T09:00:00Z' },
    ]
    const groups = groupShelf(items, NOW)
    expect(groups.map((g) => g.id)).toEqual(['today', 'older'])
    expect(groups[0].items.map((i) => i.id)).toEqual(['a', 'b'])
    expect(groups[0].label).toBe('Aujourd’hui')
  })
})

describe('relativeLabel', () => {
  it('parle en minutes, heures, puis jours', () => {
    expect(relativeLabel('2026-07-17T13:44:00Z', NOW)).toBe('il y a 16 min')
    expect(relativeLabel('2026-07-17T11:00:00Z', NOW)).toBe('il y a 3 h')
    expect(relativeLabel('2026-07-16T13:00:00Z', NOW)).toBe('hier')
    expect(relativeLabel('2026-07-12T13:00:00Z', NOW)).toBe('il y a 5 j')
  })

  it('bascule sur la date au-delà de 30 jours', () => {
    expect(relativeLabel('2026-05-02T10:00:00Z', NOW)).toMatch(/2|mai/)
  })

  it('reste vide sur une date invalide', () => {
    expect(relativeLabel('', NOW)).toBe('')
  })
})

describe('previewLines', () => {
  it('nettoie le markdown d’une fiche et borne le nombre de lignes', () => {
    const markdown = [
      '# Causes profondes',
      '- Rivalités **coloniales**',
      '',
      '> Course aux armements',
      'a',
      'b',
      'c',
      'd',
    ].join('\n')
    const lines = previewLines('fiche', { markdown })
    expect(lines[0]).toBe('Causes profondes')
    expect(lines[1]).toBe('Rivalités coloniales')
    expect(lines[2]).toBe('Course aux armements')
    expect(lines).toHaveLength(PREVIEW_MAX_LINES)
  })

  it('numérote les questions d’un quiz', () => {
    const lines = previewLines('quiz', {
      questions: [
        {
          question: 'Quand éclate la guerre ?',
          options: ['1914', '1918'],
          correct_index: 0,
          explanation: null,
        },
      ],
    })
    expect(lines).toEqual(['1. Quand éclate la guerre ?'])
  })

  it('déroule centre puis branches d’une carte mentale', () => {
    const lines = previewLines('carte', {
      centre: '1re Guerre mondiale',
      branches: [
        { titre: 'Causes', enfants: [] },
        { titre: 'Phases', enfants: [] },
      ],
    })
    expect(lines).toEqual(['1re Guerre mondiale', '→ Causes', '→ Phases'])
  })
})

describe('previewMeta', () => {
  it('compte les questions et les branches, rien pour la fiche', () => {
    expect(
      previewMeta('quiz', {
        questions: [
          {
            question: 'Q',
            options: ['a', 'b'],
            correct_index: 0,
            explanation: null,
          },
        ],
      }),
    ).toBe('1 question')
    expect(
      previewMeta('carte', {
        centre: 'c',
        branches: [
          { titre: 'a', enfants: [] },
          { titre: 'b', enfants: [] },
        ],
      }),
    ).toBe('2 branches')
    expect(previewMeta('fiche', { markdown: 'x' })).toBeNull()
  })
})
