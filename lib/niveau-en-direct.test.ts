import { describe, expect, test } from 'vitest'
import { niveauEnDirect } from './niveau-en-direct'

// Niveau 3 : de 300 à 600 XP (xpForLevel(l) = 50·l·(l−1)).
const XP_NIV3 = { actuel: 560, plancher: 300, prochain: 600 }

describe('niveauEnDirect', () => {
  test('sans gain, rend exactement l’état du serveur', () => {
    expect(niveauEnDirect(3, 'Curieux', XP_NIV3, 0)).toEqual({ niveau: 3, titre: 'Curieux', xp: XP_NIV3 })
  })

  test('un gain qui ne remplit pas la barre reste au même niveau', () => {
    const vif = niveauEnDirect(3, 'Curieux', XP_NIV3, 30)
    expect(vif.niveau).toBe(3)
    expect(vif.xp).toEqual({ actuel: 590, plancher: 300, prochain: 600 })
  })

  test('l’éclair qui remplit la barre fait passer au niveau suivant tout de suite', () => {
    const vif = niveauEnDirect(3, 'Curieux', XP_NIV3, 40)
    expect(vif.niveau).toBe(4)
    expect(vif.titre).toBe('Régulier')
    expect(vif.xp).toEqual({ actuel: 600, plancher: 600, prochain: 1000 })
  })

  test('un gros gain peut franchir plusieurs niveaux', () => {
    expect(niveauEnDirect(3, 'Curieux', XP_NIV3, 1000).niveau).toBe(6)
  })

  test('un gain négatif ou absurde est ignoré', () => {
    expect(niveauEnDirect(3, 'Curieux', XP_NIV3, -50).niveau).toBe(3)
    expect(niveauEnDirect(3, 'Curieux', XP_NIV3, Number.NaN).xp).toEqual(XP_NIV3)
  })
})
