import { describe, expect, it } from 'vitest'
import { decouper, motsMarques } from './mots'

/** Ce que l'écran affiche : le texte de chaque jeton, avec sa mise en forme. */
function rendu(s: string): string {
  return decouper(s)
    .jetons.map((j) => {
      if (j.kind === 'fraction') return `${j.num}/${j.den}`
      const t = j.texte
      if (j.gras) return `<b>${t}</b>`
      if (j.italique) return `<i>${t}</i>`
      return t
    })
    .join('')
}

describe('decouper — la mise en forme légère', () => {
  it('met en gras et en italique ce qui est entre marques', () => {
    expect(rendu('Le **sternum** ferme la cage.')).toBe('Le <b>sternum</b> ferme la cage.')
    expect(rendu('une culture d’*E. coli* K12')).toBe('une culture d’<i>E</i><i>. </i><i>coli</i> K12')
  })

  it('garde un astérisque de multiplication tel quel dans un programme', () => {
    expect(rendu('capital = capital * 1.1')).toBe('capital = capital * 1.1')
    expect(rendu('L = [k * k for k in range(1, 7)]')).toBe('L = [k * k for k in range(1, 7)]')
    expect(rendu('return n*fact(n - 1)')).toBe('return n*fact(n - 1)')
    expect(rendu('aire = a*b*c')).toBe('aire = a*b*c')
  })

  it('garde la puissance « ** » telle quelle dans un programme', () => {
    expect(rendu('carre = x ** 2')).toBe('carre = x ** 2')
    expect(rendu('y = x**2 + 2**n')).toBe('y = x**2 + 2**n')
  })

  it('garde un astérisque isolé qui ne se referme pas', () => {
    expect(rendu('SELECT COUNT(*) FROM eleve')).toBe('SELECT COUNT(*) FROM eleve')
  })

  it('numérote les mots de la même façon, marques ou astérisques ordinaires', () => {
    const avec = decouper('u = 3 * u - 4')
    const sans = decouper('u = 3 u - 4')
    expect(avec.suivant).toBe(sans.suivant)
    const { groupes } = motsMarques(['total = [[v|prix]] * 2', 'print([[v|total]])'])
    // total(0) prix(1) 2(2) print(3) total(4)
    expect(groupes.get('v')).toEqual([1, 4])
  })
})
