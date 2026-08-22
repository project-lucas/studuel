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
  type FreeAvatarFieldKey,
} from '@/lib/avatar'

// Les catégories que le vestiaire sait rendre. La table `avatar_items` en
// accepte une de plus — `hair_color` — et c'est volontaire : Open Peeps dessine
// les cheveux à l'encre noire et ne sait pas les teindre (cf. l'en-tête de
// lib/avatar.ts). La retirer d'ici suffit à ce que `normalizeCatalog` IGNORE
// toute ligne restée dans cette catégorie ; on ne l'a pas retirée de la
// contrainte SQL parce que supprimer les lignes effacerait par cascade les
// achats des élèves. La migration 240 les a reconverties en coiffures.
export const AVATAR_ITEM_CATEGORIES = [
  'body_skin',
  'hair_style',
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

// Six onglets, et non plus quatre. Les deux nouveaux (« Visage », « Détails »)
// portent les champs LIBRES — l'expression, les lunettes, la barbe, le fond.
// Ils n'ont pas de prix parce qu'ils ne sont pas des cosmétiques : ce sont les
// traits par lesquels un élève se reconnaît. Le catalogue payant reste ce qui
// se collectionne (peau rare, coiffures, couleurs, hauts, objets, bannières).
export const STUDIO_TABS = [
  { id: 'visage', label: 'Visage', categories: ['body_skin'], freeFields: ['face'] },
  { id: 'coiffure', label: 'Coiffure', categories: ['hair_style'], freeFields: [] },
  { id: 'details', label: 'Détails', categories: [], freeFields: ['accessories', 'facialHair'] },
  { id: 'tenue', label: 'Tenue', categories: ['outfit'], freeFields: [] },
  { id: 'objet', label: 'Objet', categories: ['equipment'], freeFields: [] },
  { id: 'fond', label: 'Fond', categories: ['banner'], freeFields: ['backgroundColor'] },
] as const satisfies readonly {
  id: string
  label: string
  categories: readonly AvatarItemCategory[]
  freeFields: readonly FreeAvatarFieldKey[]
}[]

export type StudioTabId = (typeof STUDIO_TABS)[number]['id']

export const CATEGORY_LABELS: Record<AvatarItemCategory, string> = {
  body_skin: 'Peau',
  hair_style: 'Coiffure et couvre-chef',
  outfit: 'Couleur du haut',
  equipment: 'Accessoire porté',
  banner: 'Bannière du profil',
}

// --- Champs libres : libellés FR ----------------------------------------------
// Les valeurs d'Open Peeps sont des identifiants anglais opaques (`smileLOL`,
// `glasses3`, `moustache7`). Un vestiaire qui les afficherait tels quels
// demanderait à un élève de 6e de choisir entre `full2` et `full3`. Chaque
// option porte donc son nom français ici, à un seul endroit.

export const FREE_FIELD_LABELS: Record<FreeAvatarFieldKey, string> = {
  face: 'Expression',
  accessories: 'Lunettes',
  facialHair: 'Barbe',
  backgroundColor: 'Fond de l’avatar',
}

/** Ce que dit le bouton « aucun » de chaque champ libre qui l'accepte. */
export const FREE_FIELD_NONE_LABELS: Partial<Record<FreeAvatarFieldKey, string>> = {
  accessories: 'Sans',
  facialHair: 'Imberbe',
  backgroundColor: 'Sans fond',
}

const FREE_OPTION_LABELS: Record<string, string> = {
  // Expressions
  'face:smile': 'Sourire',
  'face:smileBig': 'Grand sourire',
  'face:smileLOL': 'Fou rire',
  'face:smileTeethGap': 'Sourire malin',
  'face:cheeky': 'Espiègle',
  'face:lovingGrin1': 'Ravi',
  'face:lovingGrin2': 'Aux anges',
  'face:cute': 'Tout mignon',
  'face:awe': 'Émerveillé',
  'face:calm': 'Serein',
  'face:blank': 'Neutre',
  'face:serious': 'Sérieux',
  'face:solemn': 'Grave',
  'face:driven': 'Déterminé',
  'face:explaining': 'En train d’expliquer',
  'face:eyesClosed': 'Yeux fermés',
  'face:suspicious': 'Sceptique',
  'face:tired': 'Fatigué',
  // Lunettes
  'accessories:glasses': 'Rondes',
  'accessories:glasses2': 'Carrées',
  'accessories:glasses3': 'Fines',
  'accessories:glasses4': 'Épaisses',
  'accessories:glasses5': 'Papillon',
  'accessories:sunglasses': 'Solaires',
  'accessories:sunglasses2': 'Solaires aviateur',
  'accessories:eyepatch': 'Cache-œil',
  // Barbe
  'facialHair:chin': 'Bouc au menton',
  'facialHair:goatee1': 'Bouc',
  'facialHair:goatee2': 'Bouc large',
  'facialHair:moustache1': 'Moustache fine',
  'facialHair:moustache2': 'Moustache classique',
  'facialHair:moustache3': 'Moustache épaisse',
  'facialHair:moustache7': 'Moustache guidon',
  'facialHair:moustache9': 'Moustache chevron',
  'facialHair:full': 'Barbe courte',
  'facialHair:full2': 'Barbe pleine',
  'facialHair:full3': 'Barbe longue',
  'facialHair:full4': 'Barbe de bûcheron',
}

/** Le nom FR d'une option de champ libre (l'identifiant brut en dernier repli). */
export function freeOptionLabel(field: FreeAvatarFieldKey, value: string): string {
  return FREE_OPTION_LABELS[`${field}:${value}`] ?? value
}

// --- Mapping asset_key → config -----------------------------------------------
// body_skin / outfit : hex DiceBear. hair_style : valeur `head`
// (coiffure OU couvre-chef, Open Peeps n'a qu'une couche). equipment / banner :
// slug maison.
//
// L'outfit était `clothing|clothesColor` du temps d'avataaars, qui portait neuf
// COUPES de vêtement. Open Peeps n'en a qu'une, colorée : la tenue se réduit
// donc à sa couleur, et la variété a déménagé côté coiffures (47 têtes contre
// 22, voile et turban compris). Migration 240 : les ids des items ne bougent
// pas, leurs asset_key et leurs noms sont réécrits.

const optionsOf = (key: 'skinColor' | 'head' | 'clothingColor') =>
  AVATAR_FIELDS.find((f) => f.key === key)?.options ?? []

/** L'asset_key est-il valide pour sa catégorie ? (garde contre un seed dérivant) */
export function isValidAssetKey(category: AvatarItemCategory, assetKey: string): boolean {
  switch (category) {
    case 'body_skin':
      return optionsOf('skinColor').includes(assetKey)
    case 'hair_style':
      return optionsOf('head').includes(assetKey)
    case 'outfit':
      return optionsOf('clothingColor').includes(assetKey)
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
      return { ...cfg, head: item.assetKey }
    case 'outfit':
      return { ...cfg, clothingColor: item.assetKey }
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
      return cfg.head === item.assetKey
    case 'outfit':
      return cfg.clothingColor === item.assetKey
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
  const tops = optionsOf('head').map((v, i) => free('hair_style', v, i))
  const outfits = optionsOf('clothingColor').map((v, i) => free('outfit', v, i))
  // Les slugs maison servent de nom lisible en repli.
  const slugName = (v: string) => v.replaceAll('-', ' ')
  const equipments = EQUIPMENT_KEYS.map((v, i) => free('equipment', v, i, slugName(v)))
  const banners = BANNER_KEYS.map((v, i) => free('banner', v, i, slugName(v)))
  return [...skins, ...tops, ...outfits, ...equipments, ...banners]
}
