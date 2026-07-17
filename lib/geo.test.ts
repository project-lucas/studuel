import { describe, expect, it } from 'vitest'
import {
  deptFromPostalCode,
  regionForDept,
  REGIONS,
  REGION_BY_DEPT,
} from './geo'

describe('deptFromPostalCode', () => {
  it('dérive le département métropolitain des deux premiers chiffres', () => {
    expect(deptFromPostalCode('75116')).toBe('75')
    expect(deptFromPostalCode('77360')).toBe('77')
    expect(deptFromPostalCode('01000')).toBe('01')
    expect(deptFromPostalCode('59000')).toBe('59')
  })

  it('gère la Corse (2A / 2B) via le 3e chiffre', () => {
    expect(deptFromPostalCode('20000')).toBe('2A') // Ajaccio
    expect(deptFromPostalCode('20137')).toBe('2A') // Porto-Vecchio
    expect(deptFromPostalCode('20200')).toBe('2B') // Bastia
    expect(deptFromPostalCode('20600')).toBe('2B') // Furiani
  })

  it('gère l’outre-mer sur trois chiffres', () => {
    expect(deptFromPostalCode('97110')).toBe('971') // Guadeloupe
    expect(deptFromPostalCode('97400')).toBe('974') // La Réunion
    expect(deptFromPostalCode('97600')).toBe('976') // Mayotte
  })

  it('rejette l’illisible et le hors-nomenclature', () => {
    expect(deptFromPostalCode('')).toBeNull()
    expect(deptFromPostalCode('7511')).toBeNull() // 4 chiffres
    expect(deptFromPostalCode('ABCDE')).toBeNull()
    expect(deptFromPostalCode('96000')).toBeNull() // 96 n'existe pas
    expect(deptFromPostalCode('98000')).toBeNull() // Monaco
    expect(deptFromPostalCode('97500')).toBeNull() // St-Pierre-et-Miquelon : pas une région
    expect(deptFromPostalCode('20500')).toBeNull() // tranche corse non couverte
  })

  it('tolère les espaces autour', () => {
    expect(deptFromPostalCode(' 33000 ')).toBe('33')
  })
})

describe('regionForDept', () => {
  it('associe chaque département à sa région', () => {
    expect(regionForDept('77')).toBe('Île-de-France')
    expect(regionForDept('69')).toBe('Auvergne-Rhône-Alpes')
    expect(regionForDept('2b')).toBe('Corse') // insensible à la casse
    expect(regionForDept('974')).toBe('La Réunion')
    expect(regionForDept('00')).toBeNull()
  })
})

describe('référentiel', () => {
  it('couvre les 101 départements et ne cite que des régions connues', () => {
    const depts = Object.keys(REGION_BY_DEPT)
    expect(depts).toHaveLength(101) // 96 métropolitains + 5 d'outre-mer
    for (const dept of depts) {
      expect(REGIONS, dept).toContain(REGION_BY_DEPT[dept])
    }
  })

  it('toute sortie de deptFromPostalCode a une région', () => {
    for (let i = 1000; i < 100000; i += 1000) {
      const dept = deptFromPostalCode(String(i).padStart(5, '0'))
      if (dept !== null) {
        expect(regionForDept(dept), `CP ${i}`).not.toBeNull()
      }
    }
  })
})
