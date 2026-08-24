import { describe, it, expect } from 'vitest'
import {
  PLAQUE_BLANC_BAS,
  PLAQUE_BLANC_HAUT,
  plaqueClaire,
} from '@/lib/defi/plaque-claire'

// LE FOND DES DEUX FLANCS DE LA BARRE D'ACTION.
//
// Ce que ces tests gardent, et l'erreur qu'ils empêchent de refaire : les
// flancs avaient été ASSOMBRIS pour rendre au bouton doré son autorité. Mesuré
// après coup, le résultat était du kaki — baisser la clarté d'une couleur peu
// saturée ne la rend pas plus profonde, elle la salit. Le bon levier est la
// TEINTE : une pierre violette claire, à 226° de l'or.

describe('plaqueClaire', () => {
  it('délave le VIOLET DE MARQUE, et ne code aucune couleur en dur', () => {
    // La charte interdit les hex en dur hors de la flamme de série. Ici c'est
    // aussi la seule façon de garantir que la pierre reste parente du décor :
    // si le violet change, les flancs suivent.
    const fond = plaqueClaire()
    expect(fond).not.toMatch(/#[0-9a-f]{3,8}/i)
    expect(fond.match(/var\(--primary\)/g)).toHaveLength(2)
  })

  it('reste dans le registre CLAIR — c’est ce qui rend les dessins lisibles', () => {
    // Toutes les illustrations du jeu sont peintes pour un fond clair. En
    // dessous des deux tiers de blanc, la pierre redevient un violet moyen et
    // les cernes d'encre s'y noient — le défaut d'origine, exactement.
    expect(PLAQUE_BLANC_BAS).toBeGreaterThanOrEqual(65)
    expect(PLAQUE_BLANC_HAUT).toBeLessThanOrEqual(95)
  })

  it('éclaircit le haut plus que le bas — c’est ce qui fait le relief', () => {
    expect(PLAQUE_BLANC_HAUT).toBeGreaterThan(PLAQUE_BLANC_BAS)
  })

  it('rend un dégradé vertical utilisable tel quel en `background`', () => {
    const fond = plaqueClaire()
    expect(fond.startsWith('linear-gradient(180deg,')).toBe(true)
    expect(fond.endsWith(')')).toBe(true)
    expect(fond.match(/color-mix/g)).toHaveLength(2)
    expect(fond).toContain('0%,')
    expect(fond).toContain('100%)')
  })

  it('mélange en OKLCH, pour ne pas déplacer la teinte', () => {
    // Délaver en sRGB fait virer le violet au bleu lavande : le mélange touche
    // aux trois canaux au lieu de la clarté et du chroma perçus.
    expect(plaqueClaire()).not.toContain('in srgb')
    expect(plaqueClaire().match(/in oklch/g)).toHaveLength(2)
  })
})
