// -----------------------------------------------------------------------------
// LES PORTRAITS DE JOUEUR — les blasons dessinés par Lucas (16/09/2026).
//
// Treize visages d'élèves peints dans un écu violet frappé d'une couronne d'or,
// servis en WebP depuis public/images/profil (fabriqués par
// scripts/portraits-profil.mjs depuis assets-sources/profil). L'élève en choisit
// UN à l'onboarding (écran « Ton avatar »), il trône ensuite sur sa carte de
// l'onglet Moi et le représente partout (duel, classement, barre d'onglets).
//
// Le portrait est une COUCHE AU-DESSUS de l'avatar DiceBear (lib/avatar.ts) :
// `AvatarConfig.portrait` vaut une de ces clés, ou '' pour rester sur l'avatar
// dessiné trait par trait. Les deux coexistent — un élève d'avant garde son
// avatar composé tant qu'il ne choisit pas un blason au vestiaire.
//
// CE MODULE N'IMPORTE RIEN : il est lu par le parcours d'accueil (client, avant
// tout compte) comme par le rendu d'avatar, et ne doit pas tirer DiceBear dans
// le bundle de /bienvenue.
//
// LES HÉROS (31/10/2026) : les quinze élèves-héros de l'académie
// (lib/heros/eleves) sont des portraits comme les autres — leur clé va dans
// `AvatarConfig.portrait`, leur VISAGE recadré sert d'avatar partout. Les
// treize blasons restent valides (les élèves d'avant les gardent) et seuls
// eux servent de blason fixe à qui n'a rien choisi (`portraitPourId`).
// -----------------------------------------------------------------------------

import { HEROS_KEYS, herosVisageSrc, isHerosKey, type HerosKey } from '@/lib/heros/eleves'

/** Les treize blasons d'origine. Liste FERMÉE. */
export const PORTRAITS_CLASSIQUES = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
] as const

export type PortraitClassique = (typeof PORTRAITS_CLASSIQUES)[number]

export type PortraitKey = PortraitClassique | HerosKey

/** Toutes les clés valides : les blasons, puis les héros. */
export const PORTRAIT_KEYS: readonly PortraitKey[] = [...PORTRAITS_CLASSIQUES, ...HEROS_KEYS]

export function isPortraitClassique(value: unknown): value is PortraitClassique {
  return typeof value === 'string' && (PORTRAITS_CLASSIQUES as readonly string[]).includes(value)
}

export function isPortraitKey(value: unknown): value is PortraitKey {
  return typeof value === 'string' && (PORTRAIT_KEYS as readonly string[]).includes(value)
}

/** L'URL publique d'un blason — ou du visage d'un héros. */
export function portraitSrc(key: PortraitKey): string {
  if (isHerosKey(key)) return herosVisageSrc(key)
  // v2 : les portraits redessinés le 04/10/2026 (scripts/profil-ecusson.mjs).
  return `/images/profil/v2/${key}.webp`
}

/**
 * LE PORTRAIT EN PIED (25/10/2026, chantier « le jeu vivant ») : le même
 * personnage que le buste v2, debout, détouré (≈ 200 × 600 px, fond
 * transparent), servi depuis `public/images/profil/pied/`. C'est lui qu'on
 * voit en grand dans le choix d'avatar et sur la page du joueur (/joueur).
 * Les treize sont livrés ; un écran qui le montre garde le buste en repli si
 * l'image venait à manquer (`onError`).
 */
export function portraitPiedSrc(key: PortraitClassique): string {
  return `/images/profil/pied/${key}.webp`
}

/**
 * GARÇONS D'UN CÔTÉ, FILLES DE L'AUTRE (25/10/2026, Lucas : « un gabarit de
 * choix d'avatar propre, clair, masculin d'un côté / féminin de l'autre »).
 * La répartition a été faite EN REGARDANT les treize bustes v2 ; aucun n'est
 * ambigu, donc aucun ne figure dans les deux listes (un portrait ambigu le
 * pourrait : les listes ne sont pas exclusives par construction). L'ordre est
 * celui de PORTRAIT_KEYS — c'est l'ordre de la grille.
 */
export const PORTRAITS_GARCONS: readonly PortraitClassique[] = ['2', '3', '5', '7', '9', '12', '13']
export const PORTRAITS_FILLES: readonly PortraitClassique[] = ['4', '6', '8', '10', '11', '14']

export type GenrePortrait = 'garcons' | 'filles'

export const PORTRAITS_PAR_GENRE: Readonly<Record<GenrePortrait, readonly PortraitClassique[]>> = {
  garcons: PORTRAITS_GARCONS,
  filles: PORTRAITS_FILLES,
}

/**
 * L'onglet à ouvrir pour un portrait déjà choisi : celui où il figure. Sans
 * choix (ou portrait inconnu des deux listes), l'onglet des garçons — le
 * premier de la rangée, pas un jugement.
 */
export function genreDuPortrait(key: unknown): GenrePortrait {
  if (isPortraitClassique(key) && PORTRAITS_FILLES.includes(key) && !PORTRAITS_GARCONS.includes(key)) {
    return 'filles'
  }
  return 'garcons'
}

/**
 * LE CADRAGE « VISAGE » d'un blason dans un rond.
 *
 * Le blason est un écu : posé tel quel dans un disque (couloir du duel, ligne
 * du classement, onglet Moi de la barre), ses épaules et ses angles sont
 * rognés et il ne reste qu'un bout d'écu. On zoome donc sur le visage — qui
 * occupe le tiers haut de l'image, centré — comme une photo d'identité tirée
 * d'un portrait en pied. Les valeurs sont en pourcentage de la boîte ronde :
 * l'image fait 180 % de la boîte, décalée de −40 % à gauche et −20 % en haut,
 * ce qui met le centre du visage (≈ 50 %, 38 % du blason) au centre du disque.
 * Vérifié à l'œil sur les treize (scratch du 16/09/2026).
 */
export const PORTRAIT_FACE_CROP = {
  // 05/10/2026 : 180 % convenait aux écus d'avant ; les portraits v2 sont des
  // bustes carrés, la tête en remplit déjà le haut — 180 % rognait le front et
  // le menton (Lucas : « la tête est comme compactée »). 125 % garde la tête
  // entière et le haut du sweat.
  width: '125%',
  height: '125%',
  left: '-12.5%',
  top: '-6%',
} as const

/**
 * LES BLASONS DEVIENNENT DES HÉROS (05/11/2026, Lucas : « on voit toujours les
 * anciens avatars humains »). Les comptes d'avant le 31/10 portent encore un
 * des treize blasons (élèves humains en sweat) : on ne les montre plus nulle
 * part. Chaque blason a SON héros, du même genre, fixé une fois pour toutes —
 * un élève retrouve toujours le même personnage. La conversion se fait À LA
 * LECTURE (normalizeAvatarConfig, portraitDe) : aucune migration SQL, la clé
 * en base sera réécrite au prochain choix au vestiaire.
 */
const HEROS_DU_BLASON: Readonly<Record<PortraitClassique, HerosKey>> = {
  // Garçons (PORTRAITS_GARCONS) → les sept premiers héros garçons.
  '2': 'elfe-rodeur',
  '3': 'demi-elfe-mage',
  '5': 'nain-forge',
  '7': 'demi-elfe-orage',
  '9': 'elfe-ombre',
  '12': 'elfe-harpon',
  '13': 'orc-classe',
  // Filles (PORTRAITS_FILLES) → les six héroïnes.
  '4': 'gobeline-mur',
  '6': 'naine-poney',
  '8': 'elfe-cerf-volant',
  '10': 'humaine-luth',
  '11': 'gobeline-lectrice',
  '14': 'elfe-course',
}

export function herosDuBlason(blason: PortraitClassique): HerosKey {
  return HEROS_DU_BLASON[blason]
}

/** Un blason est remplacé par son héros ; toute autre valeur passe telle quelle. */
export function portraitActuel<T>(value: T): T | HerosKey {
  return isPortraitClassique(value) ? HEROS_DU_BLASON[value] : value
}

/**
 * UN HÉROS POUR UN ÉLÈVE QUI N'EN A PAS CHOISI (onglet Amis, 17/09/2026 ;
 * héros depuis le 05/11/2026). Un héros FIXE déduit de son identifiant — le
 * même à chaque visite, pour qu'on reconnaisse un camarade d'un jour à l'autre.
 */
export function portraitPourId(id: string): HerosKey {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return HEROS_KEYS[h % HEROS_KEYS.length]
}

/** Le héros à montrer : celui de l'élève (un blason devient son héros), ou son héros fixe. */
export function portraitDe(choisi: unknown, id: string): HerosKey {
  const actuel = portraitActuel(choisi)
  return isHerosKey(actuel) ? actuel : portraitPourId(id)
}
