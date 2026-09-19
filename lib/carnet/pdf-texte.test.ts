import { describe, expect, it } from 'vitest'
import { LIMITE_TEXTE_PDF, assemblerTextePdf, tronquerPourIa } from './pdf-texte'

describe('assemblerTextePdf', () => {
  it('sépare les fragments d’une espace et les pages d’une ligne vide', () => {
    expect(assemblerTextePdf([['Thalès', 'énoncé'], ['réciproque']])).toBe('Thalès énoncé\n\nréciproque')
  })

  it('ramène les blancs répétés à un seul et ignore les pages vides', () => {
    expect(assemblerTextePdf([['a  \n b', '  '], [], ['c']])).toBe('a b\n\nc')
  })
})

describe('tronquerPourIa', () => {
  it('laisse passer un texte sous la borne', () => {
    expect(tronquerPourIa('court')).toEqual({ texte: 'court', tronque: false })
  })

  it('coupe sur une fin de mot et le dit', () => {
    const mot = 'abcdefghij'
    const long = Array.from({ length: LIMITE_TEXTE_PDF / 5 }, () => mot).join(' ')
    const r = tronquerPourIa(long)
    expect(r.tronque).toBe(true)
    expect(r.texte.length).toBeLessThanOrEqual(LIMITE_TEXTE_PDF)
    expect(r.texte.endsWith(mot)).toBe(true)
  })
})
