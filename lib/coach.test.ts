import { describe, it, expect } from 'vitest'
import { buildSessionPlan, daysUntil } from '@/lib/coach'
import type { RevisionSubject, RevisionItem } from '@/lib/types'

let itemId = 0
function makeItem(patch: Partial<RevisionItem>): RevisionItem {
  itemId += 1
  return {
    id: `i${itemId}`,
    subject_id: 's',
    title: `Item ${itemId}`,
    kind: 'chapitre',
    status: 'a_faire',
    created_at: '2026-01-01T00:00:00Z',
    ...patch,
  }
}

function makeSubject(patch: Partial<RevisionSubject>): RevisionSubject {
  return {
    id: 's1',
    name: 'Maths',
    exam: null,
    exam_date: null,
    priority: 'normale',
    created_at: '2026-01-01T00:00:00Z',
    revision_items: [],
    ...patch,
  }
}

// 'YYYY-MM-DD' local à J+n — même repère temporel que daysUntil.
function localDayPlus(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

describe('daysUntil', () => {
  it('null sans date, 0 aujourd’hui, n à J+n', () => {
    expect(daysUntil(null)).toBeNull()
    expect(daysUntil(localDayPlus(0))).toBe(0)
    expect(daysUntil(localDayPlus(10))).toBe(10)
  })
})

describe('buildSessionPlan', () => {
  it('exclut les éléments maîtrisés', () => {
    const plan = buildSessionPlan([
      makeSubject({
        revision_items: [
          makeItem({ status: 'maitrise' }),
          makeItem({ status: 'a_faire', title: 'Fractions' }),
        ],
      }),
    ])
    expect(plan).toHaveLength(1)
    expect(plan[0].itemTitle).toBe('Fractions')
  })

  it('la priorité de la matière passe avant tout', () => {
    const plan = buildSessionPlan([
      makeSubject({
        name: 'Histoire',
        priority: 'normale',
        revision_items: [makeItem({ status: 'a_revoir' })],
      }),
      makeSubject({
        id: 's2',
        name: 'Maths',
        priority: 'critique',
        revision_items: [makeItem({ status: 'en_cours' })],
      }),
    ])
    expect(plan[0].subjectName).toBe('Maths')
  })

  it('« à revoir » passe avant « à faire » à priorité égale', () => {
    const plan = buildSessionPlan([
      makeSubject({
        revision_items: [
          makeItem({ status: 'a_faire', title: 'Nouveau chapitre' }),
          makeItem({ status: 'a_revoir', title: 'À consolider' }),
        ],
      }),
    ])
    expect(plan[0].itemTitle).toBe('À consolider')
  })

  it('un examen à moins de 3 semaines fait gagner un cran d’urgence', () => {
    const plan = buildSessionPlan([
      makeSubject({
        name: 'Sans échéance',
        revision_items: [makeItem({ status: 'a_faire' })],
      }),
      makeSubject({
        id: 's2',
        name: 'Brevet dans 10 jours',
        exam: 'brevet',
        exam_date: localDayPlus(10),
        revision_items: [makeItem({ status: 'a_faire' })],
      }),
    ])
    expect(plan[0].subjectName).toBe('Brevet dans 10 jours')
    expect(plan[0].daysLeft).toBe(10)
  })

  it('respecte la limite demandée', () => {
    const items = Array.from({ length: 5 }, () => makeItem({}))
    const plan = buildSessionPlan([makeSubject({ revision_items: items })], 3)
    expect(plan).toHaveLength(3)
  })
})
