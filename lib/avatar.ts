// Avatar personnalisable de l'onglet Moi, façon Duolingo. Rendu par DiceBear
// (collection « avataaars ») entièrement côté client/serveur — aucun appel
// réseau, le SVG est généré à partir des options choisies. Le catalogue est
// FERMÉ ici (comme SHOP_CATALOG / DEBRIEF_CATALOG) : la base ne stocke que la
// config validée, l'action serveur la re-valide contre ces listes. Voir 082.

import { createAvatar } from '@dicebear/core'
import { avataaars } from '@dicebear/collection'

// La configuration retenue par l'élève. Chaque champ pointe une option d'une
// liste fermée ci-dessous ; '' signifie « aucun » là où c'est permis (coiffure,
// lunettes, barbe, fond).
export type AvatarConfig = {
  skinColor: string
  top: string // '' = chauve
  hairColor: string
  eyes: string
  eyebrows: string
  mouth: string
  accessories: string // '' = pas de lunettes
  facialHair: string // '' = imberbe
  facialHairColor: string
  clothing: string
  clothesColor: string
  backgroundColor: string // '' = transparent
}

// Un champ éditable : sa clé, son libellé FR, son type (pastille de couleur ou
// vignette de style), ses options, et s'il accepte « aucun ».
export type AvatarField = {
  key: keyof AvatarConfig
  label: string
  kind: 'color' | 'style'
  options: readonly string[]
  allowNone: boolean
}

// Palettes de couleurs (hex sans '#', format attendu par DiceBear).
const HAIR_COLORS = [
  '2c1b18',
  '4a312c',
  '724133',
  'a55728',
  'b58143',
  'd6b370',
  'ecdcbf',
  'c93305',
  'f59797',
  'e8e1e1',
] as const

const SKIN_COLORS = [
  '614335',
  'ae5d29',
  'd08b5b',
  'edb98a',
  'fd9841',
  'ffdbb4',
  'f8d25c',
] as const

const CLOTHES_COLORS = [
  '7c4dff', // violet marque
  '262e33',
  '3c4f5c',
  '25557c',
  '5199e4',
  '65c9ff',
  '929598',
  'e6e6e6',
  'a7ffc4',
  'ffafb9',
  'ff5c5c',
  'ffdf6b',
] as const

const BACKGROUND_COLORS = [
  'b9a6ff', // violet clair (marque)
  'd9ccff',
  'ffe08a', // jaune solaire (marque)
  'ffd0d6',
  'c7f0d8',
  'b1e2ff',
  'ffffff',
] as const

// Styles (identifiants d'énumération de la collection avataaars).
const TOPS = [
  'shortFlat',
  'shortRound',
  'shortCurly',
  'shortWaved',
  'theCaesar',
  'shaggy',
  'frizzle',
  'dreads01',
  'fro',
  'froBand',
  'straight01',
  'straight02',
  'bob',
  'bun',
  'curly',
  'curvy',
  'longButNotTooLong',
  'bigHair',
  'hijab',
  'turban',
  'winterHat02',
  'hat',
] as const

const EYES = [
  'default',
  'happy',
  'wink',
  'winkWacky',
  'squint',
  'surprised',
  'hearts',
  'side',
  'closed',
] as const

const EYEBROWS = [
  'default',
  'defaultNatural',
  'flatNatural',
  'raisedExcited',
  'angry',
  'sadConcerned',
  'upDown',
] as const

const MOUTHS = [
  'smile',
  'default',
  'twinkle',
  'tongue',
  'serious',
  'eating',
  'grimace',
  'screamOpen',
] as const

const ACCESSORIES = [
  'round',
  'prescription01',
  'prescription02',
  'wayfarers',
  'sunglasses',
  'kurt',
  'eyepatch',
] as const

const FACIAL_HAIR = [
  'beardLight',
  'beardMedium',
  'beardMajestic',
  'moustacheFancy',
  'moustacheMagnum',
] as const

const CLOTHING = [
  'shirtCrewNeck',
  'shirtScoopNeck',
  'shirtVNeck',
  'hoodie',
  'collarAndSweater',
  'blazerAndShirt',
  'blazerAndSweater',
  'graphicShirt',
  'overall',
] as const

// L'ordre des onglets de l'éditeur suit ce tableau.
export const AVATAR_FIELDS: readonly AvatarField[] = [
  { key: 'skinColor', label: 'Peau', kind: 'color', options: SKIN_COLORS, allowNone: false },
  { key: 'top', label: 'Coiffure', kind: 'style', options: TOPS, allowNone: true },
  { key: 'hairColor', label: 'Cheveux', kind: 'color', options: HAIR_COLORS, allowNone: false },
  { key: 'eyes', label: 'Yeux', kind: 'style', options: EYES, allowNone: false },
  { key: 'eyebrows', label: 'Sourcils', kind: 'style', options: EYEBROWS, allowNone: false },
  { key: 'mouth', label: 'Bouche', kind: 'style', options: MOUTHS, allowNone: false },
  { key: 'accessories', label: 'Lunettes', kind: 'style', options: ACCESSORIES, allowNone: true },
  { key: 'facialHair', label: 'Barbe', kind: 'style', options: FACIAL_HAIR, allowNone: true },
  { key: 'clothing', label: 'Tenue', kind: 'style', options: CLOTHING, allowNone: false },
  { key: 'clothesColor', label: 'Couleur tenue', kind: 'color', options: CLOTHES_COLORS, allowNone: false },
  { key: 'backgroundColor', label: 'Fond', kind: 'color', options: BACKGROUND_COLORS, allowNone: true },
]

// Avatar par défaut (proposé au premier passage) — neutre et souriant, fond
// violet clair de la marque.
export const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: 'edb98a',
  top: 'shortFlat',
  hairColor: '4a312c',
  eyes: 'default',
  eyebrows: 'default',
  mouth: 'smile',
  accessories: '',
  facialHair: '',
  facialHairColor: '4a312c',
  clothing: 'shirtCrewNeck',
  clothesColor: '7c4dff',
  backgroundColor: 'b9a6ff',
}

// Ramène n'importe quelle entrée (valeur DB ou payload d'action) à une config
// valide : chaque champ est contraint à sa liste d'options, repli sur le défaut.
export function normalizeAvatarConfig(input: unknown): AvatarConfig {
  const raw = (input ?? {}) as Record<string, unknown>
  const pick = (field: AvatarField): string => {
    const v = raw[field.key]
    if (field.allowNone && v === '') return ''
    if (typeof v === 'string' && field.options.includes(v)) return v
    return DEFAULT_AVATAR[field.key]
  }
  const out = { ...DEFAULT_AVATAR }
  for (const field of AVATAR_FIELDS) out[field.key] = pick(field)
  // facialHairColor n'a pas d'onglet dédié (il suit la couleur des cheveux),
  // mais on le valide quand même s'il est fourni.
  out.facialHairColor =
    typeof raw.facialHairColor === 'string' &&
    (HAIR_COLORS as readonly string[]).includes(raw.facialHairColor)
      ? raw.facialHairColor
      : out.hairColor
  return out
}

// Options DiceBear dérivées d'une config : les « … = aucun » deviennent des
// probabilités à 0 (la collection avataaars n'a pas d'option « vide »).
function toDicebearOptions(cfg: AvatarConfig): Record<string, unknown> {
  return {
    seed: 'studuel',
    skinColor: [cfg.skinColor],
    top: cfg.top ? [cfg.top] : [],
    topProbability: cfg.top ? 100 : 0,
    hairColor: [cfg.hairColor],
    eyes: [cfg.eyes],
    eyebrows: [cfg.eyebrows],
    mouth: [cfg.mouth],
    accessories: cfg.accessories ? [cfg.accessories] : [],
    accessoriesProbability: cfg.accessories ? 100 : 0,
    facialHair: cfg.facialHair ? [cfg.facialHair] : [],
    facialHairProbability: cfg.facialHair ? 100 : 0,
    facialHairColor: [cfg.facialHairColor],
    clothing: [cfg.clothing],
    clothesColor: [cfg.clothesColor],
    backgroundColor: cfg.backgroundColor ? [cfg.backgroundColor] : [],
  }
}

// SVG brut de l'avatar (pour un rendu inline si besoin).
export function avatarSvg(cfg: AvatarConfig, size = 96): string {
  return createAvatar(avataaars, {
    ...toDicebearOptions(cfg),
    size,
    radius: 50,
  }).toString()
}

// Data-URI de l'avatar — à passer directement à <img src> (aucun HTML injecté,
// donc pas de dangerouslySetInnerHTML). Disque arrondi par défaut.
export function avatarDataUri(cfg: AvatarConfig, size = 96): string {
  return createAvatar(avataaars, {
    ...toDicebearOptions(cfg),
    size,
    radius: 50,
  }).toDataUri()
}
