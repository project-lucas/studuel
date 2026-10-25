import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import path from 'node:path'
import {
  CINEMATIQUE,
  MS_APPARITION_MOT,
  MS_AUTO_AVANCE,
  MS_MOUVEMENT,
  MS_PAR_MOT,
  dureeEcriture,
  indexDepuisParametre,
  mots,
} from './cinematique'

describe('la cinématique d’ouverture', () => {
  it('a cinq tableaux, une image chacun, dans l’ordre des fichiers', () => {
    expect(CINEMATIQUE).toHaveLength(5)
    CINEMATIQUE.forEach((t, i) => {
      expect(t.image).toBe(`/images/cinematique/0${i + 1}.webp`)
    })
    expect(new Set(CINEMATIQUE.map((t) => t.id)).size).toBe(5)
  })

  it('a ses cinq images livrées sur le disque', () => {
    for (const t of CINEMATIQUE) {
      expect(existsSync(path.join(process.cwd(), 'public', t.image)), t.image).toBe(true)
    }
  })

  it('a un texte et une description d’image non vides sur chaque tableau', () => {
    for (const t of CINEMATIQUE) {
      expect(t.texte.trim().length).toBeGreaterThan(0)
      expect(t.alt.trim().length).toBeGreaterThan(0)
    }
  })

  it('ne répète jamais le même mouvement de caméra deux tableaux de suite', () => {
    for (let i = 1; i < CINEMATIQUE.length; i++) {
      expect(CINEMATIQUE[i].mouvement).not.toBe(CINEMATIQUE[i - 1].mouvement)
    }
  })

  it('présente Marcel au deuxième tableau', () => {
    expect(CINEMATIQUE[1].texte).toContain('Marcel')
  })

  it('finit d’écrire chaque phrase bien avant l’avance automatique', () => {
    for (const t of CINEMATIQUE) {
      // Au moins la moitié du tableau reste pour LIRE la phrase finie.
      expect(dureeEcriture(t.texte)).toBeLessThan(MS_AUTO_AVANCE / 2)
    }
    expect(MS_MOUVEMENT).toBeGreaterThan(MS_AUTO_AVANCE)
  })

  it('mots() découpe sur les blancs et ignore les vides', () => {
    expect(mots('Moi, c’est  Marcel. ')).toEqual(['Moi,', 'c’est', 'Marcel.'])
    expect(mots('')).toEqual([])
    expect(mots('   ')).toEqual([])
  })

  it('dureeEcriture() = le dernier mot commence après (n − 1) × 70 ms et finit d’apparaître', () => {
    expect(dureeEcriture('')).toBe(0)
    expect(dureeEcriture('Un')).toBe(MS_APPARITION_MOT)
    expect(dureeEcriture('Un deux trois')).toBe(2 * MS_PAR_MOT + MS_APPARITION_MOT)
  })

  it('indexDepuisParametre() : ?tableau=3 ouvre le troisième, le reste ouvre le premier', () => {
    expect(indexDepuisParametre('3')).toBe(2)
    expect(indexDepuisParametre('1')).toBe(0)
    expect(indexDepuisParametre('5')).toBe(4)
    expect(indexDepuisParametre('6')).toBe(0)
    expect(indexDepuisParametre('0')).toBe(0)
    expect(indexDepuisParametre('-2')).toBe(0)
    expect(indexDepuisParametre('abc')).toBe(0)
    expect(indexDepuisParametre(undefined)).toBe(0)
    expect(indexDepuisParametre(['3'])).toBe(0)
  })
})
