import { describe, expect, it } from 'vitest'
import { lireTexte, texteBrut } from './texte'

describe('lireTexte', () => {
  it('rend un texte nu en un seul segment', () => {
    expect(lireTexte('Le bonheur')).toEqual([
      { type: 'texte', valeur: 'Le bonheur', gras: false, italique: false },
    ])
  })

  it('lit le gras, l’italique, le code et la formule', () => {
    expect(lireTexte('**Thèse** : *Kant*, `len(t)` et $x^2$.')).toEqual([
      { type: 'texte', valeur: 'Thèse', gras: true, italique: false },
      { type: 'texte', valeur: ' : ', gras: false, italique: false },
      { type: 'texte', valeur: 'Kant', gras: false, italique: true },
      { type: 'texte', valeur: ', ', gras: false, italique: false },
      { type: 'code', valeur: 'len(t)' },
      { type: 'texte', valeur: ' et ', gras: false, italique: false },
      { type: 'formule', valeur: 'x^2' },
      { type: 'texte', valeur: '.', gras: false, italique: false },
    ])
  })

  it('garde une formule dans du gras', () => {
    const s = lireTexte('**on a $f(x) > 0$ partout**')
    expect(s.map((x) => x.type)).toEqual(['texte', 'formule', 'texte'])
    expect(s[0]).toMatchObject({ gras: true })
    expect(s[2]).toMatchObject({ gras: true, valeur: ' partout' })
  })

  it('ne lit pas d’italique dans une formule ni dans du code', () => {
    expect(lireTexte('$a*b*c$')).toEqual([{ type: 'formule', valeur: 'a*b*c' }])
    expect(lireTexte('`x = a*b`')).toEqual([{ type: 'code', valeur: 'x = a*b' }])
  })

  it('rend tel quel un balisage jamais refermé', () => {
    expect(texteBrut('5 * 3 = 15')).toBe('5 * 3 = 15')
    expect(texteBrut('prix : 3 $')).toBe('prix : 3 $')
    expect(texteBrut('**sans fin')).toBe('**sans fin')
  })

  it('accepte un dollar échappé', () => {
    expect(texteBrut('coûte 5 \\$ à peine')).toBe('coûte 5 $ à peine')
  })
})
