import { describe, expect, it } from 'vitest'
import { lireFiche } from './fiche'
import { REPONSES_PRETES, reponsePrete } from './reponses-pretes'

const id = (q: string, mode = 'question') => reponsePrete(q, mode)?.id ?? null

describe('les réponses toutes prêtes', () => {
  it('répondent aux questions de méthode générales', () => {
    expect(id('Comment réviser un contrôle ?')).toBe('reviser-controle')
    expect(id('comment bien preparer mon interro')).toBe('reviser-controle')
    expect(id('Comment apprendre ma leçon ?')).toBe('apprendre-lecon')
    expect(id('comment faire une bonne fiche')).toBe('faire-fiche')
    expect(id('Je stresse pour le brevet')).toBe('stress')
    expect(id('J’arrive pas à me concentrer')).toBe('concentration')
    expect(id('Comment retenir les dates ?')).toBe('dates')
    expect(id('méthode de la dissertation')).toBe('dissertation')
    expect(id('comment faire un commentaire de texte')).toBe('commentaire')
    expect(id('j’ai la flemme')).toBe('motivation')
    expect(id('C’est quoi le grand oral ?')).toBe('grand-oral')
    expect(id('comment s’organiser pour réviser')).toBe('organiser')
  })

  it('laissent au modèle toute question précise', () => {
    expect(id('Comment réviser mon contrôle sur les fractions ?')).toBeNull()
    expect(id('comment apprendre la leçon sur la photosynthèse')).toBeNull()
    expect(id('Explique-moi le théorème de Pythagore')).toBeNull()
    expect(id('quelle est la date de la bataille de Verdun')).toBeNull()
  })

  it('ne confondent pas « comment » et « commentaire »', () => {
    expect(id('commentaire')).toBeNull()
  })

  it('ne servent que le mode « question », et des questions courtes', () => {
    expect(id('Comment réviser un contrôle ?', 'fiche')).toBeNull()
    expect(id(`Comment réviser un contrôle ${'vraiment '.repeat(12)}?`)).toBeNull()
    expect(id('')).toBeNull()
  })

  it('s’affichent comme une réponse mise en page, et finissent par une relance', () => {
    for (const r of REPONSES_PRETES) {
      const blocs = lireFiche(r.reponse)
      expect(blocs.some((b) => b.type === 'section')).toBe(true)
      expect(r.reponse.trim().endsWith('?') || r.reponse.trim().endsWith('.')).toBe(true)
      expect(r.reponse.length).toBeLessThan(900)
    }
  })
})
