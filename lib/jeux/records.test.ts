import { describe, expect, it } from 'vitest'
import {
  formatRecord,
  gameBestKey,
  isNewRecord,
  recordLabel,
} from '@/lib/jeux/records'

describe('gameBestKey', () => {
  it('dérive une clé stable par jeu', () => {
    expect(gameBestKey('orthographe')).toBe('studuel-jeu-orthographe-best')
    expect(gameBestKey('chasse-faute')).toBe('studuel-jeu-chasse-faute-best')
  })

  it('donne des clés distinctes à deux jeux', () => {
    expect(gameBestKey('capitales')).not.toBe(gameBestKey('frise-folle'))
  })
})

describe('isNewRecord', () => {
  it('reconnaît un score qui bat le record', () => {
    expect(isNewRecord(1200, 900)).toBe(true)
  })

  it('ne célèbre pas une égalité', () => {
    expect(isNewRecord(900, 900)).toBe(false)
  })

  it('ne célèbre pas un score inférieur', () => {
    expect(isNewRecord(500, 900)).toBe(false)
  })

  it('traite la première partie comme un record', () => {
    expect(isNewRecord(100, 0)).toBe(true)
  })
})

describe('formatRecord', () => {
  it('groupe les milliers avec une espace fine insécable', () => {
    expect(formatRecord(1250)).toBe('1 250')
    expect(formatRecord(1250000)).toBe('1 250 000')
  })

  it('laisse les petits nombres intacts', () => {
    expect(formatRecord(0)).toBe('0')
    expect(formatRecord(999)).toBe('999')
  })

  it('ne descend jamais sous zéro et arrondit', () => {
    expect(formatRecord(-40)).toBe('0')
    expect(formatRecord(120.6)).toBe('121')
  })
})

describe('recordLabel', () => {
  it('annonce le record à battre', () => {
    expect(recordLabel(1250)).toBe('Record 1 250')
  })

  it('invite à en poser un quand il n’y en a pas', () => {
    expect(recordLabel(0)).toBe('Aucun record')
  })
})
