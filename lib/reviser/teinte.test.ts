import { describe, expect, it } from 'vitest'
import { TEINTE_MATIERE } from '@/lib/defi/modes-catalog'
import { aUneTeinte, teinteMatiere } from '@/lib/reviser/teinte'
import { searchKey } from '@/lib/subject-template'

/** Les couleurs que la base donne aux matières (les clés de `subjectTheme`). */
const COULEURS = ['blue', 'red', 'orange', 'green', 'purple', 'indigo', 'teal', 'pink', 'yellow', 'slate']

describe('teinteMatiere', () => {
  it('une matière de l’arène porte la teinte de ses billets de jeu', () => {
    for (const [nom, teinte] of Object.entries(TEINTE_MATIERE)) {
      // « Histoire-Géo » → « histoire-geo », « Français » → « francais ».
      const slug = searchKey(nom).replace(/ /g, '-')
      expect(teinteMatiere(slug, 'slate'), nom).toBe(teinte)
    }
  })

  it('les autres suivent la couleur de la base', () => {
    expect(teinteMatiere('philosophie', 'purple')).toBe('violet')
    expect(teinteMatiere('nsi', 'teal')).toBe('turquoise')
    expect(teinteMatiere('ses', 'orange')).toBe('ambre')
  })

  it('chaque couleur du catalogue a sa teinte', () => {
    for (const couleur of COULEURS) expect(aUneTeinte(couleur), couleur).toBe(true)
  })

  it('une couleur inconnue ou absente retombe sur le violet de la marque', () => {
    expect(teinteMatiere('inconnue', 'fuchsia')).toBe('violet')
    expect(teinteMatiere('inconnue', null)).toBe('violet')
  })
})
