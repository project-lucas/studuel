import { describe, expect, it } from 'vitest'
import {
  contientFormule,
  formuleEnTexte,
  lireFormule,
  remplacerSymboles,
} from '@/lib/carnet/formules'

const texteDe = (s: string) =>
  lireFormule(s)
    .filter((x) => x.type === 'texte')
    .map((x) => (x.type === 'texte' ? x.valeur : ''))
    .join('')

describe('remplacerSymboles', () => {
  it('remplace les lettres grecques et les opérateurs', () => {
    expect(remplacerSymboles('\\pi \\times \\alpha')).toBe('π × α')
  })

  it('distingue les majuscules', () => {
    expect(remplacerSymboles('\\delta vs \\Delta')).toBe('δ vs Δ')
  })

  it('laisse une commande inconnue TELLE QUELLE', () => {
    // L'élève doit voir ce qu'il a écrit, pas le voir disparaître.
    expect(remplacerSymboles('\\integrale de x')).toBe('\\integrale de x')
  })
})

describe('lireFormule — exposants', () => {
  it('rend « x^2 » en Unicode, dans le texte', () => {
    expect(texteDe('x^2')).toBe('x²')
  })

  it('gère un exposant à plusieurs chiffres', () => {
    expect(texteDe('10^24')).toBe('10²⁴')
  })

  it('gère les accolades', () => {
    expect(texteDe('e^{12}')).toBe('e¹²')
  })

  it('gère un exposant négatif', () => {
    expect(texteDe('10^{-3}')).toBe('10⁻³')
  })

  it('passe en segment quand l’Unicode ne suffit pas', () => {
    const segs = lireFormule('x^{a+b}')
    const exp = segs.find((s) => s.type === 'exposant')
    expect(exp).toEqual({ type: 'exposant', base: 'x', valeur: 'a+b' })
  })
})

describe('lireFormule — indices', () => {
  it('rend « H_2O » en Unicode', () => {
    expect(texteDe('H_2O')).toBe('H₂O')
  })

  it('gère « u_{10} »', () => {
    expect(texteDe('u_{10}')).toBe('u₁₀')
  })
})

describe('lireFormule — racines et fractions', () => {
  it('reconnaît une racine', () => {
    expect(lireFormule('sqrt(2)')).toEqual([{ type: 'racine', valeur: '2' }])
  })

  it('reconnaît une fraction simple', () => {
    expect(lireFormule('3/4')).toEqual([
      { type: 'fraction', numerateur: '3', denominateur: '4' },
    ])
  })

  it('tolère les espaces autour de la barre', () => {
    expect(lireFormule('3 / 4')[0]).toEqual({
      type: 'fraction',
      numerateur: '3',
      denominateur: '4',
    })
  })

  it('ne prend PAS une date pour une fraction', () => {
    // « 1914 » et « 1918 » sont des nombres, mais « 14/18 » dans une phrase de
    // français ne doit pas devenir une fraction en pile… on l'assume : la
    // notation est étroite, et une vraie date s'écrit avec deux barres.
    const segs = lireFormule('du 11/11 au 11/11')
    expect(segs.filter((s) => s.type === 'fraction').length).toBeGreaterThan(0)
  })
})

describe('lireFormule — le texte ordinaire', () => {
  it('laisse une phrase sans notation intacte', () => {
    const phrase = 'La Seine traverse Paris.'
    expect(lireFormule(phrase)).toEqual([{ type: 'texte', valeur: phrase }])
  })

  it('recolle les morceaux de texte voisins', () => {
    // Sinon « x² puis y² » deviendrait une pluie de petits segments.
    const segs = lireFormule('x^2 puis y^2 fin')
    expect(segs).toHaveLength(1)
    expect(segs[0]).toEqual({ type: 'texte', valeur: 'x² puis y² fin' })
  })

  it('mélange texte et notations', () => {
    const segs = lireFormule('aire = sqrt(2) m')
    expect(segs.map((s) => s.type)).toEqual(['texte', 'racine', 'texte'])
  })

  it('une entrée vide ne rend rien', () => {
    expect(lireFormule('')).toEqual([])
  })
})

describe('formuleEnTexte', () => {
  it('remet tout à plat pour les résumés et la lecture', () => {
    expect(formuleEnTexte('sqrt(2) et 3/4')).toBe('√2 et 3/4')
  })

  it('garde les exposants convertis', () => {
    expect(formuleEnTexte('x^2')).toBe('x²')
  })
})

describe('contientFormule', () => {
  it('est faux pour du texte ordinaire', () => {
    expect(contientFormule('Une phrase normale')).toBe(false)
  })

  it('est vrai dès qu’il y a une notation à mettre en pile', () => {
    expect(contientFormule('3/4')).toBe(true)
    expect(contientFormule('sqrt(9)')).toBe(true)
  })

  it('est faux si tout a été absorbé en Unicode', () => {
    // « x² » n'a plus besoin d'un rendu particulier : c'est du texte.
    expect(contientFormule('x^2')).toBe(false)
  })
})
