// LE VISAGE DU HÉROS SELON L'ISSUE (05/11/2026).
//
// Lucas, sur l'écran de fin du duel : « j'aimerais voir le cadre des joueurs et
// peut-être un visage du perso qui changerait s'il a gagné ou perdu ». Chaque
// héros a deux humeurs peintes (Higgsfield, Nano Banana 2.1, la scène du
// héros en référence) : la victoire (grand sourire, poing levé) et la défaite
// (moue, larmes de dessin animé — comique, jamais triste à pleurer).
//
// Le modèle (elfe-rodeur) puis la série des quatorze autres ; un héros ajouté
// plus tard sans humeur garde son visage habituel.

import { herosVisageSrc, isHerosKey, type HerosKey } from '@/lib/heros/eleves'
import { portraitActuel } from '@/lib/portraits'

export type Humeur = 'victoire' | 'defaite'

/** Les héros dont les deux humeurs sont servies dans public/ (les quinze depuis le 05/11/2026). */
export const HUMEURS_PRETES: ReadonlySet<HerosKey> = new Set<HerosKey>([
  'elfe-rodeur',
  'elfe-cerf-volant',
  'elfe-course',
  'gobeline-lectrice',
  'gobeline-mur',
  'humaine-luth',
  'naine-poney',
  'demi-elfe-mage',
  'demi-elfe-orage',
  'elfe-harpon',
  'elfe-ombre',
  'nain-forge',
  'orc-chien',
  'orc-classe',
  'troll-pont',
])

export function herosHumeurSrc(cle: HerosKey, humeur: Humeur): string {
  return HUMEURS_PRETES.has(cle) ? `/images/heros/eleves/humeurs/${cle}-${humeur}.webp` : herosVisageSrc(cle)
}

/** Le héros d'un avatar (choisi, ou blason converti), ou `null` (avatar dessiné, personnage). */
export function herosDeLAvatar(portrait: unknown): HerosKey | null {
  const actuel = portraitActuel(portrait)
  return isHerosKey(actuel) ? actuel : null
}
