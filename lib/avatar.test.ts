import { describe, expect, it } from 'vitest'
import {
  AVATAR_FIELDS,
  DEFAULT_AVATAR,
  FREE_AVATAR_FIELD_KEYS,
  applyFreeAvatarField,
  avatarDataUri,
  avatarSvg,
  freeAvatarField,
  normalizeAvatarConfig,
} from './avatar'

describe('AVATAR_FIELDS / DEFAULT_AVATAR', () => {
  it("le défaut respecte chaque liste d'options", () => {
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

  // Le point de la bascule vers Open Peeps : un élève doit pouvoir se
  // reconnaître. Ces coiffures-là sont la raison du changement de moteur ;
  // qu'une refonte du catalogue les fasse disparaître doit casser un test.
  it('la coiffure couvre les cheveux texturés et les couvre-chefs', () => {
    const heads = AVATAR_FIELDS.find((f) => f.key === 'head')?.options ?? []
    for (const must of ['hijab', 'turban', 'cornrows', 'dreads1', 'twists', 'afro', 'bantuKnots'])
      expect(heads).toContain(must)
  })

  it('les champs libres sont bien des champs déclarés', () => {
    for (const key of FREE_AVATAR_FIELD_KEYS) expect(freeAvatarField(key)).not.toBeNull()
    expect(freeAvatarField('skinColor')).toBeNull()
    expect(freeAvatarField('nawak')).toBeNull()
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
      head: 'hijab',
      face: 'smileBig',
      clothingColor: 'pas-une-option', // rejeté → défaut
    })
    expect(cfg.skinColor).toBe('ffdbb4')
    expect(cfg.head).toBe('hijab')
    expect(cfg.face).toBe('smileBig')
    expect(cfg.clothingColor).toBe(DEFAULT_AVATAR.clothingColor)
  })

  it("accepte « aucun » (chaîne vide) là où c'est permis, sinon replie", () => {
    const cfg = normalizeAvatarConfig({ accessories: '', facialHair: '', face: '' })
    expect(cfg.accessories).toBe('') // sans lunettes autorisé
    expect(cfg.facialHair).toBe('') // imberbe autorisé
    expect(cfg.face).toBe(DEFAULT_AVATAR.face) // une expression est obligatoire
  })

  it('ignore les champs inconnus et types incorrects', () => {
    const cfg = normalizeAvatarConfig({ skinColor: 42, sournois: 'x' })
    expect(cfg.skinColor).toBe(DEFAULT_AVATAR.skinColor)
    expect(cfg).not.toHaveProperty('sournois')
  })

  // La bascule d'avataaars vers Open Peeps (2026-08-19). Ce qui est CONSERVÉ
  // l'est parce que les palettes ont été alignées hex pour hex ; ce qui ne peut
  // pas l'être doit repartir du défaut plutôt que d'échouer au rendu.
  it('traverse une config héritée d’avataaars sans casser', () => {
    const legacy = normalizeAvatarConfig({
      skinColor: 'ae5d29',
      top: 'shortFlat',
      hairColor: 'c93305',
      eyes: 'happy',
      mouth: 'twinkle',
      clothing: 'hoodie',
      clothesColor: '5199e4',
      facialHairColor: '2c1b18',
      equipment: 'livre',
      banner: 'neon',
    })
    // La peau et les couches maison survivent.
    expect(legacy.skinColor).toBe('ae5d29')
    expect(legacy.equipment).toBe('livre')
    expect(legacy.banner).toBe('neon')
    // La coiffure et la tenue n'ont pas d'équivalent : retour au défaut.
    expect(legacy.head).toBe(DEFAULT_AVATAR.head)
    expect(legacy.clothingColor).toBe(DEFAULT_AVATAR.clothingColor)
    expect(legacy).not.toHaveProperty('top')
    expect(legacy).not.toHaveProperty('clothing')
    // Open Peeps peint les cheveux à l'encre : la teinte n'est plus un réglage.
    expect(legacy).not.toHaveProperty('hairColor')
  })
})

describe('applyFreeAvatarField', () => {
  it('applique une valeur valide sans muter', () => {
    const next = applyFreeAvatarField(DEFAULT_AVATAR, 'face', 'tired')
    expect(next.face).toBe('tired')
    expect(DEFAULT_AVATAR.face).toBe('smile')
  })

  it('accepte « aucun » là où le champ le permet, le refuse sinon', () => {
    expect(applyFreeAvatarField(DEFAULT_AVATAR, 'accessories', '').accessories).toBe('')
    expect(applyFreeAvatarField(DEFAULT_AVATAR, 'face', '').face).toBe(DEFAULT_AVATAR.face)
  })

  it('ignore une clé payante ou une valeur hors liste', () => {
    // La peau est vendue au vestiaire : elle ne passe pas par cette porte.
    expect(applyFreeAvatarField(DEFAULT_AVATAR, 'skinColor', '614335')).toEqual(DEFAULT_AVATAR)
    expect(applyFreeAvatarField(DEFAULT_AVATAR, 'face', 'monster')).toEqual(DEFAULT_AVATAR)
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

  it('toutes les options du catalogue se rendent', () => {
    for (const field of AVATAR_FIELDS) {
      for (const option of field.options) {
        const cfg = normalizeAvatarConfig({ ...DEFAULT_AVATAR, [field.key]: option })
        expect(avatarSvg(cfg)).toContain('<svg')
      }
    }
  })

  it('une config sans lunettes ni barbe reste rendable', () => {
    const uri = avatarDataUri(
      normalizeAvatarConfig({ ...DEFAULT_AVATAR, accessories: '', facialHair: '' }),
    )
    expect(uri.startsWith('data:image/svg+xml')).toBe(true)
  })
})
