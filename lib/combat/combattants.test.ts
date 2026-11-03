import { existsSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, test } from 'vitest'
import { bossById } from '@/lib/bosses'
import { isHerosKey } from '@/lib/heros/eleves'
import {
  COMBATTANTS_BOSS,
  COMBATTANTS_HEROS,
  ECLAT_CRITIQUE,
  HEROS_DE_REPLI,
  IMAGES_COEUR,
  combattantBoss,
  combattantHeros,
  herosDuPortrait,
  herosDuRival,
  imagesDe,
  imagesDuCombat,
  type Combattant,
} from './combattants'

const existe = (adresse: string) => existsSync(path.join(process.cwd(), 'public', adresse))
const tous: Combattant[] = [...Object.values(COMBATTANTS_HEROS), ...Object.values(COMBATTANTS_BOSS)] as Combattant[]

// LA RÈGLE D'OR : un personnage n'entre au catalogue que si ses images
// existent. Un sprite manquant, c'est un combattant invisible en plein duel.
describe('le catalogue des combattants', () => {
  test.each(tous.map((c) => [c.id, c] as const))('%s : chaque image existe', (_id, c) => {
    for (const img of imagesDe(c)) expect(existe(img), img).toBe(true)
  })

  test('les cœurs et l’éclat critique existent', () => {
    for (const img of [...Object.values(IMAGES_COEUR), ECLAT_CRITIQUE]) expect(existe(img), img).toBe(true)
  })

  test('un héros a ses six poses, de dos comme de face', () => {
    for (const c of Object.values(COMBATTANTS_HEROS) as Combattant[]) {
      expect(isHerosKey(c.id)).toBe(true)
      expect(c.famille).toBe('heros')
      expect(c.poses.dos && c.poses.attaqueDos && c.poses.toucheDos).toBeTruthy()
    }
  })

  test('un boss est un gardien du catalogue', () => {
    for (const c of Object.values(COMBATTANTS_BOSS)) {
      expect(bossById(c.id)?.id).toBe(c.id)
      expect(c.famille).toBe('boss')
    }
  })

  test('le repli est jouable : un héros sans poses joue avec lui', () => {
    expect(COMBATTANTS_HEROS[HEROS_DE_REPLI]).toBeDefined()
    expect(combattantHeros(null).id).toBe(HEROS_DE_REPLI)
    expect(combattantHeros('troll-pont').id).toBe(COMBATTANTS_HEROS['troll-pont']?.id ?? HEROS_DE_REPLI)
  })

  test('les quinze héros et les dix-sept gardiens ont leur combattant', () => {
    expect(Object.keys(COMBATTANTS_HEROS)).toHaveLength(15)
    expect(Object.keys(COMBATTANTS_BOSS)).toHaveLength(17)
  })

  test('le héros d’un élève vient de son portrait, sinon le repli', () => {
    expect(herosDuPortrait('orc-chien')).toBe('orc-chien')
    expect(herosDuPortrait('3')).toBe(HEROS_DE_REPLI)
    expect(herosDuPortrait(null)).toBe(HEROS_DE_REPLI)
  })

  test('un gardien sans poses n’a pas de combattant', () => {
    expect(combattantBoss('inconnu')).toBeNull()
  })

  test('les images d’un combat se préchargent une seule fois', () => {
    const mage = combattantHeros('demi-elfe-mage')
    const imgs = imagesDuCombat(mage, mage)
    expect(new Set(imgs).size).toBe(imgs.length)
    expect(imgs).toContain(IMAGES_COEUR.plein)
  })
})

describe('le héros du rival', () => {
  test('un élève rejoué garde son héros', () => {
    expect(herosDuRival('troll-pont', 'x', 'orc-chien')).toBe('troll-pont')
  })
  test('un robot reçoit un héros fixe, jamais le mien', () => {
    const a = herosDuRival('', 'bot:malo', 'orc-chien')
    expect(herosDuRival('3', 'bot:malo', 'orc-chien')).toBe(a)
    expect(a).not.toBe('orc-chien')
    for (const g of ['a', 'b', 'c', 'd', 'e', 'f']) expect(herosDuRival(null, g, 'elfe-course')).not.toBe('elfe-course')
  })
})
