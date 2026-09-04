import { describe, it, expect } from 'vitest'
import {
  CONSIGNE_SOCLE,
  MODES,
  MODE_PAR_DEFAUT,
  consigneFor,
  parseMode,
  type ModeCle,
} from '@/lib/coach/outils'

const CLES: ModeCle[] = ['question', 'fiche', 'exercice', 'flashcards']

describe('MODES', () => {
  it('chaque mode se présente : un mot, une ligne, un placeholder', () => {
    for (const cle of CLES) {
      const mode = MODES[cle]
      expect(mode.cle, cle).toBe(cle)
      expect(mode.label.length, cle).toBeGreaterThan(0)
      expect(mode.hint.length, cle).toBeGreaterThan(10)
      expect(mode.placeholder.length, cle).toBeGreaterThan(0)
    }
  })

  it('chaque mode a une teinte, et deux modes ne partagent pas la même', () => {
    // La couleur sert à RECONNAÎTRE l'outil : deux outils de la même teinte
    // ramèneraient le rail à ce qu'il était, une file de cartes identiques.
    const teintes = CLES.map((c) => MODES[c].teinte)
    expect(new Set(teintes).size).toBe(teintes.length)
  })

  it('le budget de sortie suit la forme attendue', () => {
    // Une fiche en 320 tokens sort tronquée au milieu d'une puce ; un indice en
    // 1 200 tokens est un cours déguisé, et se paie comme tel.
    expect(MODES.question.maxTokens).toBeLessThan(MODES.exercice.maxTokens)
    expect(MODES.exercice.maxTokens).toBeLessThan(MODES.fiche.maxTokens)
    expect(MODES.flashcards.maxTokens).toBeGreaterThanOrEqual(MODES.fiche.maxTokens)
  })

  it('seul le mode « flashcards » rend des cartes', () => {
    expect(MODES.flashcards.cartes).toBe(true)
    for (const cle of ['question', 'fiche', 'exercice'] as ModeCle[]) {
      expect(MODES[cle].cartes, cle).toBeUndefined()
    }
  })
})

describe('parseMode', () => {
  it('accepte les modes connus', () => {
    for (const cle of CLES) expect(parseMode(cle)).toBe(cle)
  })

  it('retombe sur la question pour tout le reste', () => {
    // Ce qui vient du client n'est jamais cru : un mode inventé choisirait
    // sinon un budget de tokens et une consigne qui n'existent pas.
    for (const brut of ['triche', '', null, undefined, 42, {}]) {
      expect(parseMode(brut)).toBe(MODE_PAR_DEFAUT)
    }
  })
})

describe('consigneFor', () => {
  it('porte toujours le socle — la règle « jamais la réponse toute faite »', () => {
    for (const cle of CLES) {
      expect(consigneFor(cle, null), cle).toContain('RÈGLE ABSOLUE')
      expect(consigneFor(cle, null), cle).toContain(MODES[cle].consigne)
    }
    expect(CONSIGNE_SOCLE).toContain('JAMAIS la réponse toute faite')
  })

  it('ajoute la méthode de la matière quand il y en a une', () => {
    const avec = consigneFor('question', 'On restitue de mémoire, puis on vérifie.')
    expect(avec).toContain('Méthode de cette matière :')
    expect(consigneFor('question', null)).not.toContain('Méthode de cette matière')
  })
})
