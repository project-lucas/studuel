import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { ARENA_SCHEDULE } from './arena-background'
import {
  barreNiveau,
  bureauDuPortrait,
  chambreAuJour,
  DECOR_JOUEUR,
  decorBureau,
  FEUILLE_BUREAU,
  FEUILLE_BUREAU_JOUR,
  feuilleBureau,
  HEROS_AU_JOUR,
  ligneRang,
  periodeInitiale,
  tailleNom,
  piedDuPortrait,
  xpSemaineDepuisClassement,
} from './joueur'
import { HEROS_KEYS } from './heros/eleves'
import { PORTRAITS_CLASSIQUES } from './portraits'
import { walletLevelInfo } from './wallet'

describe('barreNiveau', () => {
  it('compte l’XP depuis le plancher du niveau, pas depuis zéro', () => {
    // Niveau 7 commence à 50·7·6 = 2 100 XP, le niveau 8 à 2 800.
    const b = barreNiveau(walletLevelInfo(2440))
    expect(b).toEqual({ level: 7, fait: 340, pas: 700, reste: 360, pct: 49 })
  })

  it('écrit 0 % sur un niveau tout juste atteint', () => {
    const b = barreNiveau(walletLevelInfo(2100))
    expect(b.fait).toBe(0)
    expect(b.pct).toBe(0)
    expect(b.reste).toBe(700)
  })

  it('ne dépasse jamais le pas, même avec une XP incohérente', () => {
    const b = barreNiveau({ level: 3, currentXp: 9_999, nextAt: 600 })
    expect(b.fait).toBe(b.pas)
    expect(b.pct).toBe(100)
    expect(b.reste).toBe(0)
  })
})

describe('ligneRang', () => {
  it('joint le niveau et la division, ou le niveau seul', () => {
    expect(ligneRang(7, 'Argent II')).toBe('Niveau 7 · Argent II')
    expect(ligneRang(1, null)).toBe('Niveau 1')
  })
})

describe('xpSemaineDepuisClassement', () => {
  it('relit ma ligne dans la réponse de classement_amis()', () => {
    const brut = [
      { id: 'lea', nom: 'Léa', moi: false, xp_semaine: 900 },
      { id: 'moi', nom: 'Lucas', moi: true, xp_semaine: 320 },
    ]
    expect(xpSemaineDepuisClassement(brut)).toBe(320)
  })

  it('rend null sans ma ligne ou sans la colonne (558 absente)', () => {
    expect(xpSemaineDepuisClassement(null)).toBeNull()
    expect(xpSemaineDepuisClassement([{ id: 'lea', nom: 'Léa', moi: false, xp_semaine: 1 }])).toBeNull()
    expect(xpSemaineDepuisClassement([{ id: 'moi', nom: 'Lucas', moi: true }])).toBeNull()
  })
})

describe('piedDuPortrait', () => {
  it('ne dessine debout que les treize portraits libres', () => {
    expect(piedDuPortrait('7')).toBe('/images/profil/pied/7.webp')
    expect(piedDuPortrait('perso:charlemagne')).toBeNull()
    expect(piedDuPortrait('')).toBeNull()
    expect(piedDuPortrait(undefined)).toBeNull()
  })
})

describe('DECOR_JOUEUR', () => {
  it('est une image servie depuis public/images/joueur', () => {
    expect(DECOR_JOUEUR).toMatch(/^\/images\/joueur\/[a-z-]+\.webp$/)
  })
})

describe('bureauDuPortrait', () => {
  it('n’assoit au bureau que les treize portraits libres et les quinze héros', () => {
    expect(bureauDuPortrait('7')).toBe('7')
    expect(bureauDuPortrait('troll-pont')).toBe('troll-pont')
    expect(bureauDuPortrait('perso:charlemagne')).toBeNull()
    expect(bureauDuPortrait('')).toBeNull()
    expect(bureauDuPortrait(undefined)).toBeNull()
  })
})

describe('decorBureau', () => {
  it('nomme la scène par le portrait et la plage', () => {
    expect(decorBureau('7', 'night')).toBe('/images/joueur/bureau/7-night.webp')
  })

  it('a ses 78 scènes servies (13 portraits × 6 plages)', () => {
    const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')
    const manquantes = PORTRAITS_CLASSIQUES.flatMap((k) =>
      ARENA_SCHEDULE.map((s) => decorBureau(k, s.period)).filter((src) => !existsSync(path.join(PUBLIC, src))),
    )
    expect(manquantes).toEqual([])
  })

  it('garde un héros à la nuit tant que ses autres plages ne sont pas peintes', () => {
    expect(decorBureau('troll-pont', 'noon')).toBe('/images/joueur/bureau/troll-pont-night.webp')
    expect(decorBureau('troll-pont', 'night')).toBe('/images/joueur/bureau/troll-pont-night.webp')
  })

  it('ouvre la chambre AU JOUR d’un héros repeint dans la DA de la fenêtre, à toute heure', () => {
    expect(chambreAuJour('elfe-rodeur')).toBe(true)
    expect(decorBureau('elfe-rodeur', 'night')).toBe('/images/joueur/bureau/elfe-rodeur-jour.webp')
    expect(decorBureau('elfe-rodeur', 'noon')).toBe('/images/joueur/bureau/elfe-rodeur-jour.webp')
  })

  it('ne met au jour ni un blason ni un héros pas encore repeint', () => {
    expect(chambreAuJour('7')).toBe(false)
    expect(chambreAuJour('troll-pont')).toBe(HEROS_AU_JOUR.includes('troll-pont'))
    expect(HEROS_AU_JOUR.every((k) => HEROS_KEYS.includes(k))).toBe(true)
  })

  it('a la scène de chaque héros servie, à chaque plage', () => {
    const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')
    const manquantes = HEROS_KEYS.flatMap((k) =>
      ARENA_SCHEDULE.map((s) => decorBureau(k, s.period)).filter((src) => !existsSync(path.join(PUBLIC, src))),
    )
    expect(manquantes).toEqual([])
  })
})

describe('periodeInitiale', () => {
  it('lit la plage à l’heure de Paris, pas en UTC', () => {
    // 21 h 30 UTC un 27 octobre = 22 h 30 à Paris (heure d'hiver) : la nuit.
    expect(periodeInitiale(new Date('2026-10-27T21:30:00Z'))).toBe('night')
    // 11 h 30 UTC un 1er juillet = 13 h 30 à Paris (heure d'été) : midi.
    expect(periodeInitiale(new Date('2026-07-01T11:30:00Z'))).toBe('noon')
    // 4 h 30 UTC un 1er juillet = 6 h 30 à Paris : l'aube, alors qu'en UTC c'est encore la nuit.
    expect(periodeInitiale(new Date('2026-07-01T04:30:00Z'))).toBe('dawn')
  })
})

describe('tailleNom', () => {
  it('garde un prénom court en grand et rapetisse un nom long pour le ruban', () => {
    expect(tailleNom('Lucas')).toBe('grand')
    expect(tailleNom('Maximilien')).toBe('moyen')
    expect(tailleNom('Marie-Antoinette')).toBe('petit')
  })

  it('ignore les espaces autour et compte les lettres accentuées pour une', () => {
    expect(tailleNom('  Léa  ')).toBe('grand')
    expect(tailleNom('Séraphine')).toBe('grand')
  })
})

describe('FEUILLE_BUREAU', () => {
  it('est servie', () => {
    const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')
    expect(existsSync(path.join(PUBLIC, FEUILLE_BUREAU))).toBe(true)
  })
})

describe('feuilleBureau', () => {
  it('punaise la feuille du jour sur une chambre au jour, l’autre partout ailleurs', () => {
    expect(feuilleBureau('elfe-rodeur')).toBe(FEUILLE_BUREAU_JOUR)
    expect(feuilleBureau('7')).toBe(FEUILLE_BUREAU)
    expect(feuilleBureau(null)).toBe(FEUILLE_BUREAU)
  })

  it('a la feuille du jour servie', () => {
    const PUBLIC = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')
    expect(existsSync(path.join(PUBLIC, FEUILLE_BUREAU_JOUR))).toBe(true)
  })
})
