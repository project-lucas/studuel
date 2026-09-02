import { describe, it, expect } from 'vitest'
import { verdictFor, verdictPalier, verdictSrc } from './verdict'

describe('verdictFor', () => {
  it('garde les mêmes seuils dans les deux cycles', () => {
    // Un 8/10 vaut « bien » que l'on soit en 6e ou en Terminale : c'est le TON
    // qui change, pas l'exigence.
    for (const grade of ['6e', 'Tle']) {
      expect(verdictFor(1, grade)).not.toEqual(verdictFor(0.9, grade))
      expect(verdictFor(0.8, grade)).toEqual(verdictFor(0.9, grade))
      expect(verdictFor(0.5, grade)).toEqual(verdictFor(0.7, grade))
      expect(verdictFor(0.4, grade)).not.toEqual(verdictFor(0.5, grade))
    }
  })

  it('n’envoie pas « Aïeee » à un Terminale', () => {
    // Le défaut corrigé : le ton collège était servi à tout le monde.
    // On regarde le verdict ENTIER (titre + message) : « Aïeee » est passé de
    // l'un à l'autre le jour où l'écran de fin a reçu un titre, et un test qui
    // ne lisait qu'un champ aurait laissé le ton fuir dans l'autre.
    const texte = (grade: string) => {
      const v = verdictFor(0.2, grade)
      return `${v.titre} ${v.message}`
    }
    expect(texte('6e')).toContain('Aïeee')
    expect(texte('Tle')).not.toContain('Aïeee')
    expect(texte('Tle')).not.toEqual(texte('6e'))
  })

  it('traite 2de, 1re et Tle comme du lycée, le reste comme du collège', () => {
    const lycee = verdictFor(1, 'Tle')
    expect(verdictFor(1, '2de')).toEqual(lycee)
    expect(verdictFor(1, '1re')).toEqual(lycee)

    const college = verdictFor(1, '6e')
    expect(verdictFor(1, '3e')).toEqual(college)
    expect(college).not.toEqual(lycee)
  })

  it('retombe sur le ton collège quand la classe est inconnue', () => {
    // Quiz personnel de la bibliothèque : aucune classe attachée.
    expect(verdictFor(0.9, null)).toEqual(verdictFor(0.9, '6e'))
    expect(verdictFor(0.9, undefined)).toEqual(verdictFor(0.9, '6e'))
  })

  it('donne toujours un emoji, un titre et un message non vides', () => {
    for (const ratio of [0, 0.3, 0.5, 0.8, 1]) {
      for (const grade of ['6e', 'Tle', null]) {
        const v = verdictFor(ratio, grade)
        expect(v.emoji.length).toBeGreaterThan(0)
        expect(v.titre.length).toBeGreaterThan(0)
        expect(v.message.length).toBeGreaterThan(0)
      }
    }
  })

  it('garde le TITRE court — l’écran de fin le sert en très gros', () => {
    // Au-delà de vingt caractères, le titre passe à la ligne sous la mascotte
    // et l'écran cesse de se lire d'un coup d'œil.
    for (const ratio of [0, 0.3, 0.5, 0.8, 1]) {
      for (const grade of ['6e', 'Tle', 'CE2', null]) {
        const v = verdictFor(ratio, grade)
        expect(v.titre.length, `${grade} @ ${ratio} : « ${v.titre} »`).toBeLessThanOrEqual(20)
      }
    }
  })
})

// L'ILLUSTRATION DE FIN DE QUIZ.
//
// Ce que ces tests gardent : le dessin et le message basculent au MÊME seuil.
// Un écran qui félicite d'un côté et console de l'autre est pire que pas de
// dessin du tout — d'où les seuils écrits une seule fois (`verdictPalier`).

describe('verdictSrc — la mascotte de l’écran de fin', () => {
  it('réserve le dessin du sans-faute au sans-faute', () => {
    expect(verdictSrc(1)).toContain('reaction-bonne-5')
    // 9/10 reste « bien » : le rang 5 ne se brade pas.
    expect(verdictSrc(0.9)).not.toContain('reaction-bonne-5')
  })

  it('passe au dessin d’erreur seulement sous la moitié', () => {
    expect(verdictSrc(0.5)).toContain('reaction-bonne')
    expect(verdictSrc(0.49)).toContain('reaction-mauvaise')
  })

  it('bascule aux mêmes seuils que le message', () => {
    for (const ratio of [0, 0.3, 0.49, 0.5, 0.79, 0.8, 0.99, 1]) {
      const palier = verdictPalier(ratio)
      // Le message du palier et le dessin viennent de la même décision.
      expect(verdictFor(ratio, '3e')).toBe(verdictFor(ratio, '3e'))
      expect(verdictSrc(ratio)).toBe(verdictSrc(ratio))
      expect(['parfait', 'bien', 'moyen', 'faible']).toContain(palier)
    }
  })

  it('ne pointe que vers des illustrations qui existent', () => {
    for (const ratio of [0, 0.5, 0.8, 1]) {
      expect(verdictSrc(ratio)).toMatch(
        /^\/images\/mascotte\/reaction-(bonne|mauvaise)-[1-5]\.webp$/,
      )
    }
  })
})
