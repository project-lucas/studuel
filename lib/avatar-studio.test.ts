import { describe, expect, it } from 'vitest'
import { DEFAULT_AVATAR, DEFAULT_BANNER, normalizeAvatarConfig } from '@/lib/avatar'
import {
  applyItem,
  catalogByCategory,
  fallbackCatalog,
  isFreeItem,
  isItemEquipped,
  isValidAssetKey,
  itemState,
  normalizeCatalog,
  unlockLabel,
  type AvatarItem,
} from '@/lib/avatar-studio'

const item = (over: Partial<AvatarItem>): AvatarItem => ({
  id: 'test',
  category: 'body_skin',
  name: 'Test',
  assetKey: 'edb98a',
  price: null,
  unlock: null,
  rarity: 'common',
  sort: 0,
  ...over,
})

describe('applyItem', () => {
  it('remplace le champ de sa catégorie sans muter la config', () => {
    const next = applyItem(DEFAULT_AVATAR, item({ category: 'body_skin', assetKey: 'ae5d29' }))
    expect(next.skinColor).toBe('ae5d29')
    expect(DEFAULT_AVATAR.skinColor).toBe('edb98a')
  })

  it('décompose une tenue en coupe + couleur', () => {
    const next = applyItem(
      DEFAULT_AVATAR,
      item({ category: 'outfit', assetKey: 'hoodie|5199e4' }),
    )
    expect(next.clothing).toBe('hoodie')
    expect(next.clothesColor).toBe('5199e4')
  })

  it('aligne la couleur de barbe sur la couleur de cheveux', () => {
    const next = applyItem(
      DEFAULT_AVATAR,
      item({ category: 'hair_color', assetKey: '2c1b18' }),
    )
    expect(next.facialHairColor).toBe('2c1b18')
  })

  it("retire l'équipement déjà porté (toggle)", () => {
    const worn = { ...DEFAULT_AVATAR, equipment: 'livre' }
    const gear = item({ category: 'equipment', assetKey: 'livre' })
    expect(applyItem(DEFAULT_AVATAR, gear).equipment).toBe('livre')
    expect(applyItem(worn, gear).equipment).toBe('')
  })
})

describe('itemState', () => {
  const none = new Set<string>()

  it('équipé quand la config porte déjà cet item', () => {
    const skin = item({ assetKey: DEFAULT_AVATAR.skinColor })
    expect(itemState(skin, DEFAULT_AVATAR, none)).toBe('equipped')
  })

  it('n’offre pas un item PAYANT que la config porte déjà par héritage', () => {
    // Les profils créés avant le vestiaire (éditeur libre de la 082) portent
    // des valeurs qui coïncident avec des items désormais payants. Les compter
    // « équipés » les donnait à vie, sans prix affiché ni moyen de les acheter.
    const paid = item({ id: 'peau-solaire', assetKey: DEFAULT_AVATAR.skinColor, price: 110 })
    expect(itemState(paid, DEFAULT_AVATAR, none)).toBe('buyable')
    expect(itemState(paid, DEFAULT_AVATAR, new Set(['peau-solaire']))).toBe('equipped')
  })

  it('n’offre pas non plus un item VERROUILLÉ porté par héritage', () => {
    const locked = item({
      id: 'chev-platine',
      assetKey: DEFAULT_AVATAR.skinColor,
      unlock: { type: 'level', value: 5 },
    })
    expect(itemState(locked, DEFAULT_AVATAR, none)).toBe('locked')
    expect(itemState(locked, DEFAULT_AVATAR, new Set(['chev-platine']))).toBe('equipped')
  })

  it('possédé si gratuit ou acheté, achetable si prix, verrouillé sinon', () => {
    const free = item({ assetKey: 'ae5d29' })
    const paid = item({ id: 'paid', assetKey: 'ae5d29', price: 120 })
    const locked = item({
      id: 'locked',
      assetKey: 'ae5d29',
      unlock: { type: 'streak', value: 7 },
    })
    expect(itemState(free, DEFAULT_AVATAR, none)).toBe('owned')
    expect(itemState(paid, DEFAULT_AVATAR, none)).toBe('buyable')
    expect(itemState(paid, DEFAULT_AVATAR, new Set(['paid']))).toBe('owned')
    expect(itemState(locked, DEFAULT_AVATAR, none)).toBe('locked')
    expect(itemState(locked, DEFAULT_AVATAR, new Set(['locked']))).toBe('owned')
  })

  it("un équipement non porté n'est jamais « équipé » même à équipement vide", () => {
    const gear = item({ category: 'equipment', assetKey: 'livre' })
    expect(isItemEquipped({ ...DEFAULT_AVATAR, equipment: '' }, gear)).toBe(false)
  })
})

describe('unlockLabel', () => {
  it('libelle les trois types de condition en français', () => {
    expect(unlockLabel({ type: 'streak', value: 7 })).toBe('Série de 7 jours')
    expect(unlockLabel({ type: 'streak', value: 1 })).toBe('Série de 1 jour')
    expect(unlockLabel({ type: 'level', value: 5 })).toBe('Niveau 5')
    expect(unlockLabel({ type: 'questions', value: 100 })).toBe('100 questions répondues')
  })
})

describe('normalizeCatalog', () => {
  const row = (over: Record<string, unknown>) => ({
    id: 'x',
    category: 'body_skin',
    name: 'X',
    asset_key: 'edb98a',
    price: null,
    unlock_condition: null,
    rarity: 'common',
    sort: 0,
    ...over,
  })

  it('ignore les lignes à catégorie ou asset_key invalides', () => {
    const items = normalizeCatalog([
      row({ id: 'ok' }),
      row({ id: 'bad-cat', category: 'chapeau' }),
      row({ id: 'bad-key', asset_key: 'zzzzzz' }),
      row({ id: 'bad-outfit', category: 'outfit', asset_key: 'hoodie|zz' }),
    ])
    expect(items.map((i) => i.id)).toEqual(['ok'])
  })

  it('parse prix, rareté et condition, et fait primer la condition sur le prix', () => {
    const items = normalizeCatalog([
      row({
        id: 'locked',
        price: 300,
        unlock_condition: { type: 'level', value: 5 },
        rarity: 'legendary',
      }),
    ])
    expect(items[0].price).toBeNull()
    expect(items[0].unlock).toEqual({ type: 'level', value: 5 })
    expect(items[0].rarity).toBe('legendary')
  })

  it('trie par sort puis nom et tolère null/undefined', () => {
    expect(normalizeCatalog(null)).toEqual([])
    const items = normalizeCatalog([
      row({ id: 'b', name: 'B', sort: 2 }),
      row({ id: 'a', name: 'A', sort: 1 }),
    ])
    expect(items.map((i) => i.id)).toEqual(['a', 'b'])
  })
})

describe('fallbackCatalog', () => {
  it('couvre les 6 catégories, tout gratuit', () => {
    const catalog = fallbackCatalog()
    expect(catalog.length).toBeGreaterThan(0)
    expect(catalog.every(isFreeItem)).toBe(true)
    for (const cat of ['body_skin', 'hair_style', 'hair_color', 'outfit', 'equipment', 'banner'] as const)
      expect(catalogByCategory(catalog, cat).length).toBeGreaterThan(0)
  })

  it("ne produit que des asset_key valides (l'écran peut tous les rendre)", () => {
    for (const i of fallbackCatalog()) expect(isValidAssetKey(i.category, i.assetKey)).toBe(true)
  })
})

describe('normalizeAvatarConfig — couches vestiaire', () => {
  it('valide équipement et bannière contre les listes fermées', () => {
    const cfg = normalizeAvatarConfig({ equipment: 'livre', banner: 'neon' })
    expect(cfg.equipment).toBe('livre')
    expect(cfg.banner).toBe('neon')
  })

  it('replie les valeurs inconnues (équipement vide, bannière par défaut)', () => {
    const cfg = normalizeAvatarConfig({ equipment: 'tronçonneuse', banner: 'plage' })
    expect(cfg.equipment).toBe('')
    expect(cfg.banner).toBe(DEFAULT_BANNER)
  })
})
