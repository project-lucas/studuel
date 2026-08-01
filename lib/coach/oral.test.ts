import { describe, expect, test } from 'vitest'
import {
  accrocheEchelle,
  BARREAUX,
  compterCriteres,
  CRITERES,
  CRITERES_VIDES,
  epreuveOf,
  epreuveParDefaut,
  etatEchelle,
  formatDuree,
  nettoyerCommentaire,
  retourEcoute,
  SEUIL_TENU,
  verdictDuree,
  verifierSujet,
  type PassageOral,
} from './oral'

describe('les quatre barreaux', () => {
  test('l’échelle en compte exactement quatre, numérotés 1 à 4', () => {
    expect(BARREAUX.map((b) => b.id)).toEqual([1, 2, 3, 4])
  })

  test('le barreau 2 promet explicitement de ne rien capter', () => {
    // C'est la promesse produit : au barreau 2, aucun micro. Si ce texte
    // change, c'est une décision, pas un détail de rédaction.
    expect(BARREAUX[1].precision).toMatch(/aucun enregistrement/i)
  })

  test('le barreau 3 promet que l’audio ne quitte pas l’appareil', () => {
    expect(BARREAUX[2].precision).toMatch(/jamais envoyé/i)
  })
})

describe('critères', () => {
  test('il y en a trois, les mêmes pour soi et pour un ami', () => {
    expect(CRITERES.map((c) => c.id)).toEqual(['intro', 'plan', 'transitions'])
  })

  test('compte ce qui est coché', () => {
    expect(compterCriteres(CRITERES_VIDES)).toBe(0)
    expect(compterCriteres({ intro: true, plan: true, transitions: false })).toBe(2)
  })
})

describe('epreuveParDefaut', () => {
  test('propose l’épreuve de la classe', () => {
    expect(epreuveParDefaut('3e')).toBe('brevet')
    expect(epreuveParDefaut('1re')).toBe('francais')
    expect(epreuveParDefaut('Tle')).toBe('grand-oral')
  })

  test('entraînement libre pour les autres classes', () => {
    expect(epreuveParDefaut('5e')).toBe('libre')
    expect(epreuveParDefaut(null)).toBe('libre')
  })

  test('une épreuve inconnue retombe sur l’entraînement libre', () => {
    expect(epreuveOf('n’importe quoi').id).toBe('libre')
    expect(epreuveOf(undefined).id).toBe('libre')
  })
})

describe('verdictDuree', () => {
  const cible = 300 // 5 minutes

  test('sous 30 secondes, rien n’a été dit', () => {
    const v = verdictDuree(20, cible)
    expect(v.tenu).toBe(false)
    expect(v.phrase).toMatch(/trop court/i)
  })

  test('la durée complète est reconnue comme telle', () => {
    expect(verdictDuree(300, cible).phrase).toMatch(/durée complète/i)
  })

  test('dépasser la cible ne casse pas le ratio', () => {
    expect(verdictDuree(900, cible).ratio).toBe(1)
  })

  test('le seuil « tenu » est à 80 % de la cible', () => {
    expect(verdictDuree(cible * SEUIL_TENU, cible).tenu).toBe(true)
    expect(verdictDuree(cible * SEUIL_TENU - 1, cible).tenu).toBe(false)
  })

  test('la moitié tenue est encouragée, pas sanctionnée', () => {
    expect(verdictDuree(160, cible).phrase).toMatch(/moitié/i)
  })

  test('aucune phrase ne rend une note', () => {
    for (const s of [0, 45, 160, 260, 300, 600]) {
      expect(verdictDuree(s, cible).phrase).not.toMatch(/\/20|note/i)
    }
  })
})

describe('formatDuree', () => {
  test('sous une minute, en secondes', () => {
    expect(formatDuree(45)).toBe('45 s')
  })

  test('au-delà, minutes et secondes sur deux chiffres', () => {
    expect(formatDuree(245)).toBe('4 min 05')
    expect(formatDuree(600)).toBe('10 min 00')
  })

  test('une durée négative ne produit pas d’absurdité', () => {
    expect(formatDuree(-10)).toBe('0 s')
  })
})

const passage = (p: Partial<PassageOral>): PassageOral => ({
  barreau: 2,
  duree: 0,
  criteres: null,
  jour: '2026-08-01',
  ...p,
})

describe('etatEchelle', () => {
  test('sans passage, tout est à faire', () => {
    const e = etatEchelle([])
    expect(e.franchis).toEqual([])
    expect(e.prochain).toBe(1)
    expect(e.passages).toBe(0)
  })

  test('un passage trop court ne franchit pas le barreau 2', () => {
    const e = etatEchelle([passage({ barreau: 2, duree: 12 })])
    expect(e.franchis).toEqual([1])
    expect(e.prochain).toBe(2)
  })

  test('30 secondes tenues franchissent le barreau 2', () => {
    const e = etatEchelle([passage({ barreau: 2, duree: 30 })])
    expect(e.franchis).toEqual([1, 2])
    expect(e.prochain).toBe(3)
  })

  test('un passage enregistré et auto-évalué franchit 2 ET 3', () => {
    const e = etatEchelle([
      passage({ barreau: 3, duree: 200, criteres: { intro: true, plan: false, transitions: false } }),
    ])
    expect(e.franchis).toEqual([1, 2, 3])
    expect(e.prochain).toBe(4)
  })

  test('un retour d’ami franchit toute l’échelle', () => {
    const e = etatEchelle([
      passage({ barreau: 4, duree: 300, criteres: { intro: true, plan: true, transitions: true } }),
    ])
    expect(e.franchis).toEqual([1, 2, 3, 4])
    expect(e.prochain).toBe(4)
  })

  test('un barreau 3 sans auto-évaluation ne franchit que le 2', () => {
    const e = etatEchelle([passage({ barreau: 3, duree: 120, criteres: null })])
    expect(e.franchis).toEqual([1])
    expect(e.prochain).toBe(2)
  })

  test('agrège la meilleure durée et les jours distincts', () => {
    const e = etatEchelle([
      passage({ duree: 100, jour: '2026-08-01' }),
      passage({ duree: 240, jour: '2026-08-01' }),
      passage({ duree: 60, jour: '2026-08-02' }),
    ])
    expect(e.meilleureDuree).toBe(240)
    expect(e.jours).toBe(2)
    expect(e.passages).toBe(3)
  })
})

describe('accrocheEchelle', () => {
  test('sans passage, elle invite à commencer', () => {
    expect(accrocheEchelle(etatEchelle([]))).toMatch(/se répète/i)
  })

  test('elle nomme la prochaine marche, jamais un pourcentage', () => {
    const apres2 = accrocheEchelle(etatEchelle([passage({ barreau: 2, duree: 60 })]))
    expect(apres2).toMatch(/enregistre/i)
    expect(apres2).not.toMatch(/%/)
  })

  test('au barreau 4, elle envoie vers un ami', () => {
    const e = etatEchelle([
      passage({ barreau: 3, duree: 200, criteres: CRITERES_VIDES }),
    ])
    expect(accrocheEchelle(e)).toMatch(/ami/i)
  })

  test('échelle complète : elle demande de recommencer', () => {
    const e = etatEchelle([
      passage({ barreau: 4, duree: 300, criteres: CRITERES_VIDES }),
    ])
    expect(accrocheEchelle(e)).toMatch(/répétition/i)
  })
})

describe('verifierSujet', () => {
  test('accepte et normalise les espaces', () => {
    expect(verifierSujet('  Le  loup   et l’agneau ')).toEqual({
      ok: true,
      valeur: 'Le loup et l’agneau',
    })
  })

  test('refuse un sujet vide ou trop court', () => {
    expect(verifierSujet('')).toEqual({
      ok: false,
      raison: 'Dis en deux mots sur quoi tu vas parler.',
    })
    expect(verifierSujet('ab').ok).toBe(false)
  })

  test('refuse un exposé entier collé dans le titre', () => {
    expect(verifierSujet('a'.repeat(200)).ok).toBe(false)
  })
})

describe('nettoyerCommentaire', () => {
  test('vide → null', () => {
    expect(nettoyerCommentaire('   ')).toBeNull()
  })

  test('tronque au lieu de rejeter', () => {
    expect(nettoyerCommentaire('x'.repeat(400))).toHaveLength(280)
  })
})

describe('retourEcoute', () => {
  test('trois critères : l’oral tient', () => {
    expect(retourEcoute({ intro: true, plan: true, transitions: true })).toMatch(
      /tient debout/i,
    )
  })

  test('deux sur trois : le manquant est nommé', () => {
    expect(retourEcoute({ intro: true, plan: true, transitions: false })).toMatch(
      /transitions/i,
    )
  })

  test('un seul : on part de l’acquis', () => {
    expect(retourEcoute({ intro: true, plan: false, transitions: false })).toMatch(
      /Intro claire/,
    )
  })

  test('aucun : une seule consigne, pas trois', () => {
    expect(retourEcoute(CRITERES_VIDES)).toMatch(/plan/i)
  })
})
