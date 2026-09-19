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
// -----------------------------------------------------------------------------

/** Les clés servies : le nom du fichier source, sans extension. Liste FERMÉE. */
export const PORTRAIT_KEYS = [
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

export type PortraitKey = (typeof PORTRAIT_KEYS)[number]

export function isPortraitKey(value: unknown): value is PortraitKey {
  return typeof value === 'string' && (PORTRAIT_KEYS as readonly string[]).includes(value)
}

/** L'URL publique d'un blason. */
export function portraitSrc(key: PortraitKey): string {
  return `/images/profil/${key}.webp`
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
  width: '180%',
  height: '180%',
  left: '-40%',
  top: '-20%',
} as const

/**
 * UN BLASON POUR UN ÉLÈVE QUI N'EN A PAS CHOISI (onglet Amis, 17/09/2026).
 *
 * Les listes de l'onglet Amis dessinaient chacun par un emoji d'animal. Elles
 * montrent désormais un blason : celui de l'élève s'il en a choisi un, sinon
 * un blason FIXE déduit de son identifiant — le même à chaque visite, pour
 * qu'on reconnaisse un camarade d'un jour à l'autre.
 */
export function portraitPourId(id: string): PortraitKey {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return PORTRAIT_KEYS[h % PORTRAIT_KEYS.length]
}

/** Le blason à montrer : le choix de l'élève, ou son blason fixe. */
export function portraitDe(choisi: unknown, id: string): PortraitKey {
  return isPortraitKey(choisi) ? choisi : portraitPourId(id)
}
