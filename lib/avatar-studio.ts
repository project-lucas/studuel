// -----------------------------------------------------------------------------
// Vestiaire d'avatar — logique pure du catalogue d'items (migration 189).
//
// Un item du catalogue mappe vers le moteur de rendu existant (DiceBear,
// lib/avatar.ts) via son asset_key ; l'équipement et la bannière sont les deux
// couches maison (components/avatar/vestiaire-assets.tsx). Les 4 états d'un
// item (équipé / possédé / achetable / verrouillé) se calculent ici, jamais
// dans les composants. Le débit des pièces et la validation des conditions de
// déblocage restent CÔTÉ SERVEUR (RPC purchase_avatar_item /
// claim_avatar_unlocks) — ce module ne fait que refléter l'état.
// -----------------------------------------------------------------------------

import {
  AVATAR_FIELDS,
  BANNER_KEYS,
  EQUIPMENT_KEYS,
  type AvatarConfig,
} from '@/lib/avatar'

export const AVATAR_ITEM_CATEGORIES = [
  'body_skin',
  'hair_style',
  'hair_color',
  'outfit',
  'equipment',
  'banner',
] as const

export type AvatarItemCategory = (typeof AVATAR_ITEM_CATEGORIES)[number]

// Conditions de déblocage V1. Le serveur les évalue avec les données réelles ;
// le client n'en affiche que le libellé. Extensible (V1.5 : titres, sport…).
export type UnlockCondition = {
  type: 'streak' | 'level' | 'questions'
  value: number
}

export type AvatarRarity = 'common' | 'rare' | 'legendary'

export type AvatarItem = {
  id: string
  category: AvatarItemCategory
  name: string
  assetKey: string
  price: number | null // null = pas à vendre (gratuit ou verrouillé)
  unlock: UnlockCondition | null
  rarity: AvatarRarity
  sort: number
}

export type ItemState = 'equipped' | 'owned' | 'buyable' | 'locked'

// --- Onglets de l'écran -------------------------------------------------------

export const STUDIO_TABS = [
  { id: 'corps', label: 'Corps', categories: ['body_skin', 'hair_style', 'hair_color'] },
  { id: 'tenue', label: 'Tenue', categories: ['outfit'] },
  { id: 'equipement', label: 'Équipement', categories: ['equipment'] },
  { id: 'banniere', label: 'Bannière', categories: ['banner'] },
] as const satisfies readonly {
  id: string
  label: string
  categories: readonly AvatarItemCategory[]
}[]

export type StudioTabId = (typeof STUDIO_TABS)[number]['id']

export const CATEGORY_LABELS: Record<AvatarItemCategory, string> = {
  body_skin: 'Peau',
  hair_style: 'Coiffure',
  hair_color: 'Couleur de cheveux',
  outfit: 'Hauts',
  equipment: 'Accessoire porté',
  banner: 'Fond du profil',
}

// --- Mapping asset_key → config -----------------------------------------------
// body_skin / hair_color : hex DiceBear. hair_style : valeur `top`.
// outfit : `clothing|clothesColor`. equipment / banner : slug maison.

const optionsOf = (key: 'skinColor' | 'top' | 'hairColor' | 'clothing' | 'clothesColor') =>
  AVATAR_FIELDS.find((f) => f.key === key)?.options ?? []

/** L'asset_key est-il valide pour sa catégorie ? (garde contre un seed dérivant) */
export function isValidAssetKey(category: AvatarItemCategory, assetKey: string): boolean {
  switch (category) {
    case 'body_skin':
      return optionsOf('skinColor').includes(assetKey)
    case 'hair_style':
      return optionsOf('top').includes(assetKey)
    case 'hair_color':
      return optionsOf('hairColor').includes(assetKey)
    case 'outfit': {
      const [clothing, color] = assetKey.split('|')
      return (
        optionsOf('clothing').includes(clothing ?? '') &&
        optionsOf('clothesColor').includes(color ?? '')
      )
    }
    case 'equipment':
      return (EQUIPMENT_KEYS as readonly string[]).includes(assetKey)
    case 'banner':
      return (BANNER_KEYS as readonly string[]).includes(assetKey)
  }
}

/**
 * Applique un item à la config (immuable). Un équipement déjà porté se
 * retire (toggle) ; les autres catégories remplacent leur champ.
 */
export function applyItem(cfg: AvatarConfig, item: AvatarItem): AvatarConfig {
  switch (item.category) {
    case 'body_skin':
      return { ...cfg, skinColor: item.assetKey }
    case 'hair_style':
      return { ...cfg, top: item.assetKey }
    case 'hair_color':
      // La couleur de barbe suit la couleur des cheveux (convention 082).
      return { ...cfg, hairColor: item.assetKey, facialHairColor: item.assetKey }
    case 'outfit': {
      const [clothing, color] = item.assetKey.split('|')
      return { ...cfg, clothing: clothing ?? cfg.clothing, clothesColor: color ?? cfg.clothesColor }
    }
    case 'equipment':
      return { ...cfg, equipment: cfg.equipment === item.assetKey ? '' : item.assetKey }
    case 'banner':
      return { ...cfg, banner: item.assetKey }
  }
}

/** L'item est-il celui actuellement porté dans sa catégorie ? */
export function isItemEquipped(cfg: AvatarConfig, item: AvatarItem): boolean {
  switch (item.category) {
    case 'body_skin':
      return cfg.skinColor === item.assetKey
    case 'hair_style':
      return cfg.top === item.assetKey
    case 'hair_color':
      return cfg.hairColor === item.assetKey
    case 'outfit':
      return `${cfg.clothing}|${cfg.clothesColor}` === item.assetKey
    case 'equipment':
      return cfg.equipment !== '' && cfg.equipment === item.assetKey
    case 'banner':
      return cfg.banner === item.assetKey
  }
}

/** Gratuit d'office : ni prix, ni condition — possédé par tout le monde. */
export function isFreeItem(item: AvatarItem): boolean {
  return item.price === null && item.unlock === null
}

/**
 * L'état affiché d'un item. `ownedIds` = lignes user_avatar_items (achats et
 * déblocages déjà réclamés côté serveur).
 */
export function itemState(
  item: AvatarItem,
  cfg: AvatarConfig,
  ownedIds: ReadonlySet<string>,
): ItemState {
  // Possession D'ABORD, équipement ensuite. `isItemEquipped` ne compare qu'un
  // `assetKey` : les configs héritées de l'ancien éditeur libre (migration 082,
  // où l'on choisissait n'importe quelle option DiceBear) portent des valeurs
  // qui coïncident avec des objets PAYANTS ou VERROUILLÉS. Les classer
  // « équipé » les offrait à vie — ni pastille de prix, ni moyen de les
  // acheter, alors que l'élève ne les avait jamais gagnés.
  const owned = isFreeItem(item) || ownedIds.has(item.id)
  if (!owned) return item.price !== null ? 'buyable' : 'locked'
  return isItemEquipped(cfg, item) ? 'equipped' : 'owned'
}

// --- Conditions de déblocage --------------------------------------------------

/** Libellé FR de la condition, affiché sous le cadenas et dans le toast. */
export function unlockLabel(condition: UnlockCondition): string {
  switch (condition.type) {
    case 'streak':
      return `Série de ${condition.value} jour${condition.value > 1 ? 's' : ''}`
    case 'level':
      return `Niveau ${condition.value}`
    case 'questions':
      return `${condition.value} questions répondues`
  }
}

// --- Normalisation du catalogue (lignes DB → items sûrs) ----------------------

type CatalogRow = {
  id: unknown
  category: unknown
  name: unknown
  asset_key: unknown
  price: unknown
  unlock_condition: unknown
  rarity: unknown
  sort: unknown
}

const RARITIES: readonly AvatarRarity[] = ['common', 'rare', 'legendary']

function parseUnlock(input: unknown): UnlockCondition | null {
  if (input === null || input === undefined) return null
  const raw = input as { type?: unknown; value?: unknown }
  const value = Number(raw.value)
  if (!Number.isFinite(value) || value <= 0) return null
  if (raw.type === 'streak' || raw.type === 'level' || raw.type === 'questions')
    return { type: raw.type, value: Math.round(value) }
  return null
}

/**
 * Transforme les lignes brutes d'avatar_items en catalogue sûr : catégorie et
 * asset_key validés (item ignoré sinon), prix et rareté assainis, tri stable.
 */
export function normalizeCatalog(rows: readonly CatalogRow[] | null | undefined): AvatarItem[] {
  const items: AvatarItem[] = []
  for (const row of rows ?? []) {
    const id = typeof row.id === 'string' ? row.id : ''
    const name = typeof row.name === 'string' ? row.name : ''
    const assetKey = typeof row.asset_key === 'string' ? row.asset_key : ''
    const category = AVATAR_ITEM_CATEGORIES.find((c) => c === row.category)
    if (!id || !name || !category || !isValidAssetKey(category, assetKey)) continue

    const price =
      typeof row.price === 'number' && Number.isFinite(row.price) && row.price >= 0
        ? Math.round(row.price)
        : null
    const unlock = parseUnlock(row.unlock_condition)
    items.push({
      id,
      category,
      name,
      assetKey,
      // Un item ne peut pas être à la fois à vendre et verrouillé : la
      // condition prime (le prix est ignoré), comme côté RPC.
      price: unlock ? null : price,
      unlock,
      rarity: RARITIES.find((r) => r === row.rarity) ?? 'common',
      sort: typeof row.sort === 'number' && Number.isFinite(row.sort) ? row.sort : 0,
    })
  }
  return items.sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name))
}

/** Items d'une catégorie, déjà triés par normalizeCatalog. */
export function catalogByCategory(
  catalog: readonly AvatarItem[],
  category: AvatarItemCategory,
): AvatarItem[] {
  return catalog.filter((i) => i.category === category)
}

// --- Catalogue de repli -------------------------------------------------------
// Si avatar_items est vide ou absente (migration 189 pas encore passée), le
// vestiaire reste utilisable : toutes les options de base, gratuites, sans
// économie. Aucun prix ici — l'autorité des prix vit en base, jamais dans l'app.

const FALLBACK_NAMES: Partial<Record<AvatarItemCategory, string>> = {
  body_skin: 'Teinte',
  hair_style: 'Coiffure',
  hair_color: 'Couleur',
  outfit: 'Tenue',
}

export function fallbackCatalog(): AvatarItem[] {
  const free = (
    category: AvatarItemCategory,
    assetKey: string,
    index: number,
    name?: string,
  ): AvatarItem => ({
    id: `libre-${category}-${index}`,
    category,
    name: name ?? `${FALLBACK_NAMES[category] ?? 'Option'} ${index + 1}`,
    assetKey,
    price: null,
    unlock: null,
    rarity: 'common',
    sort: index,
  })

  const skins = optionsOf('skinColor').map((v, i) => free('body_skin', v, i))
  const tops = optionsOf('top').map((v, i) => free('hair_style', v, i))
  const hairs = optionsOf('hairColor').map((v, i) => free('hair_color', v, i))
  // Tenues : chaque coupe dans la couleur violette de la marque.
  const outfits = optionsOf('clothing').map((v, i) => free('outfit', `${v}|7c4dff`, i))
  // Les slugs maison servent de nom lisible en repli.
  const slugName = (v: string) => v.replaceAll('-', ' ')
  const equipments = EQUIPMENT_KEYS.map((v, i) => free('equipment', v, i, slugName(v)))
  const banners = BANNER_KEYS.map((v, i) => free('banner', v, i, slugName(v)))
  return [...skins, ...tops, ...hairs, ...outfits, ...equipments, ...banners]
}
