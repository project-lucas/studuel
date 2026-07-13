import { describe, expect, it } from 'vitest'
import {
  AVATAR_FIELDS,
  DEFAULT_AVATAR,
  avatarDataUri,
  avatarSvg,
  normalizeAvatarConfig,
} from './avatar'

describe('AVATAR_FIELDS / DEFAULT_AVATAR', () => {
  it('le défaut respecte chaque liste d\'options', () => {
    for (const field of AVATAR_FIELDS) {
      const v = DEFAULT_AVATAR[field.key]
      if (field.allowNone && v === '') continue
      expect(field.options).toContain(v)
    }
  })

  it('chaque champ a des options uniques', () => {
    for (const field of AVATAR_FIELDS) {
      expect(new Set(field.options).size).toBe(field.options.length)
    }
  })
})

describe('normalizeAvatarConfig', () => {
  it('replie une entrée vide sur le défaut', () => {
    expect(normalizeAvatarConfig(null)).toEqual(DEFAULT_AVATAR)
    expect(normalizeAvatarConfig(undefined)).toEqual(DEFAULT_AVATAR)
    expect(normalizeAvatarConfig({})).toEqual(DEFAULT_AVATAR)
  })

  it('garde les valeurs valides et rejette les valeurs hors catalogue', () => {
    const cfg = normalizeAvatarConfig({
      skinColor: 'ffdbb4',
      mouth: 'tongue',
      clothing: 'hoodie',
      eyes: 'pas-une-option', // rejeté → défaut
    })
    expect(cfg.skinColor).toBe('ffdbb4')
    expect(cfg.mouth).toBe('tongue')
    expect(cfg.clothing).toBe('hoodie')
    expect(cfg.eyes).toBe(DEFAULT_AVATAR.eyes)
  })

  it('accepte « aucun » (chaîne vide) là où c\'est permis, sinon replie', () => {
    const cfg = normalizeAvatarConfig({ top: '', accessories: '', mouth: '' })
    expect(cfg.top).toBe('') // chauve autorisé
    expect(cfg.accessories).toBe('') // sans lunettes autorisé
    expect(cfg.mouth).toBe(DEFAULT_AVATAR.mouth) // bouche obligatoire → défaut
  })

  it('ignore les champs inconnus et types incorrects', () => {
    const cfg = normalizeAvatarConfig({ skinColor: 42, sournois: 'x' })
    expect(cfg.skinColor).toBe(DEFAULT_AVATAR.skinColor)
    expect(cfg).not.toHaveProperty('sournois')
  })
})

describe('rendu DiceBear', () => {
  it('avatarDataUri renvoie un data-URI SVG', () => {
    const uri = avatarDataUri(DEFAULT_AVATAR)
    expect(uri.startsWith('data:image/svg+xml')).toBe(true)
  })

  it('avatarSvg renvoie un SVG non vide', () => {
    const svg = avatarSvg(DEFAULT_AVATAR)
    expect(svg).toContain('<svg')
    expect(svg.length).toBeGreaterThan(100)
  })

  it('une config chauve + sans lunettes reste rendable', () => {
    const uri = avatarDataUri(
      normalizeAvatarConfig({ ...DEFAULT_AVATAR, top: '', accessories: '' }),
    )
    expect(uri.startsWith('data:image/svg+xml')).toBe(true)
  })
})
