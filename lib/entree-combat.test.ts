import { describe, expect, it } from 'vitest'
import {
  cheminDe,
  finirEntreeCombat,
  lancerEntreeCombat,
  lignesDeVitesse,
  lireEntreeCombat,
  pointsLigne,
  TEMPS_ENTREE,
} from './entree-combat'

describe('cheminDe — reconnaître la page d’arrivée', () => {
  it('retire la requête, l’ancre et la barre finale', () => {
    expect(cheminDe('/defi/programme/maths?course=12')).toBe('/defi/programme/maths')
    expect(cheminDe('/defi/traque/krach#x')).toBe('/defi/traque/krach')
    expect(cheminDe('/defi/traque/krach/')).toBe('/defi/traque/krach')
    expect(cheminDe('/')).toBe('/')
  })
})

describe('le calendrier de l’entrée', () => {
  it('va dans l’ordre : voile, vitesse, blanc, éclat, plein blanc', () => {
    const t = TEMPS_ENTREE
    expect(t.voile).toBeLessThan(t.vitesse)
    expect(t.vitesse).toBeLessThan(t.blanc)
    expect(t.blanc).toBeLessThan(t.eclat)
    expect(t.eclat).toBeLessThanOrEqual(t.plein)
  })

  it('tient en moins de deux secondes hors chargement', () => {
    expect(TEMPS_ENTREE.plein + TEMPS_ENTREE.tenu + TEMPS_ENTREE.fondu).toBeLessThan(2000)
  })
})

describe('les lignes de vitesse', () => {
  it('le même dessin à chaque appel (rendu serveur = client)', () => {
    expect(lignesDeVitesse(12)).toEqual(lignesDeVitesse(12))
  })

  it('font le tour de l’écran, la pointe loin du centre', () => {
    const lignes = lignesDeVitesse(28)
    expect(lignes).toHaveLength(28)
    for (const l of lignes) {
      expect(l.rayonInterieur).toBeGreaterThanOrEqual(26)
      expect(l.rayonInterieur).toBeLessThan(50)
    }
    expect(pointsLigne(lignes[0]).split(' ')).toHaveLength(3)
  })
})

describe('le magasin', () => {
  it('un double tap ne relance pas la scène', () => {
    expect(lancerEntreeCombat('/defi/traque/krach')).toBe(true)
    const premiere = lireEntreeCombat()
    expect(lancerEntreeCombat('/defi/traque/krach')).toBe(false)
    expect(lireEntreeCombat()).toBe(premiere)
    finirEntreeCombat(premiere!.id)
    expect(lireEntreeCombat()).toBeNull()
  })
})
