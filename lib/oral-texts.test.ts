import { describe, it, expect } from 'vitest'
import {
  MAX_ORAL_TEXTS,
  normalizeOralText,
  normalizeOralList,
  addOralText,
  removeOralText,
  setOralStatus,
  nextOralStatus,
  oralProgress,
  oralCounts,
  isOralStatus,
  type OralText,
} from '@/lib/oral-texts'

const text = (
  id: string,
  title = `Texte ${id}`,
  status: OralText['status'] = 'a_faire',
  work: string | null = null,
): OralText => ({ id, title, work, status })

describe('normalizeOralText', () => {
  it('accepte un texte bien formé et rogne le titre', () => {
    expect(
      normalizeOralText({
        id: 'a',
        title: '  Le Malade imaginaire  ',
        work: '  Molière  ',
        status: 'en_cours',
      }),
    ).toEqual({
      id: 'a',
      title: 'Le Malade imaginaire',
      work: 'Molière',
      status: 'en_cours',
    })
  })

  it('rejette id ou titre manquant/vide', () => {
    expect(normalizeOralText({ id: '', title: 'x' })).toBeNull()
    expect(normalizeOralText({ id: 'a', title: '   ' })).toBeNull()
    expect(normalizeOralText({ title: 'x' })).toBeNull()
    expect(normalizeOralText(null)).toBeNull()
    expect(normalizeOralText('nope')).toBeNull()
  })

  it('œuvre absente → null, statut inconnu → « à faire »', () => {
    expect(normalizeOralText({ id: 'a', title: 'x' })).toEqual({
      id: 'a',
      title: 'x',
      work: null,
      status: 'a_faire',
    })
    expect(
      normalizeOralText({ id: 'a', title: 'x', status: 'bidon' })?.status,
    ).toBe('a_faire')
  })
})

describe('isOralStatus', () => {
  it('ne reconnaît que les 3 statuts', () => {
    expect(isOralStatus('a_faire')).toBe(true)
    expect(isOralStatus('en_cours')).toBe(true)
    expect(isOralStatus('maitrise')).toBe(true)
    expect(isOralStatus('maîtrisé')).toBe(false)
    expect(isOralStatus(2)).toBe(false)
  })
})

describe('normalizeOralList', () => {
  it('non-tableau → liste vide', () => {
    expect(normalizeOralList(null)).toEqual([])
    expect(normalizeOralList({ id: 'a' })).toEqual([])
  })

  it('jette les entrées invalides et dédoublonne par id (dernière gagne)', () => {
    const list = normalizeOralList([
      text('a', 'Premier'),
      'invalide',
      { id: 'a', title: 'Écrasé', status: 'maitrise' },
      text('b'),
    ])
    expect(list.map((t) => t.id)).toEqual(['a', 'b'])
    expect(list[0]).toMatchObject({ title: 'Écrasé', status: 'maitrise' })
  })

  it('borne aux plus récents', () => {
    const many = Array.from({ length: MAX_ORAL_TEXTS + 5 }, (_, i) =>
      text(`t${i}`),
    )
    const list = normalizeOralList(many)
    expect(list).toHaveLength(MAX_ORAL_TEXTS)
    expect(list[list.length - 1].id).toBe(`t${MAX_ORAL_TEXTS + 4}`)
  })
})

describe('addOralText / removeOralText', () => {
  it('ajoute sans muter la liste source', () => {
    const base = [text('a')]
    const next = addOralText(base, text('b'))
    expect(next.map((t) => t.id)).toEqual(['a', 'b'])
    expect(base).toHaveLength(1)
  })

  it('remplace le texte de même id (dernier gagne)', () => {
    const next = addOralText([text('a', 'Vieux')], text('a', 'Neuf', 'maitrise'))
    expect(next).toHaveLength(1)
    expect(next[0]).toMatchObject({ title: 'Neuf', status: 'maitrise' })
  })

  it('retire par id', () => {
    expect(removeOralText([text('a'), text('b')], 'a').map((t) => t.id)).toEqual(
      ['b'],
    )
  })
})

describe('setOralStatus', () => {
  it('change le statut du bon texte uniquement', () => {
    const next = setOralStatus([text('a'), text('b')], 'a', 'maitrise')
    expect(next[0].status).toBe('maitrise')
    expect(next[1].status).toBe('a_faire')
  })

  it('id inconnu → liste inchangée en contenu', () => {
    const base = [text('a')]
    expect(setOralStatus(base, 'zzz', 'maitrise')).toEqual(base)
  })
})

describe('nextOralStatus', () => {
  it('cycle à faire → en cours → maîtrisé → à faire', () => {
    expect(nextOralStatus('a_faire')).toBe('en_cours')
    expect(nextOralStatus('en_cours')).toBe('maitrise')
    expect(nextOralStatus('maitrise')).toBe('a_faire')
  })
})

describe('oralProgress', () => {
  it('liste vide → 0', () => {
    expect(oralProgress([])).toBe(0)
  })

  it('maîtrisé = 1, en cours = 0,5, à faire = 0', () => {
    const list = [
      text('a', 'a', 'maitrise'),
      text('b', 'b', 'en_cours'),
      text('c', 'c', 'a_faire'),
      text('d', 'd', 'a_faire'),
    ]
    // (1 + 0,5 + 0 + 0) / 4 = 0,375
    expect(oralProgress(list)).toBeCloseTo(0.375)
  })

  it('tout maîtrisé → 1', () => {
    expect(
      oralProgress([text('a', 'a', 'maitrise'), text('b', 'b', 'maitrise')]),
    ).toBe(1)
  })
})

describe('oralCounts', () => {
  it('compte par statut', () => {
    const list = [
      text('a', 'a', 'maitrise'),
      text('b', 'b', 'maitrise'),
      text('c', 'c', 'en_cours'),
      text('d', 'd', 'a_faire'),
    ]
    expect(oralCounts(list)).toEqual({ a_faire: 1, en_cours: 1, maitrise: 2 })
  })

  it('liste vide → tout à zéro', () => {
    expect(oralCounts([])).toEqual({ a_faire: 0, en_cours: 0, maitrise: 0 })
  })
})
