import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import {
  adressePiste,
  basculerOngletMusique,
  cibleMusique,
  lireOngletsMusique,
  lireTheme,
  ONGLETS_MUSIQUE_DEFAUT,
  PISTES,
  THEME_DEFAUT,
  THEMES,
  type Demande,
} from './musique'

const d = (id: number, piste: Demande['piste'], boucle = true): Demande => ({ id, piste, boucle })
const base = { silenceForce: false, reglage: true, visible: true }

describe('cibleMusique — la dernière demande joue', () => {
  it('rien demandé : silence', () => {
    expect(cibleMusique({ ...base, pile: [] })).toBeNull()
  })

  it('le combat demandé par-dessus l’arène prend la main', () => {
    expect(cibleMusique({ ...base, pile: [d(1, 'arene'), d(2, 'combat')] })?.piste).toBe('combat')
  })

  it('une demande de silence (la défaite) tait tout', () => {
    expect(cibleMusique({ ...base, pile: [d(1, 'combat'), d(2, null)] })).toBeNull()
  })

  it('réglage coupé, app en arrière-plan ou blanc de l’entrée : silence', () => {
    const pile = [d(1, 'arene')]
    expect(cibleMusique({ ...base, pile, reglage: false })).toBeNull()
    expect(cibleMusique({ ...base, pile, visible: false })).toBeNull()
    expect(cibleMusique({ ...base, pile, silenceForce: true })).toBeNull()
  })
})

describe('les fichiers des musiques', () => {
  it('chaque piste est servie dans public/', () => {
    for (const p of PISTES) expect(existsSync(join(process.cwd(), 'public', adressePiste(p)))).toBe(true)
  })

  it('chaque thème de fond a son fichier (scripts/musiques-themes.mjs)', () => {
    for (const t of THEMES) expect(existsSync(join(process.cwd(), 'public', adressePiste('arene', t.id)))).toBe(true)
  })
})

describe('la musique onglet par onglet (05/11/2026)', () => {
  it('joue par défaut partout sauf dans Réviser', () => {
    expect(lireOngletsMusique(null)).toEqual(['tresor', 'defi', 'amis', 'moi'])
    expect(ONGLETS_MUSIQUE_DEFAUT).not.toContain('reviser')
  })

  it('lit la liste réglée, ignore l’inconnu, et retombe sur le défaut si illisible', () => {
    expect(lireOngletsMusique('["moi","reviser","inconnu"]')).toEqual(['reviser', 'moi'])
    expect(lireOngletsMusique('[]')).toEqual([])
    expect(lireOngletsMusique('{pas du json')).toEqual(['tresor', 'defi', 'amis', 'moi'])
    expect(lireOngletsMusique('"defi"')).toEqual(['tresor', 'defi', 'amis', 'moi'])
  })

  it('bascule un onglet sans toucher aux autres, dans l’ordre de la barre', () => {
    const depart = ['tresor', 'defi', 'amis', 'moi'] as const
    expect(basculerOngletMusique(depart, 'amis')).toEqual(['tresor', 'defi', 'moi'])
    expect(basculerOngletMusique(depart, 'reviser')).toEqual(['tresor', 'reviser', 'defi', 'amis', 'moi'])
    expect(depart).toEqual(['tresor', 'defi', 'amis', 'moi'])
  })
})

describe('le thème de fond au choix (05/11/2026)', () => {
  it('ne change que la piste de fond, pas le combat ni la victoire', () => {
    expect(adressePiste('arene', 'cour')).toBe('/music/arene.mp3')
    expect(adressePiste('arene', 'taverne')).toBe('/music/arene-taverne.mp3')
    expect(adressePiste('combat', 'taverne')).toBe('/music/combat.mp3')
    expect(adressePiste('victoire', 'rempart')).toBe('/music/victoire.mp3')
  })

  it('lit le thème réglé, et retombe sur la cour d’honneur sinon', () => {
    expect(lireTheme('rempart')).toBe('rempart')
    expect(lireTheme(null)).toBe(THEME_DEFAUT)
    expect(lireTheme('inconnu')).toBe(THEME_DEFAUT)
    expect(THEME_DEFAUT).toBe('cour')
  })
})
