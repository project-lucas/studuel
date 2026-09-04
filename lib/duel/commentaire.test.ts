import { describe, expect, it } from 'vitest'
import { bulleRival, commentaire, rivalParle, type CourseMoment, type RivalMood } from '@/lib/duel/commentaire'
import { TEMPERAMENTS } from '@/lib/duel/rival'

const MOMENTS: CourseMoment[] = [
  'depart', 'me-double', 'rival-double', 'doree', 'sprint', 'serie-3', 'serie-6',
  'serie-cassee', 'me-arrivee', 'rival-arrivee', 'dernieres-secondes',
]
const MOODS: RivalMood[] = ['marque', 'rate', 'double', 'double-par', 'serie', 'arrivee']

describe('le commentaire', () => {
  it('a un texte court et un ton pour chaque moment', () => {
    for (const m of MOMENTS) {
      const c = commentaire(m, 'Nina')
      expect(c.texte.length).toBeGreaterThan(3)
      expect(c.texte.length).toBeLessThan(40)
      expect(['moi', 'rival', 'neutre', 'dore']).toContain(c.ton)
    }
  })

  it('nomme le rival quand c’est lui qui agit', () => {
    expect(commentaire('rival-double', 'Nina').texte).toContain('Nina')
    expect(commentaire('rival-double', 'Nina').ton).toBe('rival')
    expect(commentaire('me-double', 'Nina').ton).toBe('moi')
    expect(commentaire('doree', 'Nina').ton).toBe('dore')
  })
})

describe('les bulles du rival', () => {
  it('sont déterministes, et varient d’une occurrence à l’autre', () => {
    expect(bulleRival('s', 'fleche', 'marque', 0)).toBe(bulleRival('s', 'fleche', 'marque', 0))
    const phrases = new Set(Array.from({ length: 12 }, (_, i) => bulleRival('s', 'irregulier', 'marque', i)))
    expect(phrases.size).toBeGreaterThan(1)
  })

  it('chaque tempérament a une voix pour chaque humeur ; un replay parle neutre', () => {
    for (const t of TEMPERAMENTS) {
      for (const mood of MOODS) expect(bulleRival('x', t, mood, 1).length).toBeGreaterThan(1)
    }
    expect(bulleRival('x', null, 'arrivee', 0)).toBe(bulleRival('x', 'metronome', 'arrivee', 0))
  })

  it('ne parle pas à chaque coup ordinaire, toujours sur un événement', () => {
    const marques = [0, 1, 2, 3, 4, 5].filter((i) => rivalParle('marque', i))
    expect(marques.length).toBeLessThan(6)
    expect(marques.length).toBeGreaterThan(0)
    expect(rivalParle('double', 0)).toBe(true)
    expect(rivalParle('arrivee', 7)).toBe(true)
  })
})
