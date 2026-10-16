import { describe, expect, it } from 'vitest'
import {
  FICHE_VIDE,
  ficheEntreeDepuis,
  ficheEntreeVersPayload,
  lireNote,
  objectifDepuis,
  progressionObjectif,
  remplissageFiche,
  resumeObjectif,
  semainesDepuis,
  tendance,
} from './suivi'

describe('fiche d’entrée', () => {
  it('lit la ligne de la base et écarte les notes hors 0..20', () => {
    const f = ficheEntreeDepuis({ etablissement: 'Collège', moyennes: { Maths: 11.5, Français: 25, '': 3 }, moyenne_generale: '12.3', points_forts: 'Oral' })
    expect(f.moyennes).toEqual({ Maths: 11.5 })
    expect(f.moyenneGenerale).toBe(12.3)
    expect(f.pointsForts).toBe('Oral')
  })
  it('rien → fiche vide', () => {
    expect(ficheEntreeDepuis(null)).toEqual(FICHE_VIDE)
  })
  it('payload : arrondi au centième, clés vides écartées', () => {
    const p = ficheEntreeVersPayload({ ...FICHE_VIDE, moyennes: { ' Maths ': 11.456, '': 4 } })
    expect(p.moyennes).toEqual({ Maths: 11.46 })
  })
  it('lireNote', () => {
    expect(lireNote('12,5')).toBe(12.5)
    expect(lireNote('21')).toBeNull()
    expect(lireNote('abc')).toBeNull()
    expect(lireNote('')).toBeNull()
  })
  it('remplissage', () => {
    expect(remplissageFiche(FICHE_VIDE)).toBe(0)
    expect(remplissageFiche({ ...FICHE_VIDE, etablissement: 'x', moyenneGenerale: 12 })).toBe(2 / 8)
  })
})

describe('objectif', () => {
  it('objectifDepuis : null si vide', () => {
    expect(objectifDepuis(null)).toBeNull()
    expect(objectifDepuis({ minutes: null, jours: null, quiz: null })).toBeNull()
    expect(objectifDepuis({ minutes: 120, jours: 4 })?.minutes).toBe(120)
  })
  it('progression : seulement les cibles posées, atteint si toutes', () => {
    const p = progressionObjectif({ minutes: 120, jours: 4, quiz: null, message: null }, { minutes: 150, jours: 2, quiz: 9 })
    expect(p.lignes.map((l) => l.cle)).toEqual(['minutes', 'jours'])
    expect(p.lignes[0].part).toBe(1)
    expect(p.atteint).toBe(false)
    expect(p.part).toBe(0.75)
    expect(progressionObjectif({ minutes: 60, jours: null, quiz: null, message: null }, { minutes: 60, jours: 0, quiz: 0 }).atteint).toBe(true)
  })
  it('résumé', () => {
    expect(resumeObjectif({ minutes: 120, jours: 4, quiz: 5, message: null })).toBe('2 h 00 · 4 jours · 5 quiz')
    expect(resumeObjectif({ minutes: 45, jours: 1, quiz: null, message: null })).toBe('45 min · 1 jour')
    expect(resumeObjectif(null)).toBe('Aucun objectif cette semaine')
  })
})

describe('tendance', () => {
  const sem = (minutes: number[]) => semainesDepuis(minutes.map((m, i) => ({ lundi: `s${i}`, minutes: m })))
  it('hausse, baisse, stable, inconnue', () => {
    expect(tendance(sem([60, 60, 60, 60, 60, 60, 120, 120])).sens).toBe('hausse')
    expect(tendance(sem([60, 60, 120, 120, 120, 120, 30, 30]))).toEqual({ sens: 'baisse', ecartPct: -75 })
    expect(tendance(sem([60, 60, 60, 60, 60, 60, 62, 58])).sens).toBe('stable')
    expect(tendance(sem([60])).sens).toBe('inconnue')
  })
})
