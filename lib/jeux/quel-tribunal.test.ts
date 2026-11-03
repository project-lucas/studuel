import { describe, expect, it } from 'vitest'
import { MATIERES_SUP } from '@/lib/superieur/cursus'
import { SALONS, salonVisiblePour, salonsPour } from './catalog'
import {
  AFFAIRES,
  MATIERE_QUEL_TRIBUNAL,
  affairesDuPalier,
  buildQuelTribunalPool,
} from './quel-tribunal'

describe('Quel tribunal ? — la banque', () => {
  it('a des identifiants uniques et une règle de compétence par affaire', () => {
    expect(new Set(AFFAIRES.map((a) => a.id)).size).toBe(AFFAIRES.length)
    for (const a of AFFAIRES) {
      expect(a.id).toMatch(/^[a-z0-9-]+$/)
      expect(a.situation.length, a.id).toBeGreaterThan(20)
      expect(a.tip.length, a.id).toBeGreaterThan(30)
    }
  })

  it('n’offre jamais la bonne réponse parmi les leurres, ni deux fois le même leurre', () => {
    for (const a of AFFAIRES) {
      expect(a.leurres, a.id).not.toContain(a.reponse)
      expect(new Set(a.leurres).size, a.id).toBe(3)
    }
  })

  it('monte avec le palier, sans jamais retirer ce qui était déjà tiré', () => {
    const p1 = affairesDuPalier(1)
    const p3 = affairesDuPalier(3)
    const p5 = affairesDuPalier(5)
    expect(p1.length).toBeGreaterThanOrEqual(12)
    expect(p3.length).toBeGreaterThan(p1.length)
    expect(p5.length).toBe(AFFAIRES.length)
    for (const a of p1) expect(p3).toContain(a)
  })
})

describe('Quel tribunal ? — le tirage', () => {
  it('sert des QCM à quatre options, la bonne au bon index', () => {
    const pool = buildQuelTribunalPool('graine', 20, 5)
    expect(pool).toHaveLength(20)
    for (const q of pool) {
      expect(q.options).toHaveLength(4)
      const affaire = AFFAIRES.find((a) => a.situation === q.prompt)!
      expect(q.options[q.correctIndex]).toBe(affaire.reponse)
      expect(q.subject).toBe(MATIERE_QUEL_TRIBUNAL)
    }
  })

  it('ne tire au palier 1 que les affaires de première instance', () => {
    const permises = new Set(affairesDuPalier(1).map((a) => a.situation))
    for (const q of buildQuelTribunalPool('g', 30, 1)) expect(permises.has(q.prompt)).toBe(true)
  })

  it('est déterministe à graine fixée', () => {
    expect(buildQuelTribunalPool('g', 10, 3)).toEqual(buildQuelTribunalPool('g', 10, 3))
  })
})

describe('Quel tribunal ? — le salon', () => {
  it('porte le nom exact de la matière déclarée par la 606', () => {
    expect(MATIERES_SUP.map((m) => m.nom)).toContain(MATIERE_QUEL_TRIBUNAL)
    expect(SALONS.map((s) => s.subject)).toContain(MATIERE_QUEL_TRIBUNAL)
  })
})

describe('qui voit le salon du droit', () => {
  it('l’étudiant de L1 droit, et lui seul', () => {
    expect(salonVisiblePour(MATIERE_QUEL_TRIBUNAL, 'L1 droit')).toBe(true)
    expect(salonVisiblePour(MATIERE_QUEL_TRIBUNAL, 'L1 psycho')).toBe(false)
    expect(salonVisiblePour(MATIERE_QUEL_TRIBUNAL, '4e')).toBe(false)
    expect(salonVisiblePour(MATIERE_QUEL_TRIBUNAL, null)).toBe(false)
  })

  it('laisse les salons du collège et du lycée à tout le monde, comme avant', () => {
    const scolaires = SALONS.filter((s) => s.subject !== MATIERE_QUEL_TRIBUNAL)
    expect(salonsPour('4e')).toEqual(scolaires)
    expect(salonsPour(null)).toEqual(scolaires)
    expect(salonsPour('L1 droit')).toEqual(SALONS)
  })
})
