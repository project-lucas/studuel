import { describe, it, expect } from 'vitest'
import { estStructuree, lireFiche } from '@/lib/coach/fiche'

describe('lireFiche', () => {
  it('reconnaît le titre, les sections et les puces', () => {
    const brut = [
      '# Le traité de Versailles',
      '',
      '## Ce qu’il impose',
      '- L’Allemagne perd l’Alsace-Lorraine.',
      '* Elle paie des réparations.',
      '1) Elle réduit son armée.',
    ].join('\n')

    expect(lireFiche(brut)).toEqual([
      { type: 'titre', texte: 'Le traité de Versailles' },
      { type: 'section', texte: 'Ce qu’il impose' },
      { type: 'puce', texte: 'L’Allemagne perd l’Alsace-Lorraine.' },
      { type: 'puce', texte: 'Elle paie des réparations.' },
      { type: 'puce', texte: 'Elle réduit son armée.' },
    ])
  })

  it('retire le gras et l’italique plutôt que d’afficher les astérisques', () => {
    // On ne rend pas le gras : « **important** » affiché tel quel est pire que
    // « important » sans emphase.
    expect(lireFiche('- Le **traité** est *dur*.')).toEqual([
      { type: 'puce', texte: 'Le traité est dur.' },
    ])
  })

  it('garde un paragraphe ordinaire tel quel', () => {
    // Le cas le plus fréquent : une réponse de quatre phrases, sans structure.
    const blocs = lireFiche('Commence par repérer les droites parallèles.')
    expect(blocs).toEqual([
      { type: 'texte', texte: 'Commence par repérer les droites parallèles.' },
    ])
    expect(estStructuree(blocs)).toBe(false)
  })

  it('jette les lignes vides', () => {
    expect(lireFiche('\n\n  \n')).toEqual([])
  })

  it('dit qu’une fiche est structurée', () => {
    expect(estStructuree(lireFiche('# Titre\n- une puce'))).toBe(true)
  })
})
