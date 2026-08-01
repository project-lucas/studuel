import { describe, expect, test } from 'vitest'
import {
  estActif,
  estPlanPayant,
  joursRestants,
  libelleEcheance,
  verifierContact,
  verifierMois,
  verifierNote,
  MOIS_MAX,
} from './abonnement'

const MAINTENANT = new Date('2026-08-01T10:00:00Z')

describe('estPlanPayant', () => {
  test('accepte les trois paliers payants', () => {
    expect(estPlanPayant('tier1')).toBe(true)
    expect(estPlanPayant('tier3')).toBe(true)
  })

  test('refuse « free » et n’importe quoi d’autre', () => {
    expect(estPlanPayant('free')).toBe(false)
    expect(estPlanPayant('tier9')).toBe(false)
    expect(estPlanPayant('')).toBe(false)
  })
})

describe('verifierContact', () => {
  test('un contact vide est valide (il est facultatif)', () => {
    expect(verifierContact('')).toEqual({ ok: true, valeur: null })
    expect(verifierContact(null)).toEqual({ ok: true, valeur: null })
    expect(verifierContact('   ')).toEqual({ ok: true, valeur: null })
  })

  test('accepte un email', () => {
    expect(verifierContact(' parent@exemple.fr ')).toEqual({
      ok: true,
      valeur: 'parent@exemple.fr',
    })
  })

  test('accepte un téléphone français, espacé ou avec indicatif', () => {
    expect(verifierContact('06 12 34 56 78').ok).toBe(true)
    expect(verifierContact('+33 6 12 34 56 78').ok).toBe(true)
  })

  test('refuse une saisie qui n’est ni un email ni un numéro', () => {
    const r = verifierContact('appelle-moi')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.raison).toContain('email')
  })

  test('refuse un numéro trop court (une faute de frappe n’est pas un contact)', () => {
    expect(verifierContact('0612').ok).toBe(false)
  })

  test('refuse un contact interminable', () => {
    expect(verifierContact('a@b.fr' + 'x'.repeat(200)).ok).toBe(false)
  })
})

describe('verifierNote', () => {
  test('vide → null', () => {
    expect(verifierNote('  ')).toBeNull()
  })

  test('tronque au-delà de 500 caractères au lieu de rejeter', () => {
    expect(verifierNote('a'.repeat(900))).toHaveLength(500)
  })
})

describe('verifierMois', () => {
  test('accepte une durée entière dans les bornes', () => {
    expect(verifierMois(1)).toBe(1)
    expect(verifierMois('12')).toBe(12)
    expect(verifierMois(MOIS_MAX)).toBe(MOIS_MAX)
  })

  test('0 est valide : c’est la révocation', () => {
    expect(verifierMois(0)).toBe(0)
  })

  test('refuse le négatif, le hors-borne et le non-entier', () => {
    expect(verifierMois(-1)).toBeNull()
    expect(verifierMois(MOIS_MAX + 1)).toBeNull()
    expect(verifierMois(1.5)).toBeNull()
    expect(verifierMois('beaucoup')).toBeNull()
  })
})

describe('estActif', () => {
  test('sans échéance, l’abonnement est actif', () => {
    expect(estActif(null, MAINTENANT)).toBe(true)
  })

  test('échéance future = actif, passée = inactif', () => {
    expect(estActif('2026-09-01T10:00:00Z', MAINTENANT)).toBe(true)
    expect(estActif('2026-07-01T10:00:00Z', MAINTENANT)).toBe(false)
  })

  test('une date illisible ne vaut PAS un abonnement actif', () => {
    expect(estActif('demain', MAINTENANT)).toBe(false)
  })
})

describe('joursRestants', () => {
  test('null sans échéance', () => {
    expect(joursRestants(null, MAINTENANT)).toBeNull()
  })

  test('arrondit au jour supérieur', () => {
    // 36 heures restantes → « 2 jours », pas « 1 ».
    expect(joursRestants('2026-08-02T22:00:00Z', MAINTENANT)).toBe(2)
  })

  test('0 quand c’est passé', () => {
    expect(joursRestants('2026-07-31T10:00:00Z', MAINTENANT)).toBe(0)
  })
})

describe('libelleEcheance', () => {
  test('dit ce qu’il faut sans échéance', () => {
    expect(libelleEcheance(null, MAINTENANT)).toBe('sans échéance')
  })

  test('nomme l’expiration passée', () => {
    expect(libelleEcheance('2026-07-01T10:00:00Z', MAINTENANT)).toBe('expiré')
  })

  test('singulier pour demain', () => {
    expect(libelleEcheance('2026-08-02T09:00:00Z', MAINTENANT)).toBe(
      'expire demain',
    )
  })

  test('en jours sous un mois, en mois au-delà', () => {
    expect(libelleEcheance('2026-08-11T10:00:00Z', MAINTENANT)).toBe(
      'expire dans 10 jours',
    )
    expect(libelleEcheance('2026-11-01T10:00:00Z', MAINTENANT)).toBe(
      'expire dans ~3 mois',
    )
  })
})
