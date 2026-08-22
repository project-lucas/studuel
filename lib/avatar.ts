// Avatar personnalisable de l'onglet Moi. Rendu par DiceBear entièrement
// côté client/serveur — aucun appel réseau, le SVG est généré à partir des
// options choisies. Le catalogue est FERMÉ ici (comme SHOP_CATALOG /
// DEBRIEF_CATALOG) : la base ne stocke que la config validée, l'action serveur
// la re-valide contre ces listes. Voir 082, puis 189 (vestiaire), puis 240.
//
// -----------------------------------------------------------------------------
// POURQUOI OPEN PEEPS (2026-08-19), ET CE QUE ÇA CHANGE.
//
// Le moteur était « avataaars » : 22 coiffures, aucune texture de cheveux, un
// trait plat de 2017. Un élève sur deux ne pouvait pas se reconnaître dedans —
// ni cheveux crépus, ni locks, ni voile, ni tresses. Open Peeps (Pablo Stanley,
// CC0) apporte 47 têtes DONT hijab, turban, cornrows, dreads, twists, afro,
// bantu knots, bonnet, casquette — et 18 expressions entières au lieu d'une
// paire yeux/bouche à assembler soi-même.
//
// CE QU'OPEN PEEPS NE SAIT PAS FAIRE, ET QU'IL FAUT SAVOIR : colorer les
// cheveux. Ils sont TOUJOURS à l'encre noire — dans le SVG, la chevelure et les
// contours du visage sont un seul tracé `fill="#000"`, on ne peut pas teindre
// l'une sans repeindre les autres. C'est la convention du trait, pas un
// oubli. La catégorie « couleur de cheveux » a donc été RETIRÉE du vestiaire
// (migration 240) plutôt que de vendre une teinte qui ne se voit pas : ses sept
// articles sont devenus des coiffures, que leurs propriétaires gardent.
// `headContrastColor` reste réglé sur `HAIR_INK` — il ne peint que quelques
// détails (les mèches des tresses, la bande du voile), pas la chevelure.
//
// LES CHAMPS ONT CHANGÉ DE NOM (top → head, eyes+mouth → face,
// clothing|clothesColor → clothingColor). `normalizeAvatarConfig` ramène
// n'importe quelle ancienne config à une config valide : la COULEUR DE PEAU
// traverse (les palettes se recouvrent volontairement, hex pour hex), la
// coiffure et la tenue repartent du défaut. C'est le prix assumé du
// changement de trait, et il n'y en a pas d'autre : les ids du catalogue
// (`avatar_items`) ne bougent PAS — un élève qui possédait « Hoodie Studuel »
// le possède toujours, seul son rendu change (migration 240).
// -----------------------------------------------------------------------------

import { createAvatar } from '@dicebear/core'
import { openPeeps } from '@dicebear/collection'

// La configuration retenue par l'élève. Chaque champ pointe une option d'une
// liste fermée ci-dessous ; '' signifie « aucun » là où c'est permis (barbe,
// lunettes, fond).
export type AvatarConfig = {
  skinColor: string
  /** Coiffure ou couvre-chef (une seule couche chez Open Peeps). */
  head: string
  /** Expression : yeux + bouche + sourcils d'un seul tenant. */
  face: string
  facialHair: string // '' = imberbe
  accessories: string // '' = pas de lunettes
  clothingColor: string
  backgroundColor: string // '' = transparent
  equipment: string // '' = aucun accessoire porté (couche vestiaire, hors DiceBear)
  banner: string // fond du profil (couche vestiaire, hors DiceBear)
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

// --- Palettes (hex sans '#', format attendu par DiceBear) ---------------------

// Les six premières sont celles d'Open Peeps ; les deux dernières prolongent la
// gamme (614335 était déjà proposée par l'ancien moteur — une peau choisie ne
// doit pas disparaître au changement de trait).
const SKIN_COLORS = [
  'ffdbb4',
  'edb98a',
  'd08b5b',
  'ae5d29',
  '8d5524',
  '694d3d',
  '614335',
  'f8d25c', // « solaire » : peau fantaisie du vestiaire
] as const

// L'encre des cheveux. UNE valeur, pas une palette : voir l'en-tête du fichier
// — Open Peeps dessine la chevelure et les contours du visage d'un même noir.
// Ce réglage ne teinte que des détails (mèches des tresses, bande du voile),
// et il est fixé pour que le rendu ne dépende pas du hasard de la graine.
const HAIR_INK = '2c1b18'

const CLOTHING_COLORS = [
  '7c4dff', // violet marque
  '262e33',
  '25557c',
  '5199e4',
  '9ddadb',
  '78e185',
  'a7ffc4',
  'fdea6b',
  'ffcf77',
  'e78276',
  'ff5c5c',
  'e279c7',
  'e6e6e6',
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

// --- Styles (identifiants d'énumération de la collection open-peeps) ----------

// 47 têtes : tout le jeu d'Open Peeps sauf `bear` (une tête d'ours en peluche,
// hors sujet ici). L'ordre est celui de l'écran : coupes courtes, mi-longues,
// longues, textures, puis couvre-chefs.
const HEADS = [
  'short1',
  'short2',
  'short3',
  'short4',
  'short5',
  'shaved1',
  'shaved2',
  'shaved3',
  'noHair1',
  'noHair2',
  'noHair3',
  'flatTop',
  'flatTopLong',
  'pomp',
  'mohawk',
  'mohawk2',
  'medium1',
  'medium2',
  'medium3',
  'mediumStraight',
  'mediumBangs',
  'mediumBangs2',
  'mediumBangs3',
  'bangs',
  'bangs2',
  'long',
  'longBangs',
  'longCurly',
  'longAfro',
  'afro',
  'bun',
  'bun2',
  'buns',
  'grayBun',
  'grayMedium',
  'grayShort',
  'cornrows',
  'cornrows2',
  'dreads1',
  'dreads2',
  'twists',
  'twists2',
  'bantuKnots',
  'hijab',
  'turban',
  'hatBeanie',
  'hatHip',
] as const

// 18 expressions. Écartées : les colères (`rage`, `veryAngry`, `angryWithFang`),
// les peurs (`fear`, `concernedFear`, `hectic`) et les fantaisies (`monster`,
// `cyclops`, `old`). Un élève choisit ici le visage qu'il montre à ses amis :
// l'app n'a pas à lui proposer d'avoir l'air terrorisé.
const FACES = [
  'smile',
  'smileBig',
  'smileLOL',
  'smileTeethGap',
  'cheeky',
  'lovingGrin1',
  'lovingGrin2',
  'cute',
  'awe',
  'calm',
  'blank',
  'serious',
  'solemn',
  'driven',
  'explaining',
  'eyesClosed',
  'suspicious',
  'tired',
] as const

const FACIAL_HAIR = [
  'chin',
  'goatee1',
  'goatee2',
  'moustache1',
  'moustache2',
  'moustache3',
  'moustache7',
  'moustache9',
  'full',
  'full2',
  'full3',
  'full4',
] as const

const ACCESSORIES = [
  'glasses',
  'glasses2',
  'glasses3',
  'glasses4',
  'glasses5',
  'sunglasses',
  'sunglasses2',
  'eyepatch',
] as const

// Couches du vestiaire, HORS DiceBear : l'équipement est un SVG maison
// superposé à l'avatar, la bannière est le fond du profil. Listes fermées
// (mêmes slugs que les asset_key du catalogue avatar_items — migration 189).
export const EQUIPMENT_KEYS = [
  'ballon-basket',
  'casque-audio',
  'lunettes-soleil',
  'livre',
  'sac-a-dos',
] as const

export const BANNER_KEYS = [
  'uni-lavande',
  'terrain-basket',
  'bibliotheque',
  'ciel-etoile',
  'neon',
] as const

// Bannière par défaut : le pastel uni de la marque (toujours présente, jamais '').
export const DEFAULT_BANNER: (typeof BANNER_KEYS)[number] = 'uni-lavande'

// L'ordre des onglets de l'éditeur suit ce tableau.
export const AVATAR_FIELDS: readonly AvatarField[] = [
  { key: 'skinColor', label: 'Peau', kind: 'color', options: SKIN_COLORS, allowNone: false },
  { key: 'head', label: 'Coiffure', kind: 'style', options: HEADS, allowNone: false },
  { key: 'face', label: 'Expression', kind: 'style', options: FACES, allowNone: false },
  { key: 'accessories', label: 'Lunettes', kind: 'style', options: ACCESSORIES, allowNone: true },
  { key: 'facialHair', label: 'Barbe', kind: 'style', options: FACIAL_HAIR, allowNone: true },
  { key: 'clothingColor', label: 'Haut', kind: 'color', options: CLOTHING_COLORS, allowNone: false },
  { key: 'backgroundColor', label: 'Fond', kind: 'color', options: BACKGROUND_COLORS, allowNone: true },
]

// Les champs que l'élève règle LIBREMENT, sans passer par la caisse : ceux qui
// font qu'il se reconnaît (son visage, ses lunettes, sa barbe, son fond). Les
// autres (peau, coiffure, haut) restent le catalogue vendu.
// Faire payer une expression reviendrait à faire payer le droit de se
// ressembler.
export const FREE_AVATAR_FIELD_KEYS = [
  'face',
  'accessories',
  'facialHair',
  'backgroundColor',
] as const

export type FreeAvatarFieldKey = (typeof FREE_AVATAR_FIELD_KEYS)[number]

/** Le champ libre de cette clé, ou null si la clé n'en est pas un. */
export function freeAvatarField(key: string): AvatarField | null {
  if (!(FREE_AVATAR_FIELD_KEYS as readonly string[]).includes(key)) return null
  return AVATAR_FIELDS.find((f) => f.key === key) ?? null
}

/**
 * Applique un champ libre à une config (immuable). Rend la config INCHANGÉE si
 * la clé n'est pas un champ libre ou si la valeur n'est pas dans sa liste :
 * même règle que `normalizeAvatarConfig`, appliquée à un seul champ, pour que
 * l'action serveur n'ait rien à re-valider elle-même.
 */
export function applyFreeAvatarField(
  cfg: AvatarConfig,
  key: string,
  value: string,
): AvatarConfig {
  const field = freeAvatarField(key)
  if (!field) return cfg
  if (value === '') return field.allowNone ? { ...cfg, [field.key]: '' } : cfg
  if (!field.options.includes(value)) return cfg
  return { ...cfg, [field.key]: value }
}

// Avatar par défaut (proposé au premier passage) — neutre et souriant, haut
// violet et fond violet clair de la marque.
export const DEFAULT_AVATAR: AvatarConfig = {
  skinColor: 'edb98a',
  head: 'short1',
  face: 'smile',
  facialHair: '',
  accessories: '',
  clothingColor: '7c4dff',
  backgroundColor: 'b9a6ff',
  equipment: '',
  banner: DEFAULT_BANNER,
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
  // Couches vestiaire (pas dans AVATAR_FIELDS : elles ne passent pas par
  // DiceBear). Équipement optionnel, bannière toujours valide.
  out.equipment =
    typeof raw.equipment === 'string' &&
    (EQUIPMENT_KEYS as readonly string[]).includes(raw.equipment)
      ? raw.equipment
      : ''
  out.banner =
    typeof raw.banner === 'string' &&
    (BANNER_KEYS as readonly string[]).includes(raw.banner)
      ? raw.banner
      : DEFAULT_BANNER
  return out
}

// Options DiceBear dérivées d'une config : les « … = aucun » deviennent des
// probabilités à 0 (la collection n'a pas d'option « vide »). Le masque
// sanitaire d'Open Peeps est éteint sans condition — il n'a rien à faire sur
// une carte de joueur.
function toDicebearOptions(cfg: AvatarConfig): Record<string, unknown> {
  return {
    seed: 'studuel',
    skinColor: [cfg.skinColor],
    head: [cfg.head],
    headContrastColor: [HAIR_INK],
    face: [cfg.face],
    facialHair: cfg.facialHair ? [cfg.facialHair] : [],
    facialHairProbability: cfg.facialHair ? 100 : 0,
    accessories: cfg.accessories ? [cfg.accessories] : [],
    accessoriesProbability: cfg.accessories ? 100 : 0,
    clothingColor: [cfg.clothingColor],
    backgroundColor: cfg.backgroundColor ? [cfg.backgroundColor] : [],
    maskProbability: 0,
  }
}

// SVG brut de l'avatar (pour un rendu inline si besoin).
export function avatarSvg(cfg: AvatarConfig, size = 96): string {
  return createAvatar(openPeeps, {
    ...toDicebearOptions(cfg),
    size,
    radius: 50,
  }).toString()
}

// Data-URI de l'avatar — à passer directement à <img src> (aucun HTML injecté,
// donc pas de dangerouslySetInnerHTML). Disque arrondi par défaut.
export function avatarDataUri(cfg: AvatarConfig, size = 96): string {
  return createAvatar(openPeeps, {
    ...toDicebearOptions(cfg),
    size,
    radius: 50,
  }).toDataUri()
}
