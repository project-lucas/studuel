import { describe, expect, it } from 'vitest'
import {
  OBJECTIF_DEFAUT,
  OBJECTIF_MAX,
  OBJECTIF_MIN,
  PREFERENCES_DEFAUT,
  normaliserObjectif,
  normaliserPreferences,
  parametresSession,
} from './preferences'

describe('normaliserObjectif', () => {
  it('borne entre 10 et 200 et arrondit', () => {
    expect(normaliserObjectif(3)).toBe(OBJECTIF_MIN)
    expect(normaliserObjectif(999)).toBe(OBJECTIF_MAX)
    expect(normaliserObjectif(24.6)).toBe(25)
  })

  it('retombe sur le défaut pour ce qui n’est pas un nombre', () => {
    expect(normaliserObjectif('abc')).toBe(OBJECTIF_DEFAUT)
    expect(normaliserObjectif(undefined)).toBe(OBJECTIF_DEFAUT)
  })
})

describe('normaliserPreferences', () => {
  it('rend le défaut pour un JSON vide ou nul', () => {
    expect(normaliserPreferences(null)).toEqual(PREFERENCES_DEFAUT)
    expect(normaliserPreferences({})).toEqual(PREFERENCES_DEFAUT)
  })

  it('un ancien ordre « urgence » retombe sur le défaut', () => {
    expect(normaliserPreferences({ ordre: 'urgence' }).ordre).toBe(PREFERENCES_DEFAUT.ordre)
  })

  it('un ancien ordre « urgence » retombe sur le défaut', () => {
    expect(normaliserPreferences({ ordre: 'urgence' }).ordre).toBe(PREFERENCES_DEFAUT.ordre)
  })

  it('juge chaque champ séparément : un ordre inconnu ne perd pas l’objectif', () => {
    const p = normaliserPreferences({ objectifCartes: 50, ordre: 'bizarre', affichage: 'liste' })
    expect(p.objectifCartes).toBe(50)
    expect(p.ordre).toBe(PREFERENCES_DEFAUT.ordre)
    expect(p.affichage).toBe('liste')
  })

  it('relit la session par défaut, longueur comprise', () => {
    const p = normaliserPreferences({
      sessionDefaut: { mode: 'examen', sens: 'mixte', longueur: 20 },
    })
    expect(p.sessionDefaut).toEqual({ mode: 'examen', sens: 'mixte', longueur: 20 })
    // Une longueur hors liste redevient « tout ».
    expect(normaliserPreferences({ sessionDefaut: { longueur: 33 } }).sessionDefaut.longueur).toBeNull()
  })
})

describe('parametresSession', () => {
  it('ne dit rien quand tout est au défaut', () => {
    expect(parametresSession(PREFERENCES_DEFAUT.sessionDefaut)).toBe('')
  })

  it('écrit le contrat de SessionOptionsSheet', () => {
    expect(parametresSession({ mode: 'examen', sens: 'verso-recto', longueur: 10 })).toBe(
      '?mode=examen&sens=verso-recto&long=10',
    )
  })
})
